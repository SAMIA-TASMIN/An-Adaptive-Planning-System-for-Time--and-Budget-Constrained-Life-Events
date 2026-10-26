import { Card, Btn, Title, Stat, taka } from '../../vendor/ui'
import EventCard from '../EventCard'
import { EVENTS } from '../data'

export default function Dashboard({ go }: { go: (id: string) => void }) {
  return (
    <>
      <Title title="Good morning, Rustam" sub="Two events are on your plate this month."><Btn onClick={() => go('new')}>New event</Btn></Title>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active events" value="2" /><Stat label="Tasks done" value="12 / 28" />
        <Stat label="Budget used" value={taka(11400)} /><Stat label="Next deadline" value="9 days" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          {EVENTS.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
        <Card>
          <h2 className="mb-3 font-bold">Today&rsquo;s actions</h2>
          <ul className="space-y-3 text-sm">{['Confirm the moving crew', 'Reply to Mahi about boxes', 'Review the updated farewell plan'].map((a) => <li key={a} className="flex gap-2"><span className="text-[#8fd1b4]">●</span>{a}</li>)}</ul>
        </Card>
      </div>
    </>
  )
}
