import { DependencyMapData, BlastRadius } from '../types/dependencyMap';
import { 
  generateDomainOwner, 
  generateTeamOwner, 
  generateProductOwner, 
  generateBusinessUnitOwner 
} from '../utils/ownerGenerator';

export const dependencyMapData: DependencyMapData = {
  domains: [
    { id: 'frontend', name: 'Frontend', color: '#0052CC', description: 'User interface and client-side components', owner: generateDomainOwner('frontend') },
    { id: 'application', name: 'Application', color: '#36B37E', description: 'MediaWiki PHP application layer', owner: generateDomainOwner('application') },
    { id: 'api', name: 'API', color: '#FF8B00', description: 'REST and GraphQL API services', owner: generateDomainOwner('api') },
    { id: 'services', name: 'Services', color: '#6554C0', description: 'Backend services and job queues', owner: generateDomainOwner('services') },
    { id: 'data', name: 'Data', color: '#FF5630', description: 'Databases, storage, and data processing', owner: generateDomainOwner('data') },
    { id: 'infrastructure', name: 'Infrastructure', color: '#00B8D9', description: 'Servers, networking, and deployment', owner: generateDomainOwner('infrastructure') }
  ],
  teams: [
    { id: 'frontend-team', name: 'Frontend Team', businessUnit: 'Engineering', color: '#0052CC', owner: generateTeamOwner('frontend-team') },
    { id: 'mediawiki-team', name: 'MediaWiki Team', businessUnit: 'Engineering', color: '#36B37E', owner: generateTeamOwner('mediawiki-team') },
    { id: 'api-team', name: 'API Team', businessUnit: 'Engineering', color: '#FF8B00', owner: generateTeamOwner('api-team') },
    { id: 'platform-team', name: 'Platform Team', businessUnit: 'Engineering', color: '#6554C0', owner: generateTeamOwner('platform-team') },
    { id: 'data-team', name: 'Data Team', businessUnit: 'Engineering', color: '#FF5630', owner: generateTeamOwner('data-team') },
    { id: 'infra-team', name: 'Infrastructure Team', businessUnit: 'Operations', color: '#00B8D9', owner: generateTeamOwner('infra-team') }
  ],
  products: [
    { id: 'wikipedia', name: 'Wikipedia', color: '#0052CC', owner: generateProductOwner('wikipedia') },
    { id: 'mediawiki', name: 'MediaWiki', color: '#36B37E', owner: generateProductOwner('mediawiki') },
    { id: 'restbase', name: 'RESTBase', color: '#FF8B00', owner: generateProductOwner('restbase') }
  ],
  businessUnits: [
    { id: 'engineering', name: 'Engineering', owner: generateBusinessUnitOwner('Engineering') },
    { id: 'operations', name: 'Operations', owner: generateBusinessUnitOwner('Operations') }
  ],
  nodes: [
    // Frontend Layer
    { id: 'wikipedia-web', name: 'Wikipedia Web', type: 'frontend', domain: 'frontend', team: 'frontend-team', product: 'wikipedia', businessUnit: 'Engineering', status: 'healthy', version: 'HTML/CSS/JS', deploymentStatus: 'deployed', description: 'Main Wikipedia web interface with responsive design' },
    { id: 'mobile-web', name: 'Mobile Web', type: 'frontend', domain: 'frontend', team: 'frontend-team', product: 'wikipedia', businessUnit: 'Engineering', status: 'healthy', version: 'HTML/CSS/JS', deploymentStatus: 'deployed', description: 'Mobile-optimized Wikipedia interface' },
    { id: 'wikipedia-app', name: 'Wikipedia App', type: 'frontend', domain: 'frontend', team: 'frontend-team', product: 'wikipedia', businessUnit: 'Engineering', status: 'healthy', version: 'React Native', deploymentStatus: 'deployed', description: 'Native mobile application for Wikipedia' },
    { id: 'vector-skin', name: 'Vector Skin', type: 'frontend', domain: 'frontend', team: 'frontend-team', product: 'wikipedia', businessUnit: 'Engineering', status: 'healthy', version: 'CSS/JS', deploymentStatus: 'deployed', description: 'Default MediaWiki skin for Wikipedia' },
    
    // Application Layer (MediaWiki PHP)
    { id: 'mediawiki-core', name: 'MediaWiki Core', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP 8.1', deploymentStatus: 'deployed', description: 'Core MediaWiki application handling page rendering and editing' },
    { id: 'parser', name: 'Parser', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'Wikitext parser converting markup to HTML' },
    { id: 'extension-manager', name: 'Extension Manager', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'Manages MediaWiki extensions and plugins' },
    { id: 'user-management', name: 'User Management', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'Handles user accounts, authentication, and permissions' },
    { id: 'content-management', name: 'Content Management', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'Manages article content, revisions, and history' },
    { id: 'file-upload', name: 'File Upload', type: 'application', domain: 'application', team: 'mediawiki-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'Handles file uploads and media management' },
    
    // API Layer
    { id: 'restbase', name: 'RESTBase', type: 'api', domain: 'api', team: 'api-team', product: 'restbase', businessUnit: 'Engineering', status: 'healthy', version: 'Node.js', deploymentStatus: 'deployed', description: 'RESTful API service for Wikipedia content' },
    { id: 'graphql-api', name: 'GraphQL API', type: 'api', domain: 'api', team: 'api-team', product: 'restbase', businessUnit: 'Engineering', status: 'healthy', version: 'Node.js', deploymentStatus: 'deployed', description: 'GraphQL endpoint for flexible data queries' },
    { id: 'action-api', name: 'Action API', type: 'api', domain: 'api', team: 'api-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'PHP', deploymentStatus: 'deployed', description: 'MediaWiki action API for programmatic access' },
    { id: 'mobile-api', name: 'Mobile API', type: 'api', domain: 'api', team: 'api-team', product: 'restbase', businessUnit: 'Engineering', status: 'healthy', version: 'Node.js', deploymentStatus: 'deployed', description: 'Optimized API endpoints for mobile applications' },
    
    // Service Layer
    { id: 'job-queue', name: 'Job Queue', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Redis', deploymentStatus: 'deployed', description: 'Background job processing for maintenance tasks' },
    { id: 'search-service', name: 'Search Service', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Elasticsearch', deploymentStatus: 'deployed', description: 'Full-text search across Wikipedia articles' },
    { id: 'cache-service', name: 'Cache Service', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Redis', deploymentStatus: 'deployed', description: 'Caching layer for frequently accessed data' },
    { id: 'notification-service', name: 'Notification Service', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Node.js', deploymentStatus: 'deployed', description: 'Handles user notifications and alerts' },
    { id: 'email-service', name: 'Email Service', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'SMTP', deploymentStatus: 'deployed', description: 'Email delivery for user communications' },
    { id: 'analytics-service', name: 'Analytics Service', type: 'service', domain: 'services', team: 'platform-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Python', deploymentStatus: 'deployed', description: 'Page view and user behavior analytics' },
    
    // Data Layer
    { id: 'mariadb-primary', name: 'MariaDB Primary', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'MariaDB 10.11', deploymentStatus: 'deployed', description: 'Primary database for Wikipedia content and metadata' },
    { id: 'mariadb-replica', name: 'MariaDB Replica', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'MariaDB 10.11', deploymentStatus: 'deployed', description: 'Read replicas for load distribution' },
    { id: 'mariadb-analytics', name: 'MariaDB Analytics', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'MariaDB 10.11', deploymentStatus: 'deployed', description: 'Analytics database for reporting and metrics' },
    { id: 'elasticsearch-cluster', name: 'Elasticsearch Cluster', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Elasticsearch 8.x', deploymentStatus: 'deployed', description: 'Search index cluster for full-text search' },
    { id: 'redis-cluster', name: 'Redis Cluster', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Redis 7.x', deploymentStatus: 'deployed', description: 'In-memory cache and session storage' },
    { id: 'object-storage', name: 'Object Storage', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Swift/Ceph', deploymentStatus: 'deployed', description: 'Distributed storage for media files and backups' },
    { id: 'backup-storage', name: 'Backup Storage', type: 'data', domain: 'data', team: 'data-team', product: 'mediawiki', businessUnit: 'Engineering', status: 'healthy', version: 'Swift', deploymentStatus: 'deployed', description: 'Long-term backup storage for disaster recovery' },
    
    // Infrastructure Layer
    { id: 'varnish-cache', name: 'Varnish Cache', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Varnish 7.x', deploymentStatus: 'deployed', description: 'HTTP accelerator and reverse proxy cache' },
    { id: 'load-balancer', name: 'Load Balancer', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'HAProxy', deploymentStatus: 'deployed', description: 'Traffic distribution across application servers' },
    { id: 'app-servers', name: 'App Servers', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'PHP-FPM', deploymentStatus: 'deployed', description: 'Application servers running MediaWiki' },
    { id: 'database-servers', name: 'Database Servers', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Bare Metal', deploymentStatus: 'deployed', description: 'Dedicated servers for MariaDB databases' },
    { id: 'search-servers', name: 'Search Servers', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Bare Metal', deploymentStatus: 'deployed', description: 'Dedicated servers for Elasticsearch' },
    { id: 'cache-servers', name: 'Cache Servers', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Bare Metal', deploymentStatus: 'deployed', description: 'Dedicated servers for Redis caching' },
    { id: 'cdn', name: 'CDN', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'CloudFlare', deploymentStatus: 'deployed', description: 'Content delivery network for global performance' },
    { id: 'dns', name: 'DNS', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'BIND', deploymentStatus: 'deployed', description: 'Domain name system for Wikipedia domains' },
    { id: 'puppet-master', name: 'Puppet Master', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Puppet', deploymentStatus: 'deployed', description: 'Configuration management for infrastructure' },
    { id: 'monitoring', name: 'Monitoring', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Prometheus', deploymentStatus: 'deployed', description: 'System monitoring and alerting' },
    { id: 'logging', name: 'Logging', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'ELK Stack', deploymentStatus: 'deployed', description: 'Centralized logging and log analysis' },
    { id: 'ci-cd', name: 'CI/CD', type: 'infrastructure', domain: 'infrastructure', team: 'infra-team', product: 'mediawiki', businessUnit: 'Operations', status: 'healthy', version: 'Jenkins', deploymentStatus: 'deployed', description: 'Continuous integration and deployment pipeline' }
  ],
  links: [
    // Frontend to Application Layer (Vertical dependencies)
    { id: 'web-mediawiki', source: 'wikipedia-web', target: 'mediawiki-core', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'mobile-web-mediawiki', source: 'mobile-web', target: 'mediawiki-core', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'app-mediawiki', source: 'wikipedia-app', target: 'mediawiki-core', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'skin-mediawiki', source: 'vector-skin', target: 'mediawiki-core', type: 'vertical', strength: 0.7, status: 'healthy' },
    
    // Frontend to API Layer (Horizontal dependencies)
    { id: 'web-restbase', source: 'wikipedia-web', target: 'restbase', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'mobile-web-restbase', source: 'mobile-web', target: 'restbase', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'app-mobile-api', source: 'wikipedia-app', target: 'mobile-api', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'app-graphql', source: 'wikipedia-app', target: 'graphql-api', type: 'horizontal', strength: 0.7, status: 'healthy' },
    
    // Application Layer internal dependencies (Horizontal)
    { id: 'core-parser', source: 'mediawiki-core', target: 'parser', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'core-extensions', source: 'mediawiki-core', target: 'extension-manager', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'core-users', source: 'mediawiki-core', target: 'user-management', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'core-content', source: 'mediawiki-core', target: 'content-management', type: 'horizontal', strength: 0.9, status: 'healthy' },
    { id: 'core-files', source: 'mediawiki-core', target: 'file-upload', type: 'horizontal', strength: 0.7, status: 'healthy' },
    { id: 'content-files', source: 'content-management', target: 'file-upload', type: 'horizontal', strength: 0.6, status: 'healthy' },
    
    // Application to API Layer (Horizontal)
    { id: 'mediawiki-action-api', source: 'mediawiki-core', target: 'action-api', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'restbase-action-api', source: 'restbase', target: 'action-api', type: 'horizontal', strength: 0.7, status: 'healthy' },
    { id: 'graphql-action-api', source: 'graphql-api', target: 'action-api', type: 'horizontal', strength: 0.6, status: 'healthy' },
    
    // Application to Services (Horizontal)
    { id: 'mediawiki-job-queue', source: 'mediawiki-core', target: 'job-queue', type: 'horizontal', strength: 0.7, status: 'healthy' },
    { id: 'mediawiki-search', source: 'mediawiki-core', target: 'search-service', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'mediawiki-cache', source: 'mediawiki-core', target: 'cache-service', type: 'horizontal', strength: 0.8, status: 'healthy' },
    { id: 'mediawiki-notifications', source: 'mediawiki-core', target: 'notification-service', type: 'horizontal', strength: 0.6, status: 'healthy' },
    { id: 'mediawiki-email', source: 'mediawiki-core', target: 'email-service', type: 'horizontal', strength: 0.6, status: 'healthy' },
    { id: 'mediawiki-analytics', source: 'mediawiki-core', target: 'analytics-service', type: 'horizontal', strength: 0.5, status: 'healthy' },
    { id: 'user-management-email', source: 'user-management', target: 'email-service', type: 'horizontal', strength: 0.7, status: 'healthy' },
    { id: 'user-management-notifications', source: 'user-management', target: 'notification-service', type: 'horizontal', strength: 0.7, status: 'healthy' },
    
    // Services to Data Layer (Vertical)
    { id: 'job-queue-redis', source: 'job-queue', target: 'redis-cluster', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'search-service-elasticsearch', source: 'search-service', target: 'elasticsearch-cluster', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'cache-service-redis', source: 'cache-service', target: 'redis-cluster', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'notification-service-redis', source: 'notification-service', target: 'redis-cluster', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'analytics-service-mariadb', source: 'analytics-service', target: 'mariadb-analytics', type: 'vertical', strength: 0.8, status: 'healthy' },
    
    // Application to Data Layer (Vertical)
    { id: 'mediawiki-mariadb-primary', source: 'mediawiki-core', target: 'mariadb-primary', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'mediawiki-mariadb-replica', source: 'mediawiki-core', target: 'mariadb-replica', type: 'vertical', strength: 0.7, status: 'healthy' },
    { id: 'content-management-object-storage', source: 'content-management', target: 'object-storage', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'file-upload-object-storage', source: 'file-upload', target: 'object-storage', type: 'vertical', strength: 0.8, status: 'healthy' },
    
    // Infrastructure dependencies (Vertical)
    { id: 'varnish-load-balancer', source: 'varnish-cache', target: 'load-balancer', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'load-balancer-app-servers', source: 'load-balancer', target: 'app-servers', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'app-servers-mediawiki', source: 'app-servers', target: 'mediawiki-core', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'database-servers-mariadb-primary', source: 'database-servers', target: 'mariadb-primary', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'database-servers-mariadb-replica', source: 'database-servers', target: 'mariadb-replica', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'database-servers-mariadb-analytics', source: 'database-servers', target: 'mariadb-analytics', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'search-servers-elasticsearch', source: 'search-servers', target: 'elasticsearch-cluster', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'cache-servers-redis', source: 'cache-servers', target: 'redis-cluster', type: 'vertical', strength: 0.9, status: 'healthy' },
    { id: 'cdn-varnish', source: 'cdn', target: 'varnish-cache', type: 'vertical', strength: 0.8, status: 'healthy' },
    { id: 'dns-cdn', source: 'dns', target: 'cdn', type: 'vertical', strength: 0.7, status: 'healthy' },
    
    // Infrastructure management dependencies
    { id: 'puppet-app-servers', source: 'puppet-master', target: 'app-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'puppet-database-servers', source: 'puppet-master', target: 'database-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'puppet-search-servers', source: 'puppet-master', target: 'search-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'puppet-cache-servers', source: 'puppet-master', target: 'cache-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    
    // Monitoring and observability
    { id: 'monitoring-app-servers', source: 'monitoring', target: 'app-servers', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'monitoring-database-servers', source: 'monitoring', target: 'database-servers', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'monitoring-search-servers', source: 'monitoring', target: 'search-servers', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'monitoring-cache-servers', source: 'monitoring', target: 'cache-servers', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'logging-app-servers', source: 'logging', target: 'app-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'logging-database-servers', source: 'logging', target: 'database-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'logging-search-servers', source: 'logging', target: 'search-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    { id: 'logging-cache-servers', source: 'logging', target: 'cache-servers', type: 'vertical', strength: 0.6, status: 'healthy' },
    
    // CI/CD dependencies
    { id: 'ci-cd-app-servers', source: 'ci-cd', target: 'app-servers', type: 'vertical', strength: 0.5, status: 'healthy' },
    { id: 'ci-cd-puppet', source: 'ci-cd', target: 'puppet-master', type: 'vertical', strength: 0.6, status: 'healthy' }
  ]
};

export const sampleBlastRadius: BlastRadius = {
  sourceNodeId: 'mariadb-primary',
  directIssues: {
    nodes: ['mariadb-primary', 'mediawiki-core', 'content-management', 'user-management'],
    links: ['mediawiki-mariadb-primary', 'core-content', 'core-users']
  },
  potentialIssues: {
    nodes: ['wikipedia-web', 'mobile-web', 'wikipedia-app', 'restbase', 'action-api', 'job-queue', 'search-service', 'cache-service', 'notification-service', 'email-service', 'analytics-service', 'mariadb-replica', 'elasticsearch-cluster', 'redis-cluster', 'object-storage', 'varnish-cache', 'load-balancer', 'app-servers', 'database-servers', 'monitoring', 'logging'],
    links: ['web-mediawiki', 'mobile-web-mediawiki', 'app-mediawiki', 'web-restbase', 'mobile-web-restbase', 'mediawiki-action-api', 'restbase-action-api', 'mediawiki-job-queue', 'mediawiki-search', 'mediawiki-cache', 'mediawiki-notifications', 'mediawiki-email', 'mediawiki-analytics', 'job-queue-redis', 'search-service-elasticsearch', 'cache-service-redis', 'notification-service-redis', 'analytics-service-mariadb', 'mediawiki-mariadb-replica', 'varnish-load-balancer', 'load-balancer-app-servers', 'app-servers-mediawiki', 'database-servers-mariadb-primary', 'database-servers-mariadb-replica', 'database-servers-mariadb-analytics', 'search-servers-elasticsearch', 'cache-servers-redis', 'cdn-varnish', 'monitoring-database-servers', 'logging-database-servers']
  },
  severity: 'critical',
  description: 'Primary MariaDB database failure causing cascading impact across Wikipedia editing, content management, and user authentication systems'
}; 