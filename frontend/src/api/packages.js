import { api } from './client'
// Turns what the backend sends into the shape the cards already use.
const ICON = { Birthday: '🎂', Farewell: '🎓', Wedding: '💍', HomeDecor: '🏡', Moving: '📦', Trips: '🚗', Else: '✨' }
export const toCard = (p) => ({
  id: p._id,
  title: p.title,
  by: p.provider?.name || 'Provider',
  dur: p.duration,
  rating: p.rating,
  price: p.price,
  cat: p.category,
  img: p.image,
  icon: ICON[p.category] || '✨',
})
// event = All | Birthday | Farewell | Wedding | HomeDecor | Moving | Trips | Else
export const getPackages = async (event = 'All') => (await api(`/public/packages?event=${event}&limit=50`)).items.map(toCard)
