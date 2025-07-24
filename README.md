# Interactive Dependency Map with Blast Radius Analysis

A comprehensive visualization tool for software architecture and ITOps assets, enabling cross-cut inspection by technical and organizational dimensions with real-time blast radius analysis.

## 🚀 Features

### Core Functionality
- **Interactive Force-Directed Graph**: 35+ nodes and 60+ links representing a realistic microservices architecture
- **Multi-Dimensional Filtering**: Filter by domains (Application, Data, Infrastructure, Security, Observability) and teams
- **Real-Time Blast Radius Analysis**: Visualize impact of incidents with cascading dependency effects
- **Zoom, Pan & Search**: Full interactive navigation with D3.js force simulation
- **Node Inspection**: Detailed metadata tooltips showing team ownership, version, and deployment status

### Architecture Domains
- **Application Layer**: Frontend apps, API Gateway, microservices
- **Data Layer**: Databases, caches, message queues, event stores
- **Infrastructure**: Load balancers, servers, VPC, CDN
- **Security**: WAF, VPN, key management
- **Observability**: Monitoring, logging, alerting, tracing

### Blast Radius Visualization
- **Incident Simulation**: Start incidents from any critical component
- **Impact Visualization**: Red highlighting for incident source, orange for affected components
- **Cascading Effects**: Shows how failures propagate through the system
- **Realistic Impact**: 25+ components affected in sample scenarios

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **D3.js** for force-directed graph visualization
- **Atlassian Design System** for UI components
- **Framer Motion** for animations
- **Emotion** for styled components

### Backend
- **Node.js/Express** API server
- **CORS** enabled for cross-origin requests
- **RESTful endpoints** for dependency data and blast radius calculations

### Data Model
- **35+ Nodes**: Services, databases, infrastructure components
- **60+ Links**: Horizontal and vertical dependencies
- **5 Domains**: Application, Data, Infrastructure, Security, Observability
- **6 Teams**: Frontend, Backend, Data, Platform, Security, SRE

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ads-vibecode

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the Backend API (Optional)
```bash
# Install backend dependencies
npm install express cors @types/express @types/cors

# Start the API server
node src/server/index.js
```

The API will be available at `http://localhost:3001`

## 📊 Usage

### Basic Navigation
1. **Zoom**: Mouse wheel or pinch gestures
2. **Pan**: Click and drag on empty space
3. **Node Selection**: Click on any node to highlight its dependencies
4. **Tooltips**: Hover over nodes for detailed information

### Filtering
- **Domain Filter**: Toggle visibility of different architectural layers
- **Team Filter**: Show/hide components by team ownership
- **Status Filter**: Filter by operational status (healthy, degraded, down, warning)

### Blast Radius Analysis
1. Click the "Blast radius" button in the header
2. View the simulated incident starting from the Payment Database
3. Observe how the failure cascades through connected components
4. Red nodes indicate the incident source
5. Orange nodes show affected components
6. Dimmed nodes represent unaffected components

### API Endpoints

#### Get All Dependencies
```http
GET /api/dependencies
```

#### Get Nodes by Domain
```http
GET /api/dependencies/domain/:domainId
```

#### Get Nodes by Team
```http
GET /api/dependencies/team/:teamId
```

#### Get Node Dependencies
```http
GET /api/dependencies/node/:nodeId
```

#### Calculate Blast Radius
```http
POST /api/blast-radius
Content-Type: application/json

{
  "sourceNodeId": "payment-db"
}
```

#### Get Sample Blast Radius
```http
GET /api/blast-radius/sample
```

## 🏗️ Architecture

### Sample Microservices Architecture
The dependency map includes a realistic microservices architecture with:

**UI Layer**
- Frontend App, Mobile App, Admin Panel

**Service Layer**
- API Gateway, User Service, Auth Service, Payment Service
- Notification Service, Analytics Service, Search Service
- File Service, Email Service

**Data Layer**
- User DB, Payment DB, Analytics DB, Search Index
- File Storage, Redis Cache, Message Queue, Event Store

**Infrastructure**
- Load Balancer, Web Servers, Database Server
- Cache Server, Queue Server, CDN, VPC

**Security**
- WAF, VPN, Key Management

**Observability**
- Monitoring, Logging, Alerting, Tracing, Metrics Database

### Dependency Types
- **Horizontal Dependencies**: Peer-to-peer service communication
- **Vertical Dependencies**: Layered stack relationships (UI → Service → Data → Infrastructure)

## 🎨 Design System

Built with Atlassian Design System components:
- **Colors**: Semantic color tokens for domains and status
- **Typography**: Consistent heading and text styles
- **Spacing**: Token-based spacing system
- **Elevation**: Layered UI with proper shadows
- **Interactive Elements**: Buttons, badges, toggles, tooltips

## 🔧 Development

### Project Structure
```
src/
├── components/
│   └── DependencyMap.tsx    # Main visualization component
├── data/
│   └── dependencyMapData.ts # Sample architecture data
├── types/
│   └── dependencyMap.ts     # TypeScript interfaces
├── server/
│   └── index.ts            # Express API server
└── App.tsx                 # Main application
```

### Key Components
- **DependencyMap**: Main D3.js visualization with force simulation
- **Filter Controls**: Domain and team filtering interface
- **Blast Radius**: Incident impact visualization
- **Node Tooltips**: Detailed component information
- **Legend**: Color coding and status indicators

## 🚨 Blast Radius Feature

The blast radius feature demonstrates realistic incident impact:

1. **Incident Source**: Payment Database failure (red)
2. **Direct Impact**: Payment Service, API Gateway (orange)
3. **Cascading Effects**: User authentication, notifications, analytics
4. **Infrastructure Impact**: Database servers, monitoring systems
5. **Observability Impact**: Logging, alerting, metrics collection

This shows how a single database failure can affect 25+ components across all architectural layers.

## 📈 Future Enhancements

- **Real-time Data**: Live status updates from monitoring systems
- **Historical Analysis**: Track dependency changes over time
- **Performance Metrics**: Latency and throughput visualization
- **Deployment Tracking**: Version and deployment status integration
- **Team Collaboration**: Shared annotations and incident notes
- **Export Capabilities**: PDF reports and data export
- **Advanced Filtering**: Custom query builder for complex filters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
