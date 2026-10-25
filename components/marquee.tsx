// A seamless looping strip. The track holds two identical halves and shifts by
// exactly one half-width, so there is never a gap. Each half repeats the items
// enough times to be wider than the viewport. Keep to one per page.
function Half({ items }: { items: string[] }) {
  return (
    <div className="flex shrink-0 items-center">
      {items.map((word, i) => (
        <span key={i} className="flex items-center gap-10 pr-10">
          <span className="font-display text-2xl font-semibold text-ink/55 md:text-3xl">{word}</span>
          <span className="size-1.5 rotate-45 bg-accent" />
        </span>
      ))}
    </div>
  );
}

export function Marquee({ items, speed = "38s" }: { items: string[]; speed?: string }) {
  const wide = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className="marquee-track" style={{ "--marquee-speed": speed } as React.CSSProperties}>
        <Half items={wide} />
        <Half items={wide} />
      </div>
    </div>
  );
}
