export const EVENTS = [
  {
    id: 1,
    icon: '📦',
    title: 'Move to the new flat',
    img: '/images/packages/moving-crew.jpg',
    left: '21 days left',
    progress: 45,
    status: 'On track',
    tone: 'green',
  },
  {
    id: 2,
    icon: '🎓',
    title: 'Farewell party',
    img: '/images/packages/farewell.jpg',
    left: '9 days left',
    progress: 20,
    status: 'At risk',
    tone: 'amber',
  },
]
export const TASKS = [
  { id: 1, t: 'Declutter bedroom', pri: 'Must', owner: 'You', due: '15 Oct', col: 'Done', done: true },
  { id: 2, t: 'Buy boxes and tape', pri: 'Must', owner: 'Mahi', due: '17 Oct', col: 'In progress', done: false },
  { id: 3, t: 'Book moving crew', pri: 'Must', owner: 'You', due: '18 Oct', col: 'To do', done: false },
  { id: 4, t: 'Label kitchen boxes', pri: 'Should', owner: 'Nova', due: '20 Oct', col: 'To do', done: false },
  { id: 5, t: 'Plan a welcome dinner', pri: 'Nice', owner: 'You', due: '28 Oct', col: 'To do', done: false },
]
export const BOOKINGS = [
  { id: 1, pack: 'Moving crew, 2 rooms', by: 'SwiftMove', img: '/images/packages/moving-crew.jpg', progress: 40, status: 'In progress' },
  { id: 2, pack: 'Packing service', by: 'SwiftMove', img: '/images/packages/packing.jpg', progress: 10, status: 'Accepted' },
  { id: 3, pack: 'Farewell setup', by: 'PartyNest', img: '/images/packages/farewell.jpg', progress: 0, status: 'Requested' },
]
export const priTone = { Must: 'red', Should: 'amber', Nice: 'green' }
