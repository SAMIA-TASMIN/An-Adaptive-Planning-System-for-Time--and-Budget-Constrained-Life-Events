import CountUp from '../shared/CountUp'
import { Clock, ShieldCheck, Sparkle } from 'lucide-react'

const STATS = [
  { Icon: Sparkle, value: '2,000+', label: 'life moments, thoughtfully planned' },
  { Icon: Clock, value: '12 hours', label: 'saved for the things that matter' },
  { Icon: ShieldCheck, value: '150+', label: 'verified helping hands' },
]

export default function StatsBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <div className="grid grid-cols-1 border-y sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
        {STATS.map(({ Icon, value, label }) => (
          <div key={label} className="flex items-start gap-3 py-6 lg:px-6 lg:first:pl-2">
            <Icon size={20} strokeWidth={1.6} className="mt-2 shrink-0 text-(--gold)" />
            <div>
              <p className="text-2xl font-bold tracking-tight"><CountUp text={value} /></p>
              <p className="muted mt-1.5 text-[11px]">{label}</p>
            </div>
          </div>
        ))}
        <div className="relative flex items-center py-6 lg:px-6">
          <p className="text-base leading-7 text-(--accent)">
            Less on your plate.<br />More in your life.
          </p>
          <svg className="absolute bottom-5 right-0 hidden w-20 text-(--gold) sm:block" viewBox="0 0 96 24" fill="none"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M2 20 C 28 22, 60 14, 92 8" />
            <path d="M84 4 L92 8 L85 13" />
          </svg>
        </div>
      </div>
    </section>
  )
}
