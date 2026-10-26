import { getSession } from "@/lib/session";
import { listProjects } from "@/lib/projects";
import { SiteNav } from "@/components/site-nav";
import { CatalogView } from "@/components/catalog-view";

export const metadata = { title: "Kataloog" };

export default async function CatalogPage() {
  const session = await getSession();
  const projects = await listProjects();

  return (
    <>
      <SiteNav isAdmin={session?.role === "admin"} />
      <CatalogView projects={projects} />
    </>
  );
}
