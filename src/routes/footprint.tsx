import { createFileRoute } from "@tanstack/react-router";
import { footprint } from "@/lib/companies";
import { WorldMap } from "@/components/world-map";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/footprint")({
  head: () => ({
    meta: [
      { title: "Global Footprint | Alsaid Group" },
      {
        name: "description",
        content:
          "Nine markets across four continents: Amman, Dubai, Sharjah, Damascus, Tripoli, Abidjan, Washington D.C., Everett, and Mecca.",
      },
      { property: "og:title", content: "Global Footprint | Alsaid Group" },
      {
        property: "og:description",
        content:
          "Nine international markets across four continents, from Amman to Abidjan, Washington to Mecca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FootprintPage,
});

const continents = [
  { name: "Asia & Middle East", cities: "Amman · Dubai · Sharjah · Damascus · Mecca" },
  { name: "Africa", cities: "Tripoli · Abidjan" },
  { name: "North America", cities: "Washington D.C. · Everett" },
  { name: "Europe", cities: "Sourcing & trade corridors" },
];

function FootprintPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink text-paper">
        <div aria-hidden className="pointer-events-none absolute inset-0 pattern-diagonal opacity-[0.18]" />
        <div className="relative container-editorial py-10 md:py-14">
          <div className="anim-sweep flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson">
            <span aria-hidden className="anim-rule h-[2px] w-8 bg-crimson" />
            Reference
          </div>
          <h1 className="anim-rise d-1 mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-8xl">
            Global <em className="not-italic text-crimson">footprint.</em>
          </h1>
          <p className="anim-rise d-3 mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            Nine markets, four continents, one group.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial py-6 md:py-8">
          <Reveal from="scale">
            <WorldMap />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid gap-px bg-rule md:grid-cols-4">
          {continents.map((c, i) => (
            <Reveal
              key={c.name}
              delay={i * 90}
              className="group relative overflow-hidden bg-paper px-6 py-7 transition-colors duration-500 hover:bg-ink"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-crimson transition-transform duration-500 group-hover:scale-x-100"
              />
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-crimson">
                {c.name}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-ink/70 transition-colors duration-500 group-hover:text-paper/70">
                {c.cities}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <div className="container-editorial py-8 md:py-12">
          <div className="grid grid-cols-12 gap-4 border-b border-ink pb-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <div className="col-span-3">City</div>
            <div className="col-span-3">Region</div>
            <div className="col-span-4 md:col-span-5">Role</div>
            <div className="col-span-2 md:col-span-1 text-right">Since</div>
          </div>
          <ul className="divide-y divide-rule">
            {footprint.map((row, i) => (
              <Reveal
                as="li"
                delay={Math.min(i, 6) * 55}
                key={row.city + row.region}
                className="group grid grid-cols-12 items-baseline gap-4 py-4 transition-all duration-300 hover:bg-ink hover:px-4"
              >
                <div className="col-span-3 font-display text-xl text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:text-paper md:text-2xl">
                  {row.city}
                </div>
                <div className="col-span-3 text-[11px] uppercase tracking-[0.2em] text-crimson">
                  {row.region}
                </div>
                <div className="col-span-4 text-sm leading-relaxed text-ink/70 transition-colors duration-300 group-hover:text-paper/70 md:col-span-5">
                  {row.role}
                </div>
                <div className="col-span-2 text-right text-xs uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 group-hover:text-paper/60 md:col-span-1">
                  {row.since}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
