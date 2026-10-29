import { Printer, X } from 'lucide-react'
import { Btn, taka } from '../vendor/ui'
import { getUser } from '../api/client'
import { WalletBadge, WALLETS, when } from './brand'

// The payment slip shown when a booking is paid in full. "Print / Save PDF" prints only this slip
// (see the @media print rules in index.css).
//   b = { id, pack, by, total, paid, due, receiptNo, payments: [{ method, wallet, trxId, amount, paidAt }] }
export default function Slip({ b, onClose }) {
  const user = getUser()
  const last = b.payments[b.payments.length - 1]
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Payment slip">
      <div className="pop mx-auto my-6 w-full max-w-lg">
        <div className="no-print mb-3 flex justify-end gap-2">
          <Btn onClick={() => window.print()}><Printer size={15} className="mr-1.5 inline" />Print / Save PDF</Btn>
          <Btn variant="ghost" onClick={onClose}><X size={15} className="mr-1.5 inline" />Close</Btn>
        </div>

        <article id="slip" className="relative overflow-hidden rounded-2xl border bg-white p-6 text-[#14213d] shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-lg font-extrabold">An Adaptive Planning</p>
              <p className="text-xs text-[#5b6785]">Payment receipt</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-bold">{b.receiptNo}</p>
              <p className="text-[#5b6785]">{last ? when(last.paidAt) : ''}</p>
            </div>
          </div>

          <span className="stamp-in pointer-events-none absolute top-16 right-6 rounded-lg border-4 border-[#2f7f5c] px-3 py-1 text-2xl font-extrabold tracking-widest text-[#2f7f5c]">PAID</span>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div><dt className="text-xs text-[#5b6785]">Billed to</dt><dd className="font-semibold">{user?.name || 'Client'}</dd></div>
            <div><dt className="text-xs text-[#5b6785]">Provider</dt><dd className="font-semibold">{b.by}</dd></div>
            <div><dt className="text-xs text-[#5b6785]">Service</dt><dd className="font-semibold">{b.pack}</dd></div>
            <div><dt className="text-xs text-[#5b6785]">Booking ref</dt><dd className="font-semibold">{String(b.id).slice(-8).toUpperCase()}</dd></div>
          </dl>

          <table className="mt-6 w-full text-left text-xs">
            <thead>
              <tr className="border-b text-[#5b6785]"><th className="py-2 font-semibold">Date</th><th className="font-semibold">Method</th><th className="font-semibold">Transaction ID</th><th className="text-right font-semibold">Amount</th></tr>
            </thead>
            <tbody>
              {b.payments.map((p, i) => (
                <tr key={i} className="border-b align-top">
                  <td className="py-2 pr-2">{when(p.paidAt)}</td>
                  <td><WalletBadge id={p.method} size="sm" /><div className="mt-0.5 text-[#5b6785]">{WALLETS[p.method]?.name} {p.wallet}</div></td>
                  <td className="font-mono">{p.trxId}</td>
                  <td className="text-right font-semibold">{taka(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-[#5b6785]">Package price</span><span>{taka(b.total)}</span></div>
            <div className="flex justify-between"><span className="text-[#5b6785]">Total paid</span><span className="font-bold text-[#2f7f5c]">{taka(b.paid)}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-semibold">Balance due</span><span className="font-extrabold">{taka(b.due)}</span></div>
          </div>

          <p className="mt-6 text-center text-[11px] text-[#5b6785]">Paid in full. Thank you for booking with An Adaptive Planning. This is a computer generated receipt.</p>
        </article>
      </div>
    </div>
  )
}
