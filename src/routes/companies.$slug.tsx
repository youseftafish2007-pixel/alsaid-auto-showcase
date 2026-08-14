import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { companies, type Company } from "@/lib/companies";
import { CompanyMotif } from "@/components/company-motif";

export const Route = createFileRoute("/companies/$slug")({
  loader: ({ params }) => {
    const company = companies.find((c) => c.slug === params.slug);
    if (!company) throw notFound();
    return { company };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Company not found | Alsaid Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { company } = loaderData;
    return {
      meta: [
        { title: `${company.name} | Alsaid Group` },
        { name: "description", content: company.tagline },
        { property: "og:title", content: `${company.name} | Alsaid Group` },
        { property: "og:description", content: company.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: NotFound,
  component: CompanyPage,
});

function NotFound() {
  return (
    <div className="container-editorial py-32 text-center">
      <div className="eyebrow">404</div>
      <h1 className="mt-4 font-display text-5xl">Company not found</h1>
      <Link to="/companies" className="link-underline mt-8 inline-block text-sm">
        Back to companies
      </Link>
    </div>
  );
}

function CompanyPage() {
  const { company } = Route.useLoaderData() as { company: Company };
  const idx = companies.findIndex((c) => c.slug === company.slug);
  const next = companies[(idx + 1) % companies.length];
  const prev = companies[(idx - 1 + companies.length) % companies.length];
  const nameWords = company.name.split(" ");
  const nameLead = nameWords.slice(0, -1).join(" ");
  const nameTail = nameWords.slice(-1)[0];

  return (
    <>
      {/* Breadcrumb rail */}
      <div className="border-b border-ink/15 bg-ink text-paper">
        <div className="container-editorial flex items-center gap-3 py-2.5 text-[10px] uppercase tracking-[0.22em] text-paper/60">
          <Link to="/companies" className="transition-colors hover:text-crimson">
            Companies
          </Link>
          <span aria-hidden>/</span>
          <span className="text-paper">{company.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink/15">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${company.accentSoft}, transparent 85%)`,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 pattern-grid mask-fade-b opacity-60"
        />

        <div className="relative container-editorial py-10 md:py-14">
          <div className="flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <span
              className="inline-flex items-center gap-2 border px-3 py-1"
              style={{ borderColor: company.accent, color: company.accent }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: company.accent }}
              />
              {company.sector}
            </span>
            {company.established ? <span>Est. {company.established}</span> : null}
            <span>{company.location}</span>
          </div>

          <div className="mt-6 grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h1 className="max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.025em] text-ink md:text-7xl">
                {nameLead ? <>{nameLead} </> : null}
                <em style={{ color: company.accent, fontStyle: "italic" }}>{nameTail}.</em>
              </h1>
              <span
                aria-hidden
                className="mt-6 block h-[3px] w-24"
                style={{ background: company.accent }}
              />
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/80">
                {company.tagline}
              </p>
            </div>
            <div className="md:col-span-5">
              <div className="image-frame aspect-[4/3]">
                <img
                  src={company.hero}
                  alt={`${company.name}`}
                  width={1400}
                  height={900}
                  loading="eager"
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[3px]"
                  style={{ background: company.accent }}
                />
                {company.logo ? (
                  <span className="absolute left-4 top-4 inline-flex items-center bg-paper/95 px-3 py-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]">
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-8 w-auto object-contain"
                    />
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motion motif */}
      <CompanyMotif motif={company.motif} accent={company.accent} />

      {/* Fact ticker */}
      <section className="border-b border-ink/15 bg-ink text-paper">
        <div className="container-editorial grid grid-cols-2 gap-px bg-paper/10 md:grid-cols-4">
          {company.facts.map((f) => (
            <div key={f.label} className="bg-ink px-5 py-6">
              <div className="num text-2xl leading-none text-paper">{f.value}</div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-paper/55">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid gap-12 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-7">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: company.accent }}
            >
              The profile
            </div>
            <div className="mt-5 space-y-5 text-base leading-relaxed text-ink/80">
              {company.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "drop-cap text-lg" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-24 border border-ink/15 bg-paper-2/60 p-6">
              <div className="eyebrow" style={{ color: company.accent }}>
                In the group
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {company.name} is one of eight operating companies within Alsaid Group,
                working in {company.sector.toLowerCase()}.
              </p>
              <div className="mt-6 border-t border-rule pt-4 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Location · <span className="text-ink">{company.location}</span>
              </div>
              <a
                href="mailto:partnerships@alsaidgroup.com"
                className="mt-6 inline-flex w-full items-center justify-center border px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-90"
                style={{ background: company.accent, borderColor: company.accent }}
              >
                Enquire about {nameTail}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-ink/15">
        <div className="container-editorial grid border-b border-rule md:grid-cols-2 md:divide-x md:divide-rule">
          <Link
            to="/companies/$slug"
            params={{ slug: prev.slug }}
            className="group relative bg-paper px-6 py-8 transition-colors hover:bg-paper-2"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: prev.accent }}
            />
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Previous
            </div>
            <div className="mt-2 font-display text-2xl text-ink transition-colors group-hover:text-crimson md:text-3xl">
              {prev.name}
            </div>
          </Link>
          <Link
            to="/companies/$slug"
            params={{ slug: next.slug }}
            className="group relative bg-paper px-6 py-8 text-right transition-colors hover:bg-paper-2"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 right-0 w-[3px]"
              style={{ background: next.accent }}
            />
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Next
            </div>
            <div className="mt-2 font-display text-2xl text-ink transition-colors group-hover:text-crimson md:text-3xl">
              {next.name}
            </div>
          </Link>
        </div>
        <div className="container-editorial py-5">
          <Link
            to="/companies"
            className="link-underline pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
          >
            All eight companies
          </Link>
        </div>
      </section>
    </>
  );
}
