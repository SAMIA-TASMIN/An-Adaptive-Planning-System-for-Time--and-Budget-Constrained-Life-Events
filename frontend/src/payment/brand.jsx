// The two wallets people can pay with. Plain coloured badges, no logo files needed.
export const WALLETS = {
  bkash: { id: 'bkash', name: 'bKash', color: '#E2136E', pin: 5, tip: 'Dial *247# or open the bKash app' },
  nagad: { id: 'nagad', name: 'Nagad', color: '#F26522', pin: 4, tip: 'Dial *167# or open the Nagad app' },
}

export function WalletBadge({ id, size = 'md' }) {
  const w = WALLETS[id]
  if (!w) return null
  const look = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm'
  return (
    <span className={`inline-block rounded-md font-extrabold tracking-tight text-white ${look}`} style={{ background: w.color }}>
      {w.name}
    </span>
  )
}

export const when = (d) =>
  new Date(d).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
