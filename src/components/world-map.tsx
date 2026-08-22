import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import worldTopo from "world-atlas/countries-110m.json";
import type { FootprintRow } from "@/lib/companies";

const WIDTH = 1100;
const HEIGHT = 560;
/** Founding city — every connection arc reads back to here. */
export const HQ_CITY = "Amman";

const world = feature(
  worldTopo as never,
  (worldTopo as never as { objects: { countries: never } }).objects.countries,
) as unknown as FeatureCollection<Geometry>;

const projection = geoNaturalEarth1().fitExtent(
  [
    [14, 14],
    [WIDTH - 14, HEIGHT - 14],
  ],
  world,
);
const path = geoPath(projection);
const graticulePath = path(geoGraticule10()) ?? undefined;
const countryPaths = world.features.map((f, i) => ({ id: i, d: path(f) ?? undefined }));

/** Manual label nudges (px, at the map's native viewBox scale) so the
 * dense MENA cluster stays legible without overlapping. */
const labelOffsets: Record<string, { dx: number; dy: number; anchor: "start" | "end" }> = {
  Amman: { dx: 12, dy: -6, anchor: "start" },
  Damascus: { dx: -12, dy: -13, anchor: "end" },
  Sharjah: { dx: 12, dy: 9, anchor: "start" },
  Dubai: { dx: 12, dy: 23, anchor: "start" },
  Mecca: { dx: -12, dy: 13, anchor: "end" },
  Tripoli: { dx: -12, dy: -2, anchor: "end" },
  Abidjan: { dx: 12, dy: 4, anchor: "start" },
  Washington: { dx: -12, dy: -2, anchor: "end" },
  Everett: { dx: 12, dy: 4, anchor: "start" },
  Seoul: { dx: 12, dy: -8, anchor: "start" },
  Guangzhou: { dx: -12, dy: 11, anchor: "end" },
  Shanghai: { dx: 12, dy: -8, anchor: "start" },
  Johannesburg: { dx: 12, dy: 10, anchor: "start" },
};

function arcPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1;
  const bow = Math.min(dist * 0.24, 100);
  const nx = -dy / dist;
  const ny = dx / dist;
  const cx = mx + nx * bow;
  const cy = my + ny * bow;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export type WorldMapProps = {
  data: FootprintRow[];
  active: string | null;
  selected: string | null;
  onHover: (city: string | null) => void;
  onSelect: (city: string | null) => void;
};

