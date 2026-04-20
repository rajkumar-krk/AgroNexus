import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp } from '../animations/fadeInUp'
import { createStaggerContainer } from '../animations/staggerContainer'
import { SectionCard } from '../components/widgets'
import { useBatch } from '../context/BatchContext'
import { useApp } from '../context/AppContext'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings,
  Shield,
  Bell,
  Database,
  HelpCircle,
  LogOut,
  Edit2,
  Camera,
  Download,
  Upload,
  Key,
  Smartphone,
  Globe,
  Lock,
  CreditCard,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react'

const container = createStaggerContainer(0.08)

export function Profile() {
  const { batches, stats } = useBatch()
  const { user } = useApp()
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSecurity, setShowSecurity] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Temperature Alert', message: 'Tomatoes batch temperature exceeded 6°C', time: '2 hours ago', read: false },
    { id: 2, type: 'info', title: 'Shipment Delivered', message: 'Banana batch arrived at destination', time: '5 hours ago', read: true },
    { id: 3, type: 'warning', title: 'Low Battery', message: 'Sensor CS-002 battery at 15%', time: '1 day ago', read: true }
  ])

  const [profileData, setProfileData] = useState({
    name: 'John Farmer',
    email: 'john.farmer@agronexus.com',
    phone: '+91 98765 43210',
    location: 'Pune, Maharashtra',
    role: 'Farm Manager',
    joinDate: 'March 2024',
    accountType: 'Premium',
    bio: 'Passionate about sustainable agriculture and cold chain management. Managing 4 farms with advanced IoT monitoring systems.',
    website: 'www.greenvalleyfarms.com',
    company: 'Green Valley Farms',
    experience: '8 years'
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsAlerts: false,
    sessionTimeout: '30min',
    ipWhitelist: false
  })

  const handleEditProfile = () => {
    setIsEditing(!isEditing)
  }

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationToggle = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const handleSecurityToggle = (setting) => {
    setSecuritySettings(prev => ({ 
      ...prev, 
      [setting]: !prev[setting] 
    }))
  }

  const exportData = () => {
    const data = {
      profile: profileData,
      batches: batches,
      stats: stats,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agronexus-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="space-y-6 pb-12"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <SectionCard
          title="Profile Settings"
          subtitle="Manage your account and preferences"
          icon={User}
          actions={
            <button
              onClick={handleEditProfile}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              {isEditing ? <Check size={16} /> : <Edit2 size={16} />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          }
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} />
                </button>
              </div>
              <div className="mt-3 text-center">
                <p className="font-medium">{profileData.name}</p>
                <p className="text-sm text-muted-foreground">{profileData.role}</p>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <User size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Mail size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.email}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.location}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) => handleProfileUpdate('company', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Database size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.company}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Experience</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.experience}
                      onChange={(e) => handleProfileUpdate('experience', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <Shield size={16} className="text-muted-foreground" />
                      <span className="font-medium">{profileData.experience}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {isEditing && (
                <div className="mt-4">
                  <label className="text-sm text-muted-foreground">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={3}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Statistics */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Your Farm Statistics"
          subtitle="Overview of your agricultural operations"
          icon={Database}
          actions={
            <button
              onClick={exportData}
              className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm"
            >
              <Download size={16} />
              Export Data
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Database size={20} className="text-primary" />
                </div>
                <h4 className="font-medium">Active Batches</h4>
              </div>
              <p className="text-2xl font-bold text-primary">{batches?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Currently monitoring</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Shield size={20} className="text-green-500" />
                </div>
                <h4 className="font-medium">Healthy Batches</h4>
              </div>
              <p className="text-2xl font-bold text-green-500">
                {batches?.filter(b => b.riskLevel === 'Low').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">No issues detected</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Bell size={20} className="text-orange-500" />
                </div>
                <h4 className="font-medium">Alerts</h4>
              </div>
              <p className="text-2xl font-bold text-orange-500">
                {batches?.filter(b => b.riskLevel === 'Medium' || b.riskLevel === 'High').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Require attention</p>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <h4 className="font-medium">Storage Units</h4>
              </div>
              <p className="text-2xl font-bold text-blue-500">
                {batches?.filter(b => b.status === 'In Storage').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">In storage</p>
            </div>
          </div>
        </SectionCard>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Settings & Preferences"
          subtitle="Configure your application settings"
          icon={Settings}
        >
          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b border-border">
            {['profile', 'notifications', 'security', 'data'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">English</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Smartphone size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">Mobile App</p>
                      <p className="text-sm text-muted-foreground">Download iOS/Android app</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-muted-foreground" />
                    <div>
                      <p className="font-medium">Subscription</p>
                      <p className="text-sm text-muted-foreground">{profileData.accountType} Plan</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'border-border bg-muted/20' : 'border-primary bg-primary/5'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'alert' ? 'bg-red-500' :
                          notification.type === 'warning' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{notification.title}</p>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => handleNotificationToggle(notification.id)}
                            className="text-xs text-primary hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Lock size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecurityToggle('twoFactorEnabled')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        securitySettings.twoFactorEnabled ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecurityToggle('emailNotifications')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        securitySettings.emailNotifications ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-muted-foreground">Get critical alerts via SMS</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSecurityToggle('smsAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        securitySettings.smsAlerts ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        securitySettings.smsAlerts ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={exportData}
                    className="p-4 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-3"
                  >
                    <Download size={20} className="text-primary" />
                    <div className="text-left">
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-muted-foreground">Download all your data</p>
                    </div>
                  </button>

                  <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-3">
                    <Upload size={20} className="text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium">Import Data</p>
                      <p className="text-sm text-muted-foreground">Upload backup data</p>
                    </div>
                  </button>

                  <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-3">
                    <Database size={20} className="text-green-500" />
                    <div className="text-left">
                      <p className="font-medium">Backup History</p>
                      <p className="text-sm text-muted-foreground">View previous backups</p>
                    </div>
                  </button>

                  <button className="p-4 rounded-lg border border-border hover:bg-muted transition-colors flex items-center gap-3">
                    <Key size={20} className="text-orange-500" />
                    <div className="text-left">
                      <p className="font-medium">API Keys</p>
                      <p className="text-sm text-muted-foreground">Manage API access</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      </motion.div>

      {/* Account Actions */}
      <motion.div variants={fadeInUp} viewport={{ once: true, margin: '-100px' }} initial="hidden" whileInView="visible">
        <SectionCard
          title="Account Actions"
          subtitle="Manage your account"
          icon={User}
        >
          <div className="space-y-3">
            <button className="w-full p-4 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              <div className="flex items-center justify-center gap-3">
                <LogOut size={20} />
                <span className="font-medium">Sign Out</span>
              </div>
            </button>
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  )
}
