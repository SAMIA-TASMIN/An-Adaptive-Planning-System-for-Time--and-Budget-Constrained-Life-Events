import Img from './Img'

// THE initial card. Every other card in the site (package, event, review...) is built from this one.
// Fill only the parts you need: image, title, subtitle, tag, children (body), footer.
export default function BaseCard({ image, emoji, alt = '', title, subtitle, tag, footer, children, className = '', imageClass = 'h-40 w-full text-3xl' }) {
  return (
    <article className={`group overflow-hidden rounded-2xl border bg-(--card) shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${className}`}>
      {(image || emoji) && <div className="overflow-hidden"><Img src={image} emoji={emoji} alt={alt} className={imageClass} /></div>}
      <div className="p-4">
        {(title || tag) && (
          <div className="flex items-start justify-between gap-2">
            <div>
              {title && <h3 className="font-bold">{title}</h3>}
              {subtitle && <p className="muted text-xs">{subtitle}</p>}
            </div>
            {tag}
          </div>
        )}
        {children}
        {footer && <div className="mt-3 flex items-center justify-between gap-2">{footer}</div>}
      </div>
    </article>
  )
}
