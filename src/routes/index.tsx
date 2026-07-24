import { createFileRoute, Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";

const partnerLogos = companies.filter((c) => c.logo);

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        {/* Depth layers: soft crimson bleed + faint diagonal rule pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-40 h-[640px] w-[640px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(200,16,46,0.09), transparent 65%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 bottom-[-160px] h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle at center, rgba(30,30,45,0.06), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #1a1a2e 0, #1a1a2e 1px, transparent 1px, transparent 44px)",
          }}
        />
        <div className="relative container-editorial py-16 md:py-24">
          <h1 className="font-display text-[clamp(2.75rem,8vw,7rem)] font-light leading-[0.95] tracking-[-0.03em] text-ink">
            Where legacy
            <br />
            <em className="not-italic text-crimson">leads.</em>
          </h1>
          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <p className="md:col-span-6 max-w-xl text-lg leading-relaxed text-ink/80">
              A privately held international group with operations across automotive,
              energy, logistics, travel, hospitality, and social impact — built and
              led across two generations.
            </p>
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Eight operating companies
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Nine markets · Four continents
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/companies"
                  className="inline-flex items-center gap-2 border border-ink bg-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-crimson hover:border-crimson"
                >
                  Explore the companies
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-ink px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper"
                >
                  About the group
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid grid-cols-2 gap-8 py-10 md:grid-cols-4 md:py-12">
          {[
            { n: "1999", l: "Founded in Amman" },
            { n: "8", l: "Operating companies" },
            { n: "9", l: "International markets" },
            { n: "4", l: "Continents of operation" },
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

      <section className="border-b border-rule bg-paper-2/60">
        <div className="container-editorial py-10 md:py-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              Group companies & partnerships
            </div>
            <Link
              to="/companies"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-crimson hover:underline"
            >
              All eight →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
            {partnerLogos.map((c) => (
              <Link
                key={c.slug}
                to="/companies/$slug"
                params={{ slug: c.slug }}
                className="group flex h-14 items-center justify-center"
                aria-label={c.name}
              >
                <img
                  src={c.logo}
                  alt={`${c.name} logo`}
                  className="max-h-12 w-auto object-contain opacity-55 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial grid gap-10 py-14 md:grid-cols-12 md:py-20">
          <div className="md:col-span-4">
            <div className="eyebrow">The Group · A statement</div>
          </div>
          <div className="md:col-span-8">
            <p className="font-display text-3xl leading-[1.15] tracking-tight text-ink md:text-5xl">
              We measure our work in <em className="text-crimson">decades</em>, not
              quarters.
            </p>
            <p className="mt-8 max-w-2xl text-base leading-relaxed text-ink/70">
              What began as a single automotive business in Amman has grown, over
              twenty-six years, into a diversified platform of eight companies across
              four continents — held privately, governed for the long term, and built
              to endure beyond any single market or cycle.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial py-14 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">01 · The Group</div>
              <h2 className="mt-4 font-display text-4xl leading-tight md:text-6xl">
                One group, <em className="text-crimson">four sectors.</em>
              </h2>
            </div>
            <Link to="/companies" className="link-underline pb-1 text-sm font-medium text-ink">
              View all companies →
            </Link>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-rule bg-rule md:grid-cols-4">
            {[
              { name: "Mobility", count: "Four companies", note: "Alsaid Auto · GAC · River Auto · GMA", color: "#C8102E" },
              { name: "Energy", count: "One company", note: "Greenviro Energy · Solar", color: "#2F7D4F" },
              { name: "Travel & Hospitality", count: "Two companies", note: "Speed Travel · Zain Farm", color: "#0B7C86" },
              { name: "Social Impact", count: "One organisation", note: "Alsaid Foundation · 501(c)(3)", color: "#334155" },
            ].map((s) => (
              <div key={s.name} className="relative bg-paper p-8">
                <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: s.color }} />
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em]" style={{ color: s.color }}>
                  {s.count}
                </div>
                <div className="mt-6 font-display text-2xl leading-tight text-ink">{s.name}</div>
                <div className="mt-6 text-xs leading-relaxed text-muted-foreground">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="container-editorial py-14 md:py-20">
          <div className="eyebrow">02 · The Companies</div>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
            Eight operating companies, each with its own{" "}
            <em className="text-crimson">mandate.</em>
          </h2>

          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="group grid grid-cols-12 items-center gap-4 py-5 transition-colors hover:bg-paper-2"
                >
                  <span
                    className="col-span-2 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:col-span-1"
                  >
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ background: c.accent }}
                      aria-hidden
                    />
                    <span className="num">{c.number.split(" ")[1]}</span>
                  </span>
                  <span className="col-span-10 font-display text-2xl leading-tight text-ink md:col-span-5 md:text-3xl">
                    {c.name}
                  </span>
                  <span className="col-span-8 text-xs uppercase tracking-[0.18em] text-muted-foreground md:col-span-4">
                    {c.sector}
                  </span>
                  <span className="col-span-4 text-right text-xs uppercase tracking-[0.18em] text-crimson transition-transform group-hover:translate-x-1 md:col-span-2">
                    Read →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}