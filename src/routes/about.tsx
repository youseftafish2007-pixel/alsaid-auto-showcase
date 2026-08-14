import { createFileRoute, Link } from "@tanstack/react-router";
import aboutLeadership from "@/assets/about-leadership.jpg";
import heroGroup from "@/assets/hero-group.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Group | Alsaid Group" },
      {
        name: "description",
        content:
          "A long-held enterprise, built to endure. Alsaid Group is a privately held international conglomerate operating across automotive, energy, travel, hospitality, and social impact since 1999.",
      },
      { property: "og:title", content: "About the Group | Alsaid Group" },
      {
        property: "og:description",
        content:
          "Privately held, generationally led, operating across four continents since 1999.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const glance = [
  { label: "Founded", value: "1999" },
  { label: "Headquarters", value: "Amman" },
  { label: "Ownership", value: "Private" },
  { label: "Companies", value: "Eight" },
  { label: "Sectors", value: "Four" },
  { label: "Continents", value: "Four" },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink text-paper">
        <div aria-hidden className="pointer-events-none absolute inset-0 pattern-diagonal opacity-[0.18]" />
        <div className="relative container-editorial grid gap-8 py-12 md:grid-cols-12 md:items-end md:py-16">
          <div className="md:col-span-7">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson">
              The Group
            </div>
            <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-7xl">
              A long-held enterprise,{" "}
              <em className="not-italic text-crimson">built to endure.</em>
            </h1>
          </div>
          <div className="md:col-span-5">
            <div className="image-frame aspect-[16/10] border-paper/20">
              <img src={heroGroup} alt="Alsaid Group" loading="lazy" width={1200} height={750} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid gap-10 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7 space-y-5 text-base leading-relaxed text-ink/80">
            <p className="drop-cap text-lg">
              Alsaid Group is a privately held international conglomerate with
              diversified operations and strategic interests spanning automotive,
              renewable energy, transportation, travel and tourism, exclusive
              dealerships, hospitality, and brand stewardship. Originally rooted in
              the automotive sector, the Group has continuously evolved alongside
              changing markets while maintaining a long-term approach to growth and
              enterprise development.
            </p>
            <p>
              Over the past two decades, Alsaid has expanded its regional and
              international footprint through long-standing partnerships, sector
              diversification, and cross-market operations extending across the
              Middle East, parts of Africa, North America, and Asia. Each company
              within the Group operates under its own mandate and leadership, while
              sharing a common horizon.
            </p>
            <div className="image-frame my-6 aspect-[16/7]">
              <img
                src={aboutLeadership}
                alt="Two generations of Alsaid Group leadership"
                loading="lazy"
                width={1400}
                height={620}
              />
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-crimson" />
            </div>
            <p>
              Today, the Group represents a multi-sector platform built on commercial
              adaptability, regional reach, and generational leadership, with a
              continued focus on developing ventures that create enduring value
              across industries and markets.
            </p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-24 border border-ink/15 bg-paper-2/60 p-6">
              <div className="eyebrow text-crimson">At a glance</div>
              <dl className="mt-5 divide-y divide-rule border-y border-rule">
                {glance.map((g) => (
                  <div key={g.label} className="flex items-baseline justify-between py-3">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {g.label}
                    </dt>
                    <dd className="font-display text-base text-ink">{g.value}</dd>
                  </div>
                ))}
              </dl>
              <Link
                to="/footprint"
                className="mt-6 inline-flex w-full items-center justify-center border border-ink bg-ink px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-colors hover:border-crimson hover:bg-crimson"
              >
                See the global footprint
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-ink/15 bg-ink text-paper">
        <div className="container-editorial py-14 md:py-20">
          <p className="max-w-4xl font-display text-4xl italic leading-[1.1] tracking-tight text-paper md:text-6xl">
            "We prefer to build sectors <span className="text-crimson">deeply</span>{" "}
            rather than chase trends."
          </p>
          <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-paper/60">
            The Group
          </div>
        </div>
      </section>
    </>
  );
}
