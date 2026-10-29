import type { PackageItem } from '../types'
import { api } from './client'

// What the backend sends for one package.
interface ApiPackage { _id: string; title: string; provider?: { name?: string }; duration?: string; rating: number; price: number; category: string; image?: string }

// Turns what the backend sends into the shape the cards already use.
const ICON: Record<string, string> = { Parties: '🎉', Moving: '📦', Trips: '🚗', Other: '✨' }
export const toCard = (p: ApiPackage): PackageItem => ({ id: p._id, title: p.title, by: p.provider?.name || 'Provider', dur: p.duration, rating: p.rating, price: p.price, cat: p.category, img: p.image, icon: ICON[p.category] })

export const getPackages = async (category = 'All'): Promise<PackageItem[]> =>
  (await api<{ items: ApiPackage[] }>(`/public/packages?category=${category}&limit=50`)).items.map(toCard)
