import { useState } from 'react'
import type { PackageItem } from '../types'
import { Btn, taka } from '../vendor/ui'
import { go } from '../router'
import { hire } from '../api/bookings'
import BaseCard from './BaseCard'

// Package card = BaseCard + package data. In the client panel the button sends a real booking request.
export default function PackageCard({ p, cta }: { p: PackageItem; cta: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle') // idle | sending | sent
  const [error, setError] = useState('')
  const onClick = async () => {
    if (cta.startsWith('Sign')) return go('sign-in')
    setState('sending'); setError('')
    try { await hire(p.id); setState('sent') } catch (e) { setError(e instanceof Error ? e.message : 'Something went wrong'); setState('idle') }
  }
  return (
    <BaseCard image={p.img} emoji={p.icon} alt={p.title} title={p.title} subtitle={`By ${p.by}`}
      footer={<><span className="font-bold">{taka(p.price)}</span><Btn onClick={onClick} disabled={state !== 'idle'} variant={state === 'sent' ? 'ghost' : 'solid'}>{state === 'sent' ? 'Requested' : state === 'sending' ? 'Sending...' : cta}</Btn></>}>
      <p className="mt-2 text-xs"><span className="font-semibold">{p.rating} out of 5</span> from clients. Takes {p.dur}.</p>
      {error && <p className="mt-2 text-xs text-[#a13348]">{error}</p>}
    </BaseCard>
  )
}
