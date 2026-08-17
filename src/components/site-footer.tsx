import { Link } from "@tanstack/react-router";
import { companies } from "@/lib/companies";
import { Reveal } from "@/components/reveal";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-rule bg-ink text-paper">
      <div
        aria-hidden
        className="anim-drift pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(166,25,46,0.22), transparent 65%)",
        }}
      />
      <div className="relative container-editorial grid gap-10 py-14 md:grid-cols-12">
        <Reveal from="left" className="md:col-span-5">
          <div className="eyebrow text-crimson">Alsaid Group</div>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
            For partnerships, <em className="not-italic text-crimson">write to us.</em>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/70">
            A privately held international conglomerate, held for the long term, built
            across two generations. Established 1999 in Amman, Jordan.
          </p>
          <div className="mt-6 space-y-2">
            <a
              href="mailto:hello@alsaidgroup.com"
              className="link-underline block font-display text-xl tracking-tight text-paper transition-transform duration-300 hover:translate-x-1"
            >
              hello@alsaidgroup.com
            </a>
            <a
              href="mailto:partnerships@alsaidgroup.com"
              className="link-underline block font-display text-xl tracking-tight text-paper transition-transform duration-300 hover:translate-x-1"
            >
              partnerships@alsaidgroup.com
            </a>
          </div>
        </Reveal>

        <Reveal delay={100} className="md:col-span-3">
          <div className="eyebrow">Offices</div>
          <ul className="mt-4 space-y-2 text-sm text-paper/80">
            <li>Amman · Jordan</li>
            <li>Dubai & Sharjah · UAE</li>
            <li>Washington D.C. · USA</li>
            <li>Everett, WA · USA</li>
          </ul>
        </Reveal>

        <Reveal delay={180} className="md:col-span-4">
          <div className="eyebrow">Companies</div>
          <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm text-paper/80">
            {companies.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/companies/$slug"
                  params={{ slug: c.slug }}
                  className="inline-block transition-all duration-300 hover:translate-x-1.5 hover:text-crimson"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="relative border-t border-paper/10">
        <div className="container-editorial flex flex-col gap-2 py-5 text-[11px] uppercase tracking-[0.22em] text-paper/50 md:flex-row md:items-center md:justify-between">
          <span>© 1999 to 2026 Alsaid Group · All rights reserved</span>
          <span>Corporate Profile · Vol. I</span>
        </div>
      </div>
    </footer>
  );
}