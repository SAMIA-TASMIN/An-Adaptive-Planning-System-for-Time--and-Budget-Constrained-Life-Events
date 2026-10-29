// Loading / error / empty messages shared by every page that fetches data.
export default function Status({ loading, error, empty, emptyText = 'Nothing here yet.' }: { loading: boolean; error: Error | null; empty: boolean; emptyText?: string }) {
  if (loading) return <p className="muted py-10 text-center text-sm">Loading...</p>
  if (error) return <p className="rounded-lg bg-[#fde4ea] p-4 text-sm text-[#a13348]">{error.message}</p>
  if (empty) return <p className="muted py-10 text-center text-sm">{emptyText}</p>
  return null
}
