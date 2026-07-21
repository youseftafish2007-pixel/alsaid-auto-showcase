import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Group" },
  { to: "/about", label: "About" },
  { to: "/companies", label: "Companies" },
  { to: "/footprint", label: "Footprint" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-md">
      <div className="container-editorial flex h-16 items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3">
          <span className="grid h-8 w-8 place-items-center border border-ink text-[10px] font-semibold tracking-[0.16em] text-ink">
            AG
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-medium tracking-tight text-ink">
              Alsaid Group
            </span>
            <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Established 1999 · Amman
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[13px] font-medium tracking-wide text-ink/70 transition-colors hover:text-crimson"
              activeProps={{ className: "text-crimson" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href="mailto:partnerships@alsaidgroup.com"
          className="hidden items-center gap-2 border border-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-ink hover:text-paper md:inline-flex"
        >
          Partnerships
        </a>

        <button
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center border border-ink md:hidden"
        >
          <span className="text-xs">{open ? "×" : "☰"}</span>
        </button>
      </div>
      {open && (
        <div className="border-t border-rule bg-paper md:hidden">
          <div className="container-editorial flex flex-col py-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-rule py-3 text-sm font-medium text-ink"
                activeProps={{ className: "text-crimson" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href="mailto:partnerships@alsaidgroup.com"
              className="mt-4 inline-flex justify-center border border-ink py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink"
            >
              Partnerships
            </a>
          </div>
        </div>
      )}
    </header>
  );
}