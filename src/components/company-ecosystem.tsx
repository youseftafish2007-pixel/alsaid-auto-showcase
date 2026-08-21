import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

const CREAM = "#f0ede8";
const VOID = "#0a0a0a";

type RingConfig = { rx: number; ry: number; duration: number; tilt: number; z: "back" | "front" };

/** Three-to-four large elliptical paths at different inclinations. Slow —
 * this is a backdrop, not the interaction. Two companies ride each ring. */
const RINGS: RingConfig[] = [
  { rx: 220, ry: 94, duration: 130, tilt: 9, z: "back" },
  { rx: 300, ry: 130, duration: 165, tilt: -14, z: "front" },
  { rx: 380, ry: 164, duration: 200, tilt: 20, z: "back" },
  { rx: 458, ry: 196, duration: 240, tilt: -7, z: "front" },
];

/** Subtle size variance only — reads as depth, not decoration. */
const NODE_SIZES = [50, 55, 47, 53, 51, 46, 56, 49];

function ellipsePath(rx: number, ry: number) {
  return `M ${rx} 0 A ${rx} ${ry} 0 1 1 ${-rx} 0 A ${rx} ${ry} 0 1 1 ${rx} 0`;
}

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
  { count: 70, size: [0.6, 1.1], opacity: [0.12, 0.28], parallax: 2, duration: 150 },
  { count: 40, size: [0.9, 1.5], opacity: [0.22, 0.42], parallax: 4, duration: 120 },
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

// ---------- Orbit node ----------

type NodeProps = {
  company: Company;
  index: number;
  ring: RingConfig;
  size: number;
  isLocked: boolean;
  isFocused: boolean;
  dimmed: boolean;
  running: boolean;
  onSelect: (i: number) => void;
  onEnter: (i: number) => void;
  onLeave: () => void;
};

function OrbitNode({
  company,
  index,
  ring,
  size,
  isLocked,
  isFocused,
  dimmed,
  running,
  onSelect,
  onEnter,
  onLeave,
}: NodeProps) {
  const delay = index % 2 === 0 ? 0 : -ring.duration / 2;
  const hitSize = 88;

  const pathStyle: CSSProperties = {
    left: "50%",
    top: "50%",
    animationDuration: `${ring.duration}s`,
    animationDelay: `${delay}s`,
    animationPlayState: running && !isFocused ? "running" : "paused",
    zIndex: isFocused ? 60 : isLocked ? 45 : 10,
    opacity: dimmed ? 0.55 : 1,
    transition: "opacity 400ms ease",
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
      <button
        type="button"
        onClick={() => onSelect(index)}
        onMouseEnter={() => onEnter(index)}
        onMouseLeave={onLeave}
        onFocus={() => onEnter(index)}
        onBlur={onLeave}
        aria-current={isLocked}
        aria-label={`Focus ${company.name}`}
        className="absolute grid place-items-center rounded-full"
        style={{
          width: hitSize,
          height: hitSize,
          marginLeft: -hitSize / 2,
          marginTop: -hitSize / 2,
        }}
      >
        <span
          className="relative grid place-items-center"
          style={{
            width: size,
            height: size,
            transform: `rotate(${-ring.tilt}deg) scale(${isFocused ? 1.2 : 1})`,
            transition: "transform 400ms cubic-bezier(0.19,1,0.22,1)",
          }}
        >
          <span
            className={`eco-node-sphere absolute inset-0 rounded-full ${isFocused ? "eco-node-sphere--focused" : ""}`}
          />
          {company.logo ? (
            <img src={company.logo} alt="" className="relative h-6 w-6 object-contain opacity-90" />
          ) : (
            <span className="relative font-display text-[10px]" style={{ color: CREAM }}>
              {company.monogram}
            </span>
          )}
        </span>
        {isFocused ? (
          <span
            className="pointer-events-none absolute left-1/2 top-full mt-2 w-max max-w-[180px] -translate-x-1/2 text-center text-[10.5px] font-bold uppercase tracking-[0.08em]"
            style={{
              color: CREAM,
              textShadow: "0 1px 4px rgba(0,0,0,.9), 0 0 12px rgba(0,0,0,.6)",
            }}
          >
            {company.name}
          </span>
        ) : null}
      </button>
    </div>
  );
}

