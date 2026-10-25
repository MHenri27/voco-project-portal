import { listProjects } from "@/lib/projects";
import { isDbConfigured } from "@/lib/db";
import { AdminHeader } from "@/components/admin-header";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";
export const metadata = { title: "Töölaud" };

export default async function AdminPage() {
  const projects = await listProjects({ includeDrafts: true });

  return (
    <>
      <AdminHeader />
      <DashboardView initialProjects={projects} canWrite={isDbConfigured()} />
    </>
  );
}
