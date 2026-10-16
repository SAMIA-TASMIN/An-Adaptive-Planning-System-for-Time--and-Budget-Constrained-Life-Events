import Img from '../../shared/Img'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Card, Btn, Badge, Title, Toggle, field, taka } from '../ui'

export default function Packages({ s }) {
  const [form, setForm] = useState({ title: '', price: '', duration: '' })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const add = (e) => {
    e.preventDefault()
    if (!form.title || !form.price) return
    s.setPackages([...s.packages, { id: Date.now(), icon: '🎁', title: form.title, price: Number(form.price), duration: form.duration || '1 day', bookings: 0, active: false, approved: false }])
    setForm({ title: '', price: '', duration: '' })
  }
  const flip = (id) => s.setPackages(s.packages.map((p) => (p.id === id ? { ...p, active: !p.active } : p)))
  return (
    <>
      <Title title="My packages" sub="Ready-made offers clients can hire. New packages are reviewed by the admin first." />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <ul className="divide-y">
            {s.packages.map((p) => (
              <li key={p.id} className="flex items-center gap-4 py-3">
                <Img src={p.img} alt={p.title} emoji={p.icon} className="h-12 w-16 shrink-0 rounded-lg text-sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.title} {!p.approved && <Badge tone="amber">Waiting for approval</Badge>}</p>
                  <p className="muted text-xs">{taka(p.price)}, {p.duration}, {p.bookings} bookings</p>
                </div>
                <Toggle on={p.active} onChange={() => flip(p.id)} label={`Show ${p.title} to clients`} />
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="mb-3 font-bold">Create a package</h2>
          <form onSubmit={add} className="space-y-3">
            <input className={field} placeholder="Title, for example Moving crew, 3 rooms" value={form.title} onChange={set('title')} />
            <input className={field} placeholder="Price in taka" type="number" min="0" value={form.price} onChange={set('price')} />
            <input className={field} placeholder="Duration, for example 1 day" value={form.duration} onChange={set('duration')} />
            <Btn type="submit" className="w-full"><Plus size={14} className="mr-1 inline" />Submit for approval</Btn>
          </form>
        </Card>
      </div>
    </>
  )
}
