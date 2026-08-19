import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import type { Company } from "@/lib/companies";

const AUTO_MS = 7600;
const RESUME_MS = 12000;

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

  const style: CSSProperties = {
    left: "50%",
    top: "50%",
    animationDuration: `${ring.duration}s`,
    animationDelay: `${delay}s`,
    animationPlayState: running && !isActive ? "running" : "paused",
  };
  const extra = style as unknown as Record<string, string>;
  extra.offsetPath = `path('${ellipsePath(ring.rx, ring.ry)}')`;
  extra.offsetAnchor = "50% 50%";
  extra.offsetRotate = "0deg";
  extra.animationName = "orbit-travel";
  extra.animationTimingFunction = "linear";
  extra.animationIterationCount = "infinite";

  return (
    <div className="eco-node-group group absolute" style={{ ...style, zIndex: isActive ? 60 : 10 }}>
      <button
        type="button"
        onClick={() => onSelect(index)}
        aria-current={isActive}
        aria-label={`View ${company.name}`}
        className={`eco-node-sphere grid place-items-center ${isActive ? "eco-node-sphere--active" : ""}`}
        style={
          {
            width: 52,
            height: 52,
            marginLeft: -26,
            marginTop: -26,
            "--tilt": `${-ring.tilt}deg`,
            transform: "rotate(var(--tilt))",
          } as CSSProperties
        }
      >
        {company.logo ? (
          <img src={company.logo} alt="" className="h-6 w-6 object-contain opacity-90" />
        ) : (
          <span className="font-display text-[10px] text-[#f0ede8]">{company.monogram}</span>
        )}
      </button>
      <div className="eco-tooltip pointer-events-none absolute left-1/2 top-full z-[70] mt-3 w-48 -translate-x-1/2 border border-[#f0ede8]/15 bg-[#0a0a0a]/90 p-3 backdrop-blur-sm">
        <div className="text-[9px] font-semibold uppercase tracking-[0.2em] text-crimson">
          {company.sector}
        </div>
        <div className="mt-1 font-display text-sm text-[#f0ede8]">{company.name}</div>
        <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-[#f0ede8]/55">
          {company.tagline}
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
          stroke="#f0ede8"
          strokeOpacity={ring.z === "front" ? 0.16 : 0.11}
          strokeWidth={1}
        />
      </svg>
      {companies.map((c, localIndex) => {
        const globalIndex = RINGS.indexOf(ring) * 2 + localIndex;
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

export function CompanyEcosystem({ companies }: { companies: Company[] }) {
  const n = companies.length;
  const [active, setActive] = useState(0);
  const [idle, setIdle] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!idle || reduceMotion) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % n), AUTO_MS);
    return () => clearTimeout(t);
  }, [active, idle, reduceMotion, n]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const select = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n);
      setIdle(false);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setIdle(true), RESUME_MS);
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

  const onMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (reduceMotion) return;
      const el = stageRef.current;
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
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  }, []);

  const activeCompany = companies[active];
  const running = idle && !reduceMotion;
  const mobileAngles = useMemo(() => companies.map((_, i) => (360 / n) * i), [companies, n]);

  return (
    <div
      ref={sectionRef}
      className={`relative left-1/2 w-screen -translate-x-1/2 bg-[#0a0a0a] transition-opacity duration-[1400ms] ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onKeyDown={onKeyDown}
    >
      <div
        ref={stageRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative mx-auto flex w-full max-w-[1500px] justify-center px-4"
        style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}
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
              <span className="font-display text-2xl tracking-[0.03em] text-[#f0ede8]">AG</span>
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
              <span className="font-display text-lg tracking-[0.03em] text-[#f0ede8]">AG</span>
            </div>
          </div>
          <div
            className={`absolute inset-0 z-20 ${reduceMotion || !idle ? "" : "eco-mobile-spin"}`}
          >
            <svg viewBox="-190 -190 380 380" className="absolute inset-0 h-full w-full" aria-hidden>
              <ellipse
                cx={0}
                cy={0}
                rx={160}
                ry={160}
                fill="none"
                stroke="#f0ede8"
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
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => select(i)}
                  aria-current={isActive}
                  aria-label={`View ${c.name}`}
                  className={`eco-node-sphere absolute grid place-items-center ${isActive ? "eco-node-sphere--active" : ""}`}
                  style={{
                    left: "50%",
                    top: "50%",
                    marginLeft: x - 22,
                    marginTop: y - 22,
                    width: 44,
                    height: 44,
                  }}
                >
                  <span
                    className={`grid place-items-center ${reduceMotion || !idle ? "" : "eco-mobile-spin-reverse"}`}
                  >
                    {c.logo ? (
                      <img src={c.logo} alt="" className="h-6 w-6 object-contain opacity-90" />
                    ) : (
                      <span className="font-display text-[10px] text-[#f0ede8]">{c.monogram}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- Reading panel, integrated into the same dark scene ---------- */}
      <div className="relative z-30 mx-auto max-w-2xl px-6 pb-16 pt-2 text-center md:pb-24">
        <div key={activeCompany.slug} className="eco-rise">
          <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#f0ede8]/45">
            {activeCompany.sector} · {activeCompany.location}
          </div>
          <h3 className="mt-5 font-display text-4xl leading-[1] tracking-[-0.01em] text-[#f0ede8] md:text-5xl">
            {activeCompany.name}
          </h3>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#f0ede8]/55">
            {activeCompany.tagline}
          </p>
          <Link
            to="/companies/$slug"
            params={{ slug: activeCompany.slug }}
            className="eco-link mt-7 inline-flex items-center gap-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f0ede8]"
          >
            Read Profile
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mx-auto mt-12 flex max-w-[260px] items-center gap-5">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous company"
            className="font-display text-lg text-[#f0ede8]/35 transition-colors duration-300 hover:text-[#f0ede8]"
          >
            ‹
          </button>
          <div className="flex-1">
            <div className="flex items-baseline justify-center gap-1.5 font-display text-sm">
              <span className="text-[#f0ede8]">{pad(active + 1)}</span>
              <span className="text-[#f0ede8]/25">/</span>
              <span className="text-[#f0ede8]/35">{pad(n)}</span>
            </div>
            <div className="mt-2.5 h-px w-full bg-[#f0ede8]/12">
              <div
                className="h-px bg-crimson transition-all duration-700"
                style={{ width: `${((active + 1) / n) * 100}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next company"
            className="font-display text-lg text-[#f0ede8]/35 transition-colors duration-300 hover:text-[#f0ede8]"
          >
            ›
          </button>
        </div>
      </div>

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
        @keyframes eco-rise-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .eco-rise { animation: eco-rise-in 900ms cubic-bezier(0.19,1,0.22,1) both; }

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
          transition: transform 500ms cubic-bezier(0.19,1,0.22,1), box-shadow 500ms ease, border-color 500ms ease;
        }
        .eco-node-sphere:hover {
          transform: rotate(var(--tilt, 0deg)) scale(1.32) !important;
          border-color: color-mix(in oklab, var(--crimson) 60%, transparent);
          box-shadow: 0 14px 30px -12px rgba(0,0,0,.75), 0 0 30px 4px color-mix(in oklab, var(--crimson) 42%, transparent);
        }
        .eco-node-sphere--active {
          transform: rotate(var(--tilt, 0deg)) scale(1.4) !important;
          border-color: color-mix(in oklab, var(--crimson) 70%, transparent);
          box-shadow: 0 16px 34px -12px rgba(0,0,0,.8), 0 0 34px 6px color-mix(in oklab, var(--crimson) 55%, transparent);
        }

        .eco-tooltip { opacity: 0; transform: translate(-50%, 4px); transition: opacity 260ms ease, transform 260ms ease; }
        .eco-node-group:hover .eco-tooltip { opacity: 1; transform: translate(-50%, 0); }

        .eco-link { background-image: linear-gradient(var(--crimson), var(--crimson)); background-size: 100% 1px; background-repeat: no-repeat; background-position: 0 100%; transition: background-size 300ms ease; }
        .eco-link:hover { background-size: 0% 1px; }

        .eco-mobile-spin { animation: eco-mobile-ring-spin 150s linear infinite; }
        .eco-mobile-spin-reverse { animation: eco-mobile-ring-spin-reverse 150s linear infinite; }

        @media (prefers-reduced-motion: reduce) {
          .eco-rise, .eco-core-bloom, .eco-core-sphere, .eco-mobile-spin, .eco-mobile-spin-reverse { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
