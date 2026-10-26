import { useState } from 'react'

// Shows a real photo. If the file is missing or broken, shows the emoji tile instead.
export default function Img({ src, alt = '', emoji = '🖼️', className = '' }: { src?: string; alt?: string; emoji?: string; className?: string }) {
  const [bad, setBad] = useState(!src)
  if (bad) {
    return <div role="img" aria-label={alt} className={`grid place-items-center bg-(--tile) ${className}`}><span className="text-[1.6em] leading-none">{emoji}</span></div>
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover transition duration-500 group-hover:scale-105 ${className}`} />
}
