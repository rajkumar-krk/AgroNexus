# AgroNexus - Cold Chain Management Platform

A comprehensive agricultural cold chain management system built with React, TypeScript, and modern web technologies. Monitor multiple crop batches in real-time with IoT sensors, storage analytics, and intelligent spoilage detection.

## 🌟 Features

### 📊 Multi-Batch Management
- **Dynamic Crop Tracking**: Manage multiple crop batches simultaneously (Tomatoes, Bananas, Mangoes, Leafy Greens)
- **Real-time Monitoring**: Live sensor data updates every 5 seconds
- **Batch Filtering**: Filter by individual crops or view all batches
- **Risk Assessment**: Automatic spoilage risk calculation (Low/Medium/High/Critical)

### 🌡️ IoT Sensor Monitoring
- **Temperature Tracking**: 2-8°C optimal range monitoring
- **Humidity Control**: 75-95% humidity level tracking
- **Gas Level Detection**: Ethylene and CO2 monitoring
- **Device Status**: Real-time sensor health and battery monitoring

### ❄️ Cold Storage Management
- **Storage Unit Health**: Monitor multiple storage units (CS-001, CS-002, REEFER units)
- **Environmental Control**: Optimal temperature and humidity maintenance
- **Capacity Management**: Storage utilization tracking
- **Alert System**: Warning notifications for optimal conditions

### 🚚 Shipment Tracking
- **GPS Monitoring**: Real-time shipment location tracking
- **Transit Conditions**: Environmental monitoring during transport
- **Delivery Status**: From farm to destination tracking
- **Route Optimization**: Efficient logistics planning

### 🔬 Spoilage Detection
- **AI-Powered Analysis**: Machine learning-based spoilage prediction
- **Risk Factors**: Temperature, humidity, gas level correlation
- **Early Warning System**: Proactive alerts for potential spoilage
- **Quality Metrics**: Shelf life estimation and quality scoring

### � Profile Management
- **In-Place Editing**: Edit profile information directly without page reloads
- **Tabbed Settings**: Organized preferences across Profile, Notifications, Security, and Data tabs
- **Real-time Updates**: Changes save immediately and reflect across the application
- **Profile Picture**: Upload and manage profile images with hover effects
- **Extended Fields**: Bio, company, experience, and website information
- **Export Functionality**: Download complete farm and batch data as JSON
- **Security Controls**: Two-factor authentication, email/SMS alerts, session management
- **Notification Center**: Real-time alerts with read/unread status tracking

### 🔔 Security Features
- **Two-Factor Authentication**: Toggle-based 2FA for enhanced security
- **Session Management**: Configurable session timeouts and IP whitelisting
- **Notification Controls**: Email and SMS alert preferences
- **Data Export**: Secure JSON export with timestamps
- **Privacy Settings**: Comprehensive privacy and security configuration

### �📱 Modern Navigation
- **Hamburger Menu**: Mobile-first responsive sidebar navigation
- **Smooth Animations**: 300ms spring-based transitions
- **Cross-Platform**: Works seamlessly on mobile, tablet, and desktop
- **Intuitive UX**: Professional SaaS dashboard experience

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern component-based architecture
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library

