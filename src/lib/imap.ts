import { ImapFlow } from "imapflow";
import { simpleParser, ParsedMail, AddressObject } from "mailparser";
import { prisma } from "./prisma";

function getImapConfig() {
  if (!process.env.IMAP_HOST || !process.env.IMAP_USER || !process.env.IMAP_PASS) {
    throw new Error("IMAP configuration missing. Set IMAP_HOST, IMAP_USER, IMAP_PASS");
  }

  return {
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT || "993"),
    secure: process.env.IMAP_TLS !== "false",
    auth: {
      user: process.env.IMAP_USER,
      pass: process.env.IMAP_PASS,
    },
    logger: false as const,
  };
}

export async function createImapClient(): Promise<ImapFlow> {
  const client = new ImapFlow(getImapConfig());
  await client.connect();
  return client;
}

function computeThreadId(parsed: ParsedMail): string {
  const subject = (parsed.subject || "")
    .replace(/^(Re|Fwd|Fw):\s*/gi, "")
    .toLowerCase()
    .trim();
  return subject || "no-subject";
}

function extractAddresses(addressObj: AddressObject | AddressObject[] | undefined): string[] {
  if (!addressObj) return [];
  const addresses = Array.isArray(addressObj) ? addressObj : [addressObj];
  return addresses.flatMap(a => a.value?.map(v => v.address || "") || []);
}

export async function syncFolder(folder: string = "INBOX"): Promise<number> {
  const client = await createImapClient();
  let syncedCount = 0;

  try {
    let syncState = await prisma.emailSyncState.findUnique({
      where: { folder },
    });

    if (!syncState) {
      syncState = await prisma.emailSyncState.create({
        data: { folder, lastUid: 0 },
      });
    }

    const mailbox = await client.mailboxOpen(folder);
    const uidValidity = Number(mailbox.uidValidity);

    if (syncState.uidValidity && syncState.uidValidity !== uidValidity) {
      await prisma.email.deleteMany({ where: { folder } });
      syncState = await prisma.emailSyncState.update({
        where: { folder },
        data: { lastUid: 0, uidValidity },
      });
    }

    const searchCriteria = syncState.lastUid > 0
      ? { uid: `${syncState.lastUid + 1}:*` }
      : { all: true };

    const batchSize = parseInt(process.env.EMAIL_SYNC_BATCH_SIZE || "100");
    let lastUid = syncState.lastUid;

    for await (const message of client.fetch(searchCriteria, {
      uid: true,
      flags: true,
      envelope: true,
      bodyStructure: true,
      source: true,
    })) {
      const messageUid = Number(message.uid);
      if (messageUid <= syncState.lastUid) continue;

      const existing = await prisma.email.findFirst({
        where: { uid: messageUid, folder },
      });
      if (existing) continue;

      if (!message.source) continue;
      const parsed = await simpleParser(message.source);

      const messageId = parsed.messageId || `${folder}-${messageUid}-${Date.now()}`;

      const existingByMessageId = await prisma.email.findUnique({
        where: { messageId },
      });
      if (existingByMessageId) continue;

      const emailData = {
        messageId,
        uid: messageUid,
        folder,
        from: parsed.from?.value?.[0]?.address || "",
        fromName: parsed.from?.value?.[0]?.name || null,
        to: extractAddresses(parsed.to),
        cc: extractAddresses(parsed.cc),
        subject: parsed.subject || "(No Subject)",
        textBody: parsed.text || null,
        htmlBody: typeof parsed.html === "string" ? parsed.html : null,
        snippet: (parsed.text || "").substring(0, 200),
        isRead: message.flags?.has("\\Seen") || false,
        isStarred: message.flags?.has("\\Flagged") || false,
        hasAttachments: (parsed.attachments?.length || 0) > 0,
        inReplyTo: parsed.inReplyTo || null,
        references: Array.isArray(parsed.references) ? parsed.references : parsed.references ? [parsed.references] : [],
        date: parsed.date || new Date(),
      };

      const email = await prisma.email.create({ data: emailData });

      if (parsed.attachments?.length) {
        for (const att of parsed.attachments) {
          await prisma.emailAttachment.create({
            data: {
              emailId: email.id,
              filename: att.filename || "attachment",
              contentType: att.contentType,
              size: att.size,
              cid: att.cid || null,
            },
          });
        }
      }

      lastUid = Math.max(lastUid, messageUid);
      syncedCount++;

      if (syncedCount >= batchSize) break;
    }

    await prisma.emailSyncState.update({
      where: { folder },
      data: {
        lastUid,
        uidValidity,
        lastSyncAt: new Date(),
      },
    });
  } finally {
    await client.logout();
  }

  return syncedCount;
}

export async function markEmailRead(
  uid: number,
  folder: string,
  read: boolean
): Promise<void> {
  const client = await createImapClient();
  try {
    await client.mailboxOpen(folder);
    if (read) {
      await client.messageFlagsAdd({ uid }, ["\\Seen"]);
    } else {
      await client.messageFlagsRemove({ uid }, ["\\Seen"]);
    }
  } finally {
    await client.logout();
  }
}

export async function deleteEmailOnServer(
  uid: number,
  folder: string
): Promise<void> {
  const client = await createImapClient();
  try {
    await client.mailboxOpen(folder);
    await client.messageMove({ uid }, "Trash");
  } finally {
    await client.logout();
  }
}

export async function getFolders(): Promise<string[]> {
  const client = await createImapClient();
  try {
    const folderList = await client.list();
    return folderList.map(f => f.path);
  } finally {
    await client.logout();
  }
}