function OrbitRing({
  ring,
  companies,
  lockedIndex,
  focusIndex,
  running,
  onSelect,
  onEnter,
  onLeave,
}: {
  ring: RingConfig;
  companies: [Company, Company];
  lockedIndex: number | null;
  focusIndex: number | null;
  running: boolean;
  onSelect: (i: number) => void;
  onEnter: (i: number) => void;
  onLeave: () => void;
}) {
  const ringIndex = RINGS.indexOf(ring);
  const globalIndices = [ringIndex * 2, ringIndex * 2 + 1];
  const ringIsFocused = focusIndex !== null && globalIndices.includes(focusIndex);
  const someoneFocused = focusIndex !== null;

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
          stroke={ringIsFocused ? "var(--crimson)" : CREAM}
          strokeOpacity={
            ringIsFocused ? 0.5 : someoneFocused ? 0.06 : ring.z === "front" ? 0.14 : 0.09
          }
          strokeWidth={1}
          style={{ transition: "stroke 400ms ease, stroke-opacity 400ms ease" }}
        />
      </svg>
      {companies.map((c, localIndex) => {
        const globalIndex = globalIndices[localIndex];
        return (
          <OrbitNode
            key={c.slug}
            company={c}
            index={globalIndex}
            ring={ring}
            size={NODE_SIZES[globalIndex]}
            isLocked={globalIndex === lockedIndex}
            isFocused={globalIndex === focusIndex}
            dimmed={someoneFocused && globalIndex !== focusIndex}
            running={running}
            onSelect={onSelect}
            onEnter={onEnter}
            onLeave={onLeave}
          />
        );
      })}
    </div>
  );
}

// ---------- Fixed info panel ----------

