import { useEffect, useState } from 'react'
// Runs a request and gives { data, error, loading }. Re-runs when deps change.
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    let off = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => {
        if (!off) setState({ data, error: null, loading: false })
      })
      .catch((error) => {
        if (!off) setState({ data: null, error, loading: false })
      })
    return () => {
      off = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}
