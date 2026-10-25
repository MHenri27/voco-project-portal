import { AdminHeader } from "@/components/admin-header";
import { ProjectEditor } from "@/components/editor/project-editor";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <>
      <AdminHeader />
      <ProjectEditor />
    </>
  );
}
