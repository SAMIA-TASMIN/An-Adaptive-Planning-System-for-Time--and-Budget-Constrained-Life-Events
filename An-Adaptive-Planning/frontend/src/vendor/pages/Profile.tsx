import type { VendorProfile } from '../../types'
import type { Store } from '../useStore'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Card, Btn, Badge, Title, field } from '../ui'

export default function Profile({ s }: { s: Store }) {
  const [p, setP] = useState(s.profile)
  const [saved, setSaved] = useState(false)
  const set = (k: keyof VendorProfile) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setP({ ...p, [k]: e.target.value }); setSaved(false) }
  const save = (e: FormEvent) => { e.preventDefault(); s.setProfile(p); setSaved(true) }
  return (
    <>
      <Title title="Business profile" sub="This is what clients see before they hire you."><Badge tone="green">Verified by admin</Badge></Title>
      <Card className="max-w-2xl">
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">Business name<input className={`${field} mt-1`} value={p.name} onChange={set('name')} /></label>
          <label className="text-sm font-semibold">Category<input className={`${field} mt-1`} value={p.category} onChange={set('category')} /></label>
          <label className="text-sm font-semibold">Service area<input className={`${field} mt-1`} value={p.area} onChange={set('area')} /></label>
          <label className="text-sm font-semibold">Phone<input className={`${field} mt-1`} value={p.phone} onChange={set('phone')} /></label>
          <label className="text-sm font-semibold sm:col-span-2">About<textarea rows={3} className={`${field} mt-1`} value={p.about} onChange={set('about')} /></label>
          <div className="flex items-center gap-3 sm:col-span-2"><Btn type="submit">Save changes</Btn>{saved && <span className="text-sm text-[#2f7f5c]">Saved</span>}</div>
        </form>
      </Card>
    </>
  )
}
