import { createFileRoute } from "@tanstack/react-router";
import { companies } from "@/lib/companies";
import { CompanyEcosystem } from "@/components/company-ecosystem";

export const Route = createFileRoute("/companies/")({
  head: () => ({
    meta: [
      { title: "The Alsaid Universe | Alsaid Group" },
      {
        name: "description",
        content:
          "Eight operating companies across mobility, energy, travel, hospitality, and social impact, each with its own mandate, market, and leadership.",
      },
      { property: "og:title", content: "The Alsaid Universe | Alsaid Group" },
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
  return <CompanyEcosystem companies={companies} />;
}
