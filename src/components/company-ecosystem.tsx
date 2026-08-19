import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

const AUTO_MS = 6800;
const RESUME_MS = 11000;
const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";
const HERO_ANGLE = -90; // 0 = top of canvas, clockwise

const CX = 430;
const CY = 470;

/**
 * Fixed, hand-placed positions for each orbit slot — deliberately irregular
 * so the composition reads as an architectural instrument rather than an
 * evenly-spaced wheel. `radius` is each company's resting distance from the
 * core; `angle` is its base position before the ring is rotated to bring
 * the active company in to the hero slot.
 */
const SLOTS = [
  { radius: 232, angle: -132 },
  { radius: 356, angle: -76 },
  { radius: 430, angle: -18 },
  { radius: 268, angle: 26 },
  { radius: 392, angle: 68 },
  { radius: 308, angle: 116 },
  { radius: 448, angle: 168 },
  { radius: 250, angle: 214 },
];

function depthOf(radius: number): "near" | "mid" | "far" {
  if (radius < 300) return "near";
  if (radius < 400) return "mid";
  return "far";
}

const DEPTH_STYLE = {
  near: { scale: 0.92, opacity: 0.85, size: 68 },
  mid: { scale: 0.74, opacity: 0.55, size: 68 },
  far: { scale: 0.58, opacity: 0.32, size: 68 },
} as const;

function toXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const a = toXY(cx, cy, r, startDeg);
  const b = toXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

const pad = (n: number) => String(n).padStart(2, "0");

