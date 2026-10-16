import { useState } from 'react'
import { Title } from '../vendor/ui'
import PackageCard from './PackageCard'
import { PACKAGES } from './data'

const CHIPS = ['All', 'Parties', 'Moving', 'Trips']

// Used by the public site ("Sign in to hire") and the client panel ("Hire").
export default function Marketplace({ cta = 'Sign in to hire', wrap = true }) {
  const [c, setC] = useState('All')
  const list = PACKAGES.filter((p) => c === 'All' || p.cat === c)
  const body = (
    <>
      <Title title="Marketplace" sub="Ready-made services from verified providers." />
      <div className="mb-5 flex flex-wrap gap-2">
        {CHIPS.map((x) => (
          <button key={x} onClick={() => setC(x)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${c === x ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}>{x}</button>
        ))}
      </div>
      <p className="muted mb-3 text-sm">{list.length} packages</p>
      <div key={c} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}><PackageCard p={p} cta={cta} /></div>)}
      </div>
    </>
  )
  return wrap ? <div className="mx-auto max-w-7xl px-6 py-8">{body}</div> : body
}
