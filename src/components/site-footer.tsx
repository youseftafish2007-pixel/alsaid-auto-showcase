import { Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-ink text-paper">
      <div className="container-editorial grid gap-14 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="eyebrow text-crimson">Alsaid Group</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            For partnerships, <em className="not-italic text-crimson">write to us.</em>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-paper/70">
            A privately held international conglomerate — held for the long term, built
            across two generations. Established 1999 in Amman, Jordan.
          </p>
          <div className="mt-8 space-y-2">
            <a
              href="mailto:hello@alsaidgroup.com"
              className="block font-display text-xl tracking-tight text-paper link-underline"
            >
              hello@alsaidgroup.com
            </a>
            <a
              href="mailto:partnerships@alsaidgroup.com"
              className="block font-display text-xl tracking-tight text-paper link-underline"
            >
              partnerships@alsaidgroup.com
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="eyebrow">Offices</div>
          <ul className="mt-5 space-y-2 text-sm text-paper/80">
            <li>Amman · Jordan</li>
            <li>Dubai & Sharjah · UAE</li>
            <li>Washington D.C. · USA</li>
            <li>Everett, WA · USA</li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <div className="eyebrow">Companies</div>
          <ul className="mt-5 grid grid-cols-1 gap-2 text-sm text-paper/80">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="transition-colors hover:text-crimson"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-editorial flex flex-col gap-2 py-6 text-[11px] uppercase tracking-[0.22em] text-paper/50 md:flex-row md:items-center md:justify-between">
          <span>© 1999 — 2026 Alsaid Group · All rights reserved</span>
          <span>Corporate Profile · Vol. I</span>
        </div>
      </div>
    </footer>
  );
}