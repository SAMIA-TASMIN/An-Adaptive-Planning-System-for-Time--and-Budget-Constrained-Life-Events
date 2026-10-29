import { useState } from 'react'
import { X, Check, ShieldCheck } from 'lucide-react'
import { Btn, field, taka } from '../vendor/ui'
import { WALLETS, WalletBadge } from './brand'

const MIN_ADVANCE_PERCENT = 20 // same rule as the backend (models/booking.model.js)
const MIN_NEXT = 100

// Checkout for bKash and Nagad. Steps: details -> verification code -> PIN -> done.
//   first   true when this is the first payment of a booking (an advance or the full price is needed)
//   total   price of the package     paid  already paid     onPay(payload) -> booking
// Demo gateway: the code and PIN are only asked to feel like the real apps; nothing is sent or stored.
export default function PayModal({ title, total, paid = 0, first = false, onPay, onClose, onSlip }) {
  const due = total - paid
  const minAmount = Math.min(due, first ? Math.ceil((total * MIN_ADVANCE_PERCENT) / 100) : MIN_NEXT)
  const [step, setStep] = useState('details') // details | otp | pin | busy | done
  const [method, setMethod] = useState('bkash')
  const [wallet, setWallet] = useState('')
  const [mode, setMode] = useState('full') // full | advance | custom
  const [custom, setCustom] = useState('')
  const [otp, setOtp] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const w = WALLETS[method]

  const amount = mode === 'full' ? due : mode === 'advance' ? minAmount : Math.round(Number(custom) || 0)
  const left = due - amount

  const toOtp = () => {
    if (!/^01[3-9]\d{8}$/.test(wallet.replace(/\s|-/g, ''))) return setError('Enter a valid 11-digit mobile number, like 01712345678')
    if (amount < minAmount || amount > due) return setError(`Amount must be between ${taka(minAmount)} and ${taka(due)}`)
    setError('')
    setStep('otp')
  }
  const toPin = () => {
    if (!/^\d{6}$/.test(otp)) return setError('Enter the 6-digit code')
    setError('')
    setStep('pin')
  }
  const confirm = async () => {
    if (pin.length !== w.pin) return setError(`Enter your ${w.pin}-digit ${w.name} PIN`)
    setError('')
    setStep('busy')
    try {
      const booking = await onPay({ method, wallet: wallet.replace(/\s|-/g, ''), amount })
      setResult(booking)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
      setPin('')
      setStep('details')
    }
  }
  const digits = (set, max) => (e) => set(e.target.value.replace(/\D/g, '').slice(0, max))
  const trx = result?.payments?.[result.payments.length - 1]
  const fullyPaid = result && result.due <= 0

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Payment">
      <div className="pop w-full max-w-md rounded-2xl border bg-(--card) shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div>
            <p className="text-sm font-bold">{step === 'done' ? 'Payment successful' : 'Pay with bKash or Nagad'}</p>
            <p className="muted text-xs">{title}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-(--tile)">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {step !== 'done' && (
            <div className="rounded-xl bg-(--tile) p-3 text-sm">
              <div className="flex justify-between"><span className="muted">Package price</span><span className="font-semibold">{taka(total)}</span></div>
              {paid > 0 && <div className="flex justify-between"><span className="muted">Already paid</span><span className="font-semibold text-[#2f7f5c]">{taka(paid)}</span></div>}
              <div className="flex justify-between"><span className="muted">Due now</span><span className="font-bold">{taka(due)}</span></div>
            </div>
          )}

          {step === 'details' && (
            <>
              <div>
                <p className="label mb-2">Pay with</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.values(WALLETS).map((x) => (
                    <button key={x.id} onClick={() => setMethod(x.id)} aria-pressed={method === x.id}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 transition ${method === x.id ? '' : 'opacity-60 hover:opacity-100'}`}
                      style={method === x.id ? { borderColor: x.color } : undefined}>
                      <WalletBadge id={x.id} />
                      <span className="muted text-[11px]">Mobile wallet</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="label">{w.name} account number</span>
                <input className={`${field} mt-1`} inputMode="numeric" placeholder="01XXXXXXXXX" value={wallet} onChange={digits(setWallet, 11)} />
              </label>
              <div>
                <p className="label mb-2">Amount</p>
                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2"><input type="radio" checked={mode === 'full'} onChange={() => setMode('full')} />Pay in full <b className="ml-auto">{taka(due)}</b></label>
                  {minAmount < due && (
                    <label className="flex items-center gap-2"><input type="radio" checked={mode === 'advance'} onChange={() => setMode('advance')} />{first ? `Pay advance (${MIN_ADVANCE_PERCENT}%)` : 'Pay the minimum'} <b className="ml-auto">{taka(minAmount)}</b></label>
                  )}
                  {minAmount < due && (
                    <label className="flex items-center gap-2"><input type="radio" checked={mode === 'custom'} onChange={() => setMode('custom')} />Other amount
                      <input className={`${field} ml-auto w-32 text-right`} inputMode="numeric" placeholder={String(minAmount)} value={custom} onFocus={() => setMode('custom')} onChange={digits(setCustom, 9)} />
                    </label>
                  )}
                </div>
                {amount > 0 && <p className="muted mt-2 text-xs">{left > 0 ? `You will still owe ${taka(left)} after this payment.` : 'This clears the full amount.'}</p>}
              </div>
              {error && <p className="rounded-lg bg-[#fde4ea] p-3 text-xs text-[#a13348]">{error}</p>}
              <Btn className="w-full" onClick={toOtp}>Continue, pay {taka(amount)}</Btn>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center"><WalletBadge id={method} /></div>
              <p className="text-center text-sm">We sent a 6-digit code to <b>{wallet.slice(0, 3)}****{wallet.slice(-4)}</b></p>
              <input className={`${field} text-center text-xl tracking-[.5em]`} inputMode="numeric" autoFocus placeholder="······" value={otp} onChange={digits(setOtp, 6)} />
              {error && <p className="rounded-lg bg-[#fde4ea] p-3 text-xs text-[#a13348]">{error}</p>}
              <Btn className="w-full" onClick={toPin}>Verify</Btn>
            </>
          )}

          {step === 'pin' && (
            <>
              <div className="text-center"><WalletBadge id={method} /></div>
              <p className="text-center text-sm">Enter your {w.name} PIN to pay <b>{taka(amount)}</b></p>
              <input className={`${field} text-center text-xl tracking-[.5em]`} type="password" inputMode="numeric" autoFocus placeholder="•••••" value={pin} onChange={digits(setPin, w.pin)} />
              {error && <p className="rounded-lg bg-[#fde4ea] p-3 text-xs text-[#a13348]">{error}</p>}
              <Btn className="w-full" onClick={confirm}>Confirm payment</Btn>
            </>
          )}

          {step === 'busy' && <p className="muted py-10 text-center text-sm">Processing your payment...</p>}

          {step === 'done' && result && (
            <>
              <div className="grid place-items-center gap-2 py-2 text-center">
                <span className="stamp-in grid h-14 w-14 place-items-center rounded-full bg-[#e6f6ee] text-[#2f7f5c]"><Check size={30} /></span>
                <p className="text-2xl font-extrabold">{taka(trx.amount)}</p>
                <WalletBadge id={trx.method} />
              </div>
              <div className="space-y-1 rounded-xl bg-(--tile) p-3 text-sm">
                <div className="flex justify-between"><span className="muted">Transaction ID</span><b>{trx.trxId}</b></div>
                <div className="flex justify-between"><span className="muted">Paid so far</span><b>{taka(result.paid)}</b></div>
                <div className="flex justify-between"><span className="muted">Still due</span><b>{taka(result.due)}</b></div>
              </div>
              {fullyPaid ? (
                <p className="rounded-lg bg-[#e6f6ee] p-3 text-center text-sm font-semibold text-[#2f7f5c]">Paid in full. Your payment slip is ready.</p>
              ) : (
                <p className="muted text-center text-xs">Booking confirmed. You can pay the remaining {taka(result.due)} any time from the Bookings tab.</p>
              )}
              <div className="flex gap-2">
                {fullyPaid && <Btn className="flex-1" onClick={() => onSlip(result)}>View payment slip</Btn>}
                <Btn variant="ghost" className="flex-1" onClick={onClose}>Done</Btn>
              </div>
            </>
          )}

          {step !== 'done' && step !== 'busy' && (
            <p className="muted flex items-center justify-center gap-1.5 text-[11px]"><ShieldCheck size={13} />Demo gateway: no real money moves. Any 6-digit code and any PIN work.</p>
          )}
        </div>
      </div>
    </div>
  )
}
