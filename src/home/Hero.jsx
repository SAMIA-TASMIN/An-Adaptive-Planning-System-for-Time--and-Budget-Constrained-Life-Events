import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { go } from '../router'
import Bar from '../shared/Bar'

const WORDS = ['move', 'party', 'trip', 'farewell']
const TASKS = ['Find the new flat and sign the lease', 'Sort, pack and label by room', 'Book the moving crew', 'Change address with the bank']

export default function Hero() {
  const [w, setW] = useState(0)                      // rotating word
  const [shown, setShown] = useState(0)              // plan rows appear one by one
  const [done, setDone] = useState([true, true, false, false])

  useEffect(() => { const t = setInterval(() => setW((n) => (n + 1) % WORDS.length), 2400); return () => clearInterval(t) }, [])
  useEffect(() => {
    if (shown >= TASKS.length) return
    const t = setTimeout(() => setShown(shown + 1), 450)
    return () => clearTimeout(t)
  }, [shown])

  const count = done.filter(Boolean).length
  const toggle = (i) => setDone((d) => d.map((v, j) => (j === i ? !v : v)))

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-6 py-14">
      <div className="drift pointer-events-none absolute -left-24 -top-10 h-80 w-80 rounded-full bg-(--primary) opacity-15 blur-3xl" />
      <div className="drift pointer-events-none absolute -right-10 top-20 h-72 w-72 rounded-full bg-(--gold) opacity-20 blur-3xl [animation-delay:-6s]" />

      <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_.9fr]">
        <div>
          <h1 className="fade-up max-w-xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl">
            Plan your{' '}
            <span key={WORDS[w]} className="word-in relative inline-block text-(--primary)">
              {WORDS[w]}
              <span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-(--gold)" />
            </span>{' '}
            without the chaos.
          </h1>
          <p className="fade-up mt-6 max-w-md text-base leading-7 text-(--mute) [animation-delay:150ms]">
            Tell the planning companion what is coming up, your budget and your deadline. Our team reviews the plan before you see it, and you can hire verified providers for the hard parts.
          </p>
          <div className="fade-up mt-8 flex flex-wrap gap-3 [animation-delay:300ms]">
            <button onClick={() => go('sign-in')} className="rounded-lg bg-(--primary) px-6 py-3 text-sm font-semibold text-(--on-primary) shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0">Start planning</button>
            <button onClick={() => go('marketplace')} className="rounded-lg border bg-(--card) px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0">Browse packages</button>
          </div>
          <p className="muted fade-up mt-6 text-sm [animation-delay:450ms]">2,000+ events planned.</p>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <span className="float-a absolute -left-8 top-1/3 z-10 hidden rounded-lg border bg-(--card) px-3 py-2 text-xs font-semibold shadow-md sm:block">Crew booked for 18 Oct</span>
          <span className="float-b absolute -right-6 bottom-10 z-10 hidden rounded-lg border bg-(--card) px-3 py-2 text-xs font-semibold shadow-md sm:block">On budget</span>

          <div className="fade-up rounded-xl border bg-(--card) p-6 shadow-lg [animation-delay:200ms]">
            <p className="label">Your plan</p>
            <h2 className="mt-1 text-xl font-bold">Moving to a new flat</h2>
            <p className="muted text-sm">21 days left. Tap a task to tick it.</p>
            <ul className="mt-4 min-h-44 divide-y">
              {TASKS.slice(0, shown).map((t, i) => (
                <li key={t} className="plan-row">
                  <button onClick={() => toggle(i)} className="flex w-full items-center gap-3 py-3 text-left text-sm transition hover:bg-(--tile)">
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition ${done[i] ? 'scale-110 border-(--primary) bg-(--primary) text-(--on-primary)' : ''}`}>{done[i] && <Check size={13} />}</span>
                    <span className={`transition ${done[i] ? 'muted line-through' : 'font-medium'}`}>{t}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between text-sm"><span className="muted">{count} of {TASKS.length} done</span><span className="font-semibold">৳ {(count * 3750).toLocaleString('en-US')} of ৳ 20,000</span></div>
            <Bar value={(count / TASKS.length) * 100} className="mt-1.5" />
          </div>
          {shown >= TASKS.length && <span className="stamp-in absolute -right-3 -top-4 rounded-md border-2 border-(--stamp) bg-(--card) px-3 py-1.5 text-sm font-extrabold text-(--stamp)">Checked by our team</span>}
        </div>
      </div>
    </section>
  )
}
