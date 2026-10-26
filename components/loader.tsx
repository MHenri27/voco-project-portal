// Centered loading indicator used by route-level loading.tsx files.
export function Loader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="text-sm text-muted">Laen…</span>
    </div>
  );
}
