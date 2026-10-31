import PanelShell from '../shared/PanelShell'
import Overview from './pages/Overview'
import Approvals from './pages/Approvals'
import Packages from './pages/Packages'
import Providers from './pages/Providers'
import Bookings from './pages/Bookings'
import Payments from './pages/Payments'
// Every admin page is registered here. Add a page = add one line.
const TABS = [
  { id: 'overview', label: 'Overview', Page: Overview },
  { id: 'approvals', label: 'Plan approvals', Page: Approvals },
  { id: 'packages', label: 'Packages', Page: Packages },
  { id: 'providers', label: 'Providers', Page: Providers },
  { id: 'bookings', label: 'Bookings', Page: Bookings },
  { id: 'payments', label: 'Payments', Page: Payments },
]
export default function AdminApp() {
  return <PanelShell role="Admin" tabs={TABS} />
}
