import { ShieldCheck, Sparkles, Users } from 'lucide-react'

const STEPS = [
  { Icon: Sparkles, tone: 'bg-[#e8f3fc] text-[#5b8fc0]', title: 'Tell your companion',
    text: 'Big ideas, small details, tight budgets — just talk. Your companion listens and connects the dots.' },
  { Icon: ShieldCheck, tone: 'bg-[#efeafc] text-[#8b73d6]', title: 'Get a plan you can trust',
    text: 'A thoughtful timeline, clear tasks, and a realistic budget. Reviewed by our team before it reaches you.' },
  { Icon: Users, tone: 'bg-[#e6f6ee] text-[#4fa57f]', title: 'A little help goes a long way',
    text: 'Bring your people along or hire verified providers. The right help, right when you need it.' },
]

export default function Steps() {
  return (
    <ol className="space-y-7 lg:pl-8 lg:pt-6">
      {STEPS.map(({ Icon, tone, title, text }, i) => (
        <li key={title} className="flex gap-4">
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon size={22} /></span>
          <div>
            <p className="label">Step {String(i + 1).padStart(2, '0')}</p>
            <h2 className="mt-1 text-lg font-bold">{title}</h2>
            <p className="muted mt-1.5 max-w-md text-sm leading-6">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
