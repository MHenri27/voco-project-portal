import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { getSession } from "@/lib/session";
import { getProjectBySlug, listProjects } from "@/lib/projects";
import { renderMarkdown } from "@/lib/markdown";
import { SiteNav } from "@/components/site-nav";
import { RevealController } from "@/components/reveal-controller";
import { ParallaxCover } from "@/components/parallax-cover";
import { buttonStyles } from "@/components/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return { title: project ? project.title : "Projekti ei leitud" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [session, project, all] = await Promise.all([getSession(), getProjectBySlug(slug), listProjects()]);

  if (!project) notFound();
  const isAdmin = session?.role === "admin";
  if (!project.published && !isAdmin) notFound();

  const html = renderMarkdown(project.description || project.summary);

  const index = all.findIndex((p) => p.slug === project.slug);
  const prev = index >= 0 && all.length > 1 ? all[(index - 1 + all.length) % all.length] : null;
  const next = index >= 0 && all.length > 1 ? all[(index + 1) % all.length] : null;

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
          Kõik projektid
        </Link>

        <header className="mt-8">
          <p data-animate className="kicker">
            aasta
            {project.year ? <span className="ml-3 text-muted/70">{project.year}</span> : null}
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

        <footer className="mt-24 border-t border-line pt-10">
          {prev && next && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                href={`/catalog/${prev.slug}`}
                className="group flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-ink"
              >
                <span className="kicker">Eelmine</span>
                <span className="font-display mt-2 text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                  {prev.title}
                </span>
              </Link>
              <Link
                href={`/catalog/${next.slug}`}
                className="group flex flex-col items-end rounded-[var(--radius-card)] border border-line bg-surface p-5 text-right transition-colors hover:border-ink"
              >
                <span className="kicker">Järgmine</span>
                <span className="font-display mt-2 text-xl font-semibold text-ink transition-colors group-hover:text-accent">
                  {next.title}
                </span>
              </Link>
            </div>
          )}
          <div className="mt-8 flex justify-center">
            <Link href="/catalog" className={buttonStyles("dark", "md")}>
              <ArrowLeft weight="bold" className="size-4" />
              Tagasi kõigi projektide juurde
            </Link>
          </div>
        </footer>
      </article>
    </>
  );
}
