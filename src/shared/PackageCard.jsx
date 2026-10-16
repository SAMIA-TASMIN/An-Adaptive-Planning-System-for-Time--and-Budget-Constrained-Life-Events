import { useState } from 'react'
import { Btn, taka } from '../vendor/ui'
import { go } from '../router'
import BaseCard from './BaseCard'

// Package card = BaseCard + package data.
export default function PackageCard({ p, cta }) {
  const [sent, setSent] = useState(false)
  const onClick = () => { if (cta.startsWith('Sign')) go('sign-in'); else setSent(true) }
  return (
    <BaseCard image={p.img} emoji={p.icon} alt={p.title} title={p.title} subtitle={`By ${p.by}`}
      footer={<><span className="font-bold">{taka(p.price)}</span><Btn onClick={onClick} disabled={sent} variant={sent ? 'ghost' : 'solid'}>{sent ? 'Requested' : cta}</Btn></>}>
      <p className="mt-2 text-xs"><span className="font-semibold">{p.rating} out of 5</span> from clients. Takes {p.dur}.</p>
    </BaseCard>
  )
}
