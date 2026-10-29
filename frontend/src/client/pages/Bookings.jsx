import { useState } from 'react'
import { Card, Badge, Btn, Stat, Title, taka } from '../../vendor/ui'
import Img from '../../shared/Img'
import Bar from '../../shared/Bar'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getBookings, payBooking, toBooking } from '../../api/bookings'
import PayModal from '../../payment/PayModal'
import Slip from '../../payment/Slip'
import { WalletBadge, when } from '../../payment/brand'

const tone = { Requested: 'lilac', Accepted: 'blue', 'In progress': 'amber', Delivered: 'green', Declined: 'red' }
const PAY = {
  unpaid: ['red', 'Unpaid'],
  partial: ['amber', 'Part paid'],
  paid: ['green', 'Paid in full'],
  refund_pending: ['red', 'Refund pending'],
}

export default function Bookings() {
  const [reload, setReload] = useState(0)
  const { data, loading, error } = useFetch(getBookings, [reload])
  const [paying, setPaying] = useState(null) // the booking being paid
  const [slip, setSlip] = useState(null) // the booking whose slip is open
  const [open, setOpen] = useState(null) // booking whose payment history is expanded
  const list = data || []

  const live = list.filter((b) => b.payStatus !== 'refund_pending')
  const total = live.reduce((s, b) => s + b.total, 0)
  const paid = live.reduce((s, b) => s + b.paid, 0)
  const due = live.reduce((s, b) => s + b.due, 0)

  const pay = async (payment) => {
    const raw = await payBooking(paying.id, payment)
    setReload((n) => n + 1)
    return toBooking(raw)
  }

  return (
    <>
      <Title title="Bookings" sub="Providers you have hired, and what you have paid." />
      <Status loading={loading} error={error} empty={!loading && !error && list.length === 0} emptyText="No bookings yet. Hire a package from the Marketplace tab." />
      {list.length > 0 && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat label="Total booked" value={taka(total)} note={`${list.length} bookings`} />
            <Stat label="Total paid" value={taka(paid)} note={total ? `${Math.round((paid / total) * 100)}% of the total` : ''} />
            <Stat label="Still to pay" value={taka(due)} note={due ? 'Pay from each booking below' : 'Everything is paid'} />
          </div>
          <div className="space-y-4">
            {list.map((b) => {
              const [payTone, payLabel] = PAY[b.payStatus] || PAY.unpaid
              const pct = b.total ? Math.min(100, Math.round((b.paid / b.total) * 100)) : 100
              return (
                <Card key={b.id}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Img src={b.img} alt={b.pack} emoji="📦" className="h-14 w-20 rounded-lg text-sm" />
                    <div className="min-w-48 flex-1">
                      <p className="text-sm font-semibold">{b.pack}</p>
                      <p className="muted text-xs">{b.by}</p>
                      <Bar value={b.progress} className="mt-2" />
                      <p className="muted mt-1 text-[11px]">Work progress {b.progress}%</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge tone={tone[b.status ?? '']}>{b.status}</Badge>
                      <Badge tone={payTone}>{payLabel}</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-(--tile) p-3 text-center">
                    <div><p className="label">Total</p><p className="font-bold">{taka(b.total)}</p></div>
                    <div><p className="label">Paid</p><p className="font-bold text-[#2f7f5c]">{taka(b.paid)}</p></div>
                    <div><p className="label">Due</p><p className={`font-bold ${b.due ? 'text-[#b23a55]' : ''}`}>{taka(b.due)}</p></div>
                  </div>
                  <Bar value={pct} className="mt-3" />

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {b.payments.length > 0 && (
                      <button onClick={() => setOpen(open === b.id ? null : b.id)} className="muted text-xs underline">
                        {open === b.id ? 'Hide' : 'Show'} payments ({b.payments.length})
                      </button>
                    )}
                    <div className="ml-auto flex gap-2">
                      {b.payStatus === 'paid' && <Btn onClick={() => setSlip(b)}>View slip</Btn>}
                      {b.due > 0 && b.payStatus !== 'refund_pending' && <Btn onClick={() => setPaying(b)}>Pay {taka(b.due)}</Btn>}
                    </div>
                  </div>

                  {open === b.id && (
                    <ul className="mt-3 divide-y text-xs">
                      {b.payments.map((p, i) => (
                        <li key={i} className="flex flex-wrap items-center gap-3 py-2">
                          <WalletBadge id={p.method} size="sm" />
                          <span className="font-mono">{p.trxId}</span>
                          <span className="muted">{when(p.paidAt)}</span>
                          <b className="ml-auto">{taka(p.amount)}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                  {b.payStatus === 'refund_pending' && <p className="mt-3 rounded-lg bg-[#fff0d9] p-3 text-xs text-[#9a6118]">The provider declined this booking. Your {taka(b.paid)} will be refunded.</p>}
                </Card>
              )
            })}
          </div>
        </>
      )}

      {paying && (
        <PayModal
          title={paying.pack}
          total={paying.total}
          paid={paying.paid}
          first={paying.payments.length === 0}
          onPay={pay}
          onClose={() => setPaying(null)}
          onSlip={(b) => {
            setPaying(null)
            setSlip(b)
          }}
        />
      )}
      {slip && <Slip b={slip} onClose={() => setSlip(null)} />}
    </>
  )
}
