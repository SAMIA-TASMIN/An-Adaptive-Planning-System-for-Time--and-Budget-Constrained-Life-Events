import { Card, Btn, Title, Stat, taka } from '../../vendor/ui'
import EventCard from '../EventCard'
import Status from '../../shared/Status'
import useFetch from '../../api/useFetch'
import { getUser } from '../../api/client'
import { daysLeft, getEvents, toEventItem } from '../../api/events'
const NEXT_STEP = {
  submitted: (t) => `Waiting for our team to review “${t}”`,
  in_review: (t) => `Our team is reviewing “${t}”`,
  approved: (t) => `Open the approved plan for “${t}”`,
  rejected: (t) => `Update “${t}” with your companion`,
}
const greeting = () => {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}
export default function Dashboard({ go }) {
  const { data, loading, error } = useFetch(getEvents)
  const events = data || []
  const name = getUser()?.name.split(' ')[0] ?? 'there'
  const next = events
    .map((e) => daysLeft(e.deadline))
    .filter((d) => d !== null && d >= 0)
    .sort((a, b) => a - b)[0]
  const actions = events.map((e) => NEXT_STEP[e.status]?.(e.title)).filter(Boolean)
  return (
    <>
      <Title
        title={`${greeting()}, ${name}`}
        sub={
          events.length
            ? `You have ${events.length} event${events.length === 1 ? '' : 's'} on your plate.`
            : 'Tell your companion what you are planning.'
        }
      >
        <Btn onClick={() => go('new')}>New event</Btn>
      </Title>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active events" value={events.length} />
        <Stat label="Approved plans" value={events.filter((e) => e.status === 'approved').length} />
        <Stat label="Budget planned" value={taka(events.reduce((sum, e) => sum + e.budget, 0))} />
        <Stat label="Next deadline" value={next === undefined ? '—' : `${next} days`} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Status
            loading={loading}
            error={error}
            empty={!loading && !error && events.length === 0}
            emptyText="No events yet. Press “New event” to start with your companion."
          />
          {events.map((e) => (
            <EventCard key={e._id} e={toEventItem(e)} />
          ))}
        </div>
        <Card>
          <h2 className="mb-3 font-bold">Today&rsquo;s actions</h2>
          <ul className="space-y-3 text-sm">
            {(actions.length ? actions : ['Tell the companion about your next event']).map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-[#8fd1b4]">●</span>
                {a}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
