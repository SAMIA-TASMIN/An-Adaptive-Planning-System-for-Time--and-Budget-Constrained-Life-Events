import { api } from './client'
// The provider's own packages. A new or changed package waits for the admin (status: pending).
export const getMyPackages = async () => (await api('/provider/packages?limit=100')).items
export const createPackage = (data) => api('/provider/packages', { method: 'POST', body: data })
export const updatePackage = (id, data) => api(`/provider/packages/${id}`, { method: 'PATCH', body: data })
