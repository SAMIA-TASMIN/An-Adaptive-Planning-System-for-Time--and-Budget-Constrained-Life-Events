import { go } from '../router'
import { setCategory } from '../shared/filter'
// [icon, label shown, marketplace category it opens]
const EVENTS = [
  ['🎂', 'Birthday parties', 'Birthday'],
  ['🎓', 'Farewells', 'Farewell'],
  ['💍', 'Weddings & proposals', 'Other'],
  ['🏡', 'Home decor', 'Other'],
  ['📦', 'Moving home', 'Other'],
  ['🚙', 'Trips & tours', 'Other'],
  ['✨', 'Something else', 'All'],
]
export default function EventBand() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="flex items-center gap-3 overflow-x-auto border-y py-4">
        <p className="label mr-3 shrink-0">What we plan:</p>
        {EVENTS.map(([icon, label, category]) => (
          <button
            key={label}
            onClick={() => {
              setCategory(category)
              go('marketplace')
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-(--card) px-4 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 hover:bg-(--tile) hover:shadow-sm active:translate-y-0"
          >
            <span aria-hidden="true" className="text-base leading-none">
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
