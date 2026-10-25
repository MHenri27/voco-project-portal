import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getSession } from "@/lib/session";
import { getProjectBySlug } from "@/lib/projects";
import { renderMarkdown } from "@/lib/markdown";
import { SiteNav } from "@/components/site-nav";
import { RevealController } from "@/components/reveal-controller";
import { ParallaxCover } from "@/components/parallax-cover";
import { buttonStyles } from "@/components/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project ? `${project.title} — VOCO Portal` : "Project not found" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [session, project] = await Promise.all([getSession(), getProjectBySlug(slug)]);

  if (!project) notFound();
  const isAdmin = session?.role === "admin";
  if (!project.published && !isAdmin) notFound();

  const meta = [project.category, project.year].filter(Boolean).join("  ·  ");
  const html = renderMarkdown(project.description || project.summary);

  return (
    <>
      <SiteNav isAdmin={isAdmin} />
      <RevealController />

      <article className="mx-auto max-w-[1000px] px-5 py-12 md:px-10 md:py-16">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft weight="bold" className="size-4" />
          All projects
        </Link>

        <header className="mt-8">
          <p data-animate className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {meta}
          </p>
          <h1 data-animate className="font-display mt-4 text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
            {project.title}
          </h1>
          <p data-animate className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            {project.summary}
          </p>

          {(project.tags.length > 0 || project.links.length > 0) && (
            <div data-animate className="mt-7 flex flex-wrap items-center gap-3">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles("outline", "sm")}
                >
                  {link.label}
                  <ArrowUpRight weight="bold" className="size-4" />
                </a>
              ))}
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {project.coverImage && (
          <div data-animate className="mt-12">
            <ParallaxCover src={project.coverImage} alt={project.title} />
          </div>
        )}

        {html && (
          <div
            data-animate
            className="prose mt-14 max-w-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {project.gallery.length > 0 && (
          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {project.gallery.map((image) => (
              <figure key={image.url} data-animate>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-surface-sunk">
                  <Image
                    src={image.url}
                    alt={image.caption ?? project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
                {image.caption && (
                  <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        <footer className="mt-20 border-t border-line pt-10">
          <Link href="/catalog" className={buttonStyles("dark", "md")}>
            <ArrowLeft weight="bold" className="size-4" />
            Back to all projects
          </Link>
        </footer>
      </article>
    </>
  );
}
