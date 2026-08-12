import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { companies, type Company } from "@/lib/companies";

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
          { title: "Company not found — Alsaid Group" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { company } = loaderData;
    return {
      meta: [
        { title: `${company.name} — Alsaid Group` },
        { name: "description", content: company.tagline },
        { property: "og:title", content: `${company.name} — Alsaid Group` },
        { property: "og:description", content: company.tagline },
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
        Back to companies →
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
  const seq = company.number.split(" ")[1] ?? "";

  return (
    <>
      {/* Breadcrumb rail */}
      <div className="border-b border-rule bg-paper-2/40">
        <div className="container-editorial flex items-center gap-3 py-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/companies" className="hover:text-ink">
            Companies
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{company.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
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
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${company.accent}22, transparent 65%)`,
          }}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute -right-2 bottom-[-2.5rem] select-none font-display text-[13rem] leading-none opacity-[0.06] md:text-[20rem]"
          style={{ color: company.accent }}
        >
          {seq}
        </span>

        <div className="relative container-editorial py-14 md:py-20">
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
            {company.established ? (
              <span>Est. {company.established}</span>
            ) : null}
            <span className="num" style={{ color: company.accent }}>
              {company.number}
            </span>
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <h1 className="max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.025em] text-ink md:text-7xl">
                {nameLead ? <>{nameLead} </> : null}
                <em style={{ color: company.accent, fontStyle: "italic" }}>
                  {nameTail}.
                </em>
              </h1>
              <span
                aria-hidden
                className="mt-8 block h-[3px] w-24"
                style={{ background: company.accent }}
              />
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80">
                {company.tagline}
              </p>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <div className="relative border border-rule bg-paper p-6 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.45)]">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-[3px]"
                  style={{ background: company.accent }}
                />
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-20 w-auto object-contain md:h-24"
                  />
                ) : (
                  <div
                    className="grid h-20 w-20 place-items-center font-display text-2xl tracking-[0.08em] text-paper md:h-24 md:w-24"
                    style={{ background: company.accent }}
                    aria-hidden
                  >
                    {company.monogram}
                  </div>
                )}
                <div className="mt-5 border-t border-rule pt-4 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {company.location}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fact ticker */}
      <section className="border-b border-rule bg-paper-2/50">
        <div className="container-editorial grid grid-cols-2 gap-px bg-rule md:grid-cols-5">
          {company.facts.map((f) => (
            <div key={f.label} className="bg-paper px-5 py-6">
              <div className="num text-2xl leading-none text-ink">{f.value}</div>
              <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid gap-14 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-7">
            <div
              className="text-[10px] font-semibold uppercase tracking-[0.24em]"
              style={{ color: company.accent }}
            >
              The profile
            </div>
            <div className="mt-6 space-y-6 text-base leading-relaxed text-ink/80">
              {company.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "drop-cap text-lg" : undefined}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="sticky top-24 border border-rule bg-paper-2/60 p-6">
              <div className="eyebrow" style={{ color: company.accent }}>
                In the group
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink/70">
                {company.name} is company {seq} of eight within Alsaid Group,
                operating in {company.sector.toLowerCase()}.
              </p>
              <div className="mt-6 grid grid-cols-8 gap-1" aria-hidden>
                {companies.map((c, i) => (
                  <span
                    key={c.slug}
                    className="h-8"
                    style={{
                      background: i === idx ? company.accent : "var(--rule)",
                    }}
                  />
                ))}
              </div>
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

      <section className="border-b border-rule">
        <div className="container-editorial grid gap-px bg-rule py-0 md:grid-cols-2">
          <Link
            to="/companies/$slug"
            params={{ slug: prev.slug }}
            className="group relative bg-paper px-6 py-10 transition-colors hover:bg-paper-2"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: prev.accent }}
            />
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              ← Previous · {prev.number}
            </div>
            <div className="mt-3 font-display text-2xl text-ink md:text-3xl">
              {prev.name}
            </div>
          </Link>
          <Link
            to="/companies/$slug"
            params={{ slug: next.slug }}
            className="group relative bg-paper px-6 py-10 text-right transition-colors hover:bg-paper-2"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 right-0 w-[3px]"
              style={{ background: next.accent }}
            />
            <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Next · {next.number} →
            </div>
            <div className="mt-3 font-display text-2xl text-ink md:text-3xl">
              {next.name}
            </div>
          </Link>
        </div>
        <div className="container-editorial py-6">
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