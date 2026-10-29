import { go } from '../router'
import { setCategory } from '../shared/filter'

// [label shown, marketplace category it opens]
const EVENTS: [string, string][] = [
  ['Moving home', 'Moving'], ['Birthday parties', 'Parties'], ['Road trips', 'Trips'],
  ['Farewells', 'Parties'], ['Celebrations', 'Parties'], ['Something else', 'All'],
]

export default function EventBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center gap-3 overflow-x-auto border-y py-4">
        <p className="label mr-3 shrink-0">What we plan:</p>
        {EVENTS.map(([label, category]) => (
          <button key={label} onClick={() => { setCategory(category); go('marketplace') }}
            className="shrink-0 rounded-full border bg-(--card) px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-(--tile) hover:shadow-sm active:translate-y-0">{label}</button>
        ))}
      </div>
    </section>
  )
}
