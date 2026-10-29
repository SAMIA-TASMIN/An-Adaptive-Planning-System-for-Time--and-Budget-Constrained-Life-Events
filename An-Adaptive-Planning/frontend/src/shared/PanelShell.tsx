import { useState, type ComponentType } from 'react'
import { LogOut, Moon, Sun, X } from 'lucide-react'
import useTheme from '../useTheme'
import { go } from '../router'
import { logout } from '../api/client'
import { Badge, Btn } from '../vendor/ui'

// What the companion bubble can take the client to: [button label, tab id]
const HELP: [string, string][] = [['Plan a new event', 'new'], ['See my plan', 'plan'], ['Check my tasks', 'tasks'], ['Find help', 'marketplace']]

export interface PanelTab { id: string; label: string; Page: ComponentType<{ go: (id: string) => void }> }

// Top bar + tabs used by the Client and Admin panels. tabs = [{ id, label, Page }]
export default function PanelShell({ role, tabs, companion }: { role: string; tabs: PanelTab[]; companion?: boolean }) {
  const [page, setPage] = useState(tabs[0].id)
  const [dark, toggle] = useTheme()
  const [chat, setChat] = useState(false)
  const { Page } = tabs.find((t) => t.id === page)!
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b bg-(--card)">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
          <a href="#" onClick={(e) => { e.preventDefault(); go('home') }} className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">Planly<span className="text-(--gold)">.</span><Badge tone="lilac">{role}</Badge></a>
          <nav aria-label={`${role} menu`} className="flex flex-1 gap-1 overflow-x-auto">
            {tabs.map(({ id, label }) => (
              <button key={id} onClick={() => setPage(id)} aria-current={page === id ? 'page' : undefined}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition ${page === id ? 'bg-(--bubble) text-(--accent)' : 'muted hover:bg-(--tile)'}`}>{label}</button>
            ))}
          </nav>
          <button onClick={toggle} className="muted flex items-center gap-1.5 text-sm font-medium" aria-label="Toggle night mode">
            {dark ? <Sun size={16} /> : <Moon size={16} />}<span className="hidden sm:inline">{dark ? 'Day' : 'Night'}</span>
          </button>
          <a href="#" onClick={(e) => { e.preventDefault(); logout(); go('sign-in') }} className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-semibold"><LogOut size={14} />Sign out</a>
        </div>
      </header>
      <main key={page} className="page-in mx-auto max-w-6xl px-6 py-8"><Page go={setPage} /></main>

      {companion && (
        <>
          {chat && (
            <div className="fixed bottom-24 right-6 z-20 w-72 rounded-2xl border bg-(--card) p-4 shadow-lg">
              <div className="mb-2 flex items-center justify-between"><p className="font-bold">Your companion</p><button onClick={() => setChat(false)} aria-label="Close"><X size={16} /></button></div>
              <p className="muted mb-3 text-xs">Hi! What should we sort out today?</p>
              <div className="flex flex-wrap gap-2">{HELP.map(([label, to]) => <Btn key={label} variant="ghost" onClick={() => { setChat(false); setPage(to) }}>{label}</Btn>)}</div>
            </div>
          )}
          <button onClick={() => setChat(!chat)} aria-label="Open companion"
            className="fixed bottom-6 right-6 z-20 grid h-14 w-14 place-items-center rounded-full bg-(--primary) text-sm font-bold text-(--on-primary) shadow-lg">Ask</button>
        </>
      )}
    </div>
  )
}
