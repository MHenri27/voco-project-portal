"use client";

import { useRef, useState } from "react";
import { TextB, TextItalic, TextHOne, ListBullets, LinkSimple } from "@phosphor-icons/react";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/cn";

export function MarkdownField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  function surround(before: string, after = before) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end) || "text";
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = start + before.length;
      el.selectionEnd = start + before.length + selected.length;
    });
  }

  function prefixLine(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + prefix.length;
    });
  }

  const tools = [
    { icon: TextB, label: "Bold", run: () => surround("**") },
    { icon: TextItalic, label: "Italic", run: () => surround("*") },
    { icon: TextHOne, label: "Heading", run: () => prefixLine("## ") },
    { icon: ListBullets, label: "List item", run: () => prefixLine("- ") },
    { icon: LinkSimple, label: "Link", run: () => surround("[", "](https://)") },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-input)] border border-line-strong bg-surface">
      <div className="flex items-center justify-between border-b border-line px-2 py-1.5">
        <div className="flex items-center gap-0.5">
          {tools.map(({ icon: Icon, label, run }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              aria-label={label}
              title={label}
              className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-sunk hover:text-ink"
            >
              <Icon weight="bold" className="size-4" />
            </button>
          ))}
        </div>
        <div className="flex rounded-full bg-surface-sunk p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={cn("rounded-full px-3 py-1", !preview && "bg-surface text-ink shadow-sm")}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={cn("rounded-full px-3 py-1", preview && "bg-surface text-ink shadow-sm")}
          >
            Preview
          </button>
        </div>
      </div>

      {preview ? (
        <div
          className="prose min-h-56 max-w-none px-4 py-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value || "_Nothing to preview yet._") }}
        />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe the project. Markdown is supported: **bold**, *italic*, ## headings, - lists, [links](https://)."
          className="min-h-56 w-full resize-y bg-transparent px-4 py-4 text-ink outline-none placeholder:text-muted/60"
        />
      )}
    </div>
  );
}
