import { Card, Title, Stat, Btn, taka } from '../../vendor/ui'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { daysLeft, getEventPlan, getEvents } from '../../api/events'
const STAGES = ['Submitted', 'Planned by companion', 'Admin review', 'Approved']
const DONE = { draft: 0, submitted: 2, in_review: 2, planned: 2, approved: 4, rejected: 3 }
// Shows the latest approved event, or the newest one if none is approved yet.
async function load() {
  const events = await getEvents()
  const event = events.find((e) => e.status === 'approved') ?? events[0]
  return event ? { event, plan: await getEventPlan(event._id) } : null
}
export default function Plan({ go }) {
  const { data, loading, error } = useFetch(load)
  if (loading || error)
    return (
      <>
        <Title title="Your plan" />
        <Status loading={loading} error={error} empty={false} />
      </>
    )
  if (!data)
    return (
      <>
        <Title title="Your plan" sub="No event yet." />
        <Card className="max-w-lg">
          <p className="muted text-sm">
            Tell your companion what you are planning, and the plan will appear here once our team approves it.
          </p>
          <Btn className="mt-4" onClick={() => go('new')}>
            New event
          </Btn>
        </Card>
      </>
    )
  const { event, plan } = data
  const approved = plan?.approvalStatus === 'approved'
  const left = daysLeft(event.deadline)
  const taskCount = plan?.phases?.reduce((n, p) => n + p.tasks.length, 0) ?? 0
  return (
    <>
      <Title
        title={`Your plan: ${event.title}`}
        sub={
          approved
            ? 'Approved by our team.'
            : event.status === 'rejected'
              ? 'Our team asked for changes.'
              : 'Our team is reviewing it. Nothing is released until it is approved.'
        }
      />
      <ol className="mb-6 flex flex-wrap gap-2">
        {STAGES.map((s, i) => (
          <li
            key={s}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${i < (DONE[event.status] ?? 0) ? 'bg-(--bubble) text-(--accent)' : 'muted'}`}
          >
            {i < (DONE[event.status] ?? 0) ? '✓ ' : ''}
            {s}
          </li>
        ))}
      </ol>
      {!approved && (
        <Card className="max-w-xl">
          <p className="font-bold">{event.status === 'rejected' ? 'Changes needed' : 'Waiting for approval'}</p>
          <p className="muted mt-2 text-sm">{plan?.adminComment || 'You will see the full plan here as soon as it is approved.'}</p>
          {event.status === 'rejected' && (
            <Btn className="mt-4" onClick={() => go('new')}>
              Plan it again
            </Btn>
          )}
        </Card>
      )}
      {approved && plan && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Time left" value={left === null ? '—' : `${Math.max(left, 0)} days`} />
            <Stat label="Estimated cost" value={taka(plan.budgetEstimate ?? 0)} note={`of ${taka(event.budget)}`} />
            <Stat label="Tasks planned" value={taskCount} />
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <Card>
              <ul className="space-y-5 border-l-2 pl-5">
                {plan.phases?.map((p) => (
                  <li key={p.name}>
                    <p className="font-semibold">{p.name}</p>
                    <ul className="muted mt-1 list-disc space-y-0.5 pl-5 text-sm">
                      {p.tasks.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h2 className="mb-3 font-bold">Notes from the team</h2>
              {plan.companionNotes && <p className="rounded-xl bg-(--bubble) p-3 text-xs">Companion: {plan.companionNotes}</p>}
              {plan.adminComment && <p className="mt-3 text-sm">{plan.adminComment}</p>}
              {!plan.companionNotes && !plan.adminComment && <p className="muted text-sm">No notes.</p>}
            </Card>
          </div>
        </>
      )}
    </>
  )
}
