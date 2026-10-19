import PackageCard from '../shared/PackageCard'
import { PACKAGES } from '../shared/data'

export default function PopularPackages() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight">Popular packages</h2>
      <div className="grid gap-5 md:grid-cols-3">{PACKAGES.slice(0, 3).map((p) => <PackageCard key={p.id} p={p} cta="Sign in to hire" />)}</div>
    </section>
  )
}
