import { AppStateProvider } from './state/AppState'
import { Renderer } from './renderer/Renderer'
import { registry } from './renderer/registry'
import type { Spec } from './renderer/types'

const spec: Spec = {
  root: 'page',
  elements: {
    page: {
      type: 'Stack',
      props: { direction: 'horizontal', gap: 'lg', align: 'start' },
      children: ['sidebar', 'main'],
    },
    sidebar: {
      type: 'Sidebar',
      props: {
        items: [
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'analytics', label: 'Analytics' },
          { key: 'settings', label: 'Settings' },
        ],
      },
    },
    main: {
      type: 'Stack',
      props: { direction: 'vertical', gap: 'md' },
      children: ['metrics', 'status'],
    },
    metrics: {
      type: 'Grid',
      props: { columns: 3, gap: 'md' },
      children: ['metricRevenue', 'metricUsers', 'metricConversion'],
    },
    metricRevenue: {
      type: 'MetricCard',
      props: { label: 'Revenue', stateKey: 'revenue' },
    },
    metricUsers: {
      type: 'MetricCard',
      props: { label: 'Active Users', stateKey: 'activeUsers' },
    },
    metricConversion: {
      type: 'MetricCard',
      props: { label: 'Conversion', stateKey: 'conversion' },
    },
    status: {
      type: 'StatusBadge',
      props: { label: 'System Status', stateKey: 'systemStatus' },
    },
  },
}

function App() {
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <Renderer spec={spec} registry={registry} />
      </div>
    </AppStateProvider>
  )
}

export default App
