import { useState } from 'react'
import { Card, Btn, Badge, Title, field, taka } from '../../vendor/ui'
import Img from '../../shared/Img'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { decidePackage, getAdminPackages, getPackageCounts } from '../../api/admin'
import { EVENT_LABELS } from '../../shared/events'
import { ACCOUNT_TONE, Chips, date } from '../ui'

const QUEUES = [
  ['pending', 'Waiting'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
  ['suspended', 'Suspended'],
]
const TONE = { pending: 'amber', approved: 'green', rejected: 'red', suspended: 'red' }

// The admin decides which provider packages clients can see and hire.
export default function Packages() {
  const [q, setQ] = useState('pending')
  const [picked, setPicked] = useState(null)
  const [comment, setComment] = useState('')
  const [note, setNote] = useState({ ok: true, text: '' })
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0)
  const counts = useFetch(getPackageCounts, [tick])
  const list = useFetch(() => getAdminPackages(q), [q, tick])
  const items = list.data || []
  const pkg = items.find((p) => p._id === picked) ?? items[0]

  const act = async (action, done) => {
    setBusy(true)
    try {
      await decidePackage(pkg._id, action, comment.trim())
      setNote({ ok: true, text: done })
      setComment('')
      setPicked(null)
      setTick((t) => t + 1)
    } catch (e) {
      setNote({ ok: false, text: e instanceof Error ? e.message : 'Something went wrong' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Title title="Package approvals" sub="A package is hidden from clients until you approve it. Rejecting needs a reason the provider can read." />
      <Chips
        items={QUEUES.map(([v, label]) => [v, label, counts.data?.[v] ?? 0])}
        value={q}
        onChange={(v) => {
          setQ(v)
          setPicked(null)
          setNote({ ok: true, text: '' })
        }}
      />
      {note.text && <p className={`mb-4 rounded-lg p-3 text-sm ${note.ok ? 'bg-(--bubble)' : 'bg-[#fde4ea] text-[#a13348]'}`}>{note.text}</p>}
      <Status loading={list.loading} error={list.error} empty={!list.loading && !list.error && items.length === 0} emptyText="Nothing in this list." />
      {items.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card>
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p._id}>
                  <button
                    onClick={() => {
                      setPicked(p._id)
                      setNote({ ok: true, text: '' })
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left ${pkg?._id === p._id ? 'bg-(--tile)' : ''}`}
                  >
                    <Img src={p.image} alt={p.title} emoji="🎁" className="h-12 w-16 shrink-0 rounded-lg text-sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{p.title}</span>
                      <span className="muted block text-xs">
                        {p.provider?.name} · {taka(p.price)}
                      </span>
                    </span>
                    <Badge tone={TONE[p.status]}>{p.status}</Badge>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          {pkg && (
            <Card>
              <Img src={pkg.image} alt={pkg.title} emoji="🎁" className="mb-4 h-40 w-full rounded-xl text-4xl" />
              <h2 className="text-lg font-bold">{pkg.title}</h2>
              <p className="mt-1 text-sm">
                {taka(pkg.price)} · {pkg.duration || 'No duration'}
              </p>
              {pkg.description && <p className="muted mt-2 text-sm">{pkg.description}</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {(pkg.events || []).map((e) => (
                  <Badge key={e} tone="lilac">
                    {EVENT_LABELS[e] || e}
                  </Badge>
                ))}
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-(--tile) p-3 text-sm">
                <div>
                  <dt className="label">Provider</dt>
                  <dd className="font-semibold">{pkg.provider?.name}</dd>
                  <dd className="muted text-xs">{pkg.provider?.email}</dd>
                </div>
                <div>
                  <dt className="label">Provider account</dt>
                  <dd>
                    <Badge tone={ACCOUNT_TONE[pkg.provider?.status]}>{pkg.provider?.status}</Badge>
                  </dd>
                  <dd className="muted mt-1 text-xs">Added {date(pkg.createdAt)}</dd>
                </div>
              </dl>
              {pkg.provider?.status !== 'active' && pkg.status !== 'approved' && (
                <p className="mt-3 rounded-lg bg-[#fff0d9] p-3 text-xs text-[#9a6118]">
                  This provider is {pkg.provider?.status}. Approve the provider first (Providers tab), then approve this package.
                </p>
              )}
              {pkg.adminComment && (
                <p className="mt-3 rounded-lg bg-(--bubble) p-3 text-xs">
                  Last decision ({date(pkg.reviewedAt)}): {pkg.adminComment}
                </p>
              )}

              <h3 className="mt-5 mb-2 font-bold">Decision</h3>
              <textarea
                rows={3}
                className={field}
                placeholder={pkg.status === 'approved' ? 'Reason for taking it down (required)' : 'Comment for the provider (required when rejecting)'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.status !== 'approved' && (
                  <Btn disabled={busy} onClick={() => act('approve', 'Approved. Clients can see and hire it now.')}>
                    Approve
                  </Btn>
                )}
                {pkg.status === 'pending' && (
                  <Btn variant="ghost" disabled={busy} onClick={() => act('reject', 'Rejected. The provider can read your reason.')}>
                    Reject
                  </Btn>
                )}
                {pkg.status === 'approved' && (
                  <Btn variant="ghost" disabled={busy} onClick={() => act('suspend', 'Suspended. It is hidden from clients.')}>
                    Suspend (take down)
                  </Btn>
                )}
              </div>
            </Card>
          )}
        </div>
      )}
    </>
  )
}
