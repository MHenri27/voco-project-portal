// A small, safe Markdown subset for project descriptions.
// HTML is escaped first, so the output is safe to render directly.

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  let out = escapeHtml(text);
  // Links: only allow http(s) targets.
  out = out.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, label, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  return out;
}

export function renderMarkdown(source: string): string {
  const blocks = source.trim().split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block.split("\n");
    if (lines.every((line) => line.startsWith("- "))) {
      const items = lines.map((line) => `<li>${inline(line.slice(2))}</li>`).join("");
      html.push(`<ul>${items}</ul>`);
    } else if (block.startsWith("### ")) {
      html.push(`<h3>${inline(block.slice(4))}</h3>`);
    } else if (block.startsWith("## ")) {
      html.push(`<h2>${inline(block.slice(3))}</h2>`);
    } else {
      html.push(`<p>${inline(block).replace(/\n/g, "<br />")}</p>`);
    }
  }

  return html.join("");
}
