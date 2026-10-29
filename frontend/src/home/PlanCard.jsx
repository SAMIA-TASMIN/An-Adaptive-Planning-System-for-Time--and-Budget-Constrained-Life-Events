import { Check, Plus, ShieldCheck, Smile, Sparkles } from 'lucide-react'
const PLAN = [
  { n: '01', title: 'A little prep', text: 'Declutter, gather supplies, take a breath.', week: 'Week 1' },
  { n: '02', title: 'Pack with a plan', text: 'Room by room. Label by label.', week: 'Week 2' },
  { n: '03', title: 'Hello, new home', text: 'Move in, settle down, make it yours.', week: 'Week 3' },
]
export default function PlanCard() {
  return (
    <div className="overflow-hidden rounded-3xl border bg-(--card) shadow-sm">
      <div className="flex items-center justify-between border-b px-5 py-2.5">
        <div className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-[#f4b6d6]" />
          <i className="h-2.5 w-2.5 rounded-full bg-(--primary)" />
          <i className="h-2.5 w-2.5 rounded-full bg-[#a8e6cf]" />
        </div>
        <span className="muted flex items-center gap-1.5 text-[11px]">
          <ShieldCheck size={12} /> your next chapter, planned
        </span>
        <Plus size={16} className="muted" />
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start gap-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-(--bubble) text-(--accent)">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-sm font-semibold">Let&rsquo;s make room for your next chapter.</p>
            <p className="muted text-xs">Your companion is putting the pieces together.</p>
          </div>
        </div>

        <div className="ml-0 flex items-center justify-between gap-3 rounded-2xl bg-(--bubble) px-4 py-3 text-xs sm:ml-14">
          <span>I&rsquo;m moving in 3 weeks. Can we keep it under ৳ 20,000?</span>
          <Smile size={16} className="muted shrink-0" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="label">Your plan is coming together</p>
          <span className="rounded-md bg-(--bubble) px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-(--accent)">
            Made for you
          </span>
        </div>

        <ul className="divide-y border-t">
          {PLAN.map((r, i) => (
            <li key={r.n} className="plan-row flex items-center gap-4 py-3" style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-(--tile) text-xs text-(--accent)">{r.n}</span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold">{r.title}</p>
                <p className="muted text-xs">{r.text}</p>
              </div>
              <span className="muted text-xs">{r.week}</span>
              <Check size={16} className="text-[#4fa57f]" />
            </li>
          ))}
        </ul>

        <p className="muted flex items-center justify-center gap-1.5 border-t pt-4 text-[11px]">
          <ShieldCheck size={12} /> Always reviewed by a real person. Always made for you.
        </p>
      </div>
    </div>
  )
}
