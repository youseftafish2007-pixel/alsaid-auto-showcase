import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Alsaid Group" },
      {
        name: "description",
        content:
          "A long-held enterprise, built to endure. Alsaid Group is a privately held international conglomerate operating across automotive, energy, travel, hospitality, and social impact since 1999.",
      },
      { property: "og:title", content: "About — Alsaid Group" },
      {
        property: "og:description",
        content:
          "A long-held enterprise, built to endure. Privately held, generationally led, operating across four continents since 1999.",
      },
    ],
  }),
  component: AboutPage,
});

const glance = [
  { label: "Founded", value: "1999" },
  { label: "Headquarters", value: "Amman" },
  { label: "Ownership", value: "Private" },
  { label: "Companies", value: "Eight" },
  { label: "Sectors", value: "Five" },
  { label: "Continents", value: "Four" },
];

function AboutPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow">01 · The Group</div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] text-ink md:text-8xl">
            A long-held enterprise, <em className="text-crimson">built to endure.</em>
          </h1>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid gap-12 py-14 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7 md:col-start-1 space-y-6 text-base leading-relaxed text-ink/80">
            <p>
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
            <p>
              Today, the Group represents a multi-sector platform built on commercial
              adaptability, regional reach, and generational leadership — with a
              continued focus on developing ventures that create enduring value
              across industries and markets.
            </p>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="eyebrow">At a glance</div>
            <dl className="mt-6 divide-y divide-rule border-y border-rule">
              {glance.map((g) => (
                <div key={g.label} className="flex items-baseline justify-between py-3">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {g.label}
                  </dt>
                  <dd className="font-display text-base text-ink">{g.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      <section className="border-b border-rule bg-ink text-paper">
        <div className="container-editorial py-16 md:py-24">
          <p className="max-w-4xl font-display text-4xl italic leading-[1.1] tracking-tight text-paper md:text-6xl">
            "We prefer to build sectors <span className="text-crimson">deeply</span>{" "}
            rather than chase trends."
          </p>
          <div className="mt-8 text-[11px] uppercase tracking-[0.22em] text-paper/60">
            — The Group
          </div>
        </div>
      </section>
    </>
  );
}