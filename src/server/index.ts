import express from 'express';
import cors from 'cors';
import { dependencyMapData, sampleBlastRadius } from '../data/dependencyMapData';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all dependency map data
app.get('/api/dependencies', (req, res) => {
  res.json(dependencyMapData);
});

// Get nodes by domain
app.get('/api/dependencies/domain/:domainId', (req, res) => {
  const { domainId } = req.params;
  const nodes = dependencyMapData.nodes.filter(node => node.domain === domainId);
  res.json(nodes);
});

// Get nodes by team
app.get('/api/dependencies/team/:teamId', (req, res) => {
  const { teamId } = req.params;
  const nodes = dependencyMapData.nodes.filter(node => node.team === teamId);
  res.json(nodes);
});

// Get dependencies for a specific node
app.get('/api/dependencies/node/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const node = dependencyMapData.nodes.find(n => n.id === nodeId);
  
  if (!node) {
    return res.status(404).json({ error: 'Node not found' });
  }

  const incomingLinks = dependencyMapData.links.filter(link => link.target === nodeId);
  const outgoingLinks = dependencyMapData.links.filter(link => link.source === nodeId);
  
  const incomingNodes = incomingLinks.map(link => 
    dependencyMapData.nodes.find(n => n.id === link.source)
  ).filter(Boolean);
  
  const outgoingNodes = outgoingLinks.map(link => 
    dependencyMapData.nodes.find(n => n.id === link.target)
  ).filter(Boolean);

  res.json({
    node,
    incomingLinks,
    outgoingLinks,
    incomingNodes,
    outgoingNodes
  });
});

// Calculate blast radius for a node
app.post('/api/blast-radius', (req, res) => {
  const { sourceNodeId } = req.body;
  
  if (!sourceNodeId) {
    return res.status(400).json({ error: 'Source node ID is required' });
  }

  const sourceNode = dependencyMapData.nodes.find(n => n.id === sourceNodeId);
  if (!sourceNode) {
    return res.status(404).json({ error: 'Source node not found' });
  }

  // Simple blast radius calculation - find all connected nodes
  const affectedNodes = new Set<string>([sourceNodeId]);
  const affectedLinks = new Set<string>();
  
  const traverse = (nodeId: string, depth: number = 0) => {
    if (depth > 3) return; // Limit depth to prevent infinite loops
    
    dependencyMapData.links.forEach(link => {
      if (link.source === nodeId && !affectedNodes.has(link.target)) {
        affectedNodes.add(link.target);
        affectedLinks.add(link.id);
        traverse(link.target, depth + 1);
      } else if (link.target === nodeId && !affectedNodes.has(link.source)) {
        affectedNodes.add(link.source);
        affectedLinks.add(link.id);
        traverse(link.source, depth + 1);
      }
    });
  };

  traverse(sourceNodeId);

  const blastRadius = {
    sourceNodeId,
    affectedNodes: Array.from(affectedNodes),
    affectedLinks: Array.from(affectedLinks),
    severity: affectedNodes.size > 20 ? 'critical' : affectedNodes.size > 10 ? 'high' : 'medium',
    description: `Incident starting from ${sourceNode.name} affecting ${affectedNodes.size - 1} connected components`
  };

  res.json(blastRadius);
});

// Get sample blast radius
app.get('/api/blast-radius/sample', (req, res) => {
  res.json(sampleBlastRadius);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Dependency Map API server running on port ${PORT}`);
});

export default app; 