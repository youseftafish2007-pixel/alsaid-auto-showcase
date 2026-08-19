import { createFileRoute } from "@tanstack/react-router";
import { companies } from "@/lib/companies";
import { CompanyEcosystem } from "@/components/company-ecosystem";

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
    <section className="relative overflow-hidden bg-[#0a0a0a] text-[#f0ede8]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 pattern-diagonal opacity-[0.06]"
      />
      <div className="relative container-editorial pb-4 pt-12 text-center md:pt-20">
        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-crimson">
          The portfolio
        </div>
        <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl leading-[1] tracking-[-0.02em] md:text-7xl">
          The <em className="not-italic text-crimson">Companies.</em>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#f0ede8]/60">
          Eight operating companies, one founder-led center of gravity.
        </p>
      </div>
      <CompanyEcosystem companies={companies} />
    </section>
  );
}
