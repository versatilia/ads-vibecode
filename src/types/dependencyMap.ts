export interface DependencyNode {
  id: string;
  name: string;
  type: 'frontend' | 'application' | 'api' | 'service' | 'data' | 'infrastructure' | 'security' | 'observability' | 'ui';
  domain: 'frontend' | 'application' | 'api' | 'services' | 'data' | 'infrastructure' | 'security' | 'observability';
  team: string;
  product: string;
  businessUnit: string;
  status: 'healthy' | 'degraded' | 'down' | 'warning';
  version?: string;
  deploymentStatus?: 'deployed' | 'deploying' | 'failed';
  description?: string;
  metadata?: Record<string, any>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface DependencyLink {
  id: string;
  source: string;
  target: string;
  type: 'horizontal' | 'vertical';
  strength: number; // 0-1
  status: 'healthy' | 'degraded' | 'down';
  metadata?: Record<string, any>;
}

export interface Owner {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Domain {
  id: string;
  name: string;
  color: string;
  description: string;
  owner: Owner;
}

export interface Team {
  id: string;
  name: string;
  businessUnit: string;
  color: string;
  owner: Owner;
}

export interface Product {
  id: string;
  name: string;
  color: string;
  owner: Owner;
}

export interface BusinessUnit {
  id: string;
  name: string;
  owner: Owner;
}

export interface BlastRadius {
  sourceNodeId: string;
  directIssues: {
    nodes: string[];
    links: string[];
  };
  potentialIssues: {
    nodes: string[];
    links: string[];
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface DependencyMapData {
  nodes: DependencyNode[];
  links: DependencyLink[];
  domains: Domain[];
  teams: Team[];
  products: Product[];
  businessUnits: BusinessUnit[];
}

export interface FilterState {
  selectedDomains: string[];
  selectedTeams: string[];
  selectedProducts: string[];
  selectedOwners: string[];
  selectedBusinessUnits: string[];
  selectedStatuses: string[];
  showBlastRadius: boolean;
  blastRadiusData?: BlastRadius;
  selectedDependencyTypes: ('vertical' | 'horizontal')[];
} 