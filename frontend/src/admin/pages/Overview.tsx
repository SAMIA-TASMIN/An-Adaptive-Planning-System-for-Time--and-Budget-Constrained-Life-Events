import type { Tone } from '../../types'
import { Card, Badge, Title, Stat } from '../../vendor/ui'

const ROWS: [string, string, string, Tone, number, string][] = [
  ['Move to the new flat', 'Mahi', 'Planning', 'amber', 45, '5 Nov'],
  ['Farewell party', 'Nova', 'Review', 'blue', 20, '22 Oct'],
  ['Cox\u2019s Bazar trip', 'Sami', 'Approved', 'green', 80, '30 Oct'],
]

export default function Overview() {
  return (
    <>
      <Title title="Overview" sub="Everything waiting on the team." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Requests waiting" value="4" /><Stat label="Plans to approve" value="3" /><Stat label="Events in progress" value="12" /><Stat label="Average rating" value="4.8" /></div>
      <Card className="mt-6 overflow-x-auto"><h2 className="mb-3 font-bold">Work schedule &amp; progress</h2>
        <table className="w-full text-left text-sm"><thead className="label"><tr>{['Event', 'Client', 'Stage', 'Progress', 'Due'].map((h) => <th key={h} className="pb-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y">{ROWS.map(([e, c, s, t, p, d]) => (
            <tr key={e}><td className="py-3 font-medium">{e}</td><td>{c}</td><td><Badge tone={t}>{s}</Badge></td>
              <td className="w-40"><div className="h-1.5 rounded-full bg-(--tile)"><div className="h-full rounded-full bg-(--primary)" style={{ width: `${p}%` }} /></div></td><td className="muted">{d}</td></tr>
          ))}</tbody></table>
      </Card>
    </>
  )
}
