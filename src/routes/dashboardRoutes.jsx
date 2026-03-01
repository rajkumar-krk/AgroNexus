// Dashboard Routes Configuration
// Centralized routing for authenticated dashboard

export const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: 'Dashboard',
    icon: 'LayoutDashboard',
    description: 'System overview and key metrics'
  },
  {
    path: '/iot-monitoring',
    name: 'IoT Sensor Monitoring',
    component: 'IoTMonitoring',
    icon: 'Activity',
    description: 'Real-time sensor data and device status'
  },
  {
    path: '/cold-storage',
    name: 'Cold Storage Health',
    component: 'ColdStorage',
    icon: 'Snowflake',
    description: 'Storage unit monitoring and performance'
  },
  {
    path: '/shipment-gps',
    name: 'Live Shipment GPS',
    component: 'ShipmentGPS',
    icon: 'MapPin',
    description: 'Real-time shipment tracking'
  },
  {
    path: '/spoilage-detection',
    name: 'Spoilage Detection',
    component: 'SpoilageDetection',
    icon: 'FlaskConical',
    description: 'AI-powered spoilage risk analysis'
  },
  {
    path: '/traceability',
    name: 'QR Crop Traceability',
    component: 'Traceability',
    icon: 'QrCode',
    description: 'Complete supply chain traceability'
  },
  {
    path: '/cloud-alerts',
    name: 'Cloud Alerts & Logs',
    component: 'CloudAlerts',
    icon: 'Bell',
    description: 'Alerts, notifications, and system logs'
  },
  {
    path: '/storage-analytics',
    name: 'Storage Analytics',
    component: 'StorageAnalytics',
    icon: 'BarChart3',
    description: 'Performance analytics and insights'
  },
  {
    path: '/shelf-life',
    name: 'Shelf Life Predictor',
    component: 'ShelfLife',
    icon: 'Clock',
    description: 'AI-powered shelf life predictions'
  }
]

// Helper function to get route by path
export const getRouteByPath = (path) => {
  return dashboardRoutes.find(route => route.path === path)
}

// Helper function to get navigation items
export const getNavigationItems = () => {
  return dashboardRoutes.map(route => ({
    path: route.path,
    name: route.name,
    icon: route.icon,
    description: route.description
  }))
}
