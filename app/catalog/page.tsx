import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { listProjects } from "@/lib/projects";
import { SiteNav } from "@/components/site-nav";
import { CatalogView } from "@/components/catalog-view";

export const metadata = { title: "Kataloog" };

export default async function CatalogPage() {
  const session = await getSession();
  // Don't lean on the proxy alone — enforce the gate here too.
  if (!session) redirect("/");
  const projects = await listProjects();

  return (
    <>
      <SiteNav isAdmin={session?.role === "admin"} />
      <CatalogView projects={projects} />
    </>
  );
}
