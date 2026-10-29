import type { Session, User } from '../types'

// The one request helper and session store. Every page talks to the backend through api().
const BASE = import.meta.env.VITE_API_URL || '/api'

export const getToken = (): string | null => localStorage.getItem('planly-token')
export const getUser = (): User | null => { try { return JSON.parse(localStorage.getItem('planly-user') ?? 'null') } catch { return null } }
export const saveSession = ({ token, user }: Session) => { localStorage.setItem('planly-token', token); localStorage.setItem('planly-user', JSON.stringify(user)) }
export const logout = () => { localStorage.removeItem('planly-token'); localStorage.removeItem('planly-user') }

interface ApiOptions { method?: string; body?: unknown }
interface ApiReply<T> { success: boolean; message?: string; data: T }

export async function api<T = unknown>(path: string, { method = 'GET', body }: ApiOptions = {}): Promise<T> {
  const token = getToken()
  let res: Response
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch { throw new Error('Cannot reach the server. Is the backend running?') }
  const json: ApiReply<T> | null = await res.json().catch(() => null)
  if (!json) throw new Error('Cannot reach the server. Is the backend running?')
  if (!json.success) throw new Error(json.message || 'Request failed')
  return json.data
}
