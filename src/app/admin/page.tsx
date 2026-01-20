import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Briefcase,
  Users,
  FolderOpen,
  FileText,
  Mail,
  TrendingUp,
} from "lucide-react";

async function getStats() {
  const [services, team, projects, posts, contacts, unreadContacts] =
    await Promise.all([
      prisma.service.count(),
      prisma.teamMember.count(),
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.contactSubmission.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
    ]);

  return { services, team, projects, posts, contacts, unreadContacts };
}

async function getRecentContacts() {
  return prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  const stats = await getStats();
  const recentContacts = await getRecentContacts();

  const statCards = [
    {
      label: "Services",
      value: stats.services,
      icon: Briefcase,
      href: "/admin/services",
      color: "bg-blue-500",
    },
    {
      label: "Team Members",
      value: stats.team,
      icon: Users,
      href: "/admin/team",
      color: "bg-green-500",
    },
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderOpen,
      href: "/admin/portfolio",
      color: "bg-purple-500",
    },
    {
      label: "Blog Posts",
      value: stats.posts,
      icon: FileText,
      href: "/admin/blog",
      color: "bg-orange-500",
    },
    {
      label: "Contact Submissions",
      value: stats.contacts,
      icon: Mail,
      href: "/admin/contacts",
      color: "bg-pink-500",
      badge: stats.unreadContacts > 0 ? stats.unreadContacts : undefined,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Dashboard
        </h1>
        <p className="text-[var(--foreground-secondary)] mt-1">
          Welcome back, {session.user?.name || "Admin"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <a
              key={stat.label}
              href={stat.href}
              className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)] hover:border-[var(--primary)] transition-colors relative"
            >
              {stat.badge && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {stat.badge}
                </span>
              )}
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-3xl font-bold text-[var(--foreground)]">
                {stat.value}
              </p>
              <p className="text-[var(--foreground-secondary)] text-sm">
                {stat.label}
              </p>
            </a>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Recent Contacts
            </h2>
            <a
              href="/admin/contacts"
              className="text-[var(--primary)] text-sm hover:underline"
            >
              View all
            </a>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-[var(--foreground-secondary)]">
              No contact submissions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-[var(--background)] transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      contact.read ? "bg-gray-400" : "bg-green-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {contact.firstName} {contact.lastName}
                    </p>
                    <p className="text-sm text-[var(--foreground-secondary)] truncate">
                      {contact.subject || contact.message.substring(0, 50)}...
                    </p>
                    <p className="text-xs text-[var(--foreground-secondary)] mt-1">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[var(--surface)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-xl font-semibold text-[var(--foreground)]">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/services/new"
              className="p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white text-[var(--foreground)] transition-colors text-center"
            >
              Add Service
            </Link>
            <Link
              href="/admin/team/new"
              className="p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white text-[var(--foreground)] transition-colors text-center"
            >
              Add Team Member
            </Link>
            <Link
              href="/admin/portfolio/new"
              className="p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white text-[var(--foreground)] transition-colors text-center"
            >
              Add Project
            </Link>
            <Link
              href="/admin/blog/new"
              className="p-4 rounded-lg bg-[var(--background)] hover:bg-[var(--primary)] hover:text-white text-[var(--foreground)] transition-colors text-center"
            >
              Write Blog Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
