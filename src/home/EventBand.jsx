import { go } from '../router'

// Each item is clickable and opens the Sign in page (the form with Client / Provider / Admin).
const EVENTS = [
  { icon: '📦', label: 'Moving homes' },
  { icon: '🎉', label: 'Birthday parties' },
  { icon: '🚙', label: 'Road trips' },
  { icon: '🎓', label: 'Farewells' },
  { icon: '💍', label: 'Celebrations' },
  { icon: '✨', label: 'Your next big thing' },
]

export default function EventBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center gap-6 overflow-x-auto border-b py-4">
        <div className="shrink-0 border-r pr-6">
          <p className="label leading-tight">For all the things</p>
          <p className="label leading-tight font-bold text-(--accent)">Life has planned.</p>
        </div>
        {EVENTS.map((e) => (
          <button
            key={e.label}
            type="button"
            onClick={() => go('sign-in')}
            className="group flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-(--tile) hover:shadow-sm active:translate-y-0"
          >
            <span className="text-xl transition group-hover:scale-110">{e.icon}</span>
            <span className="muted transition group-hover:text-(--accent)">{e.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
