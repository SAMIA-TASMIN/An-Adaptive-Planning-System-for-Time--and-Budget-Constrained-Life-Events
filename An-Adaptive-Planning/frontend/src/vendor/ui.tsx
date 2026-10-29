import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { Tone } from '../types'

// Small shared pieces used by every vendor page.
export const taka = (n: number) => '৳ ' + n.toLocaleString()

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl border bg-(--card) p-5 shadow-sm ${className}`}>{children}</div>
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'solid' | 'ghost' }

export function Btn({ variant = 'solid', className = '', ...rest }: BtnProps) {
  const look = variant === 'solid'
    ? 'bg-(--primary) text-(--on-primary)'
    : 'border bg-(--card) hover:bg-(--tile)'
  return <button className={`rounded-xl px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-95 disabled:pointer-events-none disabled:opacity-60 ${look} ${className}`} {...rest} />
}

const TONES: Record<Tone, string> = {
  blue: 'bg-(--bubble) text-(--accent)', green: 'bg-[#e6f6ee] text-[#2f7f5c]',
  amber: 'bg-[#fff0d9] text-[#9a6118]', red: 'bg-[#fde4ea] text-[#b23a55]', lilac: 'bg-(--tile) text-(--ink)',
}
export function Badge({ tone = 'blue', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${TONES[tone]}`}>{children}</span>
}
export const statusTone: Record<string, Tone> = { Accepted: 'blue', 'In progress': 'amber', Delivered: 'green' }

export function Title({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {sub && <p className="muted mt-1 text-sm">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

export function Stat({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <Card>
      <p className="label">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
      {note && <p className="muted mt-1 text-xs">{note}</p>}
    </Card>
  )
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-[#8fd1b4]' : 'bg-[#d9d7ea]'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-5.5' : 'left-0.5'}`} />
    </button>
  )
}

export const field = 'w-full rounded-xl border bg-(--page) px-3 py-2 text-sm outline-none focus:border-(--primary)'
