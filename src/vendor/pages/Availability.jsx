import { Card, Title } from '../ui'

const START = new Date(2026, 9, 15)
const days = Array.from({ length: 14 }, (_, i) => new Date(START.getFullYear(), START.getMonth(), START.getDate() + i))
const look = { open: 'border-[#8fd1b4] bg-[#e6f6ee] text-[#2f7f5c]', off: 'bg-(--tile) muted', booked: 'border-(--primary) bg-(--bubble) text-(--accent)' }
const word = { open: 'Open', off: 'Day off', booked: 'Booked' }

export default function Availability({ s }) {
  const flip = (i) => s.setAvail(s.avail.map((v, j) => (j !== i || v === 'booked' ? v : v === 'open' ? 'off' : 'open')))
  return (
    <>
      <Title title="Availability" sub="Tap a day to switch between open and day off. Booked days are set by your jobs." />
      <Card>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {days.map((d, i) => (
            <button key={i} onClick={() => flip(i)} className={`rounded-xl border p-3 text-left transition ${look[s.avail[i]]}`}>
              <span className="block text-[11px] font-semibold uppercase tracking-wider">{d.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
              <span className="block text-lg font-bold">{d.getDate()}</span>
              <span className="text-xs">{word[s.avail[i]]}</span>
            </button>
          ))}
        </div>
      </Card>
    </>
  )
}
