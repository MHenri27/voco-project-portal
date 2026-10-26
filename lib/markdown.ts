// A small, safe Markdown subset for project descriptions.
// Everything is HTML-escaped first; the only tags that make it into the output
// are ones we build ourselves, so the result is safe to render directly.
// Supports: #/##/### headings, **bold**, *italic*, _italic_, ~~strike~~,
// `code`, fenced ``` code blocks, [links](url), ![images](url), - and 1. lists,
// > quotes, --- rules, and YouTube embeds (@youtube(url) or a bare url on its line).

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Only allow urls we're willing to put in an href/src. Inputs are already escaped.
function safeUrl(url: string): string | null {
  return /^https?:\/\//i.test(url) ? url : null;
}

function safeImageUrl(url: string): string | null {
  if (/^https?:\/\//i.test(url)) return url;
  if (/^data:image\//i.test(url)) return url;
  return null;
}

// Pull an 11-char video id out of the common youtube url shapes, or a bare id.
function youtubeId(text: string): string | null {
  const wrap = text.match(/^@youtube\(\s*([^)]+?)\s*\)$/i);
  const candidate = (wrap ? wrap[1] : text).trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(candidate)) return candidate;
  const m = candidate.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/|v\/))([A-Za-z0-9_-]{11})/,
  );
  return m ? m[1] : null;
}

function youtubeEmbed(id: string): string {
  // id is validated to [A-Za-z0-9_-]{11}, so it's safe to drop straight in.
  return (
    `<div class="embed-video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" ` +
    `title="YouTube video" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" ` +
    `allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
    `allowfullscreen></iframe></div>`
  );
}

// alt + url are expected already escaped. block wraps it in a figure.
function imageTag(alt: string, url: string, block: boolean): string {
  const safe = safeImageUrl(url);
  if (!safe) return "";
  const img = `<img src="${safe}" alt="${alt}" loading="lazy" />`;
  return block ? `<figure class="embed-img">${img}</figure>` : img;
}

function inline(text: string): string {
  let out = escapeHtml(text);
  // inline images before links, since both use the [..](..) shape.
  out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, url) => imageTag(alt, url, false));
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const safe = safeUrl(url);
    return safe ? `<a href="${safe}" target="_blank" rel="noopener noreferrer">${label}</a>` : label;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/~~([^~]+)~~/g, "<del>$1</del>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^\w])_([^_\n]+)_/g, "$1<em>$2</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

function isBlockStart(line: string): boolean {
  return (
    /^\s*(#{1,3})\s+/.test(line) ||
    /^\s*[-*]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*(---|\*\*\*|___)\s*$/.test(line) ||
    /^\s*```/.test(line)
  );
}

export function renderMarkdown(source: string): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i++;
      continue;
    }

    // fenced code block
    if (line.trim().startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++; // skip the closing fence
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    // horizontal rule
    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      out.push("<hr />");
      i++;
      continue;
    }

    // a youtube link on its own line becomes an embed
    const yt = youtubeId(line.trim());
    if (yt) {
      out.push(youtubeEmbed(yt));
      i++;
      continue;
    }

    // a lone image becomes a block figure
    const imgOnly = line.trim().match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (imgOnly) {
      out.push(imageTag(escapeHtml(imgOnly[1]), escapeHtml(imgOnly[2]), true));
      i++;
      continue;
    }

    // headings
    const h = line.match(/^\s*(#{1,3})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      out.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }

    // unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*[-*]\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // paragraph: gather lines until a blank line or a new block starts
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !isBlockStart(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(para.join("\n")).replace(/\n/g, "<br />")}</p>`);
  }

  return out.join("");
}
