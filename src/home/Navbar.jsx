import { useState } from 'react'
import { ArrowRight, Menu, Moon, Sun, X } from 'lucide-react'
import LogoMark from './Logo'
import { go } from '../router'

function open(label) {
  if (label === 'How it works') {
    go('home')
    setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 60)
  } else if (label === 'For providers') go('sign-in')
  else go(label.toLowerCase())
}

export const NAV = ['Home', 'Marketplace', 'How it works', 'For providers']

function NavLink({ label, active, onClick }) {
  return (
    <a href="#" onClick={(e) => { e.preventDefault(); open(label); onClick() }}
       className={`relative inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${active ? '' : 'muted hover:opacity-80'}`}>
      {label}
      {active && <span className="absolute -bottom-3.5 left-1/2 h-0.75 w-6 -translate-x-1/2 rounded-full bg-(--primary)" />}
    </a>
  )
}

export default function Navbar({ active, setActive, dark, toggleDark }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="border-b bg-(--card)">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <a href="#" className="flex items-center gap-2.5" onClick={(e) => { e.preventDefault(); go('home') }}>
          <LogoMark />
          <span className="text-2xl font-extrabold tracking-tight">Planly<span className="text-(--gold)">.</span></span>
        </a>

        <nav className="hidden items-center gap-7 text-sm md:flex" aria-label="Main">
          {NAV.map((l) => <NavLink key={l} label={l} active={active === l} onClick={() => setActive(l)} />)}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleDark} className="muted flex items-center gap-2 text-sm font-medium hover:opacity-80" aria-label="Toggle night mode">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{dark ? 'Day' : 'Night'}</span>
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); go('sign-in') }} className="hidden items-center gap-2 rounded-xl border bg-(--card) px-4 py-2 text-sm font-semibold shadow-sm transition sm:inline-flex">
            Sign in 
          </a>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-4 border-t px-6 py-4 md:hidden" aria-label="Mobile">
          {NAV.map((l) => <NavLink key={l} label={l} active={active === l} onClick={() => { setActive(l); setOpen(false) }} />)}
          <a href="#" onClick={(e) => { e.preventDefault(); go('sign-in') }} className="font-semibold">Sign in</a>
        </nav>
      )}
    </header>
  )
}
