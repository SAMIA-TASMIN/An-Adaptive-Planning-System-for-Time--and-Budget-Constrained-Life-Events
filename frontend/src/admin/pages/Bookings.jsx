import { useState } from 'react'
import { X } from 'lucide-react'
import { Card, Btn, Badge, Title, Stat, field, taka } from '../../vendor/ui'
import Status from '../../shared/Status'
import Bar from '../../shared/Bar'
import useFetch from '../../api/useFetch'
import { getAdminBooking, getAdminBookings, getBookingCounts, refundBooking, toSlip } from '../../api/admin'
import Slip from '../../payment/Slip'
import { WalletBadge, when } from '../../payment/brand'
import { BOOKING_LABEL, Chips, PAY_LABEL, Pager, date } from '../ui'

const FILTERS = [
  ['All', 'All', 'all'],
  ['unpaid', 'Unpaid', 'unpaid'],
  ['partial', 'Part paid', 'partial'],
  ['paid', 'Paid in full', 'paid'],
  ['refund_pending', 'Refund pending', 'refund_pending'],
  ['refunded', 'Refunded', 'refunded'],
]

// Every booking on the platform with the full payment picture.
export default function Bookings() {
  const [payment, setPayment] = useState('All')
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(null) // the booking shown in the detail window
  const [tick, setTick] = useState(0)
  const counts = useFetch(getBookingCounts, [tick])
  const list = useFetch(() => getAdminBookings({ payment, page }), [payment, page, tick])
  const items = list.data?.items || []

  return (
    <>
      <Title title="Bookings and payments" sub="Who hired what, what was paid, what is still due. Click a booking for every transaction." />
      <Chips
        items={FILTERS.map(([v, label, k]) => [v, label, counts.data?.[k] ?? 0])}
        value={payment}
        onChange={(v) => {
          setPayment(v)
          setPage(1)
        }}
      />
      <Status loading={list.loading} error={list.error} empty={!list.loading && !list.error && items.length === 0} emptyText="No bookings in this list." />
      {items.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="label">
              <tr>
                {['Ref', 'Client', 'Package / provider', 'Work', 'Total', 'Paid', 'Due', 'Payment', 'Booked'].map((h) => (
                  <th key={h} className="pb-3 pr-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((b) => {
                const [bt, bl] = BOOKING_LABEL[b.status] || BOOKING_LABEL.requested
                const [pt, pl] = PAY_LABEL[b.paymentStatus] || PAY_LABEL.unpaid
                return (
                  <tr key={b._id} onClick={() => setOpen(b._id)} className="cursor-pointer hover:bg-(--tile)">
                    <td className="py-3 pr-3 font-mono text-xs">{String(b._id).slice(-8).toUpperCase()}</td>
                    <td className="pr-3">
                      <p className="font-medium">{b.client?.name ?? '—'}</p>
                      <p className="muted text-xs">{b.client?.email}</p>
                    </td>
                    <td className="pr-3">
                      <p className="font-medium">{b.package?.title ?? 'Deleted package'}</p>
                      <p className="muted text-xs">{b.provider?.name}</p>
                    </td>
                    <td className="pr-3">
                      <Badge tone={bt}>{bl}</Badge>
                    </td>
                    <td className="pr-3">{taka(b.price)}</td>
                    <td className="pr-3 font-semibold text-[#2f7f5c]">{taka(b.paid)}</td>
                    <td className={`pr-3 ${b.due ? 'font-semibold text-[#b23a55]' : ''}`}>{taka(b.due)}</td>
                    <td className="pr-3">
                      <Badge tone={pt}>{pl}</Badge>
                    </td>
                    <td className="muted">{date(b.createdAt)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pager data={list.data} onPage={setPage} />
        </Card>
      )}
      {open && <Detail id={open} onClose={() => setOpen(null)} onChanged={() => setTick((t) => t + 1)} />}
    </>
  )
}

// One booking in full: people, money, every payment, and the refund.
function Detail({ id, onClose, onChanged }) {
  const [reload, setReload] = useState(0)
  const { data: b, loading, error } = useFetch(() => getAdminBooking(id), [id, reload])
  const [note, setNote] = useState('')
  const [msg, setMsg] = useState({ ok: true, text: '' })
  const [busy, setBusy] = useState(false)
  const [slip, setSlip] = useState(null)

  const refund = async () => {
    setBusy(true)
    try {
      await refundBooking(id, note)
      setMsg({ ok: true, text: 'Refund recorded.' })
      setReload((n) => n + 1)
      onChanged()
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : 'Something went wrong' })
    } finally {
      setBusy(false)
    }
  }

  const pct = b?.price ? Math.min(100, Math.round((b.paid / b.price) * 100)) : 0
  const [pt, pl] = PAY_LABEL[b?.paymentStatus] || PAY_LABEL.unpaid
  const [bt, bl] = BOOKING_LABEL[b?.status] || BOOKING_LABEL.requested

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Booking details">
      <div className="pop mx-auto my-6 w-full max-w-3xl rounded-2xl border bg-(--card) p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold">Booking {String(id).slice(-8).toUpperCase()}</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <Status loading={loading} error={error} empty={!loading && !error && !b} emptyText="Booking not found." />
        {b && (
          <>
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="label">Client</p>
                <p className="font-semibold">{b.client?.name}</p>
                <p className="muted text-xs">{b.client?.email}</p>
              </div>
              <div>
                <p className="label">Provider</p>
                <p className="font-semibold">{b.provider?.name}</p>
                <p className="muted text-xs">{b.provider?.email}</p>
              </div>
              <div>
                <p className="label">Package</p>
                <p className="font-semibold">{b.package?.title ?? 'Deleted package'}</p>
                <p className="muted text-xs">Booked {when(b.createdAt)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={bt}>{bl}</Badge>
              <Badge tone={pt}>{pl}</Badge>
              <span className="muted text-xs">Work progress {b.progress}%</span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Stat label="Total" value={taka(b.price)} />
              <Stat label="Paid" value={taka(b.paid)} note={`${pct}% of the total`} />
              <Stat label="Still due" value={taka(b.due)} />
            </div>
            <Bar value={pct} className="mt-3" />

            <h3 className="mt-5 mb-2 font-bold">Payments ({b.payments.length})</h3>
            {b.payments.length === 0 ? (
              <p className="muted text-sm">No payment yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="label">
                    <tr>
                      {['Date', 'Method', 'Wallet', 'Transaction ID', 'Amount'].map((h) => (
                        <th key={h} className="pb-2 pr-3 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {b.payments.map((p, i) => (
                      <tr key={i}>
                        <td className="py-2 pr-3">{when(p.paidAt)}</td>
                        <td className="pr-3">
                          <WalletBadge id={p.method} size="sm" />
                        </td>
                        <td className="pr-3 font-mono">{p.wallet}</td>
                        <td className="pr-3 font-mono">{p.trxId}</td>
                        <td className="font-semibold">{taka(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {b.receiptNo && (
              <p className="mt-3 text-xs">
                Receipt number: <b className="font-mono">{b.receiptNo}</b>
              </p>
            )}

            {b.paymentStatus === 'refund_pending' && (
              <div className="mt-5 rounded-xl bg-[#fff0d9] p-4">
                <p className="text-sm font-semibold text-[#9a6118]">The provider declined this booking. {taka(b.paid)} must go back to the client.</p>
                <input className={`${field} mt-3`} placeholder="Note, for example the wallet number you sent it to" value={note} onChange={(e) => setNote(e.target.value)} />
                <Btn className="mt-3" disabled={busy} onClick={refund}>
                  Record refund of {taka(b.paid)}
                </Btn>
              </div>
            )}
            {b.paymentStatus === 'refunded' && (
              <p className="mt-5 rounded-xl bg-[#e6f6ee] p-4 text-sm text-[#2f7f5c]">
                Refunded {taka(b.refund?.amount)} on {when(b.refund?.at)}. Reference <b className="font-mono">{b.refund?.reference}</b>
                {b.refund?.note ? `. ${b.refund.note}` : ''}
              </p>
            )}
            {msg.text && <p className={`mt-3 text-sm ${msg.ok ? '' : 'text-[#a13348]'}`}>{msg.text}</p>}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {b.receiptNo && <Btn onClick={() => setSlip(toSlip(b))}>View slip</Btn>}
              <Btn variant="ghost" onClick={onClose}>
                Close
              </Btn>
            </div>
          </>
        )}
      </div>
      {slip && <Slip b={slip} onClose={() => setSlip(null)} />}
    </div>
  )
}
