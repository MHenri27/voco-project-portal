"use client";

import { useRef, useState } from "react";
import {
  TextB,
  TextItalic,
  TextStrikethrough,
  TextHOne,
  TextHTwo,
  ListBullets,
  ListNumbers,
  Quotes,
  Code,
  CodeBlock,
  LinkSimple,
  ImageSquare,
  YoutubeLogo,
  Minus,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import { renderMarkdown } from "@/lib/markdown";
import { uploadImage } from "@/components/editor/upload";
import { cn } from "@/lib/cn";

type EmbedKind = "link" | "image" | "youtube";

export function MarkdownField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);
  const [embed, setEmbed] = useState<EmbedKind | null>(null);
  const [embedValue, setEmbedValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Replace the current selection, keeping the textarea in sync and refocused.
  function replaceSelection(makeText: (selected: string) => string) {
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const insert = makeText(value.slice(start, end));
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      node.focus();
      node.selectionStart = node.selectionEnd = start + insert.length;
    });
  }

  // Wrap the selection (or a placeholder) and leave the inner text selected.
  function surround(before: string, after = before, placeholder = "tekst") {
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const selected = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      node.focus();
      node.selectionStart = start + before.length;
      node.selectionEnd = start + before.length + selected.length;
    });
  }

  // Prefix each selected line (or the current line) with the given marker.
  function prefixLines(marker: string | ((n: number) => string)) {
    const el = ref.current;
    const start = el ? el.selectionStart : value.length;
    const end = el ? el.selectionEnd : value.length;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const block = value.slice(lineStart, end);
    const lines = block.split("\n");
    const prefixed = lines
      .map((line, idx) => `${typeof marker === "function" ? marker(idx + 1) : marker}${line}`)
      .join("\n");
    const next = value.slice(0, lineStart) + prefixed + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      node.focus();
      node.selectionStart = node.selectionEnd = lineStart + prefixed.length;
    });
  }

  function insertBlock(text: string) {
    replaceSelection((sel) => {
      const prefix = value.length && !value.endsWith("\n\n") ? (value.endsWith("\n") ? "\n" : "\n\n") : "";
      return `${prefix}${text}${sel}`;
    });
  }

  function openEmbed(kind: EmbedKind) {
    setError(null);
    setEmbedValue("");
    setEmbed(kind);
  }

  function confirmEmbed() {
    const v = embedValue.trim();
    if (!v) {
      setEmbed(null);
      return;
    }
    if (embed === "link") {
      replaceSelection((sel) => `[${sel || "link"}](${v})`);
    } else if (embed === "image") {
      insertBlock(`![pilt](${v})\n`);
    } else if (embed === "youtube") {
      insertBlock(`@youtube(${v})\n`);
    }
    setEmbed(null);
    setEmbedValue("");
  }

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      insertBlock(`![${file.name.replace(/\.[^.]+$/, "")}](${url})\n`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Üleslaadimine ebaõnnestus.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!(e.metaKey || e.ctrlKey)) return;
    const k = e.key.toLowerCase();
    if (k === "b") {
      e.preventDefault();
      surround("**");
    } else if (k === "i") {
      e.preventDefault();
      surround("*");
    } else if (k === "k") {
      e.preventDefault();
      openEmbed("link");
    }
  }

  const tools: { icon: typeof TextB; label: string; run: () => void }[] = [
    { icon: TextHOne, label: "Pealkiri", run: () => prefixLines("## ") },
    { icon: TextHTwo, label: "Alampealkiri", run: () => prefixLines("### ") },
    { icon: TextB, label: "Paks (Ctrl+B)", run: () => surround("**") },
    { icon: TextItalic, label: "Kaldkiri (Ctrl+I)", run: () => surround("*") },
    { icon: TextStrikethrough, label: "Läbikriipsutus", run: () => surround("~~") },
    { icon: Code, label: "Kood", run: () => surround("`", "`", "kood") },
    { icon: ListBullets, label: "Loend", run: () => prefixLines("- ") },
    { icon: ListNumbers, label: "Nummerdatud loend", run: () => prefixLines((n) => `${n}. `) },
    { icon: Quotes, label: "Tsitaat", run: () => prefixLines("> ") },
    { icon: CodeBlock, label: "Koodiplokk", run: () => insertBlock("```\nkood\n```\n") },
    { icon: Minus, label: "Eraldusjoon", run: () => insertBlock("---\n") },
    { icon: LinkSimple, label: "Link (Ctrl+K)", run: () => openEmbed("link") },
    { icon: YoutubeLogo, label: "YouTube video", run: () => openEmbed("youtube") },
  ];

  const embedLabels: Record<EmbedKind, string> = {
    link: "Kleebi lingi URL",
    image: "Kleebi pildi URL",
    youtube: "Kleebi YouTube'i video URL",
  };

  return (
    <div className="overflow-hidden rounded-[var(--radius-input)] border border-line-strong bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          {/* each run() only touches the textarea ref inside a click handler, never during render */}
          {/* eslint-disable-next-line react-hooks/refs */}
          {tools.map(({ icon: Icon, label, run }) => (
            <button
              key={label}
              type="button"
              onClick={run}
              aria-label={label}
              title={label}
              className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunk hover:text-ink"
            >
              <Icon weight="bold" className="size-4" />
            </button>
          ))}

          <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />

          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0])} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            aria-label="Laadi pilt üles"
            title="Laadi pilt üles"
            className="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-sunk hover:text-ink disabled:opacity-50"
          >
            {busy ? <UploadSimple weight="bold" className="size-4 animate-pulse" /> : <ImageSquare weight="bold" className="size-4" />}
          </button>
        </div>

        <div className="flex rounded-full bg-surface-sunk p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setPreview(false)}
            className={cn("rounded-full px-3 py-1 transition-colors", !preview && "bg-surface text-ink shadow-sm")}
          >
            Kirjuta
          </button>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className={cn("rounded-full px-3 py-1 transition-colors", preview && "bg-surface text-ink shadow-sm")}
          >
            Eelvaade
          </button>
        </div>
      </div>

      {embed && (
        <div className="flex items-center gap-2 border-b border-line bg-surface-sunk/60 px-2 py-2">
          <input
            autoFocus
            value={embedValue}
            onChange={(e) => setEmbedValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirmEmbed();
              } else if (e.key === "Escape") {
                setEmbed(null);
              }
            }}
            placeholder={embedLabels[embed]}
            className="min-w-0 flex-1 rounded-md border border-line-strong bg-bg px-3 py-1.5 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={confirmEmbed}
            className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-bg hover:bg-ink/90"
          >
            Lisa
          </button>
          <button
            type="button"
            onClick={() => setEmbed(null)}
            aria-label="Sulge"
            className="flex size-7 items-center justify-center rounded-md text-muted hover:text-ink"
          >
            <X weight="bold" className="size-4" />
          </button>
        </div>
      )}

      {error && <p className="border-b border-line bg-accent/5 px-3 py-2 text-sm text-accent">{error}</p>}

      {preview ? (
        <div
          className="prose min-h-56 max-w-none px-4 py-4"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value || "_Pole veel midagi näidata._") }}
        />
      ) : (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Kirjelda projekti. Markdown on toetatud: **paks**, *kaldkiri*, ## pealkirjad, - loendid, > tsitaadid, [lingid](https://), pildid ja YouTube videod."
          className="min-h-56 w-full resize-y bg-transparent px-4 py-4 text-ink outline-none placeholder:text-muted/60"
        />
      )}
    </div>
  );
}
