import { useState } from 'react'
import { REQUESTS, JOBS, PACKAGES, REVIEWS, AVAIL, PROFILE } from './data'

// One place that holds the vendor's data, so every page stays in sync.
export default function useStore() {
  const [requests, setRequests] = useState(REQUESTS)
  const [jobs, setJobs] = useState(JOBS)
  const [packages, setPackages] = useState(PACKAGES)
  const [avail, setAvail] = useState(AVAIL)
  const [profile, setProfile] = useState(PROFILE)

  const accept = (id) => {
    const r = requests.find((x) => x.id === id)
    if (!r) return
    setRequests((rs) => rs.filter((x) => x.id !== id))
    setJobs((js) => [{ id: r.id, client: r.client, pack: r.pack, status: 'Accepted', progress: 10, price: r.budget }, ...js])
  }
  const decline = (id) => setRequests((rs) => rs.filter((x) => x.id !== id))
  const setStatus = (id, status) =>
    setJobs((js) => js.map((j) => j.id !== id ? j : {
      ...j, status, progress: status === 'Delivered' ? 100 : status === 'In progress' ? Math.max(j.progress, 50) : j.progress,
    }))

  return { requests, jobs, packages, setPackages, avail, setAvail, profile, setProfile, reviews: REVIEWS, accept, decline, setStatus }
}
