import { useSyncExternalStore } from 'react'
// Tiny in-app router. The address bar never changes; the back button still works.
// Routes: home, marketplace, sign-in, client, vendor, admin
let route = 'home'
const subs = new Set()
const emit = () => subs.forEach((f) => f())
history.replaceState({ route }, '')
window.addEventListener('popstate', (e) => {
  route = (e.state && e.state.route) || 'home'
  emit()
})
export function go(next) {
  if (next === route) return
  route = next
  history.pushState({ route }, '')
  emit()
  window.scrollTo(0, 0)
}
export const useRoute = () =>
  useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => route,
  )
