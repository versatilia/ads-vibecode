export interface DependencyNode {
  id: string;
  name: string;
  type: 'service' | 'database' | 'infrastructure' | 'security' | 'observability' | 'ui';
  domain: 'application' | 'data' | 'infra' | 'security' | 'observability';
  team: string;
  product: string;
  businessUnit: string;
  status: 'healthy' | 'degraded' | 'down' | 'warning';
  version?: string;
  deploymentStatus?: 'deployed' | 'deploying' | 'failed';
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

export interface Domain {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface Team {
  id: string;
  name: string;
  businessUnit: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  color: string;
}

export interface BlastRadius {
  sourceNodeId: string;
  affectedNodes: string[];
  affectedLinks: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface DependencyMapData {
  nodes: DependencyNode[];
  links: DependencyLink[];
  domains: Domain[];
  teams: Team[];
  products: Product[];
}

export interface FilterState {
  selectedDomains: string[];
  selectedTeams: string[];
  selectedProducts: string[];
  selectedStatuses: string[];
  showBlastRadius: boolean;
  blastRadiusData?: BlastRadius;
} 