import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Allow access to login page without authentication
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {session ? (
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
