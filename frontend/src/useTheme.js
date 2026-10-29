import { useEffect, useState } from 'react'
// Shared day/night switch for every panel.
export default function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('adaptive-planning-theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('adaptive-planning-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, () => setDark((d) => !d)]
}
