import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Btn, Card, field } from '../vendor/ui'
import { go } from '../router'
import Img from '../shared/Img'
import type { Role, Session } from '../types'
import { api, saveSession } from '../api/client'

interface RoleTile { name: string; role: Role; to: string; text: string; img?: string }
const ROLES: RoleTile[] = [
  { name: 'Client', role: 'client', to: 'client', text: 'Plan events and hire help.' },
  { name: 'Provider', role: 'provider', to: 'vendor', text: 'Sell ready-made packages.', img: '/images/vendors/flowers.jpg' },
  { name: 'Admin', role: 'admin', to: 'admin', text: 'Review requests and plans.' },
]

export default function SignIn() {
  const [role, setRole] = useState(ROLES[0])
  const [mode, setMode] = useState('login') // login | register
  const [f, setF] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k: keyof typeof f) => (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const register = mode === 'register' && role.role !== 'admin' // admins are created by the team, not self-registered

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setBusy(true)
    try {
      const body = register ? { ...f, role: role.role } : { email: f.email, password: f.password }
      const data = await api<Session>(register ? '/auth/register' : '/auth/login', { method: 'POST', body })
      if (data.user.role !== role.role) throw new Error(`This is a ${data.user.role} account. Pick the ${data.user.role} tile.`)
      saveSession(data)
      go(role.to)
    } catch (e2) { setErr(e2 instanceof Error ? e2.message : 'Something went wrong') } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Card className="grid gap-8 p-8 md:grid-cols-2">
        <form onSubmit={submit} className="space-y-3">
          <h1 className="text-2xl font-extrabold tracking-tight">{register ? 'Create your account' : 'Welcome back'}</h1>
          {register && <input className={field} placeholder="Full name" value={f.name} onChange={set('name')} required />}
          <input className={field} type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
          <input className={field} type="password" placeholder="Password (6+ characters)" value={f.password} onChange={set('password')} required />
          {err && <p className="rounded-lg bg-[#fde4ea] p-3 text-xs text-[#a13348]">{err}</p>}
          <Btn type="submit" disabled={busy} className="w-full">{busy ? 'Please wait...' : `${register ? 'Sign up' : 'Sign in'} as ${role.name}`}</Btn>
          {role.role !== 'admin' && (
            <p className="muted text-xs">
              {register ? 'Already have an account?' : 'New here?'}{' '}
              <a href="#" onClick={(e) => { e.preventDefault(); setMode(register ? 'login' : 'register'); setErr('') }} className="text-(--accent)">{register ? 'Sign in' : 'Create an account'}</a>
            </p>
          )}
        </form>
        <div className="space-y-3">
          {ROLES.map((r) => (
            <button key={r.name} onClick={() => { setRole(r); setErr('') }} aria-pressed={role.name === r.name}
              className={`w-full rounded-xl border p-3 text-left transition ${role.name === r.name ? 'bg-(--bubble)' : 'hover:bg-(--tile)'}`}>
              <div className="flex items-center gap-3">{r.img && <Img src={r.img} alt="" className="h-10 w-14 shrink-0 rounded-md" />}<div><p className="text-sm font-bold">{r.name}</p><p className="muted text-xs">{r.text}</p></div></div>
            </button>
          ))}
          <div className="rounded-xl border border-dashed p-3"><p className="text-sm font-bold">Planning companion</p><p className="muted text-xs">Built into the Client panel, no separate login.</p></div>
        </div>
      </Card>
    </div>
  )
}
