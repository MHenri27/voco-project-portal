import { notFound, redirect } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { requireAdmin } from "@/lib/session";
import { AdminHeader } from "@/components/admin-header";
import { ProjectEditor } from "@/components/editor/project-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Muuda projekti" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  if (!(await requireAdmin())) redirect("/admin/login");
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <>
      <AdminHeader />
      <ProjectEditor project={project} />
    </>
  );
}
