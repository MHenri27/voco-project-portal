"use client";

import { useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Plus, Trash, UploadSimple, X } from "@phosphor-icons/react";
import { uploadImage } from "@/components/editor/upload";
import { cn } from "@/lib/cn";
import type { GalleryImage, ProjectLink } from "@/lib/types";

export const inputClass =
  "w-full rounded-[var(--radius-input)] border border-line-strong bg-bg px-4 py-3 text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-[var(--radius-input)] border border-line bg-surface px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-accent" : "bg-line-strong",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-surface transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (value && !tags.includes(value)) onChange([...tags, value]);
    setDraft("");
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-input)] border border-line-strong bg-surface p-2">
      {tags.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-surface-sunk px-3 py-1 text-sm text-ink">
          {tag}
          <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} aria-label={`Eemalda ${tag}`}>
            <X weight="bold" className="size-3.5 text-muted hover:text-ink" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          } else if (e.key === "Backspace" && !draft && tags.length) {
            onChange(tags.slice(0, -1));
          }
        }}
        onBlur={add}
        placeholder={tags.length ? "Lisa veel" : "Kirjuta silt, vajuta Enter"}
        className="min-w-32 flex-1 bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted/60"
      />
    </div>
  );
}

function UploadButton({ onUploaded, onError }: { onUploaded: (url: string) => void; onError: (msg: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onUploaded(await uploadImage(file));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Üleslaadimine ebaõnnestus.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handle(e.target.files?.[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink disabled:opacity-50"
      >
        <UploadSimple weight="bold" className="size-4" />
        {busy ? "Laadin üles…" : "Laadi üles"}
      </button>
    </>
  );
}

export function ImageField({ value, onChange }: { value: string | null; onChange: (url: string | null) => void }) {
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-sunk">
            <Image src={value} alt="" fill sizes="80px" className="object-cover" />
          </div>
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-line-strong text-xs text-muted">
            Puudub
          </div>
        )}
        <div className="flex flex-col gap-2">
          <UploadButton onUploaded={(url) => { setError(null); onChange(url); }} onError={setError} />
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent"
            >
              <Trash className="size-4" /> Eemalda
            </button>
          )}
        </div>
      </div>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        placeholder="…või kleebi pildi URL"
        className={inputClass}
      />
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  );
}

export function GalleryEditor({ items, onChange }: { items: GalleryImage[]; onChange: (items: GalleryImage[]) => void }) {
  const [error, setError] = useState<string | null>(null);

  function update(index: number, patch: Partial<GalleryImage>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3 rounded-[var(--radius-input)] border border-line bg-surface p-3">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-sunk">
            {item.url && <Image src={item.url} alt="" fill sizes="64px" className="object-cover" />}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              value={item.url}
              onChange={(e) => update(index, { url: e.target.value })}
              placeholder="Pildi URL"
              className={cn(inputClass, "py-2")}
            />
            <input
              value={item.caption ?? ""}
              onChange={(e) => update(index, { caption: e.target.value })}
              placeholder="Pealkiri (valikuline)"
              className={cn(inputClass, "py-2")}
            />
          </div>
          <div className="flex flex-col items-end justify-between">
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Eemalda pilt"
              className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-accent/10 hover:text-accent"
            >
              <Trash className="size-4" />
            </button>
            <UploadButton onUploaded={(url) => { setError(null); update(index, { url }); }} onError={setError} />
          </div>
        </div>
      ))}
      {error && <p className="text-sm text-accent">{error}</p>}
      <button
        type="button"
        onClick={() => onChange([...items, { url: "", caption: "" }])}
        className="inline-flex items-center gap-1.5 self-start rounded-full border border-line-strong px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink"
      >
        <Plus weight="bold" className="size-4" /> Lisa pilt
      </button>
    </div>
  );
}

export function LinkEditor({ items, onChange }: { items: ProjectLink[]; onChange: (items: ProjectLink[]) => void }) {
  function update(index: number, patch: Partial<ProjectLink>) {
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            value={item.label}
            onChange={(e) => update(index, { label: e.target.value })}
            placeholder="Silt"
            className={cn(inputClass, "w-40 py-2")}
          />
          <input
            value={item.url}
            onChange={(e) => update(index, { url: e.target.value })}
            placeholder="https://"
            className={cn(inputClass, "flex-1 py-2")}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            aria-label="Eemalda link"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-accent/10 hover:text-accent"
          >
            <Trash className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { label: "", url: "" }])}
        className="inline-flex items-center gap-1.5 self-start rounded-full border border-line-strong px-4 py-2 text-sm text-ink-soft transition-colors hover:border-ink"
      >
        <Plus weight="bold" className="size-4" /> Lisa link
      </button>
    </div>
  );
}