function InfoPanel({
  company,
  isLocked,
  onBack,
  mobile,
}: {
  company: Company;
  isLocked: boolean;
  onBack: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={
        mobile
          ? "eco-panel-mobile-in absolute inset-x-0 bottom-0 z-[70] border-t px-6 pb-6 pt-5"
          : "eco-panel-in absolute right-0 top-1/2 z-[70] w-[280px] -translate-y-1/2 border p-6"
      }
      style={{ borderColor: `${CREAM}22`, background: `${VOID}e8`, backdropFilter: "blur(10px)" }}
    >
      <div
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        style={{ color: "var(--crimson)" }}
      >
        {company.sector}
      </div>
      <h3 className="mt-3 font-display text-2xl leading-[1.05]" style={{ color: CREAM }}>
        {company.name}
      </h3>
      <p className="mt-3 text-[13px] leading-relaxed" style={{ color: `${CREAM}99` }}>
        {company.tagline}
      </p>
      <div className="mt-5 flex items-center gap-5">
        <Link
          to="/companies/$slug"
          params={{ slug: company.slug }}
          className="eco-link text-[10.5px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: CREAM }}
        >
          Explore Company →
        </Link>
        {isLocked ? (
          <button
            type="button"
            onClick={onBack}
            className="text-[10.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300"
            style={{ color: `${CREAM}66` }}
          >
            ← Back
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ---------- Main component ----------

export function CompanyEcosystem({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const [lockedIndex, setLockedIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
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

  const select = useCallback(
    (i: number) => {
      setLockedIndex(((i % n) + n) % n);
    },
    [n],
  );

  const back = useCallback(() => setLockedIndex(null), []);
  const handleEnter = useCallback((i: number) => setHoverIndex(i), []);
  const handleLeave = useCallback(() => setHoverIndex(null), []);

  const onStageClick = useCallback((e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setLockedIndex(null);
  }, []);

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

  const focusIndex = hoverIndex ?? lockedIndex;
  const focusCompany = focusIndex !== null ? companies[focusIndex] : null;
  const running = !reduceMotion;
  const mobileAngles = useMemo(() => companies.map((_, i) => (360 / n) * i), [companies, n]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#0a0a0a] transition-opacity duration-[1400ms] ease-out ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
    >
      <Starfield reduceMotion={reduceMotion} />

      <div className="relative container-editorial pb-4 pt-12 text-center md:pt-20">
        <div
          className="text-[10px] font-semibold uppercase tracking-[0.28em]"
          style={{ color: "var(--crimson)" }}
        >
          Alsaid Group
        </div>
        <h1
          className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-7xl"
          style={{ color: CREAM }}
        >
          The Alsaid <em className="not-italic text-crimson">Universe.</em>
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-lg leading-relaxed"
          style={{ color: `${CREAM}99` }}
        >
          One group, eight companies orbiting a shared center of gravity.
        </p>
      </div>

      {/* ---------- Desktop ---------- */}
      <div
        className="relative mx-auto hidden h-[640px] w-full max-w-[1100px] px-4 md:block lg:h-[720px]"
        onClick={onStageClick}
      >
        <div
          className="absolute inset-0 z-0"
          style={{ transform: "translate3d(calc(var(--px) * 4px), calc(var(--py) * 4px), 0)" }}
        >
          {RINGS.filter((r) => r.z === "back").map((ring) => (
            <OrbitRing
              key={ring.rx}
              ring={ring}
              companies={[
                companies[RINGS.indexOf(ring) * 2],
                companies[RINGS.indexOf(ring) * 2 + 1],
              ]}
              lockedIndex={lockedIndex}
              focusIndex={focusIndex}
              running={running}
              onSelect={select}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="eco-core-bloom" aria-hidden />
          <div className="eco-core-ring eco-core-ring--outer" aria-hidden />
          <div className="eco-core-ring eco-core-ring--inner" aria-hidden />
          <div className="eco-core-sphere grid place-items-center">
            <span className="eco-core-highlight" aria-hidden />
            <span className="font-display text-2xl tracking-[0.03em]" style={{ color: CREAM }}>
              AG
            </span>
          </div>
        </div>

        <div
          className="absolute inset-0 z-20"
          style={{ transform: "translate3d(calc(var(--px) * 10px), calc(var(--py) * 10px), 0)" }}
        >
          {RINGS.filter((r) => r.z === "front").map((ring) => (
            <OrbitRing
              key={ring.rx}
              ring={ring}
              companies={[
                companies[RINGS.indexOf(ring) * 2],
                companies[RINGS.indexOf(ring) * 2 + 1],
              ]}
              lockedIndex={lockedIndex}
              focusIndex={focusIndex}
              running={running}
              onSelect={select}
              onEnter={handleEnter}
              onLeave={handleLeave}
            />
          ))}
        </div>

        {focusCompany ? (
          <InfoPanel company={focusCompany} isLocked={lockedIndex !== null} onBack={back} />
        ) : null}
      </div>

      {/* ---------- Mobile ---------- */}
      <div className="relative mx-auto aspect-square w-full max-w-[380px] py-10 md:hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="eco-core-bloom eco-core-bloom--sm" aria-hidden />
          <div className="eco-core-ring eco-core-ring--outer eco-core-ring--sm" aria-hidden />
          <div className="eco-core-ring eco-core-ring--inner eco-core-ring--sm" aria-hidden />
          <div className="eco-core-sphere eco-core-sphere--sm grid place-items-center">
            <span className="eco-core-highlight eco-core-highlight--sm" aria-hidden />
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
              strokeOpacity={0.14}
              strokeWidth={1}
            />
          </svg>
          {companies.map((c, i) => {
            const angle = mobileAngles[i];
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = 160 * Math.cos(rad);
            const y = 160 * Math.sin(rad);
            const isLocked = i === lockedIndex;
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => select(i)}
                aria-current={isLocked}
                aria-label={`Focus ${c.name}`}
                className="absolute grid place-items-center rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  width: 60,
                  height: 60,
                  marginLeft: x - 30,
                  marginTop: y - 30,
                  zIndex: isLocked ? 60 : 10,
                }}
              >
                <span
                  className={`grid place-items-center ${running ? "eco-mobile-spin-reverse" : ""}`}
                  style={{ opacity: lockedIndex !== null && !isLocked ? 0.55 : 1 }}
                >
                  <span
                    className={`eco-node-sphere relative rounded-full ${isLocked ? "eco-node-sphere--focused" : ""}`}
                    style={{
                      width: 44,
                      height: 44,
                      transform: isLocked ? "scale(1.15)" : "scale(1)",
                      transition: "transform 400ms cubic-bezier(0.19,1,0.22,1)",
                    }}
                  />
                  <span className="pointer-events-none absolute inset-0 grid place-items-center">
                    {c.logo ? (
                      <img src={c.logo} alt="" className="h-6 w-6 object-contain opacity-90" />
                    ) : (
                      <span className="font-display text-[10px]" style={{ color: CREAM }}>
                        {c.monogram}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {focusCompany ? <InfoPanel company={focusCompany} isLocked mobile onBack={back} /> : null}
      </div>

      <div className={focusCompany ? "h-4" : "h-14 md:h-20"} aria-hidden />

      <style>{`
        @keyframes orbit-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes eco-core-pulse-bloom {
          0%, 100% { opacity: .35; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: .55; transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes eco-core-pulse-scale {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.025); }
        }
        @keyframes eco-mobile-ring-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes eco-mobile-ring-spin-reverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes eco-core-ring-spin {
          from { transform: translate(-50%, -50%) rotate(0deg) scaleY(.82); }
          to { transform: translate(-50%, -50%) rotate(360deg) scaleY(.82); }
        }
        @keyframes eco-core-ring-spin-rev {
          from { transform: translate(-50%, -50%) rotate(360deg) scaleY(.7); }
          to { transform: translate(-50%, -50%) rotate(0deg) scaleY(.7); }
        }
        @keyframes eco-star-drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(5px, -3px); }
        }
        @keyframes eco-panel-in {
          from { opacity: 0; transform: translate(12px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
        @keyframes eco-panel-mobile-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eco-panel-in { animation: eco-panel-in 350ms cubic-bezier(0.19,1,0.22,1) both; }
        .eco-panel-mobile-in { animation: eco-panel-mobile-in 350ms cubic-bezier(0.19,1,0.22,1) both; border-radius: 16px 16px 0 0; }

        .eco-core-bloom {
          position: absolute; left: 50%; top: 50%;
          width: 300px; height: 300px; border-radius: 9999px;
          background: radial-gradient(circle, var(--crimson) 0%, transparent 72%);
          filter: blur(40px);
          animation: eco-core-pulse-bloom 6s ease-in-out infinite;
        }
        .eco-core-bloom--sm { width: 180px; height: 180px; filter: blur(26px); }
        .eco-core-ring { position: absolute; left: 50%; top: 50%; border-radius: 9999px; border-style: solid; }
        .eco-core-ring--outer { width: 176px; height: 176px; border-width: 1px; border-color: color-mix(in oklab, var(--crimson) 35%, transparent); animation: eco-core-ring-spin 60s linear infinite; }
        .eco-core-ring--inner { width: 136px; height: 136px; border-width: 1px; border-color: rgba(240,237,232,.18); animation: eco-core-ring-spin-rev 44s linear infinite; }
        .eco-core-ring--sm.eco-core-ring--outer { width: 108px; height: 108px; }
        .eco-core-ring--sm.eco-core-ring--inner { width: 84px; height: 84px; }
        .eco-core-sphere {
          position: relative; width: 92px; height: 92px; border-radius: 9999px;
          background: radial-gradient(circle at 34% 30%, color-mix(in oklab, var(--crimson) 50%, white) 0%, var(--crimson) 46%, var(--crimson-deep) 100%);
          box-shadow: 0 0 44px 6px color-mix(in oklab, var(--crimson) 40%, transparent), inset 0 0 16px rgba(0,0,0,.4);
          animation: eco-core-pulse-scale 6s ease-in-out infinite;
        }
        .eco-core-sphere--sm { width: 58px; height: 58px; box-shadow: 0 0 28px 5px color-mix(in oklab, var(--crimson) 40%, transparent), inset 0 0 10px rgba(0,0,0,.4); }
        .eco-core-highlight { position: absolute; left: 20%; top: 16%; width: 36%; height: 36%; border-radius: 9999px; background: radial-gradient(circle, rgba(255,255,255,.5), transparent 70%); filter: blur(1px); }
        .eco-core-highlight--sm { left: 18%; top: 14%; }

        .eco-node-sphere {
          background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.42), rgba(255,255,255,.05) 42%, rgba(10,10,10,.72) 78%);
          border: 1px solid rgba(240,237,232,.2);
          box-shadow: 0 8px 18px -10px rgba(0,0,0,.7);
          transition: box-shadow 400ms ease, border-color 400ms ease;
        }
        .eco-node-sphere--focused {
          border-color: color-mix(in oklab, var(--crimson) 65%, transparent);
          box-shadow: 0 12px 26px -12px rgba(0,0,0,.75), 0 0 22px 3px color-mix(in oklab, var(--crimson) 40%, transparent);
        }
        .eco-node-group button:focus-visible .eco-node-sphere { outline: 2px solid var(--crimson); outline-offset: 3px; }

        .eco-link { background-image: linear-gradient(currentColor, currentColor); background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size 300ms ease; }
        .eco-link:hover { background-size: 0% 1px; }

        .eco-mobile-spin { animation: eco-mobile-ring-spin 200s linear infinite; }
        .eco-mobile-spin-reverse { animation: eco-mobile-ring-spin-reverse 200s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .eco-core-bloom, .eco-core-sphere, .eco-core-ring, .eco-mobile-spin, .eco-mobile-spin-reverse { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
