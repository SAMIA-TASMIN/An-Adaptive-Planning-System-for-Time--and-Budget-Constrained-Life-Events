import { useEffect, useState } from 'react'
import { Title } from '../vendor/ui'
import PackageCard from './PackageCard'
import Status from './Status'
import useFetch from '../api/useFetch'
import { getPackages } from '../api/packages'
import { getCategory, setCategory } from './filter'

const CHIPS = ['All', 'Parties', 'Moving', 'Trips']

// Used by the public site ("Sign in to hire") and the client panel ("Hire"). Data comes from the backend.
export default function Marketplace({ cta = 'Sign in to hire', wrap = true }: { cta?: string; wrap?: boolean }) {
  const [c, setC] = useState(getCategory) // the "What we plan" buttons on the home page can open it filtered
  useEffect(() => setCategory('All'), [])
  const { data, loading, error } = useFetch(() => getPackages(c), [c])
  const list = data || []
  const body = (
    <>
      <Title title="Marketplace" sub="Ready-made services from verified providers." />
      <div className="mb-5 flex flex-wrap gap-2">
        {CHIPS.map((x) => (
          <button key={x} onClick={() => setC(x)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${c === x ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}>{x}</button>
        ))}
      </div>
      <Status loading={loading} error={error} empty={!loading && !error && list.length === 0} emptyText="No packages yet. Run the demo seed." />
      {!loading && !error && list.length > 0 && (
        <>
          <p className="muted mb-3 text-sm">{list.length} packages</p>
          <div key={c} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 80}ms` }}><PackageCard p={p} cta={cta} /></div>)}
          </div>
        </>
      )}
    </>
  )
  return wrap ? <div className="mx-auto max-w-7xl px-6 py-8">{body}</div> : body
}
