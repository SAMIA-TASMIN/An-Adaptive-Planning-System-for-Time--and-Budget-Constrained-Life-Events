export const paginate = ({ page = 1, limit = 20 }: { page?: unknown; limit?: unknown } = {}) => {
  const p = Math.max(1, Number(page) || 1)
  const l = Math.min(100, Math.max(1, Number(limit) || 20))
  return { page: p, limit: l, skip: (p - 1) * l }
}
