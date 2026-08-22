import { useEffect, useRef, useState } from "react";

export type TimelineItem = {
  year: string;
  label: string;
  title: string;
  description: string;
  /** Photograph — used when available. */
  image?: string;
  imageAlt?: string;
  /** Coordinate/document-style card, used when no photograph exists. */
  plaque?: { heading: string; sub: string };
  accent?: string;
};

/** A single milestone. Reveals independently as it enters the viewport,
 * and lights up the line's dot to mark progress through the story. */
function TimelineRow({ item, index }: { item: TimelineItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.28, rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const accent = item.accent ?? "var(--crimson)";

  return (
    <div ref={ref} className="relative">
      {/* Node dot on the spine */}
      <span
        aria-hidden
        className="absolute left-[3px] top-[3.25rem] z-10 -translate-x-1/2 md:left-[3px]"
      >
        <span
          className="relative flex h-[13px] w-[13px] items-center justify-center rounded-full border-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            borderColor: shown ? accent : "color-mix(in oklab, var(--ink) 22%, transparent)",
            background: shown ? accent : "var(--paper)",
            transform: shown ? "scale(1)" : "scale(0.6)",
          }}
        >
          {shown && (
            <span
              aria-hidden
              className="map-ping absolute -inset-2 rounded-full"
              style={{ background: accent }}
            />
          )}
        </span>
      </span>

      <div
        className="grid gap-6 py-10 pl-10 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:pl-14 md:grid-cols-12 md:gap-10 md:py-16 md:pl-16"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(36px)",
          transitionDelay: shown ? "60ms" : "0ms",
        }}
      >
        <div className="md:col-span-4">
          <div
            className="num text-[13px] font-semibold uppercase tracking-[0.24em]"
            style={{ color: accent }}
          >
            {String(index + 1).padStart(2, "0")} · {item.label}
          </div>
          <div className="num mt-2 text-6xl font-light leading-[0.95] tracking-tight text-ink md:text-7xl">
            {item.year}
          </div>
          <h3 className="mt-3 font-display text-xl leading-snug text-ink md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">{item.description}</p>
        </div>

        <div className="md:col-span-8">
          {item.image ? (
            <div
              className="image-frame aspect-[16/8] transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "scale(1)" : "scale(0.94)",
                filter: shown ? "blur(0px)" : "blur(6px)",
                transitionDelay: shown ? "160ms" : "0ms",
              }}
            >
              <img src={item.image} alt={item.imageAlt ?? item.title} loading="lazy" />
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[3px]"
                style={{ background: accent }}
              />
              <span className="absolute left-3 top-3 border border-paper/40 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/85 backdrop-blur-sm">
                Fig. {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          ) : item.plaque ? (
            <div
              className="relative flex aspect-[16/8] flex-col justify-between overflow-hidden border border-dashed p-6 transition-all duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:p-8"
              style={{
                borderColor: "color-mix(in oklab, var(--ink) 22%, transparent)",
                background: "var(--paper-2)",
                opacity: shown ? 1 : 0,
                transform: shown ? "scale(1)" : "scale(0.94)",
                transitionDelay: shown ? "160ms" : "0ms",
              }}
            >
              <span aria-hidden className="pattern-dots absolute inset-0 opacity-[0.5]" />
              <div className="relative flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                  Field note · Ref {String(index + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: accent }} />
              </div>
              <div className="relative">
                <div className="font-mono text-2xl tracking-tight text-ink md:text-3xl">
                  {item.plaque.heading}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
                  {item.plaque.sub}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** Vertical scroll-progress spine + revealing milestone rows. The fill
 * height tracks scroll position so the line visibly "draws itself" as
 * the reader moves through the Group's history. */
export function ScrollTimeline({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = containerRef.current;
      const fill = fillRef.current;
      if (!el || !fill) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height - vh * 0.35;
      const passed = vh * 0.65 - rect.top;
      const progress = total > 0 ? Math.min(1, Math.max(0, passed / total)) : 0;
      fill.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden
        className="absolute left-[3px] top-2 bottom-2 w-px"
        style={{ background: "color-mix(in oklab, var(--ink) 14%, transparent)" }}
      />
      <div
        ref={fillRef}
        aria-hidden
        className="absolute left-[3px] top-2 bottom-2 w-px origin-top bg-crimson"
        style={{ transform: "scaleY(0)" }}
      />
      <div>
        {items.map((item, i) => (
          <TimelineRow key={`${item.year}-${i}`} item={item} index={i} />
        ))}
      </div>
    </div>
  );
}
