import { useState } from 'react'
import { Plus } from 'lucide-react'
import Img from '../../shared/Img'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { createPackage, getMyPackages, updatePackage } from '../../api/provider'
import { EVENT_KEYS, EVENT_LABELS } from '../../shared/events'
import { getUser } from '../../api/client'
import { Card, Btn, Badge, Title, Toggle, field, taka } from '../ui'
const TONE = { pending: 'amber', approved: 'green', rejected: 'red', suspended: 'red' }
const LABEL = { pending: 'Waiting for approval', approved: 'Live', rejected: 'Rejected', suspended: 'Suspended' }
// Real packages from the backend. A new package, or a change to a live one, goes to the admin first.
export default function Packages() {
  const [tick, setTick] = useState(0)
  const { data, loading, error } = useFetch(getMyPackages, [tick])
  const [form, setForm] = useState({ title: '', price: '', duration: '', description: '', events: [] })
  const [note, setNote] = useState({ ok: true, text: '' })
  const [busy, setBusy] = useState(false)
  const me = getUser()
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const toggleEvent = (k) => setForm({ ...form, events: form.events.includes(k) ? form.events.filter((x) => x !== k) : [...form.events, k] })

  const add = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price) return setNote({ ok: false, text: 'Add a title and a price.' })
    if (form.events.length === 0) return setNote({ ok: false, text: 'Pick at least one event group.' })
    setBusy(true)
    try {
      await createPackage({ ...form, price: Number(form.price), category: form.events[0], duration: form.duration || '1 day' })
      setNote({ ok: true, text: 'Sent to the admin. It goes live after approval.' })
      setForm({ title: '', price: '', duration: '', description: '', events: [] })
      setTick((t) => t + 1)
    } catch (err) {
      setNote({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong' })
    } finally {
      setBusy(false)
    }
  }
  const flip = async (p) => {
    try {
      await updatePackage(p._id, { isActive: !p.isActive })
      setTick((t) => t + 1)
    } catch (err) {
      setNote({ ok: false, text: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }
  const list = data || []
  return (
    <>
      <Title title="My packages" sub="Ready-made offers clients can hire. New packages are reviewed by the admin first." />
      {me?.status === 'pending' && (
        <p className="mb-4 rounded-lg bg-[#fff0d9] p-3 text-sm text-[#9a6118]">
          Your provider account is waiting for the admin. You can send packages now, but none go live until the admin approves you.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <Status loading={loading} error={error} empty={!loading && !error && list.length === 0} emptyText="No packages yet. Create your first one." />
          <ul className="divide-y">
            {list.map((p) => (
              <li key={p._id} className="flex items-center gap-4 py-3">
                <Img src={p.image} alt={p.title} emoji="🎁" className="h-12 w-16 shrink-0 rounded-lg text-sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {p.title} <Badge tone={TONE[p.status]}>{LABEL[p.status]}</Badge>
                  </p>
                  <p className="muted text-xs">
                    {taka(p.price)}, {p.duration} · {(p.events || []).map((k) => EVENT_LABELS[k] || k).join(', ')}
                  </p>
                  {(p.status === 'rejected' || p.status === 'suspended') && p.adminComment && (
                    <p className="mt-1 text-xs text-[#b23a55]">Admin: {p.adminComment}</p>
                  )}
                </div>
                {p.status === 'approved' && <Toggle on={p.isActive} onChange={() => flip(p)} label={`Show ${p.title} to clients`} />}
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
            <textarea className={field} rows={2} placeholder="What the client gets" value={form.description} onChange={set('description')} />
            <div>
              <p className="label mb-1">Show it under (pick one or more)</p>
              <div className="flex flex-wrap gap-2">
                {EVENT_KEYS.map((k) => (
                  <button
                    type="button"
                    key={k}
                    onClick={() => toggleEvent(k)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${form.events.includes(k) ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}
                  >
                    {EVENT_LABELS[k]}
                  </button>
                ))}
              </div>
            </div>
            {note.text && <p className={`text-xs ${note.ok ? '' : 'text-[#a13348]'}`}>{note.text}</p>}
            <Btn type="submit" disabled={busy} className="w-full">
              <Plus size={14} className="mr-1 inline" />
              Submit for approval
            </Btn>
          </form>
        </Card>
      </div>
    </>
  )
}
