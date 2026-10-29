import { useState } from 'react'
import { Card, Btn, Badge, Title, field } from '../../vendor/ui'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { daysLeft } from '../../api/events'
import { decidePlan, getPlanCounts, getPlans } from '../../api/plans'
// [tab label, approvalStatus it shows]
const QUEUES = [
  ['Pending', 'pending'],
  ['Newly generated', 'generated'],
  ['Approved', 'approved'],
  ['Rejected', 'rejected'],
  ['Needs replanning', 'needs_replanning'],
]
const OPEN = ['pending', 'generated', 'needs_replanning'] // plans still waiting for a decision
export default function Approvals() {
  const [q, setQ] = useState('generated')
  const [picked, setPicked] = useState(null)
  const [comment, setComment] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [tick, setTick] = useState(0) // bump to reload the tabs and the list after a decision
  const counts = useFetch(getPlanCounts, [tick])
  const list = useFetch(() => getPlans(q), [q, tick])
  const plans = list.data || []
  const plan = plans.find((p) => p._id === picked) ?? plans[0]
  const left = daysLeft(plan?.event?.deadline)
  const taskCount = plan?.phases.reduce((n, p) => n + p.tasks.length, 0) ?? 0
  const decide = async (approve) => {
    if (!plan) return
    setBusy(true)
    setNote('')
    try {
      await decidePlan(plan._id, approve, comment.trim())
      setNote(approve ? 'Plan approved. The client can see it now.' : 'Plan rejected and sent back to the client.')
      setComment('')
      setPicked(null)
      setTick((t) => t + 1)
    } catch (e) {
      setNote(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <Title title="Plan approvals" sub="Nothing reaches a client until you approve it." />
      <div className="mb-4 flex flex-wrap gap-2">
        {QUEUES.map(([label, status]) => (
          <button
            key={status}
            onClick={() => {
              setQ(status)
              setPicked(null)
              setNote('')
            }}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${q === status ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}
          >
            {label} ({counts.data?.[status] ?? 0})
          </button>
        ))}
      </div>
      {note && <p className="mb-4 rounded-lg bg-(--bubble) p-3 text-sm">{note}</p>}
      <Status
        loading={list.loading}
        error={list.error}
        empty={!list.loading && !list.error && plans.length === 0}
        emptyText="Nothing in this queue."
      />
      {plans.length > 0 && (
        <>
          <Card className="mb-6">
            <ul className="divide-y">
              {plans.map((p) => (
                <li key={p._id}>
                  <button
                    onClick={() => {
                      setPicked(p._id)
                      setNote('')
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-sm font-semibold ${plan?._id === p._id ? 'bg-(--tile)' : ''}`}
                  >
                    {p.event?.title ?? 'Deleted event'}
                    <span className="muted text-xs font-medium">{p.event?.type}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
          {plan && (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <h2 className="font-bold">{plan.event?.title}</h2>
                <p className="muted mt-1 text-sm">
                  {plan.phases.length} phases · {taskCount} tasks
                </p>
                <p className="mt-3 text-sm">
                  Budget ৳ {(plan.budgetEstimate ?? 0).toLocaleString('en-US')} of ৳ {(plan.event?.budget ?? 0).toLocaleString('en-US')}
                </p>
                {left !== null && (
                  <div className="mt-3">
                    <Badge tone={left >= 7 ? 'green' : 'amber'}>
                      {left >= 7 ? 'Fits client deadline' : `Tight deadline: ${Math.max(left, 0)} days`}
                    </Badge>
                  </div>
                )}
                <ul className="mt-4 space-y-2 text-sm">
                  {plan.phases.map((p) => (
                    <li key={p.name}>
                      <span className="font-semibold">{p.name}</span>
                      <span className="muted"> · {p.tasks.join(', ')}</span>
                    </li>
                  ))}
                </ul>
                {plan.event?.notes && plan.event.notes !== 'None' && (
                  <p className="mt-4 rounded-xl bg-(--tile) p-3 text-xs">Client notes: {plan.event.notes}</p>
                )}
                {plan.companionNotes && <p className="mt-3 rounded-xl bg-(--bubble) p-3 text-xs">Companion notes: {plan.companionNotes}</p>}
              </Card>
              <Card>
                <h2 className="mb-3 font-bold">Decision</h2>
                {OPEN.includes(plan.approvalStatus) ? (
                  <>
                    <textarea
                      rows={3}
                      className={field}
                      placeholder="Add a comment for the client or the companion"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Btn disabled={busy} onClick={() => decide(true)}>
                        Accept and send to client
                      </Btn>
                      <Btn variant="ghost" disabled={busy} onClick={() => decide(false)}>
                        Reject and send back to the companion
                      </Btn>
                    </div>
                  </>
                ) : (
                  <p className="muted text-sm">
                    This plan was already {plan.approvalStatus.replace('_', ' ')}.
                    {plan.adminComment ? ` Comment: ${plan.adminComment}` : ''}
                  </p>
                )}
              </Card>
            </div>
          )}
        </>
      )}
    </>
  )
}
