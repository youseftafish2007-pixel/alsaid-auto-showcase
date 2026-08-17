import { Link } from "@tanstack/react-router";
import { useState } from "react";
import asgLogo from "@/assets/asg-logo.png";

const nav = [
  { to: "/", label: "Group" },
  { to: "/about", label: "About" },
  { to: "/companies", label: "Companies" },
  { to: "/footprint", label: "Footprint" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/90 backdrop-blur-md">
      <div className="container-editorial flex h-16 items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={asgLogo}
            alt="Alsaid Group"
            width={40}
            height={40}
            className="h-9 w-auto object-contain transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[15px] font-medium tracking-tight text-ink transition-colors duration-300 group-hover:text-crimson">
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
              className="relative text-[13px] font-medium tracking-wide text-ink/70 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-right after:scale-x-0 after:bg-crimson after:transition-transform after:duration-300 hover:text-crimson hover:after:origin-left hover:after:scale-x-100"
              activeProps={{ className: "text-crimson" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href="mailto:partnerships@alsaidgroup.com"
          className="hidden items-center gap-2 border border-ink bg-ink px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-paper transition-all duration-300 hover:-translate-y-0.5 hover:border-crimson hover:bg-crimson hover:shadow-[0_10px_24px_-14px_rgba(0,0,0,0.8)] md:inline-flex"
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
        <div className="anim-rise border-t border-rule bg-paper md:hidden">
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