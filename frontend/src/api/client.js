// The one request helper and session store. Every page talks to the backend through api().
const BASE = import.meta.env.VITE_API_URL || '/api'
export const getToken = () => localStorage.getItem('adaptive-planning-token')
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('adaptive-planning-user') ?? 'null')
  } catch {
    return null
  }
}
export const saveSession = ({ token, user }) => {
  localStorage.setItem('adaptive-planning-token', token)
  localStorage.setItem('adaptive-planning-user', JSON.stringify(user))
}
export const logout = () => {
  localStorage.removeItem('adaptive-planning-token')
  localStorage.removeItem('adaptive-planning-user')
}
export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  let res
  try {
    res = await fetch(BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }
  const json = await res.json().catch(() => null)
  if (!json) throw new Error('Cannot reach the server. Is the backend running?')
  if (!json.success) throw new Error(json.message || 'Request failed')
  return json.data
}
