import type { ClientReview } from '../types'
import BaseCard from './BaseCard'

// Review card = BaseCard with no image, plus stars and text.
export default function ReviewCard({ r }: { r: ClientReview }) {
  return (
    <BaseCard title={r.name} className="p-1">
      <p className="mt-1 text-(--gold)">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
      <p className="mt-2 text-sm leading-6">{r.text}</p>
    </BaseCard>
  )
}
