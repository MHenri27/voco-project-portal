import { Landing } from "@/components/landing";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await listProjects();
  return <Landing projectCount={projects.length} />;
}
