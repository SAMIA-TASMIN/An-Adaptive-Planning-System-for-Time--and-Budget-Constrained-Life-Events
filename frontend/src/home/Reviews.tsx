import ReviewCard from '../shared/ReviewCard'
import { CLIENT_REVIEWS } from '../shared/data'

export default function Reviews() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 pt-4">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight">What clients say</h2>
      <div className="grid gap-5 md:grid-cols-3">{CLIENT_REVIEWS.map((r) => <ReviewCard key={r.id} r={r} />)}</div>
    </section>
  )
}
