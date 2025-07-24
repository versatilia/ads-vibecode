import { DependencyMapData, BlastRadius } from '../types/dependencyMap';

export const dependencyMapData: DependencyMapData = {
  domains: [
    { id: 'application', name: 'Application', color: '#0052CC', description: 'Application services and UI components' },
    { id: 'data', name: 'Data', color: '#36B37E', description: 'Databases, storage, and data processing' },
    { id: 'infra', name: 'Infrastructure', color: '#FF5630', description: 'Servers, networking, and cloud services' },
    { id: 'security', name: 'Security', color: '#FF8B00', description: 'Security services and compliance' },
    { id: 'observability', name: 'Observability', color: '#6554C0', description: 'Monitoring, logging, and alerting' }
  ],
  teams: [
    { id: 'frontend', name: 'Frontend Team', businessUnit: 'Engineering', color: '#0052CC' },
    { id: 'backend', name: 'Backend Team', businessUnit: 'Engineering', color: '#36B37E' },
    { id: 'data', name: 'Data Team', businessUnit: 'Engineering', color: '#FF5630' },
    { id: 'platform', name: 'Platform Team', businessUnit: 'Engineering', color: '#FF8B00' },
    { id: 'security', name: 'Security Team', businessUnit: 'Security', color: '#6554C0' },
    { id: 'sre', name: 'SRE Team', businessUnit: 'Operations', color: '#00B8D9' }
  ],
  products: [
    { id: 'jira', name: 'Jira', color: '#0052CC' },
    { id: 'confluence', name: 'Confluence', color: '#36B37E' },
    { id: 'bitbucket', name: 'Bitbucket', color: '#FF5630' }
  ],
  nodes: [
    // UI Layer
    { id: 'frontend-app', name: 'Frontend App', type: 'ui', domain: 'application', team: 'frontend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '2.1.0', deploymentStatus: 'deployed' },
    { id: 'mobile-app', name: 'Mobile App', type: 'ui', domain: 'application', team: 'frontend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '1.8.2', deploymentStatus: 'deployed' },
    { id: 'admin-panel', name: 'Admin Panel', type: 'ui', domain: 'application', team: 'frontend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '1.5.1', deploymentStatus: 'deployed' },
    
    // Service Layer
    { id: 'api-gateway', name: 'API Gateway', type: 'service', domain: 'application', team: 'backend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '3.2.0', deploymentStatus: 'deployed' },
    { id: 'user-service', name: 'User Service', type: 'service', domain: 'application', team: 'backend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '2.4.1', deploymentStatus: 'deployed' },
    { id: 'auth-service', name: 'Auth Service', type: 'service', domain: 'application', team: 'backend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '1.9.3', deploymentStatus: 'deployed' },
    { id: 'payment-service', name: 'Payment Service', type: 'service', domain: 'application', team: 'backend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '2.7.0', deploymentStatus: 'deployed' },
    { id: 'notification-service', name: 'Notification Service', type: 'service', domain: 'application', team: 'backend', product: 'jira', businessUnit: 'Engineering', status: 'healthy', version: '1.6.2', deploymentStatus: 'deployed' },
    { id: 'analytics-service', name: 'Analytics Service', type: 'service', domain: 'application', team: 'backend', product: 'confluence', businessUnit: 'Engineering', status: 'healthy', version: '2.0.1', deploymentStatus: 'deployed' },
    { id: 'search-service', name: 'Search Service', type: 'service', domain: 'application', team: 'backend', product: 'confluence', businessUnit: 'Engineering', status: 'healthy', version: '1.8.5', deploymentStatus: 'deployed' },
    { id: 'file-service', name: 'File Service', type: 'service', domain: 'application', team: 'backend', product: 'confluence', businessUnit: 'Engineering', status: 'healthy', version: '1.4.3', deploymentStatus: 'deployed' },
    { id: 'email-service', name: 'Email Service', type: 'service', domain: 'application', team: 'backend', product: 'confluence', businessUnit: 'Engineering', status: 'healthy', version: '1.2.1', deploymentStatus: 'deployed' },
    
    // Data Layer
    { id: 'user-db', name: 'User Database', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'PostgreSQL 14', deploymentStatus: 'deployed' },
    { id: 'payment-db', name: 'Payment Database', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'PostgreSQL 14', deploymentStatus: 'deployed' },
    { id: 'analytics-db', name: 'Analytics Database', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'ClickHouse 22', deploymentStatus: 'deployed' },
    { id: 'search-index', name: 'Search Index', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'Elasticsearch 8', deploymentStatus: 'deployed' },
    { id: 'file-storage', name: 'File Storage', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'S3 Compatible', deploymentStatus: 'deployed' },
    { id: 'redis-cache', name: 'Redis Cache', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'Redis 7', deploymentStatus: 'deployed' },
    { id: 'message-queue', name: 'Message Queue', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'RabbitMQ 3.11', deploymentStatus: 'deployed' },
    { id: 'event-store', name: 'Event Store', type: 'database', domain: 'data', team: 'data', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'EventStore 22', deploymentStatus: 'deployed' },
    
    // Infrastructure
    { id: 'load-balancer', name: 'Load Balancer', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'HAProxy 2.6', deploymentStatus: 'deployed' },
    { id: 'web-servers', name: 'Web Servers', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'Nginx 1.24', deploymentStatus: 'deployed' },
    { id: 'database-server', name: 'Database Server', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'EC2 m5.large', deploymentStatus: 'deployed' },
    { id: 'cache-server', name: 'Cache Server', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'EC2 t3.medium', deploymentStatus: 'deployed' },
    { id: 'queue-server', name: 'Queue Server', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'EC2 t3.medium', deploymentStatus: 'deployed' },
    { id: 'cdn', name: 'CDN', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'CloudFront', deploymentStatus: 'deployed' },
    { id: 'vpc', name: 'VPC', type: 'infrastructure', domain: 'infra', team: 'platform', product: 'bitbucket', businessUnit: 'Engineering', status: 'healthy', version: 'AWS VPC', deploymentStatus: 'deployed' },
    
    // Security
    { id: 'waf', name: 'WAF', type: 'security', domain: 'security', team: 'security', product: 'jira', businessUnit: 'Security', status: 'healthy', version: 'AWS WAF', deploymentStatus: 'deployed' },
    { id: 'vpn', name: 'VPN', type: 'security', domain: 'security', team: 'security', product: 'jira', businessUnit: 'Security', status: 'healthy', version: 'OpenVPN', deploymentStatus: 'deployed' },
    { id: 'key-management', name: 'Key Management', type: 'security', domain: 'security', team: 'security', product: 'jira', businessUnit: 'Security', status: 'healthy', version: 'AWS KMS', deploymentStatus: 'deployed' },
    
    // Observability
    { id: 'monitoring', name: 'Monitoring', type: 'observability', domain: 'observability', team: 'sre', product: 'confluence', businessUnit: 'Operations', status: 'healthy', version: 'Prometheus 2.45', deploymentStatus: 'deployed' },
    { id: 'logging', name: 'Logging', type: 'observability', domain: 'observability', team: 'sre', product: 'confluence', businessUnit: 'Operations', status: 'healthy', version: 'ELK Stack', deploymentStatus: 'deployed' },
    { id: 'alerting', name: 'Alerting', type: 'observability', domain: 'observability', team: 'sre', product: 'confluence', businessUnit: 'Operations', status: 'healthy', version: 'AlertManager', deploymentStatus: 'deployed' },
    { id: 'tracing', name: 'Tracing', type: 'observability', domain: 'observability', team: 'sre', product: 'confluence', businessUnit: 'Operations', status: 'healthy', version: 'Jaeger', deploymentStatus: 'deployed' },
    { id: 'metrics-db', name: 'Metrics Database', type: 'observability', domain: 'observability', team: 'sre', product: 'confluence', businessUnit: 'Operations', status: 'healthy', version: 'InfluxDB 2.7', deploymentStatus: 'deployed' }
  ],
  links: [
    // UI to API Gateway connections
    { id: 'frontend-api', source: 'frontend-app', target: 'api-gateway', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'mobile-api', source: 'mobile-app', target: 'api-gateway', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'admin-api', source: 'admin-panel', target: 'api-gateway', type: 'horizontal', strength: 0.8, status: 'healthy' },
    
    // API Gateway to Services (vertical dependencies)
    { id: 'gateway-user', source: 'api-gateway', target: 'user-service', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'gateway-auth', source: 'api-gateway', target: 'auth-service', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'gateway-payment', source: 'api-gateway', target: 'payment-service', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'gateway-notification', source: 'api-gateway', target: 'notification-service', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'gateway-analytics', source: 'api-gateway', target: 'analytics-service', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'gateway-search', source: 'api-gateway', target: 'search-service', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'gateway-file', source: 'api-gateway', target: 'file-service', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'gateway-email', source: 'api-gateway', target: 'email-service', type: 'vertical', strength: 0.5, status: 'healthy' },
    
    // Service to Service dependencies (horizontal)
    { id: 'user-auth', source: 'user-service', target: 'auth-service', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'payment-auth', source: 'payment-service', target: 'auth-service', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'notification-user', source: 'notification-service', target: 'user-service', type: 'horizontal', strength: 0.7, status: 'healthy' },
    { id: 'analytics-user', source: 'analytics-service', target: 'user-service', type: 'horizontal', strength: 0.6, status: 'healthy' },
    { id: 'search-file', source: 'search-service', target: 'file-service', type: 'horizontal', strength: 0.5, status: 'healthy' },
    { id: 'email-notification', source: 'email-service', target: 'notification-service', type: 'horizontal', strength: 0.6, status: 'healthy' },
    
    // Services to Databases (vertical)
    { id: 'user-db-link', source: 'user-service', target: 'user-db', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'payment-db-link', source: 'payment-service', target: 'payment-db', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'analytics-db-link', source: 'analytics-service', target: 'analytics-db', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'search-index-link', source: 'search-service', target: 'search-index', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'file-storage-link', source: 'file-service', target: 'file-storage', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'redis-cache-link', source: 'user-service', target: 'redis-cache', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'redis-cache-payment', source: 'payment-service', target: 'redis-cache', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'message-queue-notification', source: 'notification-service', target: 'message-queue', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'message-queue-email', source: 'email-service', target: 'message-queue', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'event-store-analytics', source: 'analytics-service', target: 'event-store', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'event-store-payment', source: 'payment-service', target: 'event-store', type: 'vertical', strength: 0.6, status: 'healthy' },
    
    // Infrastructure dependencies
    { id: 'load-balancer-web', source: 'load-balancer', target: 'web-servers', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'web-servers-api', source: 'web-servers', target: 'api-gateway', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'database-server-user', source: 'database-server', target: 'user-db', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'database-server-payment', source: 'database-server', target: 'payment-db', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'cache-server-redis', source: 'cache-server', target: 'redis-cache', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'queue-server-message', source: 'queue-server', target: 'message-queue', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'cdn-frontend', source: 'cdn', target: 'frontend-app', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'vpc-load-balancer', source: 'vpc', target: 'load-balancer', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'vpc-database', source: 'vpc', target: 'database-server', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'vpc-cache', source: 'vpc', target: 'cache-server', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'vpc-queue', source: 'vpc', target: 'queue-server', type: 'vertical', strength: 0.9, status: 'healthy' },
    
    // Security dependencies
    { id: 'waf-load-balancer', source: 'waf', target: 'load-balancer', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'vpn-vpc', source: 'vpn', target: 'vpc', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'key-management-payment', source: 'key-management', target: 'payment-service', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'key-management-auth', source: 'key-management', target: 'auth-service', type: 'vertical', strength: 0.8, status: 'healthy' },
    
    // Observability dependencies
    { id: 'monitoring-api', source: 'monitoring', target: 'api-gateway', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'monitoring-user', source: 'monitoring', target: 'user-service', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'monitoring-payment', source: 'monitoring', target: 'payment-service', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'logging-api', source: 'logging', target: 'api-gateway', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'logging-user', source: 'logging', target: 'user-service', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'logging-payment', source: 'logging', target: 'payment-service', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'alerting-monitoring', source: 'alerting', target: 'monitoring', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'tracing-api', source: 'tracing', target: 'api-gateway', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'tracing-user', source: 'tracing', target: 'user-service', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'tracing-payment', source: 'tracing', target: 'payment-service', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'metrics-db-monitoring', source: 'metrics-db', target: 'monitoring', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'metrics-db-logging', source: 'metrics-db', target: 'logging', type: 'vertical', strength: 0.8, status: 'healthy' }
  ]
};

export const sampleBlastRadius: BlastRadius = {
  sourceNodeId: 'payment-db',
  affectedNodes: [
    'payment-db', 'payment-service', 'api-gateway', 'frontend-app', 'mobile-app', 'admin-panel',
    'user-service', 'auth-service', 'notification-service', 'analytics-service', 'email-service',
    'user-db', 'redis-cache', 'message-queue', 'event-store', 'database-server', 'cache-server',
    'queue-server', 'load-balancer', 'web-servers', 'vpc', 'monitoring', 'logging', 'alerting',
    'tracing', 'metrics-db'
  ],
  affectedLinks: [
    'payment-db-link', 'gateway-payment', 'payment-auth', 'frontend-api', 'mobile-api', 'admin-api',
    'user-auth', 'notification-user', 'analytics-user', 'email-notification', 'redis-cache-payment',
    'event-store-payment', 'database-server-payment', 'cache-server-redis', 'queue-server-message',
    'load-balancer-web', 'web-servers-api', 'vpc-load-balancer', 'vpc-database', 'vpc-cache',
    'vpc-queue', 'monitoring-payment', 'logging-payment', 'tracing-payment', 'metrics-db-monitoring',
    'metrics-db-logging'
  ],
  severity: 'critical',
  description: 'Payment database failure causing cascading impact across payment processing, user authentication, and notification systems'
}; 