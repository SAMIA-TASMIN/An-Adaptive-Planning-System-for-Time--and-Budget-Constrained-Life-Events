import { useState } from 'react'
import { Card, Btn, Badge, Title, field, taka } from '../../vendor/ui'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getAdminProviders, getProviderCounts, setProviderStatus } from '../../api/admin'
import { ACCOUNT_TONE, Chips, date } from '../ui'

const QUEUES = [
  ['pending', 'Waiting'],
  ['active', 'Active'],
  ['suspended', 'Suspended'],
  ['rejected', 'Rejected'],
]

// The admin decides who may sell on the platform.
export default function Providers() {
  const [q, setQ] = useState('pending')
  const [picked, setPicked] = useState(null)
  const [comment, setComment] = useState('')
  const [note, setNote] = useState({ ok: true, text: '' })
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0)
  const counts = useFetch(getProviderCounts, [tick])
  const list = useFetch(() => getAdminProviders(q), [q, tick])
  const items = list.data || []
  const p = items.find((x) => x._id === picked) ?? items[0]

  const act = async (status, done) => {
    setBusy(true)
    try {
      await setProviderStatus(p._id, status, comment.trim())
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
      <Title title="Providers" sub="Approve new providers, or suspend one. A suspended or rejected provider cannot sign in and their packages disappear from the Marketplace." />
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
      <Status loading={list.loading} error={list.error} empty={!list.loading && !list.error && items.length === 0} emptyText="No providers in this list." />
      {items.length > 0 && (
        <>
          <Card className="mb-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="label">
                <tr>
                  {['Provider', 'Packages (live / all)', 'Jobs', 'Money collected', 'Joined', 'Status'].map((h) => (
                    <th key={h} className="pb-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((x) => (
                  <tr key={x._id} onClick={() => setPicked(x._id)} className={`cursor-pointer ${p?._id === x._id ? 'bg-(--tile)' : ''}`}>
                    <td className="py-3">
                      <p className="font-semibold">{x.name}</p>
                      <p className="muted text-xs">{x.email}</p>
                    </td>
                    <td>
                      {x.livePackages} / {x.packages}
                    </td>
                    <td>{x.jobs}</td>
                    <td>{taka(x.collected)}</td>
                    <td className="muted">{date(x.createdAt)}</td>
                    <td>
                      <Badge tone={ACCOUNT_TONE[x.status]}>{x.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          {p && (
            <Card>
              <h2 className="font-bold">{p.name}</h2>
              <p className="muted text-sm">{p.email}</p>
              {p.statusNote && <p className="mt-3 rounded-lg bg-(--bubble) p-3 text-xs">Last reason: {p.statusNote}</p>}
              <textarea
                rows={2}
                className={`${field} mt-4`}
                placeholder="Reason (required when rejecting or suspending)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {p.status !== 'active' && (
                  <Btn disabled={busy} onClick={() => act('active', 'Provider approved. They can now get packages approved.')}>
                    {p.status === 'pending' ? 'Approve provider' : 'Activate again'}
                  </Btn>
                )}
                {p.status === 'pending' && (
                  <Btn variant="ghost" disabled={busy} onClick={() => act('rejected', 'Provider rejected.')}>
                    Reject
                  </Btn>
                )}
                {p.status === 'active' && (
                  <Btn variant="ghost" disabled={busy} onClick={() => act('suspended', 'Provider suspended. Their packages are hidden.')}>
                    Suspend
                  </Btn>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </>
  )
}
