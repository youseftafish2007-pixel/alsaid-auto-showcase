import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { companies } from "@/lib/companies";

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
  const { company } = Route.useLoaderData();
  const idx = companies.findIndex((c) => c.slug === company.slug);
  const next = companies[(idx + 1) % companies.length];
  const nameWords = company.name.split(" ");
  const nameLead = nameWords.slice(0, -1).join(" ");
  const nameTail = nameWords.slice(-1)[0];

  return (
    <>
      <section className="border-b border-rule">
        <div className="container-editorial py-16 md:py-24">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-crimson" />
              <span>{company.sector}</span>
            </div>
            <span className="text-crimson">{company.number}</span>
          </div>
          <h1 className="mt-10 max-w-4xl font-display text-5xl leading-[1] tracking-[-0.02em] text-ink md:text-8xl">
            {nameLead ? <>{nameLead} </> : null}
            <em className="text-crimson">{nameTail}.</em>
          </h1>
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-ink/80">
            {company.tagline}
          </p>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid gap-16 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7 space-y-6 text-base leading-relaxed text-ink/80">
            {company.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="md:col-span-4 md:col-start-9">
            <div className="eyebrow">Company facts</div>
            <dl className="mt-6 divide-y divide-rule border-y border-rule">
              {company.facts.map((f) => (
                <div
                  key={f.label}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {f.label}
                  </dt>
                  <dd className="text-right font-display text-base text-ink">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Location · <span className="text-ink">{company.location}</span>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-rule bg-paper-2">
        <div className="container-editorial flex flex-wrap items-center justify-between gap-6 py-10">
          <Link
            to="/companies"
            className="link-underline pb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink"
          >
            ← All companies
          </Link>
          <Link
            to="/companies/$slug"
            params={{ slug: next.slug }}
            className="group flex items-center gap-6 text-right"
          >
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Next · {next.number}
              </div>
              <div className="font-display text-2xl text-ink transition-colors group-hover:text-crimson">
                {next.name}
              </div>
            </div>
            <span className="text-crimson">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}