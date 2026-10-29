import { api } from './client'
// Turns what the backend sends into the shape the cards already use.
const ICON = { Birthday: '🎂', Farewell: '🎓', Other: '✨', Parties: '🎉', Moving: '📦', Trips: '🚗' }
export const toCard = (p) => ({
  id: p._id,
  title: p.title,
  by: p.provider?.name || 'Provider',
  dur: p.duration,
  rating: p.rating,
  price: p.price,
  cat: p.category,
  img: p.image,
  icon: ICON[p.category],
})
export const getPackages = async (category = 'All') => (await api(`/public/packages?category=${category}&limit=50`)).items.map(toCard)