### Architecture
- **Context API** - Global state management
- **React Router** - Client-side routing
- **Component-Based** - Modular, reusable components
- **Error Boundaries** - Graceful error handling
- **Responsive Design** - Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sonnet-agrismart-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3002/`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 📱 Usage

### Dashboard Navigation
1. **Hamburger Menu**: Click the package icon in the top-left to open the sidebar
2. **Module Access**: Navigate between IoT Monitoring, Cold Storage, Shipments, etc.
3. **Crop Management**: Expand "Crops / Batches" section to manage individual batches
4. **Add New Batch**: Click "+ Add New Batch" to create new crop batches

### Multi-Batch Workflow
1. **Add Crops**: Create multiple crop batches with environmental parameters
2. **Monitor**: View real-time sensor data across all batches
3. **Filter**: Focus on specific crops or view all batches simultaneously
4. **Respond**: Act on alerts and risk assessments for individual batches

### Profile Management
1. **Access Profile**: Navigate to Profile → Settings & Preferences
2. **Edit Profile**: Click "Edit" to modify personal information
3. **Settings Tabs**: Switch between Profile, Notifications, Security, and Data
4. **Export Data**: Download your farm data and batch information
5. **Security**: Configure two-factor authentication and notification preferences

### Key Features
- **Real-time Updates**: Automatic data refresh every 5 seconds
- **Risk Assessment**: Color-coded risk levels (Green/Yellow/Orange/Red)
- **Batch Selection**: Click any batch to view detailed information
- **Alert Management**: Acknowledge and resolve system alerts
- **Analytics**: View trends and performance metrics
- **Profile Editing**: In-place editing with save functionality
- **Data Export**: JSON export of all farm and batch data
- **Security Settings**: Toggle-based security preferences
- **Notification Management**: Real-time alert system with read/unread states

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── HamburgerSidebar.jsx    # Mobile navigation drawer
│   │   ├── Sidebar.jsx              # Desktop sidebar
│   │   ├── Navbar.jsx               # Top navigation bar
│   │   └── BottomNav.jsx            # Mobile bottom navigation
│   ├── widgets/
│   │   ├── MetricCard.jsx           # Data display cards
│   │   ├── DeviceStatusCard.jsx    # Device monitoring cards
│   │   └── ChartCard.jsx           # Chart containers
│   ├── AddBatchModal.jsx           # Batch creation modal
│   ├── BatchFilter.jsx             # Batch filtering component
│   └── ErrorBoundary.jsx           # Error handling wrapper
├── context/
│   ├── AppContext.jsx              # Global app state
│   └── BatchContext.jsx            # Batch management state
├── pages/
│   ├── Dashboard.tsx               # Main dashboard
│   ├── IoTMonitoring.jsx           # IoT sensor monitoring
│   ├── ColdStorage.jsx             # Storage unit management
│   ├── ShipmentGPS.jsx             # GPS shipment tracking
│   ├── SpoilageDetection.jsx       # Spoilage risk analysis
│   ├── Traceability.jsx            # Supply chain traceability
│   ├── CloudAlerts.jsx             # Alert management
│   ├── StorageAnalytics.jsx        # Analytics and insights
│   ├── ShelfLife.jsx               # Shelf life prediction
│   └── Profile.jsx                  # User profile
├── services/
│   ├── batchService.js              # Batch CRUD operations
│   ├── sensorService.js             # Sensor data simulation
│   ├── storageService.js            # Storage unit management
│   └── ...                          # Other service modules
└── animations/
    ├── fadeInUp.js                  # Animation presets
    └── staggerContainer.js          # Staggered animations
```

## 🎯 Demo Data

The system includes realistic demo data for 4 crop batches:

| Crop | Temperature | Humidity | Risk Level | Status |
|------|-------------|----------|------------|--------|
| Tomatoes | 4.2°C | 85% | Low | In Storage |
| Bananas | 13.5°C | 90% | Medium | In Transit |
| Mangoes | 10.0°C | 88% | High | In Storage |
| Leafy Greens | 2.5°C | 95% | Low | In Storage |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_APP_NAME=AgroNexus
```

### Tailwind Configuration
The project uses custom CSS variables for theming. Check `tailwind.config.cjs` for complete configuration.

## 📊 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run dev:https        # Start with HTTPS

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Linting
npm run lint              # Run all linting
npm run lint:js          # JavaScript/TypeScript linting
npm run lint:css         # CSS linting
npm run check:css-vars   # Check CSS variables

# Testing
npm run test              # Run tests
npm run test:watch       # Watch mode testing
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Neutral**: Gray shades (#6b7280, #374151)

### Typography
- **Font Family**: Inter (system-ui fallback)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent sizing and hover states
- **Forms**: Clean, accessible form controls
- **Navigation**: Intuitive menu structure

## 🔮 Future Enhancements

### Planned Features
- **Firebase Integration**: Real-time database connectivity
- **ESP32 Hardware**: Actual IoT sensor integration
- **Advanced Analytics**: Machine learning insights
- **Mobile App**: React Native companion application
- **Multi-Tenant**: Support for multiple farms/organizations

### Technical Improvements
- **PWA Support**: Offline capabilities
- **WebSockets**: Real-time bidirectional communication
- **Performance**: Code splitting and lazy loading
- **Accessibility**: WCAG 2.1 compliance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool
- **Tailwind CSS** - For the utility-first CSS framework
- **Framer Motion** - For the beautiful animation library
- **Lucide** - For the comprehensive icon set

---

**AgroNexus** - Revolutionizing cold chain management with intelligent monitoring and analytics. 🌱❄️