import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/projects";
import { AdminHeader } from "@/components/admin-header";
import { ProjectEditor } from "@/components/editor/project-editor";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit project" };

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
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
