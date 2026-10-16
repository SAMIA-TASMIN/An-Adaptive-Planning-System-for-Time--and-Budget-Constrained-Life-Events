import { Card, Title, Stat, taka } from '../ui'
import { MONTHS } from '../data'

export default function Earnings({ s }) {
  const done = s.jobs.filter((j) => j.status === 'Delivered')
  const pending = s.jobs.filter((j) => j.status !== 'Delivered').reduce((t, j) => t + j.price, 0)
  const max = Math.max(...MONTHS.map((m) => m[1]))
  return (
    <>
      <Title title="Earnings" sub="A summary of your completed work. Online payments are not part of this version." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Paid out this month" value={taka(done.reduce((t, j) => t + j.price, 0))} />
        <Stat label="Waiting on active jobs" value={taka(pending)} />
        <Stat label="Completed jobs" value={done.length} />
      </div>
      <Card className="mt-6">
        <h2 className="mb-4 font-bold">Last five months</h2>
        <div className="flex h-44 items-end gap-4">
          {MONTHS.map(([m, v]) => (
            <div key={m} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
              <span className="muted text-[11px]">{taka(v)}</span>
              <div className="w-full max-w-14 rounded-t-lg bg-(--primary)" style={{ height: `${(v / max) * 75}%` }} />
              <span className="text-xs font-semibold">{m}</span>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}
