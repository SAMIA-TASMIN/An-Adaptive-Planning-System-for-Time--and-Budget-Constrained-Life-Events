import { Card, Btn, Badge, Title, taka } from '../ui'

export default function Requests({ s }) {
  return (
    <>
      <Title title="Booking requests" sub="Accept a request to turn it into an active job." />
      {s.requests.length === 0 && <Card><p className="muted text-sm">You are all caught up. New requests will appear here.</p></Card>}
      <div className="grid gap-4 md:grid-cols-2">
        {s.requests.map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between"><div><h2 className="font-bold">{r.pack}</h2><p className="muted text-xs">Client: {r.client}</p></div><Badge tone="lilac">New</Badge></div>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <div><dt className="label">Date</dt><dd className="mt-1 font-semibold">{r.date}</dd></div>
              <div><dt className="label">Budget</dt><dd className="mt-1 font-semibold">{taka(r.budget)}</dd></div>
              <div><dt className="label">Place</dt><dd className="mt-1 font-semibold">{r.place}</dd></div>
            </dl>
            <div className="mt-5 flex gap-2"><Btn onClick={() => s.accept(r.id)}>Accept</Btn><Btn variant="ghost" onClick={() => s.decline(r.id)}>Decline</Btn></div>
          </Card>
        ))}
      </div>
    </>
  )
}
