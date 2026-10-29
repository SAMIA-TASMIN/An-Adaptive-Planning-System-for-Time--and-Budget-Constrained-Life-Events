import type { Tone } from '../../types'
import { Card, Badge, Title } from '../../vendor/ui'
import Img from '../../shared/Img'
import Bar from '../../shared/Bar'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getBookings } from '../../api/bookings'

const tone: Record<string, Tone> = { Requested: 'lilac', Accepted: 'blue', 'In progress': 'amber', Delivered: 'green', Declined: 'red' }

export default function Bookings() {
  const { data, loading, error } = useFetch(getBookings)
  const list = data || []
  return (
    <>
      <Title title="Bookings" sub="Providers you have hired." />
      <Status loading={loading} error={error} empty={!loading && !error && list.length === 0} emptyText="No bookings yet. Hire a package from the Marketplace tab." />
      {list.length > 0 && (
        <Card><ul className="divide-y">{list.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
            <Img src={b.img} alt={b.pack} emoji="📦" className="h-14 w-20 rounded-lg text-sm" />
            <div className="min-w-48 flex-1"><p className="text-sm font-semibold">{b.pack}</p><p className="muted text-xs">{b.by}</p>
              <Bar value={b.progress} className="mt-2" /></div>
            <Badge tone={tone[b.status ?? '']}>{b.status}</Badge>
          </li>))}</ul></Card>
      )}
    </>
  )
}
