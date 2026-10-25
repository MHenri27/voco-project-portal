// A single horizontal strip that loops its items. CSS-driven, pauses under
// reduced motion. Keep to one per page.
export function Marquee({ items, speed = "32s" }: { items: string[]; speed?: string }) {
  return (
    <div className="relative flex overflow-hidden" aria-hidden="true">
      <div
        className="animate-marquee flex shrink-0 items-center"
        style={{ "--marquee-speed": speed } as React.CSSProperties}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-display text-xl font-semibold text-ink/80">{item}</span>
            <span className="mx-8 size-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
