import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import useTheme from './useTheme'
import Navbar from './home/Navbar'
import { useRoute } from './router'
import Hero from './home/Hero'
import EventBand from './home/EventBand'
import SeeItInAction from './home/SeeItInAction'
import StatsBand from './home/StatsBand'
import PopularPackages from './home/PopularPackages'
import Reviews from './home/Reviews'
import Footer from './home/Footer'
import Reveal from './shared/Reveal'
import SignIn from './home/SignIn'
import Marketplace from './shared/Marketplace'
import VendorApp from './vendor/VendorApp.jsx'
import ClientApp from './client/ClientApp.jsx'
import AdminApp from './admin/AdminApp.jsx'

// The homepage, top to bottom. Reorder, add or remove a line to change the page.
const HOME_SECTIONS = [Hero, EventBand, SeeItInAction, StatsBand, PopularPackages, Reviews, Footer]

// Role panels, opened from the Sign in page (no separate addresses).
const PANELS = { vendor: VendorApp, client: ClientApp, admin: AdminApp }

// Shows a readable message on the page if a component crashes, instead of a blank screen.
class Guard extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <pre style={{ whiteSpace: 'pre-wrap', margin: 16, padding: 16, background: '#fde4ea', color: '#7a1f35', borderRadius: 12 }}>
          {String(this.state.error.stack || this.state.error)}
        </pre>
      )
    }
    return this.props.children
  }
}

function PublicSite({ route }) {
  const [dark, toggle] = useTheme()
  const active = route === 'marketplace' ? 'Marketplace' : route === 'home' ? 'Home' : ''
  let page = HOME_SECTIONS.map((S, i) => (i === 0 ? <S key={i} /> : <Reveal key={i}><S /></Reveal>))
  if (route === 'marketplace') page = <Marketplace />
  if (route === 'sign-in') page = <SignIn />
  return (
    <div className="min-h-screen">
      <Navbar active={active} setActive={() => { }} dark={dark} toggleDark={toggle} />
      <main id="home" key={route} className="page-in">{page}</main>
    </div>
  )
}

function Root() {
  const route = useRoute()
  const Panel = PANELS[route]
  return Panel ? <Panel /> : <PublicSite route={route} />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Guard>
      <Root />
    </Guard>
  </StrictMode>,
)
