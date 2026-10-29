import { useEffect, useState } from 'react'

// Shared day/night switch for every panel.
export default function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('planly-theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('planly-theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, () => setDark((d) => !d)] as const
}
