import { useState } from 'react'
import { Btn, Card, field } from '../vendor/ui'
import { go } from '../router'
import Img from '../shared/Img'

const ROLES = [
  { name: 'Client', to: 'client', text: 'Plan events and hire help.' },
  { name: 'Provider', to: 'vendor', text: 'Sell ready-made packages.', img: '/images/vendors/flowers.jpg' },
  { name: 'Admin', to: 'admin', text: 'Review requests and plans.' },
]

export default function SignIn() {
  const [role, setRole] = useState(ROLES[0])
  const submit = (e) => { e.preventDefault(); go(role.to) }
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card className="grid gap-8 p-8 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <input className={field} type="email" placeholder="Email" />
          <input className={field} type="password" placeholder="Password" />
          <Btn type="submit" className="w-full">Sign in as {role.name}</Btn>
          <p className="muted text-xs">New here? <a href="#" onClick={(e) => e.preventDefault()} className="text-(--accent)">Create an account</a> · <a href="#" onClick={(e) => e.preventDefault()} className="text-(--accent)">Forgot password?</a></p>
        </form>
        <div className="space-y-3">
          {ROLES.map((r) => (
            <button key={r.name} onClick={() => setRole(r)} aria-pressed={role.name === r.name}
              className={`w-full rounded-xl border p-3 text-left transition ${role.name === r.name ? 'bg-(--bubble)' : 'hover:bg-(--tile)'}`}>
              <div className="flex items-center gap-3">{r.img && <Img src={r.img} alt="" className="h-10 w-14 shrink-0 rounded-md" />}<div><p className="text-sm font-bold">{r.name}</p><p className="muted text-xs">{r.text}</p></div></div>
            </button>
          ))}
          <div className="rounded-xl border border-dashed p-3"><p className="text-sm font-bold">🤖 Planning companion</p><p className="muted text-xs">Built into the Client panel, no separate login.</p></div>
        </div>
      </Card>
    </div>
  )
}
