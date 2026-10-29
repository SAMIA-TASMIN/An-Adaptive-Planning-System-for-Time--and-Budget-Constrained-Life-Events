import { api } from './client'
export const getOverview = () => api('/admin/overview')
export const getPlanCounts = () => api('/admin/plans/counts')
export const getPlans = async (status) => (await api(`/admin/plans?status=${status}&limit=50`)).items
export const decidePlan = (id, approve, comment) =>
  api(`/admin/plans/${id}/${approve ? 'approve' : 'reject'}`, { method: 'POST', body: { comment } })
