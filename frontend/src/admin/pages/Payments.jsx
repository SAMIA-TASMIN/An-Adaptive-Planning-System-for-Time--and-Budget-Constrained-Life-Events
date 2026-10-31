import { useState } from 'react'
import { Card, Title, Stat, field, taka } from '../../vendor/ui'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getPaymentSummary, getPayments } from '../../api/admin'
import { WalletBadge, when } from '../../payment/brand'
import { BOOKING_LABEL, Chips, Pager } from '../ui'
import { Badge } from '../../vendor/ui'

// The money ledger: totals, each wallet, and every single transaction.
export default function Payments() {
  const [method, setMethod] = useState('All')
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const summary = useFetch(getPaymentSummary)
  const list = useFetch(() => getPayments({ method, q, page }), [method, q, page])
  const s = summary.data
  const items = list.data?.items || []

  return (
    <>
      <Title title="Payments" sub="Every bKash and Nagad payment, with the totals. (Sandbox gateway: no real money moves yet.)" />
      <Status loading={summary.loading} error={summary.error} empty={false} />
      {s && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Money received" value={taka(s.collected)} note={`${s.bookings} bookings, ${s.fullyPaid} paid in full`} />
            <Stat label="Still to collect" value={taka(s.due)} note="Clients still owe this" />
            <Stat label="Refund pending" value={taka(s.refundPending)} note="Declined bookings to pay back" />
            <Stat label="Money kept" value={taka(s.kept)} note={`After ${taka(s.refunded)} refunded`} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {['bkash', 'nagad'].map((m) => (
              <Card key={m} className="flex items-center justify-between">
                <div>
                  <WalletBadge id={m} />
                  <p className="muted mt-2 text-xs">{s.byMethod[m].transactions} transactions</p>
                </div>
                <p className="text-xl font-bold">{taka(s.byMethod[m].amount)}</p>
              </Card>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 mb-3 text-lg font-bold">All transactions</h2>
      <div className="mb-2 flex flex-wrap items-start gap-3">
        <Chips
          items={[
            ['All', 'All'],
            ['bkash', 'bKash'],
            ['nagad', 'Nagad'],
          ]}
          value={method}
          onChange={(v) => {
            setMethod(v)
            setPage(1)
          }}
        />
        <input
          className={`${field} max-w-60`}
          placeholder="Search transaction ID"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            setPage(1)
          }}
        />
      </div>
      <Status loading={list.loading} error={list.error} empty={!list.loading && !list.error && items.length === 0} emptyText="No transactions found." />
      {items.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="label">
              <tr>
                {['Date', 'Transaction ID', 'Method', 'Wallet', 'Client', 'Package', 'Provider', 'Booking', 'Amount'].map((h) => (
                  <th key={h} className="pb-3 pr-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((t, i) => {
                const [bt, bl] = BOOKING_LABEL[t.status] || BOOKING_LABEL.requested
                return (
                  <tr key={`${t.booking}-${t.payment.trxId}-${i}`}>
                    <td className="py-3 pr-3 text-xs">{when(t.payment.paidAt)}</td>
                    <td className="pr-3 font-mono text-xs">{t.payment.trxId}</td>
                    <td className="pr-3">
                      <WalletBadge id={t.payment.method} size="sm" />
                    </td>
                    <td className="pr-3 font-mono text-xs">{t.payment.wallet}</td>
                    <td className="pr-3">{t.client?.name ?? '—'}</td>
                    <td className="pr-3">{t.package?.title ?? '—'}</td>
                    <td className="pr-3">{t.provider?.name ?? '—'}</td>
                    <td className="pr-3">
                      <Badge tone={bt}>{bl}</Badge>
                    </td>
                    <td className="font-semibold">{taka(t.payment.amount)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <Pager data={list.data} onPage={setPage} />
        </Card>
      )}
    </>
  )
}
