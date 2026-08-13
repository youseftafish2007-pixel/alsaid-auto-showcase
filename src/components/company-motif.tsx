import type { Motif } from "@/lib/companies";

/** Small animated motif that gives each company page a sign of life. */
export function CompanyMotif({ motif, accent }: { motif: Motif; accent: string }) {
  return (
    <div className="relative h-16 overflow-hidden border-y border-rule bg-paper-2/50">
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-4 h-px"
        style={{ background: "color-mix(in oklab, var(--ink) 15%, transparent)" }}
      />
      <div aria-hidden className="motif-track absolute bottom-2 h-10 w-10" style={{ color: accent }}>
        <Glyph motif={motif} />
      </div>
    </div>
  );
}

function Glyph({ motif }: { motif: Motif }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } as const;
  switch (motif) {
    case "plane":
      return (
        <svg viewBox="0 0 32 32" className="h-10 w-10 motif-tilt">
          <path {...stroke} d="M3 18l26-8-6 12-6-2-3 6-2-7-9-1z" />
        </svg>
      );
    case "solar":
      return (
        <svg viewBox="0 0 32 32" className="h-10 w-10">
          <circle {...stroke} cx="16" cy="11" r="4" className="motif-pulse" />
          <path {...stroke} d="M6 26h20l-3-8H9z" />
          <path {...stroke} d="M13 18l-1 8M19 18l1 8" />
        </svg>
      );
    case "carrier":
      return (
        <svg viewBox="0 0 40 32" className="h-10 w-12">
          <path {...stroke} d="M2 22h26v-8H2zM28 22h8v-6l-4-4h-4z" />
          <circle {...stroke} cx="9" cy="25" r="3" />
          <circle {...stroke} cx="31" cy="25" r="3" />
          <path {...stroke} d="M4 14V8h20v6" />
        </svg>
      );
    case "pickup":
      return (
        <svg viewBox="0 0 40 32" className="h-10 w-12">
          <path {...stroke} d="M2 22h6M14 22h12M32 22h6" />
          <path {...stroke} d="M4 22v-6h10l4-6h8l3 6h5v6" />
          <circle {...stroke} cx="11" cy="24" r="3" />
          <circle {...stroke} cx="29" cy="24" r="3" />
        </svg>
      );
    case "showroom":
    case "fleet":
      return (
        <svg viewBox="0 0 40 32" className="h-10 w-12">
          <path {...stroke} d="M3 22v-5l4-6h18l6 6h6v5" />
          <circle {...stroke} cx="11" cy="24" r="3" />
          <circle {...stroke} cx="29" cy="24" r="3" />
        </svg>
      );
    case "lights":
      return (
        <svg viewBox="0 0 32 32" className="h-10 w-10">
          <path {...stroke} d="M2 8q14 10 28 0" />
          <circle cx="8" cy="13" r="2" fill="currentColor" className="motif-pulse" />
          <circle cx="16" cy="15" r="2" fill="currentColor" className="motif-pulse motif-delay-1" />
          <circle cx="24" cy="13" r="2" fill="currentColor" className="motif-pulse motif-delay-2" />
        </svg>
      );
    case "impact":
    default:
      return (
        <svg viewBox="0 0 32 32" className="h-10 w-10">
          <circle {...stroke} cx="16" cy="16" r="6" className="motif-pulse" />
          <circle {...stroke} cx="16" cy="16" r="11" opacity={0.5} />
        </svg>
      );
  }
}
