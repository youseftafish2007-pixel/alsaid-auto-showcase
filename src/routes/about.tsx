import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { ScrollTimeline, type TimelineItem } from "@/components/scroll-timeline";
import { companies } from "@/lib/companies";

import heroGroup from "@/assets/hero-group.jpg";
import heroAlsaidAuto from "@/assets/hero-alsaid-automotive.jpg";
import heroGreenviro from "@/assets/hero-greenviro.jpg";
import heroZain from "@/assets/hero-zain-farm.jpg";
import heroGac from "@/assets/hero-gac-motor.jpg";
import heroSpeed from "@/assets/hero-speed-travel.jpg";
import heroFoundation from "@/assets/hero-alsaid-foundation.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Established In 1999 | Alsaid Group" },
      {
        name: "description",
        content:
          "A group built around long-term partnerships, disciplined growth and a belief in building businesses that endure. The history of Alsaid Group, from 1999 to today.",
      },
      { property: "og:title", content: "Established In 1999 | Alsaid Group" },
      {
        property: "og:description",
        content:
          "A group built around long-term partnerships, disciplined growth and a belief in building businesses that endure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

/** Real milestones drawn from the Group's own operating history. */
const timeline: TimelineItem[] = [
  {
    year: "1999",
    label: "The Beginning",
    title: "Alsaid Group is established in Amman",
    description:
      "Founded on a belief in accessibility and regional mobility, Alsaid Automotive becomes the founding pillar of the Group, marking the start of twenty-six years of continuous operating history.",
    image: heroAlsaidAuto,
    imageAlt: "Alsaid Automotive, the Group's founding company",
    accent: "#A6192E",
  },
  {
    year: "2009",
    label: "Expansion",
    title: "A gateway to Dubai",
    description:
      "The Group opens in Dubai, UAE, establishing a gateway for international sourcing and trade that extends its automotive reach beyond Jordan for the first time.",
    plaque: { heading: "DUBAI, UAE", sub: "Sourcing & Trade Gateway" },
    accent: "#A6192E",
  },
  {
    year: "2013",
    label: "New Sector",
    title: "Greenviro Energy is founded",
    description:
      "An early recognition of the region's changing energy landscape. Greenviro Energy is established to build solar and renewable infrastructure, the Group's first move beyond automotive.",
    image: heroGreenviro,
    imageAlt: "Greenviro Energy solar infrastructure",
    accent: "#2F7D4F",
  },
  {
    year: "2018",
    label: "New Sector",
    title: "Zain Farm opens its doors",
    description:
      "A premier events venue for weddings and formal gatherings opens in Jordan, complete with in-house culinary operations, marking the Group's entry into hospitality and event production.",
    image: heroZain,
    imageAlt: "Zain Farm events venue",
    accent: "#8A6A2E",
  },
  {
    year: "2019",
    label: "Social Impact",
    title: "Alsaid Foundation is established",
    description:
      "A 501(c)(3) non-profit is founded in Washington, D.C., driven by the belief that meaningful progress begins through opportunity and access: education, sustainability, and youth empowerment.",
    plaque: { heading: "WASHINGTON, D.C.", sub: "501(c)(3) · Foundation HQ" },
    accent: "#334155",
  },
  {
    year: "2025",
    label: "New Territory",
    title: "An exclusive partnership with GAC Motor",
    description:
      "The Group signs an exclusive partnership with GAC Motor across Amman, Libya, and Syria, continuing a long engagement with leading Asian manufacturers into a new generation of vehicles.",
    image: heroGac,
    imageAlt: "GAC Motor partnership vehicles",
    accent: "#111827",
  },
  {
    year: "Today",
    label: "The Group Now",
    title: "Eight companies. Four sectors. Four continents.",
    description:
      "What began as a single automotive business in Amman now operates across mobility, energy, travel & hospitality, and social impact. Privately held, and governed for the long term.",
    image: heroGroup,
    imageAlt: "Alsaid Group today",
    accent: "#A6192E",
  },
];

/** Mirrors the Group's real sector structure — same four disciplines
 * shown on the homepage, given their own full-bleed moment here. */
type Sector = {
  index: string;
  name: string;
  sub: string;
  note: string;
  accent: string;
  image?: string;
};

const sectors: Sector[] = [
  {
    index: "01",
    name: "Automotive",
    sub: "Mobility · Four companies",
    note: "Alsaid Automotive · GAC Motor · GMA of Everett · River Auto",
    accent: "#A6192E",
    image: heroAlsaidAuto,
  },
  {
    index: "02",
    name: "Energy",
    sub: "Renewables · One company",
    note: "Greenviro Energy · Solar & sustainable infrastructure",
    accent: "#2F7D4F",
    image: heroGreenviro,
  },
  {
    index: "03",
    name: "Travel & Hospitality",
    sub: "Two companies",
    note: "Speed Travel & Tourism · Zain Farm",
    accent: "#0B7C86",
    image: heroSpeed,
  },
  {
    index: "04",
    name: "Social Impact",
    sub: "501(c)(3) · Washington, D.C.",
    note: "Alsaid Foundation · Education, sustainability, youth",
    accent: "#334155",
    image: heroFoundation,
  },
];

function SectorBlock({ sector }: { sector: Sector }) {
  return (
    <Reveal from="scale" className="group relative overflow-hidden border-b border-paper/10">
      <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden md:h-[82vh]">
        {sector.image ? (
          <img
            src={sector.image}
            alt={sector.name}
            loading="lazy"
            className="anim-drift absolute inset-0 h-full w-full object-cover opacity-45 transition-opacity duration-700 group-hover:opacity-60"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-ink">
            {/* Original graphic treatment — an enlarged reading of the Foundation's
                own ripple motif, standing in for a photo we won't reuse site-wide. */}
            <svg viewBox="0 0 800 700" className="absolute inset-0 h-full w-full opacity-[0.5]">
              {[90, 165, 240, 320, 405].map((r, i) => (
                <circle
                  key={r}
                  cx="560"
                  cy="330"
                  r={r}
                  fill="none"
                  stroke={sector.accent}
                  strokeWidth={1}
                  className="motif-pulse"
                  style={{ animationDelay: `${i * 0.5}s`, opacity: 0.55 - i * 0.08 }}
                />
              ))}
              <circle cx="560" cy="330" r="7" fill={sector.accent} />
            </svg>
            <div aria-hidden className="pattern-dots absolute inset-0 opacity-[0.15]" />
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,12,12,0.55) 0%, rgba(14,12,12,0.78) 55%, rgba(14,12,12,0.95) 100%)",
          }}
        />
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-700 group-hover:scale-x-100"
          style={{ background: sector.accent }}
        />

        <div className="container-editorial relative flex h-full flex-col justify-end pb-12 pt-24 md:pb-16">
          <div className="flex items-baseline gap-4">
            <span
              className="num text-lg tracking-[0.1em] md:text-xl"
              style={{ color: sector.accent }}
            >
              {sector.index}
            </span>
            <span aria-hidden className="h-px w-10" style={{ background: sector.accent }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-paper/60">
              {sector.sub}
            </span>
          </div>
          <h3 className="mt-4 break-words font-display text-4xl uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl md:text-8xl lg:text-[7.5rem]">
            {sector.name}
          </h3>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-paper/60 md:text-base">
            {sector.note}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function AboutPage() {
  return (
    <>
      {/* HERO — blueprint identity: dark ground, drafting grid, huge type */}
      <section className="relative overflow-hidden border-b border-paper/10 bg-ink text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 pattern-grid opacity-[0.07]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.5]"
        >
          <span className="anim-scan absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-paper/[0.04] to-transparent" />
        </div>

        {/* Watermark year — reads like a drawing's revision number. Hidden on
            phones: at this size it visually dominated the whole hero instead
            of sitting quietly in the corner. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 hidden select-none font-display text-[22rem] font-light leading-none text-paper/[0.035] sm:block md:text-[30rem]"
        >
          99
        </div>

        <div className="container-editorial relative pt-10 md:pt-14">
          <div className="flex items-center justify-between">
            <div className="anim-sweep flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-crimson">
              <span aria-hidden className="anim-rule h-[2px] w-8 bg-crimson" />
              The Group · Est. 1999
            </div>
            <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-paper/35 sm:block">
              Rev. Today
            </div>
          </div>
        </div>

        <div className="relative container-editorial py-14 md:py-24">
          <h1 className="anim-rise d-1 max-w-5xl break-words font-display text-[2.5rem] uppercase leading-[0.95] tracking-tight sm:text-8xl md:text-[7rem] lg:text-[8.5rem]">
            Established <span className="text-crimson">in</span>
            <br />
            1999.
          </h1>
          <p className="anim-rise d-3 mt-8 max-w-xl text-base leading-relaxed text-paper/70 md:text-lg">
            A group built around long-term partnerships, disciplined growth and a belief in building
            businesses that endure.
          </p>
        </div>

        {/* Blueprint annotation strip — spec-sheet reading of the Group */}
        <div className="anim-rise d-5 relative border-t border-paper/10">
          <div className="container-editorial grid grid-cols-2 divide-x divide-paper/10 sm:grid-cols-3 md:grid-cols-5">
            {[
              { l: "Founded", v: "1999" },
              { l: "Ownership", v: "Private" },
              { l: "Companies", v: "Eight" },
              { l: "Sectors", v: "Four" },
              { l: "Continents", v: "Four" },
            ].map((s) => (
              <div key={s.l} className="border-b border-paper/10 px-4 py-5 sm:border-b-0 md:px-6">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-paper/40">
                  {s.l}
                </div>
                <div className="num mt-1.5 text-base text-paper md:text-lg">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE — the history, drawn as a blueprint spine */}
      <section className="relative border-b border-ink/15 bg-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 pattern-dots opacity-[0.35]"
        />
        <div className="relative container-editorial py-16 md:py-24">
          <Reveal className="max-w-2xl">
            <div className="eyebrow text-crimson">History</div>
            <h2 className="anim-rule-v mt-4 font-display text-4xl leading-[0.95] tracking-tight text-ink md:text-6xl">
              1999
              <br />
              <span className="text-crimson">The beginning.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65 md:text-base">
              Twenty-six years of continuous operating history, told through the moments that shaped
              the Group, from a single automotive business to a diversified, four-sector platform.
            </p>
          </Reveal>

          <div className="mt-6 md:mt-10">
            <ScrollTimeline items={timeline} />
          </div>
        </div>
      </section>

      {/* SECTOR REVEAL — one group, multiple directions */}
      <section className="relative border-b border-paper/10 bg-ink">
        <div className="container-editorial py-16 md:py-20">
          <Reveal className="text-center">
            <div className="eyebrow text-crimson">One group, four disciplines</div>
            <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-tight text-paper sm:text-6xl md:text-7xl">
              One group.
              <br />
              <span className="text-crimson">Multiple directions.</span>
            </h2>
          </Reveal>
        </div>

        <div>
          {sectors.map((s) => (
            <SectorBlock key={s.name} sector={s} />
          ))}
        </div>
      </section>

      {/* ENDING — today, and a quiet echo of the companies universe */}
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink py-20 text-paper md:py-32">
        {/* Subtle orbit motif — same visual grammar as the Companies universe,
            dialled down to a whisper so it reads as continuity, not repetition. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[140vw] w-[140vw] max-h-[900px] max-w-[900px] -translate-x-1/2 -translate-y-1/2 opacity-[0.16] sm:opacity-[0.22]"
        >
          <svg viewBox="0 0 800 800" className="h-full w-full">
            <ellipse
              cx="400"
              cy="400"
              rx="360"
              ry="150"
              fill="none"
              stroke="var(--paper)"
              strokeWidth="1"
              className="anim-orbit"
              transform="rotate(-14 400 400)"
            />
            <ellipse
              cx="400"
              cy="400"
              rx="270"
              ry="112"
              fill="none"
              stroke="var(--paper)"
              strokeWidth="1"
              className="anim-orbit-rev"
              transform="rotate(9 400 400)"
            />
            <ellipse
              cx="400"
              cy="400"
              rx="180"
              ry="74"
              fill="none"
              stroke="var(--crimson)"
              strokeWidth="1"
              className="anim-orbit"
              transform="rotate(-6 400 400)"
            />
            {companies.map((c, i) => {
              const angle = (i / companies.length) * Math.PI * 2;
              const rx = 270;
              const ry = 112;
              const x = 400 + Math.cos(angle) * rx;
              const y = 400 + Math.sin(angle) * ry;
              return <circle key={c.slug} cx={x} cy={y} r="4.5" fill={c.accent} />;
            })}
          </svg>
        </div>

        <div className="relative container-editorial text-center">
          <Reveal from="scale">
            <div className="eyebrow text-crimson">Today</div>
            <h2 className="mt-5 font-display text-5xl uppercase leading-[0.9] tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              One group.
              <br />
              <span className="text-crimson">Many horizons.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/companies"
                className="inline-flex items-center gap-2 border border-paper bg-paper px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-crimson hover:text-paper"
              >
                Explore the companies universe →
              </Link>
              <Link
                to="/footprint"
                className="inline-flex items-center border border-paper/40 px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:bg-paper/10"
              >
                See the global footprint
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
