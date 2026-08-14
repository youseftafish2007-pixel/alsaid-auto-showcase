import { createFileRoute, Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title: "The Companies | Alsaid Group" },
      {
        name: "description",
        content:
          "Eight operating companies across mobility, energy, travel, hospitality, and social impact, each with its own mandate, market, and leadership.",
      },
      { property: "og:title", content: "The Companies | Alsaid Group" },
      {
        property: "og:description",
        content:
          "Alsaid Automotive, GAC Motor Partnership, GMA of Everett, River Auto, Greenviro Energy, Speed Travel, Zain Farm, and Alsaid Foundation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompaniesIndex,
});

function CompaniesIndex() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/15 bg-ink text-paper">
        <div aria-hidden className="pointer-events-none absolute inset-0 pattern-diagonal opacity-[0.18]" />
        <div className="relative container-editorial py-12 md:py-16">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-crimson">
            The portfolio
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-7xl">
            The <em className="not-italic text-crimson">Companies.</em>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">
            Eight operating companies across mobility, energy, travel, hospitality,
            and social impact, each with its own mandate, market, and leadership.
          </p>
        </div>
      </section>

      <section>
        <div className="container-editorial py-8 md:py-10">
          <div className="grid gap-px overflow-hidden border border-ink/15 bg-rule md:grid-cols-2">
            {companies.map((c) => (
              <Link
                key={c.slug}
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="group relative flex flex-col bg-paper transition-colors hover:bg-paper-2"
              >
                <span
                  className="absolute inset-y-0 left-0 z-10 w-[3px]"
                  style={{ background: c.accent }}
                  aria-hidden
                />
                <div className="image-frame aspect-[16/9] border-0 border-b border-ink/10">
                  <img src={c.hero} alt={c.name} loading="lazy" width={1200} height={675} />
                  <span
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(17,17,17,0) 45%, rgba(17,17,17,0.55) 100%)",
                    }}
                  />
                  {c.logo ? (
                    <span className="absolute bottom-4 left-5 inline-flex items-center bg-paper/95 px-2.5 py-1.5">
                      <img
                        src={c.logo}
                        alt={`${c.name} logo`}
                        className="h-7 w-auto object-contain"
                      />
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col justify-between p-7 md:p-8">
                  <div
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: c.accent }}
                  >
                    {c.sector}
                  </div>
                  <div className="mt-4">
                    <h2 className="font-display text-3xl leading-[1.05] text-ink md:text-4xl">
                      {c.name}
                    </h2>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/70">
                      {c.tagline}
                    </p>
                    <div className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-transform group-hover:translate-x-1">
                      <span>Read profile</span>
                      <span style={{ color: c.accent }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
