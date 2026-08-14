import { createFileRoute } from "@tanstack/react-router";
import { footprint } from "@/lib/companies";
import { WorldMap } from "@/components/world-map";

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
        <div className="relative container-editorial py-12 md:py-16">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson">
            Reference
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-8xl">
            Global <em className="not-italic text-crimson">footprint.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            Nine markets, four continents, one group.
          </p>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial py-8 md:py-10">
          <WorldMap />
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid gap-px bg-rule md:grid-cols-4">
          {continents.map((c) => (
            <div key={c.name} className="bg-paper px-6 py-7">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-crimson">
                {c.name}
              </div>
              <div className="mt-3 text-sm leading-relaxed text-ink/70">{c.cities}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="container-editorial py-10 md:py-14">
          <div className="grid grid-cols-12 gap-4 border-b border-ink pb-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <div className="col-span-3">City</div>
            <div className="col-span-3">Region</div>
            <div className="col-span-4 md:col-span-5">Role</div>
            <div className="col-span-2 md:col-span-1 text-right">Since</div>
          </div>
          <ul className="divide-y divide-rule">
            {footprint.map((row) => (
              <li
                key={row.city + row.region}
                className="group grid grid-cols-12 items-baseline gap-4 py-5 transition-colors hover:bg-paper-2"
              >
                <div className="col-span-3 font-display text-xl text-ink transition-colors group-hover:text-crimson md:text-2xl">
                  {row.city}
                </div>
                <div className="col-span-3 text-[11px] uppercase tracking-[0.2em] text-crimson">
                  {row.region}
                </div>
                <div className="col-span-4 md:col-span-5 text-sm leading-relaxed text-ink/70">
                  {row.role}
                </div>
                <div className="col-span-2 md:col-span-1 text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {row.since}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
