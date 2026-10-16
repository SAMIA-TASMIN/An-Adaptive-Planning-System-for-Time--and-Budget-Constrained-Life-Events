import { useEffect, useState } from 'react'

// Progress bar that fills from 0 when it appears and whenever the value changes.
export default function Bar({ value, className = '' }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(value), 80); return () => clearTimeout(t) }, [value])
  return (
    <div className={`h-1.5 rounded-full bg-(--tile) ${className}`}>
      <div className="h-full rounded-full bg-(--primary) transition-[width] duration-1000 ease-out" style={{ width: `${w}%` }} />
    </div>
  )
}
