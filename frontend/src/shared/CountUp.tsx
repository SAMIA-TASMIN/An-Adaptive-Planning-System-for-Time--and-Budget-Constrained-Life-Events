import { useEffect, useRef, useState } from 'react'

// Counts up to the number in text ("2,000+", "12 hours") when scrolled into view.
export default function CountUp({ text }: { text: string }) {
  const [, num = '', rest = ''] = text.match(/^([\d,]+)(.*)$/) ?? []
  const target = Number((num || '0').replace(/,/g, ''))
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !num) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400)
        setN(Math.round(target * (1 - (1 - p) ** 3)))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [num, target])
  return <span ref={ref}>{num ? n.toLocaleString('en-US') + rest : text}</span>
}
