import { createFileRoute } from "@tanstack/react-router";
import { footprint } from "@/lib/companies";

export const Route = createFileRoute("/footprint")({
  head: () => ({
    meta: [
      { title: "Global Footprint — Alsaid Group" },
      {
        name: "description",
        content:
          "Nine markets across four continents — Amman, Dubai, Sharjah, Damascus, Tripoli, Abidjan, Washington D.C., Everett, and Mecca.",
      },
      { property: "og:title", content: "Global Footprint — Alsaid Group" },
      {
        property: "og:description",
        content:
          "Nine international markets across four continents — from Amman to Abidjan, Washington to Mecca.",
      },
    ],
  }),
  component: FootprintPage,
});

function FootprintPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow">03 · Reference</div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] text-ink md:text-8xl">
            Global <em className="text-crimson">footprint.</em>
          </h1>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid grid-cols-2 gap-8 py-12 md:grid-cols-4 md:py-16">
          {[
            { n: "5", l: "MENA cities" },
            { n: "2", l: "United States" },
            { n: "1", l: "West Africa" },
            { n: "1", l: "Saudi Arabia" },
          ].map((s) => (
            <div key={s.l} className="border-l border-rule pl-5">
              <div className="num text-4xl font-light leading-none text-ink md:text-5xl">
                {s.n}
              </div>
              <div className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="container-editorial py-16 md:py-20">
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
                className="grid grid-cols-12 items-baseline gap-4 py-6"
              >
                <div className="col-span-3 font-display text-xl text-ink md:text-2xl">
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