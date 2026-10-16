import { Card, Badge, Title } from '../../vendor/ui'
import { BOOKINGS } from '../data'
import Img from '../../shared/Img'
import Bar from '../../shared/Bar'

const tone = { Requested: 'lilac', Accepted: 'blue', 'In progress': 'amber' }

export default function Bookings() {
  return (
    <>
      <Title title="Bookings" sub="Providers you have hired." />
      <Card><ul className="divide-y">{BOOKINGS.map((b) => (
        <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
          <Img src={b.img} alt={b.pack} emoji="📦" className="h-14 w-20 rounded-lg text-sm" />
          <div className="min-w-48 flex-1"><p className="text-sm font-semibold">{b.pack}</p><p className="muted text-xs">{b.by}</p>
            <Bar value={b.progress} className="mt-2" /></div>
          <Badge tone={tone[b.status]}>{b.status}</Badge>
        </li>))}</ul></Card>
    </>
  )
}
