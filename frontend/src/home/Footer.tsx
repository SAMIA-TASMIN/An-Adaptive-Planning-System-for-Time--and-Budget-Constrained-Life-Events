import LogoMark from './Logo'
import { go } from '../router'

type FooterLink = [label: string, action?: () => void]
const COLS: { title: string; links: FooterLink[] }[] = [
  { title: 'Product', links: [['Marketplace', () => go('marketplace')], ['How it works', () => { document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }) }], ['For providers', () => go('sign-in')]] },
  { title: 'Company', links: [['About us'], ['Contact'], ['Help centre']] },
  { title: 'Legal', links: [['Privacy'], ['Terms']] },
]

export default function Footer() {
  return (
    <footer className="border-t bg-(--card)">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2.5"><LogoMark /><span className="text-2xl font-extrabold tracking-tight">Planly<span className="text-(--gold)">.</span></span></div>
          <p className="muted mt-3 max-w-xs text-sm leading-6">Less on your plate. More in your life. Plans for life&rsquo;s big moments, reviewed by real people.</p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="label mb-3">{c.title}</p>
            <ul className="space-y-2 text-sm">
              {c.links.map(([label, fn]) => (
                <li key={label}><a href="#" onClick={(e) => { e.preventDefault(); fn && fn() }} className="muted hover:opacity-80">{label}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <p className="muted mx-auto max-w-7xl px-6 py-4 text-xs">© 2026 Planly. Made with care.</p>
      </div>
    </footer>
  )
}
