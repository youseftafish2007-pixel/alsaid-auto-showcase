import { createFileRoute, Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";
import { Reveal } from "@/components/reveal";
import { HeroCarousel, type Slide } from "@/components/hero-carousel";
import heroGroup from "@/assets/hero-group.jpg";
import aboutLeadership from "@/assets/about-leadership.jpg";

const partnerLogos = companies.filter((c) => c.logo);

const bySlug = (slug: string) => companies.find((c) => c.slug === slug)!;

const slides: Slide[] = [
  {
    image: heroGroup,
    eyebrow: "Alsaid Group · Established 1999 · Amman",
    title: "Where legacy",
    emphasis: "leads.",
    copy: "A privately held international group of eight companies across automotive, energy, logistics, travel, hospitality, and social impact, built and led across two generations.",
    to: "/companies",
    cta: "Explore the companies",
  },
  {
    image: bySlug("alsaid-automotive").hero,
    eyebrow: "Automotive · Mobility",
    title: "The founding",
    emphasis: "pillar.",
    copy: bySlug("alsaid-automotive").tagline,
    to: "/companies/$slug",
    params: { slug: "alsaid-automotive" },
    cta: "Alsaid Automotive",
  },
  {
    image: bySlug("greenviro").hero ?? heroGroup,
    eyebrow: "Energy",
    title: "Power for the",
    emphasis: "long term.",
    copy: bySlug("greenviro").tagline,
    to: "/companies/$slug",
    params: { slug: "greenviro" },
    cta: "Greenviro Energy",
  },
  {
    image: bySlug("speed-travel").hero,
    eyebrow: "Travel & Hospitality",
    title: "Moving people",
    emphasis: "across borders.",
    copy: bySlug("speed-travel").tagline,
    to: "/companies/$slug",
    params: { slug: "speed-travel" },
    cta: "Speed Travel",
  },
  {
    image: bySlug("alsaid-foundation").hero,
    eyebrow: "Social Impact",
    title: "Giving back, by",
    emphasis: "design.",
    copy: bySlug("alsaid-foundation").tagline,
    to: "/companies/$slug",
    params: { slug: "alsaid-foundation" },
    cta: "Alsaid Foundation",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alsaid Group | Where Legacy Leads" },
      {
        name: "description",
        content:
          "A privately held international group of eight companies across automotive, energy, logistics, travel, hospitality, and social impact. Founded in Amman, 1999.",
      },
      { property: "og:title", content: "Alsaid Group | Where Legacy Leads" },
      {
        property: "og:description",
        content:
          "Eight operating companies across nine markets and four continents, built and led across two generations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroCarousel slides={slides} />

      <section className="border-b border-ink/15 bg-ink text-paper">
        <div className="container-editorial grid grid-cols-2 gap-px bg-paper/10 md:grid-cols-4">
          {[
            { n: "1999", l: "Founded in Amman" },
            { n: "8", l: "Operating companies" },
            { n: "9", l: "International markets" },
            { n: "4", l: "Continents of operation" },
          ].map((s, i) => (
            <Reveal
              key={s.l}
              delay={i * 90}
              from="up"
              className="group relative bg-ink px-6 py-8 transition-colors duration-500 hover:bg-crimson"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-crimson transition-transform duration-500 group-hover:scale-x-100 group-hover:bg-paper"
              />
              <div className="num text-4xl font-light leading-none text-paper md:text-5xl">
                {s.n}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-paper/55">
                {s.l}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-b border-ink/15 bg-paper-2/60">
        <div className="container-editorial py-8 md:py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink">
              Group companies & partnerships
            </div>
            <Link
              to="/companies"
              className="link-underline pb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-crimson"
            >
              All eight →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
            {partnerLogos.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60} from="scale">
                <Link
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="group flex h-14 items-center justify-center transition-transform duration-300 hover:scale-110"
                aria-label={c.name}
                >
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="max-h-12 w-auto object-contain opacity-55 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid gap-10 py-12 md:grid-cols-12 md:items-center md:py-16">
          <Reveal from="left" className="md:col-span-5">
            <div className="image-frame aspect-[4/3]">
              <img
                src={aboutLeadership}
                alt="Two generations of Alsaid Group leadership"
                loading="lazy"
                width={1200}
                height={900}
              />
              <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-crimson" />
            </div>
          </Reveal>
          <Reveal from="right" delay={120} className="md:col-span-6 md:col-start-7">
            <div className="eyebrow text-crimson">The Group · A statement</div>
            <p className="mt-5 font-display text-3xl leading-[1.12] tracking-tight text-ink md:text-5xl">
              We measure our work in <em className="text-crimson">decades</em>, not
              quarters.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70">
              What began as a single automotive business in Amman has grown, over
              twenty-six years, into a diversified platform of eight companies across
              four continents. Held privately, governed for the long term, and built
              to endure beyond any single market or cycle.
            </p>
            <Link
              to="/about"
              className="link-underline mt-6 inline-block pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
            >
              Read the group history
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-ink/15 bg-ink text-paper">
        <div className="container-editorial py-12 md:py-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-crimson">One group, four sectors</div>
              <h2 className="mt-4 font-display text-4xl leading-tight text-paper md:text-6xl">
                Built across <em className="text-crimson">four disciplines.</em>
              </h2>
            </div>
            <Link to="/companies" className="link-underline pb-1 text-sm font-medium text-paper">
              View all companies →
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-px overflow-hidden border border-paper/15 bg-paper/15 md:grid-cols-4">
            {[
              { name: "Mobility", count: "Four companies", note: "Alsaid Auto · GAC · GMA · River Auto", color: "#A6192E" },
              { name: "Energy", count: "One company", note: "Greenviro Energy · Solar", color: "#2F7D4F" },
              { name: "Travel & Hospitality", count: "Two companies", note: "Speed Travel · Zain Farm", color: "#0B7C86" },
              { name: "Social Impact", count: "One organisation", note: "Alsaid Foundation · 501(c)(3)", color: "#334155" },
            ].map((s, i) => (
              <Reveal
                key={s.name}
                delay={i * 90}
                from="up"
                className="group relative overflow-hidden bg-ink p-8 transition-colors duration-500 hover:bg-paper/[0.06]"
              >
                <span
                  className="absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-500 group-hover:scale-y-[2]"
                  style={{ background: s.color }}
                />
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: s.color }}>
                  {s.count}
                </div>
                <div className="mt-6 font-display text-2xl leading-tight text-paper transition-transform duration-500 group-hover:-translate-y-0.5">
                  {s.name}
                </div>
                <div className="mt-6 text-xs leading-relaxed text-paper/55">{s.note}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial py-12 md:py-16">
          <Reveal>
            <div className="eyebrow text-crimson">The Companies</div>
            <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            Eight operating companies, each with its own{" "}
            <em className="text-crimson">mandate.</em>
            </h2>
          </Reveal>

          <ul className="mt-8 divide-y divide-rule border-y border-ink/15">
            {companies.map((c, i) => (
              <Reveal as="li" key={c.slug} delay={Math.min(i, 6) * 60} from="up">
                <Link
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="group relative grid grid-cols-12 items-center gap-4 py-5 transition-all duration-300 hover:bg-ink hover:px-4"
                >
                  <span className="col-span-1 flex items-center">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-[1.8]"
                      style={{ background: c.accent }}
                      aria-hidden
                    />
                  </span>
                  <span className="col-span-11 font-display text-2xl leading-tight text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper md:col-span-5 md:text-3xl">
                    {c.name}
                  </span>
                  <span className="col-span-8 text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:text-paper/60 md:col-span-4">
                    {c.sector}
                  </span>
                  <span className="col-span-4 text-right text-xs uppercase tracking-[0.18em] text-crimson transition-transform duration-300 group-hover:translate-x-1 md:col-span-2">
                    Read →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
