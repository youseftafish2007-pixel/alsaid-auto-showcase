import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

const ROTATE_MS = 4200;
const RESUME_MS = 9000;

/**
 * A rotating orbit of the Group's companies around a central crest.
 * The company at the top of the ring is always the one in focus; the
 * detail panel beside it updates in sync. Replaces the flat logo grid.
 */
export function CompanyOrbit({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [radius, setRadius] = useState(200);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 420;
      setRadius(Math.max(92, Math.min(230, w / 2 - 48)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), ROTATE_MS);
    return () => clearTimeout(t);
  }, [active, paused, n]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPaused(true);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const select = useCallback((i: number) => {
    setActive(i);
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), RESUME_MS);
  }, []);

  const activeCompany = companies[active];

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center">
      <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[440px]">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full border border-dashed transition-colors duration-700"
          style={{ borderColor: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700"
          style={{
            width: 96,
            height: 96,
            boxShadow: `0 0 0 1px color-mix(in oklab, ${activeCompany.accent} 35%, transparent)`,
          }}
        />
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-ink text-paper shadow-[0_18px_36px_-16px_rgba(0,0,0,0.55)]">
          <span className="font-display text-lg leading-none tracking-[0.02em]">AG</span>
        </div>

        {companies.map((c, i) => {
          let delta = (((i - active) % n) + n) % n;
          if (delta > n - delta) delta -= n;
          const angleDeg = delta * (360 / n);
          const rad = (angleDeg * Math.PI) / 180;
          const x = radius * Math.sin(rad);
          const y = -radius * Math.cos(rad);
          const dist = Math.abs(delta);
          const scale = dist === 0 ? 1 : dist === 1 ? 0.8 : dist === 2 ? 0.66 : 0.55;
          const opacity = dist === 0 ? 1 : dist === 1 ? 0.85 : dist === 2 ? 0.55 : 0.32;
          const isActive = i === active;

          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => select(i)}
              aria-current={isActive}
              aria-label={`View ${c.name}`}
              className="absolute left-1/2 top-1/2 grid place-items-center rounded-full bg-paper transition-[transform,opacity,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                width: 62,
                height: 62,
                marginLeft: -31,
                marginTop: -31,
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                opacity,
                border: `2px solid ${isActive ? c.accent : "color-mix(in oklab, var(--ink) 20%, transparent)"}`,
                boxShadow: isActive ? `0 14px 28px -14px ${c.accent}` : "none",
                zIndex: 30 - dist,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                outlineColor: c.accent as any,
              }}
            >
              {c.logo ? (
                <img src={c.logo} alt="" className="h-7 w-7 object-contain md:h-8 md:w-8" />
              ) : (
                <span className="font-display text-[11px]" style={{ color: c.accent }}>
                  {c.monogram}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div key={activeCompany.slug} className="anim-rise">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.24em]"
          style={{ color: activeCompany.accent }}
        >
          {activeCompany.sector}
        </div>
        <h3 className="mt-3 font-display text-3xl leading-[1.05] text-ink md:text-4xl">
          {activeCompany.name}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">{activeCompany.tagline}</p>
        <Link
          to="/companies/$slug"
          params={{ slug: activeCompany.slug }}
          className="mt-6 inline-flex items-center gap-2 border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:-translate-y-0.5"
          style={{ borderColor: activeCompany.accent }}
        >
          Read profile
          <span aria-hidden className="transition-transform duration-300">
            →
          </span>
        </Link>

        <div className="mt-8 flex max-w-xs gap-1.5" role="tablist" aria-label="Choose a company">
          {companies.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => select(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`View ${c.name}`}
              className="h-[3px] flex-1 rounded-full transition-colors duration-500"
              style={{ background: i === active ? c.accent : "var(--rule)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
