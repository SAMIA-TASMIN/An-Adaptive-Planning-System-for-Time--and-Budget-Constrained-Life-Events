import PackageCard from '../shared/PackageCard'
import Status from '../shared/Status'
import useFetch from '../api/useFetch'
import { getPackages } from '../api/packages'
export default function PopularPackages() {
  const { data, loading, error } = useFetch(() => getPackages('All'))
  const list = (data || []).slice(0, 3)
  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight">Popular packages</h2>
      <Status loading={loading} error={error} empty={!loading && !error && list.length === 0} emptyText="No packages yet." />
      <div className="grid gap-5 md:grid-cols-3">
        {list.map((p) => (
          <PackageCard key={p.id} p={p} cta="Sign in to hire" />
        ))}
      </div>
    </section>
  )
}
