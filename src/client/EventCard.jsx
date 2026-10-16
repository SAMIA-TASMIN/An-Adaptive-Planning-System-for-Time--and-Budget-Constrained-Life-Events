import { Badge } from '../vendor/ui'
import BaseCard from '../shared/BaseCard'
import Bar from '../shared/Bar'

// Event card = BaseCard + event data + progress bar.
export default function EventCard({ e }) {
  return (
    <BaseCard image={e.img} emoji={e.icon} alt={e.title} title={e.title} subtitle={e.left}
      tag={<Badge tone={e.tone}>{e.status}</Badge>} imageClass="h-32 w-full text-3xl">
      <Bar value={e.progress} className="mt-3" />
    </BaseCard>
  )
}
