import PanelShell from '../shared/PanelShell'
import Dashboard from './pages/Dashboard'
import NewEvent from './pages/NewEvent'
import Plan from './pages/Plan'
import Tasks from './pages/Tasks'
import Marketplace from './pages/Marketplace'
import Bookings from './pages/Bookings'

// Every client page is registered here. Add a page = add one line.
const TABS = [
  { id: 'dashboard', label: 'Dashboard', Page: Dashboard },
  { id: 'new', label: 'New event', Page: NewEvent },
  { id: 'plan', label: 'Plan', Page: Plan },
  { id: 'tasks', label: 'Tasks', Page: Tasks },
  { id: 'marketplace', label: 'Marketplace', Page: Marketplace },
  { id: 'bookings', label: 'Bookings', Page: Bookings },
]

export default function ClientApp() {
  return <PanelShell role="Client" tabs={TABS} companion />
}
