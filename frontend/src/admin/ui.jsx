import { Btn } from '../vendor/ui'
// Small pieces shared by the admin pages.

// Round filter buttons. items = [[value, label, count?]]
export function Chips({ items, value, onChange }) {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {items.map(([v, label, n]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${value === v ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}
        >
          {label}
          {n !== undefined && ` (${n})`}
        </button>
      ))}
    </div>
  )
}

// Previous / Next for a paginated list: data = { page, limit, total }
export function Pager({ data, onPage }) {
  if (!data || data.total <= data.limit) return null
  const pages = Math.ceil(data.total / data.limit)
  return (
    <div className="mt-4 flex items-center justify-end gap-3 text-sm">
      <span className="muted">
        Page {data.page} of {pages} · {data.total} in total
      </span>
      <Btn variant="ghost" disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>
        Previous
      </Btn>
      <Btn variant="ghost" disabled={data.page >= pages} onClick={() => onPage(data.page + 1)}>
        Next
      </Btn>
    </div>
  )
}

export const date = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')

export const PAY_LABEL = {
  unpaid: ['red', 'Unpaid'],
  partial: ['amber', 'Part paid'],
  paid: ['green', 'Paid in full'],
  refund_pending: ['red', 'Refund pending'],
  refunded: ['green', 'Refunded'],
}
export const BOOKING_LABEL = {
  requested: ['lilac', 'Requested'],
  accepted: ['blue', 'Accepted'],
  in_progress: ['amber', 'In progress'],
  delivered: ['green', 'Delivered'],
  declined: ['red', 'Declined'],
}
export const ACCOUNT_TONE = { active: 'green', pending: 'amber', suspended: 'red', rejected: 'red' }
