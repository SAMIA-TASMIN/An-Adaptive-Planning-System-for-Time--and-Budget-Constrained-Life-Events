import { Star } from 'lucide-react'
import { Card, Title, Badge } from '../ui'

export default function Reviews({ s }) {
  const avg = (s.reviews.reduce((t, r) => t + r.stars, 0) / s.reviews.length).toFixed(1)
  return (
    <>
      <Title title="Reviews" sub="What clients say about your work."><Badge tone="green">{avg} average, {s.reviews.length} reviews</Badge></Title>
      <div className="grid gap-4 md:grid-cols-3">
        {s.reviews.map((r) => (
          <Card key={r.id}>
            <div className="flex gap-0.5 text-[#e0a93b]" aria-label={`${r.stars} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} fill={n <= r.stars ? 'currentColor' : 'none'} />)}
            </div>
            <p className="mt-3 text-sm">{r.text}</p>
            <p className="muted mt-3 text-xs">{r.name}, {r.pack}</p>
          </Card>
        ))}
      </div>
    </>
  )
}
