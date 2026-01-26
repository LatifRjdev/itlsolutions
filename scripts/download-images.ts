import fs from "fs";
import path from "path";
import https from "https";

// Extract project data from seed file
const seedPath = path.join(__dirname, "../prisma/seed.ts");
const seedContent = fs.readFileSync(seedPath, "utf-8");

// Find all projects with images
const projectRegex = /{\s*slug:\s*"([^"]+)"[\s\S]*?image:\s*"(https:\/\/images\.unsplash\.com[^"]+)"/g;

const projects: { slug: string; imageUrl: string }[] = [];
let match;

while ((match = projectRegex.exec(seedContent)) !== null) {
  projects.push({
    slug: match[1],
    imageUrl: match[2],
  });
}

console.log(`Found ${projects.length} projects with Unsplash images`);

// Create output directory
const outputDir = path.join(__dirname, "../public/portfolio");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Download function
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          https.get(redirectUrl, (redirectResponse) => {
            redirectResponse.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
          }).on("error", reject);
        }
        return;
      }

      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", (err) => {
      fs.unlink(filepath, () => {}); // Delete file on error
      reject(err);
    });
  });
}

// Download all images
async function downloadAll() {
  let updated = 0;
  let newSeedContent = seedContent;

  for (const project of projects) {
    const filename = `${project.slug}.jpg`;
    const filepath = path.join(outputDir, filename);
    const localPath = `/portfolio/${filename}`;

    // Skip if already downloaded
    if (fs.existsSync(filepath)) {
      console.log(`✓ ${project.slug} (already exists)`);
    } else {
      try {
        console.log(`↓ Downloading ${project.slug}...`);
        await downloadImage(project.imageUrl, filepath);
        console.log(`✓ ${project.slug}`);
      } catch (err) {
        console.error(`✗ ${project.slug}: ${err}`);
        continue;
      }
    }

    // Update seed file to use local path
    newSeedContent = newSeedContent.replace(
      `image: "${project.imageUrl}"`,
      `image: "${localPath}"`
    );
    updated++;
  }

  // Save updated seed file
  fs.writeFileSync(seedPath, newSeedContent);
  console.log(`\n✓ Updated ${updated} image paths in seed.ts`);
}

downloadAll().catch(console.error);
