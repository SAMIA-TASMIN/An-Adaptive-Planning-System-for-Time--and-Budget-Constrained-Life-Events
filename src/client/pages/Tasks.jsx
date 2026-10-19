import { useState } from 'react'
import { Card, Badge, Title, Toggle } from '../../vendor/ui'
import { TASKS, priTone } from '../data'

const COLS = ['To do', 'In progress', 'Done']

export default function Tasks() {
  const [tasks, setTasks] = useState(TASKS)
  const flip = (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  return (
    <>
      <Title title="Tasks" sub="Who does what, and by when." />
      <div className="grid gap-4 md:grid-cols-3">
        {COLS.map((c) => (
          <Card key={c}><p className="label mb-3">{c}</p>
            <div className="space-y-2">{tasks.filter((t) => t.col === c).map((t) => <div key={t.id} className="rounded-xl bg-(--tile) p-3 text-sm font-medium">{t.t}</div>)}</div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="label"><tr>{['Task', 'Priority', 'Owner', 'Due', 'Confirmed'].map((h) => <th key={h} className="pb-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{tasks.map((t) => (
            <tr key={t.id}><td className="py-3 font-medium">{t.t}</td><td><Badge tone={priTone[t.pri]}>{t.pri}</Badge></td><td>{t.owner}</td><td className="muted">{t.due}</td><td><Toggle on={t.done} onChange={() => flip(t.id)} label={`Confirm ${t.t}`} /></td></tr>
          ))}</tbody>
        </table>
      </Card>
    </>
  )
}
