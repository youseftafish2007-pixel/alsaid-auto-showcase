import { createFileRoute, Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title: "The Companies — Alsaid Group" },
      {
        name: "description",
        content:
          "Eight operating companies across mobility, energy, travel, hospitality, and social impact — each with its own mandate, market, and leadership.",
      },
      { property: "og:title", content: "The Companies — Alsaid Group" },
      {
        property: "og:description",
        content:
          "Alsaid Automotive, GAC Motor Partnership, Greenviro Energy, River Auto, Speed Travel, GMA of Everett, Zain Farm, and Alsaid Foundation.",
      },
    ],
  }),
  component: CompaniesIndex,
});

function CompaniesIndex() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow">Section 02</div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] text-ink md:text-7xl">
            The <em className="text-crimson">Companies.</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">
            Eight operating companies across mobility, energy, travel, hospitality,
            and social impact — each with its own mandate, market, and leadership.
          </p>
        </div>
      </section>

      <section>
        <div className="container-editorial py-10 md:py-12">
          <div className="grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-2">
            {companies.map((c) => (
              <Link
                key={c.slug}
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="group relative flex min-h-[240px] flex-col justify-between bg-paper p-8 transition-colors hover:bg-paper-2 md:p-10"
              >
                <span
                  className="absolute inset-y-0 left-0 w-[3px]"
                  style={{ background: c.accent }}
                  aria-hidden
                />
                <div className="flex items-start justify-between">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{ color: c.accent }}
                  >
                    {c.number}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                      {c.sector}
                    </span>
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt={`${c.name} logo`}
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <span
                        className="grid h-8 min-w-[2.25rem] place-items-center px-2 text-[10px] font-semibold tracking-[0.14em] text-paper"
                        style={{ background: c.accent }}
                        aria-hidden
                      >
                        {c.monogram}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="font-display text-3xl leading-[1.05] text-ink md:text-4xl">
                    {c.name}
                  </h2>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
                    {c.tagline}
                  </p>
                  <div className="mt-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink transition-transform group-hover:translate-x-1">
                    <span>Read profile</span>
                    <span style={{ color: c.accent }}>→</span>
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