import { Card, Title, Stat, taka } from '../../vendor/ui'

const STAGES = ['Submitted', 'Admin review', 'Planned by AI', 'Approved']
const PHASES = [['Prepare', 'Declutter, gather supplies', 'Week 1'], ['Pack', 'Room by room, label by label', 'Week 2'], ['Transfer', 'Book crew, move boxes', 'Week 3'], ['Moving day', 'Load, unload, settle in', 'Day 21']]
const SUPPLIES: [string, boolean][] = [['Boxes ×20', true], ['Packing tape', true], ['Bubble wrap', false]]

export default function Plan() {
  return (
    <>
      <Title title="Your plan: Move to the new flat" sub="Approved by our team." />
      <ol className="mb-6 flex flex-wrap gap-2">{STAGES.map((s, i) => <li key={s} className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${i < 4 ? 'bg-(--bubble) text-(--accent)' : 'muted'}`}>✓ {s}</li>)}</ol>
      <div className="grid gap-4 sm:grid-cols-3"><Stat label="Time left" value="21 days" /><Stat label="Budget used" value={taka(11400)} note="of ৳ 20,000" /><Stat label="Tasks done" value="12 / 28" /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card><ul className="space-y-5 border-l-2 pl-5">{PHASES.map(([t, d, w]) => <li key={t}><p className="font-semibold">{t} <span className="muted text-xs">· {w}</span></p><p className="muted text-sm">{d}</p></li>)}</ul></Card>
        <Card><h2 className="mb-3 font-bold">Supplies</h2><ul className="divide-y text-sm">{SUPPLIES.map(([n, r]) => <li key={n} className="flex justify-between py-2">{n}<span className={r ? 'text-[#2f7f5c]' : 'text-[#9a6118]'}>{r ? 'ready' : 'to buy'}</span></li>)}</ul></Card>
      </div>
    </>
  )
}
