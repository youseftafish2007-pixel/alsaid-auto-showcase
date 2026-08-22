import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { footprint } from "@/lib/companies";
import { WorldMap, HQ_CITY } from "@/components/world-map";
import { Reveal } from "@/components/reveal";

export const Route = createFileRoute("/footprint")({
  head: () => ({
    meta: [
      { title: "Global Footprint | Alsaid Group" },
      {
        name: "description",
        content:
          "Thirteen markets across four continents: Amman, Dubai, Sharjah, Damascus, Tripoli, Abidjan, Washington D.C., Everett, Mecca, Seoul, Guangzhou, Shanghai, and Johannesburg.",
      },
      { property: "og:title", content: "Global Footprint | Alsaid Group" },
      {
        property: "og:description",
        content:
          "Thirteen international markets across four continents, from Amman to Johannesburg, Seoul to Washington.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FootprintPage,
});

const continents = [
  { name: "Middle East", cities: "Amman · Dubai · Sharjah · Damascus · Mecca" },
  { name: "Asia", cities: "Seoul · Guangzhou · Shanghai" },
  { name: "Africa", cities: "Tripoli · Abidjan · Johannesburg" },
  { name: "North America", cities: "Washington D.C. · Everett" },
];

function FootprintPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hovered ?? selected;

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 pattern-diagonal opacity-[0.18]"
        />
        <div className="relative container-editorial py-10 md:py-14">
          <div className="anim-sweep flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson">
            <span aria-hidden className="anim-rule h-[2px] w-8 bg-crimson" />
            Reference
          </div>
          <h1 className="anim-rise d-1 mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-8xl">
            Global <em className="not-italic text-crimson">footprint.</em>
          </h1>
          <p className="anim-rise d-3 mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            Thirteen markets, four continents, one group.
          </p>
        </div>
      </section>

      {/* Map — full-bleed, the centerpiece of the page */}
      <section className="border-b border-ink/15 bg-paper-2/40">
        <Reveal from="scale">
          <div className="mx-auto max-w-[1600px]">
            <WorldMap
              data={footprint}
              active={active}
              selected={selected}
              onHover={setHovered}
              onSelect={setSelected}
            />
          </div>
        </Reveal>
        <p className="container-editorial py-3 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35 md:hidden">
          Tap a point to focus · tap again to reset
        </p>
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
            {footprint.map((row, i) => {
              const isActive = active === row.city;
              return (
                <Reveal as="li" delay={Math.min(i, 6) * 55} key={row.city + row.region}>
                  <button
                    type="button"
                    onMouseEnter={() => setHovered(row.city)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(row.city)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected((s) => (s === row.city ? null : row.city))}
                    aria-pressed={selected === row.city}
                    className={`grid w-full grid-cols-12 items-baseline gap-4 py-4 text-left transition-all duration-300 ${
                      isActive ? "bg-ink px-4" : "hover:bg-ink hover:px-4"
                    }`}
                  >
                    <div
                      className={`col-span-3 flex items-center gap-2 font-display text-xl transition-all duration-300 md:text-2xl ${
                        isActive ? "translate-x-1 text-paper" : "text-ink"
                      }`}
                    >
                      {row.city === HQ_CITY ? (
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 text-crimson"
                          aria-hidden
                        >
                          <path
                            d="M12 1.3l2.98 6.6 7.27.9-5.44 4.94 1.6 7.16L12 17.24l-6.41 3.66 1.6-7.16-5.44-4.94 7.27-.9L12 1.3z"
                            fill="currentColor"
                          />
                        </svg>
                      ) : null}
                      {row.city}
                      {selected === row.city ? (
                        <span
                          aria-hidden
                          className="inline-block h-1.5 w-1.5 rounded-full bg-crimson align-middle"
                        />
                      ) : null}
                    </div>
                    <div className="col-span-3 text-[11px] uppercase tracking-[0.2em] text-crimson">
                      {row.region}
                    </div>
                    <div
                      className={`col-span-4 text-sm leading-relaxed transition-colors duration-300 md:col-span-5 ${
                        isActive ? "text-paper/70" : "text-ink/70"
                      }`}
                    >
                      {row.role}
                    </div>
                    <div
                      className={`col-span-2 text-right text-xs uppercase tracking-[0.18em] transition-colors duration-300 md:col-span-1 ${
                        isActive ? "text-paper/60" : "text-muted-foreground"
                      }`}
                    >
                      {row.since}
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
