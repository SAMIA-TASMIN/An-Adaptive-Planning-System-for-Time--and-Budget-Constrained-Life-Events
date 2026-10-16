import { useEffect, useRef, useState } from 'react'

// Fades a section up the first time it scrolls into view.
export default function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out ${seen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>{children}</div>
  )
}