export function WorldMap({ data, active, selected, onHover, onSelect }: WorldMapProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pointer, setPointer] = useState<{ nx: number; ny: number } | null>(null);

  const points = useMemo(
    () =>
      data.map((row) => {
        const p = projection([row.lng, row.lat]);
        return { ...row, x: p ? p[0] : 0, y: p ? p[1] : 0 };
      }),
    [data],
  );

  const activePoint = points.find((p) => p.city === active) ?? null;
  const hqPoint = points.find((p) => p.city === HQ_CITY) ?? null;

  // Entrance: play once this section scrolls into view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setEntered(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setEntered(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  const handlePointerMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      nx: (e.clientX - rect.left) / rect.width,
      ny: (e.clientY - rect.top) / rect.height,
    });
  };

  // Camera zoom follows the committed selection only — hover previews the
  // info card and dims the rest without yanking the whole map around,
  // which is what made hovering a second city while one was selected feel
  // broken (the view would jump, but the HQ connection arc stayed put).
  const zoomed = Boolean(selected) && !reducedMotion;
  const zoomPoint = selected ? (points.find((p) => p.city === selected) ?? null) : null;
  const originPct = zoomPoint
    ? { x: (zoomPoint.x / WIDTH) * 100, y: (zoomPoint.y / HEIGHT) * 100 }
    : { x: 50, y: 50 };

  const parallax =
    pointer && !reducedMotion
      ? { x: (pointer.nx - 0.5) * -10, y: (pointer.ny - 0.5) * -7 }
      : { x: 0, y: 0 };

  const sceneTransform = `scale(${zoomed ? 1.7 : 1}) translate(${parallax.x}px, ${parallax.y}px)`;

  const showArc = Boolean(selected) && selected !== HQ_CITY && hqPoint && !reducedMotion;
  const arcTarget = points.find((p) => p.city === selected) ?? null;

  return (
    <div
      ref={rootRef}
      className="group/map relative overflow-hidden border-y border-ink/12 bg-paper-2/60"
      onMouseMove={handlePointerMove}
      onMouseLeave={() => setPointer(null)}
      onClick={() => onSelect(null)}
      role="group"
      aria-label="Interactive map of Alsaid Group's thirteen locations"
    >
      {/* Blueprint-style ground */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 pattern-grid opacity-[0.05]"
      />

      {/* Atmosphere — a slow, faint glow that drifts with the cursor */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 opacity-60 transition-transform duration-[1400ms] ease-out"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--crimson) 10%, transparent), transparent 70%)",
          transform: `translate(${parallax.x * -2.2}px, ${parallax.y * -2.2}px)`,
        }}
      />

      {/* Cursor crosshair — subtle instrument-panel feel */}
      {pointer && !reducedMotion ? (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-px bg-crimson/[0.14] opacity-0 transition-opacity duration-300 group-hover/map:opacity-100"
            style={{ left: `${pointer.nx * 100}%` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-px bg-crimson/[0.14] opacity-0 transition-opacity duration-300 group-hover/map:opacity-100"
            style={{ top: `${pointer.ny * 100}%` }}
          />
        </>
      ) : null}

      <div
        className="relative"
        style={{
          transform: sceneTransform,
          transformOrigin: `${originPct.x}% ${originPct.y}%`,
          transition: reducedMotion ? "none" : "transform 1.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full"
          role="img"
          aria-label="Map of Alsaid Group locations across four continents"
        >
          <path
            d={graticulePath}
            fill="none"
            stroke="var(--ink)"
            strokeWidth={0.6}
            style={{
              opacity: entered ? 0.07 : 0,
              transition: reducedMotion ? "none" : "opacity 0.7s ease-out 0.15s",
            }}
          />
          {countryPaths.map((c) => (
            <path
              key={c.id}
              d={c.d}
              fill="color-mix(in oklab, var(--ink) 8%, transparent)"
              stroke="color-mix(in oklab, var(--ink) 22%, transparent)"
              strokeWidth={0.5}
              style={{
                opacity: entered ? 1 : 0,
                filter: entered ? "blur(0px)" : "blur(5px)",
                transition: reducedMotion
                  ? "none"
                  : "opacity 0.8s cubic-bezier(0.16,1,0.3,1) 0.25s, filter 0.9s cubic-bezier(0.16,1,0.3,1) 0.25s",
              }}
            />
          ))}

          {showArc && arcTarget && hqPoint ? (
            <path
              d={arcPath(hqPoint.x, hqPoint.y, arcTarget.x, arcTarget.y)}
              fill="none"
              stroke="var(--crimson)"
              strokeWidth={1.1}
              strokeDasharray="6 5"
              strokeLinecap="round"
              className="opacity-70"
              style={{
                strokeDashoffset: 0,
                animation: reducedMotion ? "none" : "arc-draw 1s cubic-bezier(0.16,1,0.3,1) both",
              }}
            />
          ) : null}
        </svg>

        {/* Location pins — real HTML elements laid over the SVG for a11y + rich info treatment.
            Each point is a zero-size anchor div; every child measures its offset directly
            from that single anchor, so dx/dy in labelOffsets map exactly onto the geo point. */}
        <div className="pointer-events-none absolute inset-0">
          {points.map((p, i) => {
            const isActive = active === p.city;
            const isSelected = selected === p.city;
            const dim = active !== null && !isActive;
            const offset = labelOffsets[p.city] ?? { dx: 12, dy: 4, anchor: "start" as const };
            const xPct = (p.x / WIDTH) * 100;
            const yPct = (p.y / HEIGHT) * 100;
            const inLowerHalf = p.y / HEIGHT > 0.55;
            const isHQ = p.city === HQ_CITY;

            return (
              <div
                key={p.city}
                className="pointer-events-none absolute"
                style={{
                  left: `${xPct}%`,
                  top: `${yPct}%`,
                  zIndex: isHQ ? 30 : isActive ? 20 : 10,
                  opacity: entered ? 1 : 0,
                  transform: `scale(${entered ? 1 : 0.4})`,
                  transition: reducedMotion
                    ? "none"
                    : `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${0.55 + i * 0.07}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.55 + i * 0.07}s`,
                }}
              >
                <button
                  type="button"
                  className={`group pointer-events-auto absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full outline-none ${
                    isHQ ? "h-11 w-11" : "h-8 w-8"
                  }`}
                  aria-label={`${p.city}${isHQ ? " — Group headquarters" : ""}, ${p.region} — ${p.role}, since ${p.since}`}
                  aria-pressed={isSelected}
                  onMouseEnter={() => onHover(p.city)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(p.city)}
                  onBlur={() => onHover(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(isSelected ? null : p.city);
                  }}
                >
                  {/* idle ambient pulse */}
                  <span
                    aria-hidden
                    className="map-ping absolute rounded-full bg-crimson"
                    style={{
                      width: isHQ ? 14 : 10,
                      height: isHQ ? 14 : 10,
                      opacity: dim ? 0.25 : 0.7,
                    }}
                  />
                  {/* active ripple */}
                  {isActive ? (
                    <span
                      aria-hidden
                      className="absolute rounded-full border border-crimson"
                      style={{
                        width: isHQ ? 14 : 10,
                        height: isHQ ? 14 : 10,
                        animation: reducedMotion ? "none" : "hover-ripple 1.4s ease-out infinite",
                      }}
                    />
                  ) : null}
                  {/* core mark — Amman gets a capital-city star, everyone else a dot */}
                  {isHQ ? (
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      className="relative transition-all duration-300 ease-out"
                      style={{
                        width: isActive ? 23 : 16,
                        height: isActive ? 23 : 16,
                        opacity: dim ? 0.4 : 1,
                        filter: isSelected
                          ? "drop-shadow(0 0 2px color-mix(in oklab, var(--crimson) 75%, transparent)) drop-shadow(0 0 7px color-mix(in oklab, var(--crimson) 45%, transparent))"
                          : "drop-shadow(0 1px 1.5px rgba(0,0,0,0.3))",
                      }}
                    >
                      <path
                        d="M12 1.3l2.98 6.6 7.27.9-5.44 4.94 1.6 7.16L12 17.24l-6.41 3.66 1.6-7.16-5.44-4.94 7.27-.9L12 1.3z"
                        fill="var(--crimson)"
                        stroke="var(--paper)"
                        strokeWidth="1.1"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      aria-hidden
                      className="relative rounded-full border transition-all duration-300 ease-out"
                      style={{
                        width: isActive ? 11 : 6,
                        height: isActive ? 11 : 6,
                        background: "var(--crimson)",
                        borderColor: "var(--paper)",
                        borderWidth: isActive ? 2 : 1.2,
                        opacity: dim ? 0.35 : 1,
                        boxShadow: isSelected
                          ? "0 0 0 3px color-mix(in oklab, var(--crimson) 20%, transparent)"
                          : "none",
                      }}
                    />
                  )}
                  {/* keyboard focus ring */}
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full ring-0 ring-crimson/40 transition-all duration-150 group-focus-visible:ring-4"
                  />
                </button>

                {/* label */}
                <span
                  className="pointer-events-none absolute whitespace-nowrap font-sans uppercase transition-all duration-300"
                  style={{
                    left: offset.dx,
                    top: offset.dy,
                    textAlign: offset.anchor === "end" ? "right" : "left",
                    transform: offset.anchor === "end" ? "translateX(-100%)" : undefined,
                    fontSize: isActive ? 13 : 10.5,
                    letterSpacing: "0.07em",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? "var(--ink)"
                      : "color-mix(in oklab, var(--ink) 62%, transparent)",
                    opacity: dim ? 0.4 : 1,
                  }}
                >
                  {p.city}
                </span>

                {/* info treatment — reads as part of the map, not a floating card */}
                {isActive ? (
                  <div
                    className="anim-rise pointer-events-none absolute z-20 w-56 border border-ink/15 bg-paper/95 px-4 py-3 backdrop-blur-sm"
                    style={{
                      left: offset.anchor === "end" ? "auto" : 20,
                      right: offset.anchor === "end" ? 20 : "auto",
                      top: inLowerHalf ? "auto" : 20,
                      bottom: inLowerHalf ? 20 : "auto",
                      animationDuration: "0.35s",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute -left-1 top-4 h-2 w-2 rotate-45 border-b border-l border-ink/15 bg-paper"
                      style={{ display: offset.anchor === "end" ? "none" : "block" }}
                    />
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-display text-base leading-tight text-ink">{p.city}</div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink/40">
                        {p.since}
                      </div>
                    </div>
                    <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-crimson">
                      {p.region}
                    </div>
                    <p className="mt-2 text-[12px] leading-snug text-ink/70">{p.role}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Blueprint coordinate readout */}
      <div className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40 sm:bottom-4 sm:left-5">
        {activePoint ? (
          <span className="text-ink/70">
            {activePoint.city} · {activePoint.lat.toFixed(2)}°N {activePoint.lng.toFixed(2)}°E
          </span>
        ) : (
          <span>{data.length} locations · 4 continents</span>
        )}
        <span className="hidden items-center gap-1 text-ink/35 sm:inline-flex">
          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" aria-hidden>
            <path
              d="M12 1.3l2.98 6.6 7.27.9-5.44 4.94 1.6 7.16L12 17.24l-6.41 3.66 1.6-7.16-5.44-4.94 7.27-.9L12 1.3z"
              fill="currentColor"
            />
          </svg>
          Headquarters
        </span>
      </div>
      {selected ? (
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="pointer-events-auto absolute bottom-3 right-4 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40 underline decoration-dotted underline-offset-2 transition-colors hover:text-crimson sm:bottom-4 sm:right-5"
        >
          Reset view ×
        </button>
      ) : null}
    </div>
  );
}
