import { Card, Btn, Title, Stat, taka } from '../../vendor/ui'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getOverview, getPlans } from '../../api/plans'
export default function Overview({ go }) {
  const stats = useFetch(getOverview)
  const waiting = useFetch(() => getPlans('generated'))
  const s = stats.data
  const plans = (waiting.data || []).slice(0, 5)
  return (
    <>
      <Title title="Overview" sub="Everything waiting on the team, and the money." />
      <Status loading={stats.loading} error={stats.error} empty={false} />
      {s && (
        <>
          <p className="label mb-2">Waiting for you</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Plans to approve" value={s.plansToApprove} note={`${s.requestsWaiting} requests waiting`} />
            <Stat label="Packages to approve" value={s.packagesToApprove} />
            <Stat label="Providers to approve" value={s.providersToApprove} />
            <Stat label="Refunds to pay back" value={taka(s.money.refundPending)} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={() => go('approvals')}>Review plans</Btn>
            <Btn variant="ghost" onClick={() => go('packages')}>
              Review packages
            </Btn>
            <Btn variant="ghost" onClick={() => go('providers')}>
              Review providers
            </Btn>
            <Btn variant="ghost" onClick={() => go('bookings')}>
              Open bookings
            </Btn>
          </div>

          <p className="label mt-8 mb-2">Money</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Money received" value={taka(s.money.collected)} note={`bKash ${taka(s.money.byMethod.bkash.amount)} · Nagad ${taka(s.money.byMethod.nagad.amount)}`} />
            <Stat label="Still to collect" value={taka(s.money.due)} />
            <Stat label="Total booked" value={taka(s.money.booked)} note={`${s.money.bookings} bookings`} />
            <Stat label="Events in progress" value={s.eventsInProgress} note={`Average rating ${s.averageRating ? s.averageRating.toFixed(1) : '—'}`} />
          </div>
        </>
      )}
      <Card className="mt-6 overflow-x-auto">
        <h2 className="mb-3 font-bold">Newest plans waiting for approval</h2>
        <Status
          loading={waiting.loading}
          error={waiting.error}
          empty={!waiting.loading && !waiting.error && plans.length === 0}
          emptyText="No new plans right now."
        />
        {plans.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="label">
              <tr>
                {['Event', 'Type', 'Budget', 'Deadline'].map((h) => (
                  <th key={h} className="pb-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {plans.map((p) => (
                <tr key={p._id}>
                  <td className="py-3 font-medium">{p.event?.title}</td>
                  <td>{p.event?.type}</td>
                  <td>{taka(p.event?.budget ?? 0)}</td>
                  <td className="muted">
                    {p.event?.deadline ? new Date(p.event.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  )
}
