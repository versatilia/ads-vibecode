# Wikipedia Architecture Dependency Map

An interactive software architecture dependency map for Wikipedia based on its open-source system. This visualization shows the complex relationships between different layers and components of Wikipedia's infrastructure.

## 🏗️ Architecture Layers

### 1. **Frontend Layer** (Blue - #0052CC)
- **Wikipedia Web**: Main web interface with responsive design
- **Mobile Web**: Mobile-optimized Wikipedia interface  
- **Wikipedia App**: Native mobile application (React Native)
- **Vector Skin**: Default MediaWiki skin for Wikipedia

### 2. **Application Layer** (Green - #36B37E)
- **MediaWiki Core**: Core PHP application handling page rendering and editing
- **Parser**: Wikitext parser converting markup to HTML
- **Extension Manager**: Manages MediaWiki extensions and plugins
- **User Management**: Handles user accounts, authentication, and permissions
- **Content Management**: Manages article content, revisions, and history
- **File Upload**: Handles file uploads and media management

### 3. **API Layer** (Orange - #FF8B00)
- **RESTBase**: RESTful API service for Wikipedia content (Node.js)
- **GraphQL API**: GraphQL endpoint for flexible data queries
- **Action API**: MediaWiki action API for programmatic access
- **Mobile API**: Optimized API endpoints for mobile applications

### 4. **Service Layer** (Purple - #6554C0)
- **Job Queue**: Background job processing for maintenance tasks (Redis)
- **Search Service**: Full-text search across Wikipedia articles (Elasticsearch)
- **Cache Service**: Caching layer for frequently accessed data (Redis)
- **Notification Service**: Handles user notifications and alerts
- **Email Service**: Email delivery for user communications
- **Analytics Service**: Page view and user behavior analytics

### 5. **Data Layer** (Red - #FF5630)
- **MariaDB Primary**: Primary database for Wikipedia content and metadata
- **MariaDB Replica**: Read replicas for load distribution
- **MariaDB Analytics**: Analytics database for reporting and metrics
- **Elasticsearch Cluster**: Search index cluster for full-text search
- **Redis Cluster**: In-memory cache and session storage
- **Object Storage**: Distributed storage for media files and backups
- **Backup Storage**: Long-term backup storage for disaster recovery

### 6. **Infrastructure Layer** (Cyan - #00B8D9)
- **Varnish Cache**: HTTP accelerator and reverse proxy cache
- **Load Balancer**: Traffic distribution across application servers (HAProxy)
- **App Servers**: Application servers running MediaWiki (PHP-FPM)
- **Database Servers**: Dedicated servers for MariaDB databases
- **Search Servers**: Dedicated servers for Elasticsearch
- **Cache Servers**: Dedicated servers for Redis caching
- **CDN**: Content delivery network for global performance (CloudFlare)
- **DNS**: Domain name system for Wikipedia domains (BIND)
- **Puppet Master**: Configuration management for infrastructure
- **Monitoring**: System monitoring and alerting (Prometheus)
- **Logging**: Centralized logging and log analysis (ELK Stack)
- **CI/CD**: Continuous integration and deployment pipeline (Jenkins)

## 🔗 Dependency Types

### Vertical Dependencies
- **Frontend → Application**: Web interfaces connect to MediaWiki core
- **Application → Data**: MediaWiki connects to MariaDB databases
- **Services → Data**: Backend services connect to their respective data stores
- **Infrastructure → All Layers**: Infrastructure components support all layers

### Horizontal Dependencies
- **Frontend → API**: Web and mobile apps use RESTBase and GraphQL APIs
- **Application → Services**: MediaWiki core integrates with job queue, search, and caching
- **API → Application**: APIs connect to MediaWiki action API
- **Service-to-Service**: Services communicate with each other (e.g., notifications → email)

## 🎯 Key Features

### Interactive Visualization
- **Zoom & Pan**: Navigate through the architecture with smooth zoom and pan controls
- **Node Details**: Hover over nodes to see detailed information including:
  - Component description
  - Technology stack
  - Team ownership
  - Deployment status
  - Version information

### Filtering & Controls
- **Domain Filtering**: Filter by architecture layers (Frontend, Application, API, Services, Data, Infrastructure)
- **Team Filtering**: Filter by team ownership
- **Product Filtering**: Filter by product (Wikipedia, MediaWiki, RESTBase)
- **Status Filtering**: Filter by health status

### Blast Radius Analysis
- **Impact Visualization**: See how failures in one component affect the entire system
- **Cascading Effects**: Visualize both direct and potential impact paths
- **Critical Paths**: Identify the most critical dependencies in the system

### Real-time Updates
- **Live Status**: Real-time health status of all components
- **Dynamic Layout**: Force-directed graph layout that adapts to changes
- **Responsive Design**: Works on desktop and mobile devices

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

### Usage
1. **Navigate**: Use mouse wheel to zoom, drag to pan
2. **Explore**: Hover over nodes to see detailed information
3. **Filter**: Use the control panel to filter by domain, team, or product
4. **Analyze**: Enable blast radius to see impact analysis
5. **Reset**: Use the reset view button to return to the initial state

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, D3.js
- **Styling**: Atlaskit Design System, Emotion
- **Visualization**: D3.js force simulation
- **Build Tool**: Vite
- **Development**: Hot reload with Vite dev server

## 📊 Architecture Insights

### High Availability Design
- **Database Replication**: MariaDB primary with read replicas
- **Load Balancing**: HAProxy distributes traffic across app servers
- **Caching Layers**: Multiple caching layers (Varnish, Redis)
- **CDN**: Global content delivery for performance

### Scalability Patterns
- **Horizontal Scaling**: Multiple app servers behind load balancer
- **Database Sharding**: Separate databases for different purposes
- **Service Separation**: Microservices architecture for different functions
- **Caching Strategy**: Multi-level caching for optimal performance

### Monitoring & Observability
- **Comprehensive Monitoring**: Prometheus for metrics collection
- **Centralized Logging**: ELK stack for log aggregation
- **Configuration Management**: Puppet for infrastructure automation
- **CI/CD Pipeline**: Jenkins for automated deployments

## 🔍 Use Cases

### For Engineers
- **System Understanding**: Quickly understand Wikipedia's architecture
- **Impact Analysis**: Assess the impact of changes or failures
- **Dependency Mapping**: Identify critical dependencies
- **Troubleshooting**: Visualize failure propagation paths

### For Operations
- **Incident Response**: Quickly identify affected services during outages
- **Capacity Planning**: Understand resource dependencies
- **Change Management**: Assess the impact of infrastructure changes
- **Documentation**: Visual reference for system architecture

### For Management
- **System Overview**: High-level view of Wikipedia's complexity
- **Risk Assessment**: Identify single points of failure
- **Resource Planning**: Understand team and technology dependencies
- **Strategic Planning**: Visualize architectural evolution

## 🤝 Contributing

This project is part of the Atlaskit Design System showcase. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Wikipedia Foundation**: For the open-source MediaWiki platform
- **Atlassian**: For the Atlaskit Design System
- **D3.js Community**: For the powerful visualization library
- **Open Source Community**: For the various tools and libraries used

---

*This dependency map represents a simplified view of Wikipedia's actual architecture. The real system is more complex with additional components, security layers, and edge cases.*
