import { useEffect, useState } from 'react'

interface FetchState<T> { data: T | null; error: Error | null; loading: boolean }

// Runs a request and gives { data, error, loading }. Re-runs when deps change.
export default function useFetch<T>(fn: () => Promise<T>, deps: readonly unknown[] = []): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, error: null, loading: true })
  useEffect(() => {
    let off = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fn().then((data) => { if (!off) setState({ data, error: null, loading: false }) })
      .catch((error: Error) => { if (!off) setState({ data: null, error, loading: false }) })
    return () => { off = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
