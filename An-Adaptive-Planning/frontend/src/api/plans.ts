import { api } from './client'

// What the admin endpoints send back.
export interface PlanItem {
  _id: string
  event?: { title: string; type: string; budget: number; deadline?: string; guests?: number; notes?: string }
  phases: { name?: string; tasks: string[] }[]
  budgetEstimate?: number
  companionNotes?: string
  approvalStatus: string
  adminComment?: string
}
export interface Overview { requestsWaiting: number; plansToApprove: number; eventsInProgress: number; averageRating: number }

export const getOverview = () => api<Overview>('/admin/overview')
export const getPlanCounts = () => api<Record<string, number>>('/admin/plans/counts')
export const getPlans = async (status: string) => (await api<{ items: PlanItem[] }>(`/admin/plans?status=${status}&limit=50`)).items
export const decidePlan = (id: string, approve: boolean, comment: string) =>
  api(`/admin/plans/${id}/${approve ? 'approve' : 'reject'}`, { method: 'POST', body: { comment } })
