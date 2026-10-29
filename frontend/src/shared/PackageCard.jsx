import { useState } from 'react'
import { Btn, taka } from '../vendor/ui'
import { go } from '../router'
import { hire, toBooking } from '../api/bookings'
import PayModal from '../payment/PayModal'
import Slip from '../payment/Slip'
import BaseCard from './BaseCard'

// Package card = BaseCard + package data. In the client panel "Hire & pay" opens the bKash / Nagad checkout;
// the booking is created together with the first payment (an advance or the full price).
export default function PackageCard({ p, cta }) {
  const [paying, setPaying] = useState(false)
  const [booked, setBooked] = useState(false)
  const [slip, setSlip] = useState(null)
  const signedOut = cta.startsWith('Sign')

  const pay = async (payment) => {
    const raw = await hire(p.id, payment)
    setBooked(true)
    // the reply has no package or provider names, so add them for the slip
    return toBooking({ ...raw, package: { title: p.title, image: p.img }, provider: { name: p.by } })
  }

  return (
    <>
      <BaseCard
        image={p.img}
        emoji={p.icon}
        alt={p.title}
        title={p.title}
        subtitle={`By ${p.by}`}
        footer={
          <>
            <span className="font-bold">{taka(p.price)}</span>
            <Btn onClick={() => (signedOut ? go('sign-in') : setPaying(true))} disabled={booked} variant={booked ? 'ghost' : 'solid'}>
              {booked ? 'Booked' : signedOut ? cta : `${cta} & pay`}
            </Btn>
          </>
        }
      >
        <p className="mt-2 text-xs">
          <span className="font-semibold">{p.rating} out of 5</span> from clients. Takes {p.dur}.
        </p>
      </BaseCard>
      {paying && (
        <PayModal
          title={p.title}
          total={p.price}
          first
          onPay={pay}
          onClose={() => setPaying(false)}
          onSlip={(b) => {
            setPaying(false)
            setSlip(b)
          }}
        />
      )}
      {slip && <Slip b={slip} onClose={() => setSlip(null)} />}
    </>
  )
}
