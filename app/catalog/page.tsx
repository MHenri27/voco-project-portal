import { getSession } from "@/lib/session";
import { listProjects } from "@/lib/projects";
import { SiteNav } from "@/components/site-nav";
import { CatalogView } from "@/components/catalog-view";
import { ScrollProgress } from "@/components/scroll-progress";

export default async function CatalogPage() {
  const session = await getSession();
  const projects = await listProjects();

  return (
    <>
      <ScrollProgress />
      <SiteNav isAdmin={session?.role === "admin"} />
      <CatalogView projects={projects} />
    </>
  );
}
