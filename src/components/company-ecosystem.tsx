import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

const CREAM = "#f0ede8";
const VOID = "#0a0a0a";

type RingConfig = { rx: number; ry: number; duration: number; tilt: number; z: "back" | "front" };

/** Four elliptical rings at different sizes and tilts, alternating in front
 * of and behind the core sphere. Two companies ride each ring. */
const RINGS: RingConfig[] = [
  { rx: 218, ry: 92, duration: 52, tilt: 10, z: "back" },
  { rx: 292, ry: 126, duration: 68, tilt: -16, z: "front" },
  { rx: 368, ry: 158, duration: 86, tilt: 22, z: "back" },
  { rx: 444, ry: 190, duration: 104, tilt: -8, z: "front" },
];

function ellipsePath(rx: number, ry: number) {
  return `M ${rx} 0 A ${rx} ${ry} 0 1 1 ${-rx} 0 A ${rx} ${ry} 0 1 1 ${rx} 0`;
}

const pad = (n: number) => String(n).padStart(2, "0");

// ---------- Starfield ----------

function mulberry32(seed: number) {
  let s = seed | 0;
  return function rand() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = { left: number; top: number; size: number; opacity: number };
type StarLayer = {
  count: number;
  size: [number, number];
  opacity: [number, number];
  parallax: number;
  duration: number;
};

const STAR_LAYERS: StarLayer[] = [
  { count: 90, size: [0.6, 1.2], opacity: [0.15, 0.35], parallax: 3, duration: 130 },
  { count: 55, size: [1, 1.8], opacity: [0.3, 0.55], parallax: 6, duration: 100 },
  { count: 26, size: [1.6, 2.6], opacity: [0.5, 0.85], parallax: 10, duration: 76 },
];

function buildStars(layer: StarLayer, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: layer.count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: layer.size[0] + rand() * (layer.size[1] - layer.size[0]),
    opacity: layer.opacity[0] + rand() * (layer.opacity[1] - layer.opacity[0]),
  }));
}