export function CompanyEcosystem({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, paused, reduceMotion, n]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    },
    [],
  );

  const select = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n);
      setPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setPaused(false), RESUME_MS);
    },
    [n],
  );

  const prev = useCallback(() => select(active - 1), [active, select]);
  const next = useCallback(() => select(active + 1), [active, select]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    },
    [prev, next],
  );

  const activeCompany = companies[active];

  // Decorative, non-interactive orbit lines: a mix of full faint ellipses
  // and open arcs, at radii that don't line up with the node slots, so the
  // linework reads as its own layer rather than tracing the nodes.
  const rings = useMemo(
    () => [
      { r: 150, from: 0, to: 360, opacity: 0.14 },
      { r: 210, from: -40, to: 250, opacity: 0.1 },
      { r: 300, from: 0, to: 360, opacity: 0.08 },
      { r: 370, from: -160, to: 95, opacity: 0.09 },
      { r: 470, from: 20, to: 330, opacity: 0.06 },
    ],
    [],
  );

  return (
    <div
      className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-6 lg:gap-10"
      onKeyDown={onKeyDown}
    >
      {/* --- The orbit --- */}
      <div className="relative mx-auto aspect-[860/940] w-full max-w-[420px] sm:max-w-[520px] md:-ml-[8%] md:w-[122%] md:max-w-[720px] lg:-ml-[14%] lg:w-[132%] lg:max-w-[820px]">
        <svg
          viewBox="0 0 860 940"
          className={`absolute inset-0 h-full w-full ${reduceMotion ? "" : "eco-drift"}`}
          aria-hidden
        >
          <defs>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--paper)" stopOpacity="0.14" />
              <stop offset="100%" stopColor="var(--paper)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {rings.map((ring, i) => (
            <path
              key={i}
              d={arcPath(CX, CY, ring.r, ring.from, ring.to)}
              fill="none"
              stroke="var(--paper)"
              strokeOpacity={ring.opacity}
              strokeWidth={1}
            />
          ))}

          {/* the single deliberate red accent: a slow-orbiting arc */}
          <g
            className={reduceMotion ? "" : "eco-accent-spin"}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <path
              d={arcPath(CX, CY, 210, -20, 46)}
              fill="none"
              stroke="var(--crimson)"
              strokeOpacity={0.85}
              strokeWidth={1.4}
              strokeLinecap="round"
            />
          </g>

          {/* gravitational core */}
          <circle cx={CX} cy={CY} r={150} fill="url(#core-glow)" />
          <circle
            cx={CX}
            cy={CY}
            r={112}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity={0.16}
            strokeWidth={1}
          />
          <circle
            cx={CX}
            cy={CY}
            r={90}
            fill="none"
            stroke="var(--paper)"
            strokeOpacity={0.22}
            strokeWidth={1}
          />
          <circle
            cx={CX}
            cy={CY}
            r={66}
            fill="var(--ink)"
            stroke="var(--paper)"
            strokeOpacity={0.3}
            strokeWidth={1}
          />
        </svg>

        <div
          className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${(CX / 860) * 100}%`, top: `${(CY / 940) * 100}%` }}
          aria-hidden
        >
          <span className="font-display text-xl tracking-[0.03em] text-paper md:text-2xl">AG</span>
        </div>

        {companies.map((c, i) => {
          const slot = SLOTS[i % SLOTS.length];
          const depth = depthOf(slot.radius);
          const style = DEPTH_STYLE[depth];
          const isActive = i === active;

          const angle = slot.angle - SLOTS[active % SLOTS.length].angle + HERO_ANGLE;
          const radius = isActive ? 176 : slot.radius;
          const { x, y } = toXY(CX, CY, radius, angle);
          const leftPct = (x / 860) * 100;
          const topPct = (y / 940) * 100;
          const scale = isActive ? 1.62 : style.scale;
          const opacity = isActive ? 1 : style.opacity;

          return (
            <button
              key={c.slug}
              type="button"
              onClick={() => select(i)}
              aria-current={isActive}
              aria-label={`View ${c.name}`}
              className="absolute grid place-items-center rounded-full bg-paper transition-[left,top,transform,opacity,box-shadow] ease-[var(--eco-ease)]"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
                width: style.size,
                height: style.size,
                marginLeft: -style.size / 2,
                marginTop: -style.size / 2,
                transform: `scale(${scale})`,
                opacity,
                transitionDuration: "1100ms",
                zIndex: isActive ? 40 : Math.round(30 - slot.radius / 20),
                boxShadow: isActive
                  ? "0 22px 46px -18px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in oklab, var(--crimson) 55%, transparent)"
                  : "0 1px 0 0 color-mix(in oklab, var(--ink) 8%, transparent)",
              }}
            >
              {c.logo ? (
                <img src={c.logo} alt="" className="h-[46%] w-[46%] object-contain" />
              ) : (
                <span className="font-display text-[11px] text-ink">{c.monogram}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* --- The reading --- */}
      <div>
        <div key={activeCompany.slug} className="eco-rise">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-paper/50">
            {activeCompany.sector} · {activeCompany.location}
          </div>
          <h3 className="mt-5 font-display text-[2.75rem] leading-[0.98] tracking-[-0.01em] text-paper md:text-6xl">
            {activeCompany.name}
          </h3>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-paper/60">
            {activeCompany.tagline}
          </p>
          <Link
            to="/companies/$slug"
            params={{ slug: activeCompany.slug }}
            className="link-underline mt-8 inline-flex items-center gap-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-paper"
          >
            Read Profile
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-16 flex items-center gap-6">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous company"
            className="font-display text-lg text-paper/40 transition-colors duration-300 hover:text-paper"
          >
            ‹
          </button>
          <div className="flex-1">
            <div className="flex items-baseline gap-1.5 font-display text-sm">
              <span className="text-paper">{pad(active + 1)}</span>
              <span className="text-paper/30">/</span>
              <span className="text-paper/40">{pad(n)}</span>
            </div>
            <div className="mt-2.5 h-px w-full bg-paper/15">
              <div
                className="h-px bg-crimson transition-all duration-700 ease-[var(--eco-ease)]"
                style={{ width: `${((active + 1) / n) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next company"
            className="font-display text-lg text-paper/40 transition-colors duration-300 hover:text-paper"
          >
            ›
          </button>
        </div>
      </div>

      <style>{`
        :root { --eco-ease: ${EASE}; }
        .eco-rise { animation: eco-rise-in 900ms var(--eco-ease) both; }
        @keyframes eco-rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .eco-drift { animation: eco-drift-spin 220s linear infinite; transform-origin: ${(CX / 860) * 100}% ${(CY / 940) * 100}%; }
        .eco-accent-spin { animation: eco-accent-rotate 70s linear infinite; }
        @keyframes eco-drift-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes eco-accent-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .eco-rise { animation: none; }
        }
      `}</style>
    </div>
  );
}
