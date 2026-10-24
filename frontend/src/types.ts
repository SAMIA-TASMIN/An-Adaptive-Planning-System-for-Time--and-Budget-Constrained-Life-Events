// Shared types for the whole frontend. Components import what they need from here.
export type Role = 'client' | 'provider' | 'admin'
export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'lilac'

export interface User { id: string; name: string; email: string; role: Role; status: string }
export interface Session { token: string; user: User }

// A package as the cards show it (the API reply is converted to this in api/packages.ts)
export interface PackageItem {
  id: string | number
  title: string
  by: string
  dur?: string
  rating: number
  price: number
  cat: string
  img?: string
  icon?: string
}
export interface ClientReview { id: number; name: string; stars: number; text: string }

export interface EventItem { id: number; icon: string; title: string; img?: string; left: string; progress: number; status: string; tone: Tone }
export type Priority = 'Must' | 'Should' | 'Nice'
export type Column = 'To do' | 'In progress' | 'Done'
export interface TaskItem { id: number; t: string; pri: Priority; owner: string; due: string; col: Column; done: boolean }
export interface BookingItem { id: string | number; pack?: string; by?: string; img?: string; progress: number; status?: string }

// Vendor (provider) panel
export type JobStatus = 'Accepted' | 'In progress' | 'Delivered'
export type DayState = 'open' | 'off' | 'booked'
export interface VendorRequest { id: number; client: string; pack: string; date: string; budget: number; place: string }
export interface VendorJob { id: number; client: string; pack: string; status: JobStatus; progress: number; price: number }
export interface VendorPackage { id: number; icon: string; img?: string; title: string; price: number; duration: string; bookings: number; active: boolean; approved: boolean }
export interface VendorReview { id: number; name: string; stars: number; pack: string; text: string }
export interface VendorProfile { name: string; category: string; area: string; phone: string; about: string }