function Starfield({ reduceMotion }: { reduceMotion: boolean }) {
  const layers = useMemo(
    () => STAR_LAYERS.map((layer, i) => ({ layer, stars: buildStars(layer, 1000 + i * 97) })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {layers.map(({ layer, stars }, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            transform: `translate3d(calc(var(--px) * ${-layer.parallax}px), calc(var(--py) * ${-layer.parallax}px), 0)`,
            transition: "transform 400ms ease-out",
          }}
        >
          <div
            className={reduceMotion ? "absolute inset-0" : "absolute inset-0 eco-star-drift"}
            style={{ animationDuration: `${layer.duration}s` }}
          >
            {stars.map((s, si) => (
              <span
                key={si}
                className="absolute rounded-full"
                style={{
                  left: `${s.left}%`,
                  top: `${s.top}%`,
                  width: s.size,
                  height: s.size,
                  opacity: s.opacity,
                  background: CREAM,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Orbit nodes & rings ----------

type NodeProps = {
  company: Company;
  index: number;
  ring: RingConfig;
  isActive: boolean;
  running: boolean;
  onSelect: (i: number) => void;
};

function OrbitNode({ company, index, ring, isActive, running, onSelect }: NodeProps) {
  const delay = index % 2 === 0 ? 0 : -ring.duration / 2;

  const pathStyle: CSSProperties = {
    left: "50%",
    top: "50%",
    animationDuration: `${ring.duration}s`,
    animationDelay: `${delay}s`,
    animationPlayState: running && !isActive ? "running" : "paused",
    zIndex: isActive ? 60 : 10,
  };
  const extra = pathStyle as unknown as Record<string, string>;
  extra.offsetPath = `path('${ellipsePath(ring.rx, ring.ry)}')`;
  extra.offsetAnchor = "50% 50%";
  extra.offsetRotate = "0deg";
  extra.animationName = "orbit-travel";
  extra.animationTimingFunction = "linear";
  extra.animationIterationCount = "infinite";

  return (
    <div className="eco-node-group absolute" style={pathStyle}>
      <div
        className="relative"
        style={{
          width: 52,
          height: 52,
          marginLeft: -26,
          marginTop: -26,
          transform: `rotate(${-ring.tilt}deg)`,
        }}
      >
        <button
          type="button"
          onClick={() => onSelect(index)}
          aria-current={isActive}
          aria-label={`View ${company.name}`}
          className={`eco-node-sphere absolute inset-0 grid place-items-center ${isActive ? "eco-node-sphere--active" : ""}`}
        >
          {company.logo ? (
            <img src={company.logo} alt="" className="h-6 w-6 object-contain opacity-90" />
          ) : (
            <span className="font-display text-[10px]" style={{ color: CREAM }}>
              {company.monogram}
            </span>
          )}
        </button>
        <div
          className="eco-node-label pointer-events-none absolute left-1/2 top-full mt-2 max-w-[112px] -translate-x-1/2 truncate text-center text-[8px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: isActive ? "var(--crimson)" : `${CREAM}a6` }}
        >
          {company.name}
        </div>
      </div>
    </div>
  );
}

function OrbitRing({
  ring,
  companies,
  active,
  running,
  onSelect,
}: {
  ring: RingConfig;
  companies: [Company, Company];
  active: number;
  running: boolean;
  onSelect: (i: number) => void;
}) {
  const ringIndex = RINGS.indexOf(ring);
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `rotate(${ring.tilt}deg)`, transformOrigin: "50% 50%" }}
    >
      <svg
        viewBox="-500 -320 1000 640"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden
      >
        <ellipse
          cx={0}
          cy={0}
          rx={ring.rx}
          ry={ring.ry}
          fill="none"
          stroke={CREAM}
          strokeOpacity={ring.z === "front" ? 0.16 : 0.11}
          strokeWidth={1}
        />
      </svg>
      {companies.map((c, localIndex) => {
        const globalIndex = ringIndex * 2 + localIndex;
        return (
          <OrbitNode
            key={c.slug}
            company={c}
            index={globalIndex}
            ring={ring}
            isActive={globalIndex === active}
            running={running}
            onSelect={onSelect}
          />
        );
      })}
    </div>
  );
}

// ---------- Main component ----------

export function CompanyEcosystem({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // Deep-linking: /companies#slug pre-selects and expands on load, and on
  // browser back/forward.
  useEffect(() => {
    const applyHash = () => {
      const slug = window.location.hash.replace("#", "");
      if (!slug) return;
      const idx = companies.findIndex((c) => c.slug === slug);
      if (idx >= 0) {
        setActive(idx);
        setExpanded(true);
      }
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [companies]);

  const select = useCallback(
    (i: number) => {
      const idx = ((i % n) + n) % n;
      setActive(idx);
      setExpanded(true);
      window.history.replaceState(null, "", `#${companies[idx].slug}`);
    },
    [n, companies],
  );

  const close = useCallback(() => {
    setExpanded(false);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  const prev = useCallback(() => select(active - 1), [active, select]);
  const next = useCallback(() => select(active + 1), [active, select]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && expanded) close();
    },
    [prev, next, close, expanded],
  );

  const onMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      if (reduceMotion) return;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const py = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    },
    [reduceMotion],
  );

  const onMouseLeave = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  }, []);

  const activeCompany = companies[active];
  const running = !reduceMotion;
  const mobileAngles = useMemo(() => companies.map((_, i) => (360 / n) * i), [companies, n]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0a0a0a] transition-opacity duration-[1400ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
    >
      <Starfield reduceMotion={reduceMotion} />

      <div className="relative container-editorial pb-4 pt-12 text-center md:pt-20">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-crimson">
          The portfolio
        </div>
        <h1
          className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-7xl"
          style={{ color: CREAM }}
        >
          The <em className="not-italic text-crimson">Companies.</em>
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-lg leading-relaxed"
          style={{ color: `${CREAM}99` }}
        >
          Eight operating companies, one founder-led center of gravity.
        </p>
      </div>

      <div
        className={`relative mx-auto flex w-full max-w-[1500px] origin-top justify-center px-4 transition-transform duration-500 ease-out ${
          expanded ? "scale-[0.82] md:scale-[0.86]" : ""
        }`}
      >
        {/* ---------- Desktop: four-ring cinematic system ---------- */}
        <div className="relative hidden h-[680px] w-full max-w-[1040px] md:block lg:h-[760px]">
          <div
            className="absolute inset-0 z-0"
            style={{ transform: "translate3d(calc(var(--px) * 5px), calc(var(--py) * 5px), 0)" }}
          >
            {RINGS.filter((r) => r.z === "back").map((ring) => (
              <OrbitRing
                key={ring.rx}
                ring={ring}
                companies={[
                  companies[RINGS.indexOf(ring) * 2],
                  companies[RINGS.indexOf(ring) * 2 + 1],
                ]}
                active={active}
                running={running}
                onSelect={select}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="eco-core-bloom" aria-hidden />
            <div className="eco-core-sphere grid place-items-center">
              <span className="font-display text-2xl tracking-[0.03em]" style={{ color: CREAM }}>
                AG
              </span>
            </div>
          </div>

          <div
            className="absolute inset-0 z-20"
            style={{ transform: "translate3d(calc(var(--px) * 13px), calc(var(--py) * 13px), 0)" }}
          >
            {RINGS.filter((r) => r.z === "front").map((ring) => (
              <OrbitRing
                key={ring.rx}
                ring={ring}
                companies={[
                  companies[RINGS.indexOf(ring) * 2],
                  companies[RINGS.indexOf(ring) * 2 + 1],
                ]}
                active={active}
                running={running}
                onSelect={select}
              />
            ))}
          </div>
        </div>

        {/* ---------- Mobile: single rotating ring ---------- */}
        <div className="relative mx-auto aspect-square w-full max-w-[380px] py-10 md:hidden">
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <div className="eco-core-bloom eco-core-bloom--sm" aria-hidden />
            <div className="eco-core-sphere eco-core-sphere--sm grid place-items-center">
              <span className="font-display text-lg tracking-[0.03em]" style={{ color: CREAM }}>
                AG
              </span>
            </div>
          </div>
          <div className={`absolute inset-0 z-20 ${running ? "eco-mobile-spin" : ""}`}>
            <svg viewBox="-190 -190 380 380" className="absolute inset-0 h-full w-full" aria-hidden>
              <ellipse
                cx={0}
                cy={0}
                rx={160}
                ry={160}
                fill="none"
                stroke={CREAM}
                strokeOpacity={0.16}
                strokeWidth={1}
              />
            </svg>
            {companies.map((c, i) => {
              const angle = mobileAngles[i];
              const rad = ((angle - 90) * Math.PI) / 180;
              const x = 160 * Math.cos(rad);
              const y = 160 * Math.sin(rad);
              const isActive = i === active;
              return (
                <div
                  key={c.slug}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: x - 22,
                    marginTop: y - 22,
                    width: 44,
                    zIndex: isActive ? 60 : 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-current={isActive}
                    aria-label={`View ${c.name}`}
                    className={`eco-node-sphere grid place-items-center ${isActive ? "eco-node-sphere--active" : ""}`}
                    style={{ width: 44, height: 44 }}
                  >
                    <span
                      className={`grid place-items-center ${running ? "eco-mobile-spin-reverse" : ""}`}
                    >
                      {c.logo ? (
                        <img src={c.logo} alt="" className="h-6 w-6 object-contain opacity-90" />
                      ) : (
                        <span className="font-display text-[10px]" style={{ color: CREAM }}>
                          {c.monogram}
                        </span>
                      )}
                    </span>
                  </button>
                  <div
                    className="pointer-events-none mt-1.5 max-w-[64px] truncate text-center text-[7px] font-semibold uppercase tracking-[0.12em]"
                    style={{ color: isActive ? "var(--crimson)" : `${CREAM}a6` }}
                  >
                    {c.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Legend: a second, reliable way to pick a company ---------- */}
      <div className="relative mx-auto mt-2 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 md:mt-4">
        {companies.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => select(i)}
            aria-current={i === active}
            className="text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300"
            style={{ color: i === active ? "var(--crimson)" : `${CREAM}73` }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* ---------- Minimal sequence nav ---------- */}
      <div className="relative mx-auto mt-6 flex max-w-[220px] items-center gap-5 px-6">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous company"
          className="font-display text-lg transition-colors duration-300"
          style={{ color: `${CREAM}59` }}
        >
          ‹
        </button>
        <div className="flex-1">
          <div className="flex items-baseline justify-center gap-1.5 font-display text-sm">
            <span style={{ color: CREAM }}>{pad(active + 1)}</span>
            <span style={{ color: `${CREAM}40` }}>/</span>
            <span style={{ color: `${CREAM}59` }}>{pad(n)}</span>
          </div>
          <div className="mt-2.5 h-px w-full" style={{ background: `${CREAM}1f` }}>
            <div
              className="h-px bg-crimson transition-all duration-500"
              style={{ width: `${((active + 1) / n) * 100}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next company"
          className="font-display text-lg transition-colors duration-300"
          style={{ color: `${CREAM}59` }}
        >
          ›
        </button>
      </div>

      {/* ---------- Inline expanding detail panel ---------- */}
      <div className="relative mx-auto max-w-5xl px-6">
        <div
          className="grid transition-[grid-template-rows] duration-[380ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <div className="overflow-hidden">
            <div
              className={`border-t pt-8 pb-16 transition-opacity duration-300 ${expanded ? "opacity-100 delay-150" : "opacity-0"}`}
              style={{ borderColor: `${CREAM}1f` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: `${CREAM}8c` }}
                >
                  <span
                    className="inline-flex items-center gap-2 border px-3 py-1"
                    style={{ borderColor: `${CREAM}33`, color: activeCompany.accent }}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: activeCompany.accent }}
                    />
                    {activeCompany.sector}
                  </span>
                  {activeCompany.established ? <span>Est. {activeCompany.established}</span> : null}
                  <span>{activeCompany.location}</span>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Collapse company profile"
                  className="shrink-0 border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-300"
                  style={{ borderColor: `${CREAM}33`, color: `${CREAM}99` }}
                >
                  Close ✕
                </button>
              </div>

              <div className="mt-8 grid gap-10 md:grid-cols-12">
                <div className="md:col-span-7">
                  <h3
                    className="font-display text-4xl leading-[1] tracking-[-0.01em] md:text-5xl"
                    style={{ color: CREAM }}
                  >
                    {activeCompany.name}
                  </h3>
                  <div
                    className="mt-5 space-y-4 text-[15px] leading-relaxed"
                    style={{ color: `${CREAM}a6` }}
                  >
                    {activeCompany.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <a
                      href="mailto:partnerships@alsaidgroup.com"
                      className="inline-flex items-center justify-center border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition-transform duration-300 hover:-translate-y-0.5"
                      style={{
                        background: activeCompany.accent,
                        borderColor: activeCompany.accent,
                        color: VOID,
                      }}
                    >
                      Enquire
                    </a>
                    <Link
                      to="/companies/$slug"
                      params={{ slug: activeCompany.slug }}
                      className="eco-link pb-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
                      style={{ color: `${CREAM}b3` }}
                    >
                      Open full profile ↗
                    </Link>
                  </div>
                </div>
                <div className="md:col-span-5">
                  <div
                    className="relative aspect-[4/3] overflow-hidden border"
                    style={{ borderColor: `${CREAM}1f` }}
                  >
                    <img
                      src={activeCompany.hero}
                      alt={activeCompany.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {activeCompany.logo ? (
                      <span
                        className="absolute left-3 top-3 inline-flex items-center border px-2.5 py-1.5 backdrop-blur-sm"
                        style={{ borderColor: `${CREAM}40`, background: `${VOID}b3` }}
                      >
                        <img
                          src={activeCompany.logo}
                          alt=""
                          className="h-5 w-auto object-contain"
                        />
                      </span>
                    ) : null}
                  </div>
                  <div
                    className="mt-5 grid grid-cols-2 gap-px overflow-hidden border"
                    style={{ borderColor: `${CREAM}1f`, background: `${CREAM}1a` }}
                  >
                    {activeCompany.facts.map((f) => (
                      <div key={f.label} className="px-4 py-4" style={{ background: VOID }}>
                        <div className="font-display text-xl leading-none" style={{ color: CREAM }}>
                          {f.value}
                        </div>
                        <div
                          className="mt-2 text-[9px] uppercase tracking-[0.16em]"
                          style={{ color: `${CREAM}73` }}
                        >
                          {f.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={expanded ? "h-6" : "h-16 md:h-24"} aria-hidden />

      <style>{`
        @keyframes orbit-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes eco-core-pulse-bloom {
          0%, 100% { opacity: .4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: .68; transform: translate(-50%, -50%) scale(1.07); }
        }
        @keyframes eco-core-pulse-scale {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.035); }
        }
        @keyframes eco-mobile-ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes eco-mobile-ring-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes eco-star-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(6px, -4px); }
        }

        .eco-core-bloom {
          position: absolute; left: 50%; top: 50%;
          width: 320px; height: 320px; border-radius: 9999px;
          background: radial-gradient(circle, var(--crimson) 0%, transparent 72%);
          filter: blur(38px);
          animation: eco-core-pulse-bloom 5.5s ease-in-out infinite;
        }
        .eco-core-bloom--sm { width: 190px; height: 190px; filter: blur(24px); }
        .eco-core-sphere {
          position: relative;
          width: 96px; height: 96px; border-radius: 9999px;
          background: radial-gradient(circle at 34% 30%, color-mix(in oklab, var(--crimson) 55%, white) 0%, var(--crimson) 46%, var(--crimson-deep) 100%);
          box-shadow: 0 0 54px 8px color-mix(in oklab, var(--crimson) 50%, transparent), inset 0 0 18px rgba(0,0,0,.4);
          animation: eco-core-pulse-scale 5.5s ease-in-out infinite;
        }
        .eco-core-sphere--sm { width: 60px; height: 60px; box-shadow: 0 0 32px 6px color-mix(in oklab, var(--crimson) 50%, transparent), inset 0 0 12px rgba(0,0,0,.4); }

        .eco-node-sphere {
          border-radius: 9999px;
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.5), rgba(255,255,255,.06) 42%, rgba(10,10,10,.7) 78%);
          border: 1px solid rgba(240,237,232,.22);
          box-shadow: 0 10px 22px -10px rgba(0,0,0,.7), 0 0 16px 1px color-mix(in oklab, var(--crimson) 22%, transparent);
          transition: transform 400ms cubic-bezier(0.19,1,0.22,1), box-shadow 400ms ease, border-color 400ms ease;
          cursor: pointer;
        }
        .eco-node-sphere:hover { transform: scale(1.28); border-color: color-mix(in oklab, var(--crimson) 55%, transparent); }
        .eco-node-sphere--active {
          transform: scale(1.4) !important;
          border-color: color-mix(in oklab, var(--crimson) 75%, transparent);
          box-shadow: 0 16px 34px -12px rgba(0,0,0,.8), 0 0 34px 6px color-mix(in oklab, var(--crimson) 55%, transparent);
        }

        .eco-link { background-image: linear-gradient(currentColor, currentColor); background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size 300ms ease; }
        .eco-link:hover { background-size: 0% 1px; }

        .eco-mobile-spin { animation: eco-mobile-ring-spin 150s linear infinite; }
        .eco-mobile-spin-reverse { animation: eco-mobile-ring-spin-reverse 150s linear infinite; }

        .delay-150 { transition-delay: 150ms; }

        @media (prefers-reduced-motion: reduce) {
          .eco-core-bloom, .eco-core-sphere, .eco-mobile-spin, .eco-mobile-spin-reverse { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
