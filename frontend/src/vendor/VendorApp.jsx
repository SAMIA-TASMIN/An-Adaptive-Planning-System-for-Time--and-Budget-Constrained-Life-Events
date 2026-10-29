import { useEffect, useState } from 'react'
import { Briefcase, CalendarDays, Inbox, LayoutDashboard, LogOut, Moon, Package, Star, Sun, UserRound, Wallet } from 'lucide-react'
import useStore from './useStore'
import { go } from '../router'
import { logout } from '../api/client'
import Dashboard from './pages/Dashboard'
import Packages from './pages/Packages'
import Requests from './pages/Requests'
import Jobs from './pages/Jobs'
import Availability from './pages/Availability'
import Earnings from './pages/Earnings'
import Reviews from './pages/Reviews'
import Profile from './pages/Profile'
const TABS = [
  { id: 'home', label: 'Home', Icon: LayoutDashboard, Page: Dashboard },
  { id: 'packages', label: 'Packages', Icon: Package, Page: Packages },
  { id: 'requests', label: 'Requests', Icon: Inbox, Page: Requests },
  { id: 'jobs', label: 'Jobs', Icon: Briefcase, Page: Jobs },
  { id: 'availability', label: 'Availability', Icon: CalendarDays, Page: Availability },
  { id: 'earnings', label: 'Earnings', Icon: Wallet, Page: Earnings },
  { id: 'reviews', label: 'Reviews', Icon: Star, Page: Reviews },
  { id: 'profile', label: 'Profile', Icon: UserRound, Page: Profile },
]
export default function VendorApp() {
  const [page, setPage] = useState('home')
  const [dark, setDark] = useState(() => typeof localStorage !== 'undefined' && localStorage.getItem('adaptive-planning-theme') === 'dark')
  const s = useStore()
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('adaptive-planning-theme', dark ? 'dark' : 'light')
  }, [dark])
  const { Page } = TABS.find((t) => t.id === page)
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-(--card)">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              setPage('home')
            }}
            className="flex items-center gap-2 text-lg font-extrabold tracking-tight sm:text-xl"
          >
            An Adaptive Planning
            <span className="rounded-md bg-(--bubble) px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-(--accent)">
              Vendor
            </span>
          </a>
          <nav aria-label="Vendor menu" className="flex flex-1 gap-1 overflow-x-auto">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setPage(id)}
                aria-current={page === id ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${page === id ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}
              >
                <Icon size={15} />
                {label}
                {id === 'requests' && s.requests.length > 0 && (
                  <span className="rounded-full bg-(--primary) px-1.5 text-[10px] font-bold text-(--on-primary)">{s.requests.length}</span>
                )}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setDark(!dark)}
            className="muted flex items-center gap-1.5 text-sm font-medium"
            aria-label="Toggle night mode"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            <span className="hidden sm:inline">{dark ? 'Day' : 'Night'}</span>
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              logout()
              go('sign-in')
            }}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold"
          >
            <LogOut size={14} />
            Sign out
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Page s={s} go={setPage} />
      </main>
    </div>
  )
}
