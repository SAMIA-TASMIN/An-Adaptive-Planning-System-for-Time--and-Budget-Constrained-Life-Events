const EVENTS = ['Moving home', 'Birthday parties', 'Road trips', 'Farewells', 'Celebrations', 'Something else']

export default function EventBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center gap-8 overflow-x-auto border-y py-4">
        <p className="label shrink-0">What we plan:</p>
        {EVENTS.map((t) => <span key={t} className="shrink-0 text-sm font-medium">{t}</span>)}
      </div>
    </section>
  )
}
