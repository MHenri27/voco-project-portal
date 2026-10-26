import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/session";
import { AdminHeader } from "@/components/admin-header";
import { ProjectEditor } from "@/components/editor/project-editor";

export const metadata = { title: "Uus projekt" };

export default async function NewProjectPage() {
  if (!(await requireAdmin())) redirect("/admin/login");
  return (
    <>
      <AdminHeader />
      <ProjectEditor />
    </>
  );
}
