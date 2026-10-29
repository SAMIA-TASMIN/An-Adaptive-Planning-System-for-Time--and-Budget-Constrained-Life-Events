import PanelShell from '../shared/PanelShell'
import Overview from './pages/Overview'
import Approvals from './pages/Approvals'
// Every admin page is registered here. Add a page = add one line.
const TABS = [
  { id: 'overview', label: 'Overview', Page: Overview },
  { id: 'approvals', label: 'Plan approvals', Page: Approvals },
]
export default function AdminApp() {
  return <PanelShell role="Admin" tabs={TABS} />
}
