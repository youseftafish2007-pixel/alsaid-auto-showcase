import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

export type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  copy: string;
  to: string;
  params?: { slug: string };
  cta: string;
};

const DURATION = 6500;

export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    timer.current = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      DURATION,
    );
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [paused, slides.length, index]);

  // Pause only when the tab is hidden, never on hover (hover-pause made the
  // carousel appear frozen for desktop users resting the cursor on the hero).
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const active = slides[index];

  return (
    <section
      className="relative isolate w-full overflow-hidden bg-ink text-paper"
      aria-roledescription="carousel"
      aria-label="Alsaid Group featured work"
    >
      <div className="relative h-[68vh] min-h-[420px] w-full md:h-[82vh] md:min-h-[560px]">
        {slides.map((s, i) => (
          <div
            key={s.image + i}
            aria-hidden={i !== index}
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <img
              src={s.image}
              alt={i === index ? s.title : ""}
              className="h-full w-full object-cover"
              style={{
                animation: i === index ? "ken-burns 9s ease-out both" : undefined,
              }}
              loading={i === 0 ? "eager" : "lazy"}
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(100deg, rgba(14,12,12,0.86) 0%, rgba(14,12,12,0.62) 42%, rgba(14,12,12,0.18) 78%, rgba(14,12,12,0.35) 100%)",
              }}
            />
          </div>
        ))}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 44px)",
          }}
        />

        <div className="relative flex h-full items-end">
          <div className="container-editorial w-full pb-16 md:pb-24">
            <div key={index} className="max-w-3xl">
              <div className="anim-sweep flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.26em] text-paper/80">
                <span aria-hidden className="anim-rule h-[2px] w-10 bg-crimson" />
                {active.eyebrow}
              </div>
              <h1 className="anim-rise d-1 mt-5 font-display text-[clamp(2.4rem,6.2vw,5rem)] font-light leading-[0.98] tracking-[-0.03em]">
                {active.title}{" "}
                <em className="not-italic text-crimson">{active.emphasis}</em>
              </h1>
              <p className="anim-rise d-3 mt-5 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">
                {active.copy}
              </p>
              <div className="anim-rise d-4 mt-8 flex flex-wrap gap-3">
                <Link
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  to={active.to as any}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  params={active.params as any}
                  className="group inline-flex items-center gap-2 border border-crimson bg-crimson px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-crimson-deep"
                >
                  {active.cta}
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center border border-paper/40 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper hover:text-ink"
                >
                  About the group
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-6 right-0 hidden md:block">
          <div className="container-editorial flex justify-end gap-px">
            <button
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="grid h-11 w-11 place-items-center border border-paper/30 text-paper transition-colors hover:border-crimson hover:bg-crimson"
            >
              ←
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="grid h-11 w-11 place-items-center border border-paper/30 text-paper transition-colors hover:border-crimson hover:bg-crimson"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="container-editorial flex items-center gap-2 pb-5 md:pb-6">
          {slides.map((s, i) => (
            <button
              key={s.image + i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              className="group relative h-[3px] flex-1 max-w-[84px] overflow-hidden bg-paper/25"
            >
              <span
                className="absolute inset-y-0 left-0 bg-crimson transition-all duration-500"
                style={{ width: i === index ? "100%" : "0%" }}
              />
            </button>
          ))}
          <span className="ml-3 num text-[11px] tracking-[0.2em] text-paper/60">
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}