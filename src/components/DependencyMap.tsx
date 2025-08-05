import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { token } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives';
import Lozenge from '@atlaskit/lozenge';

import Select from '@atlaskit/select';
import Checkbox from '@atlaskit/checkbox';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import CrossIcon from '@atlaskit/icon/glyph/cross';

import { AtlassianIcon } from '@atlaskit/logo';
import { DependencyNode, DependencyLink, FilterState } from '../types/dependencyMap';
import { dependencyMapData } from '../data/dependencyMapData';
import OwnerAvatar from './OwnerAvatar';

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: ${token('space.200')} ${token('space.300')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  pointer-events: none;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.200')};
  pointer-events: auto;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.200')};
  pointer-events: auto;
`;



const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${token('space.200')};
  width: 100%;
  margin-bottom: 8px;
`;



const DependencyTypeToggle = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${token('space.200')};
  align-items: center;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.100')};
  font-size: 12px;
  font-weight: 500;
  color: ${token('color.text')};
`;

const Legend = styled.div`
  position: absolute;
  top: 80px;
  left: ${token('space.300')};
  z-index: 1000;
  background: white;
  border: 1px solid ${token('color.border')};
  border-radius: 6px;
  padding: ${token('space.200')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 250px;
`;

const LegendHeading = styled.div`
  margin-bottom: 8px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.100')};
  margin-bottom: ${token('space.100')};
  font-size: 12px;
`;

const LegendColor = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${props => props.color};
`;

const NodeTooltip = styled.div<{ isDarkMode: boolean }>`
  position: absolute;
  background: ${props => props.isDarkMode ? '#1D2125' : '#FFFFFF'};
  border: 1px solid ${props => props.isDarkMode ? '#42526E' : '#DFE1E6'};
  border-radius: ${token('border.radius.300')};
  padding: ${token('space.200')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 10000;
  max-width: 250px;
  font-size: 12px;
  backdrop-filter: none;
  color: ${props => props.isDarkMode ? '#E6FCFF' : '#172B4D'};
`;

const NodeDrawer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 25px;
  right: ${props => props.isOpen ? '24px' : '-424px'};
  width: 400px;
  height: calc(100vh - 50px);
  background: ${token('elevation.surface')};
  border: 1px solid ${token('color.border')};
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10001;
  transition: right 0.3s ease;
  overflow-y: auto;
  padding: 28px ${token('space.300')} ${token('space.300')} ${token('space.300')};
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${token('space.300')};
  padding-bottom: ${token('space.200')};
  border-bottom: 1px solid ${token('color.border')};
`;

const DrawerSection = styled.div`
  margin-bottom: ${token('space.300')};
`;

const DrawerSectionTitle = styled.div`
  font-weight: 600;
  margin-bottom: ${token('space.100')};
  color: ${token('color.text.subtle')};
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DrawerContent = styled.div`
  color: ${token('color.text')};
  font-size: 14px;
  line-height: 1.5;
`;

const DrawerCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${token('space.100')};
  border-radius: ${token('border.radius.100')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${token('color.text.subtle')};
  
  &:hover {
    background: ${token('color.background.neutral')};
  }
`;



interface DependencyMapProps {
  data?: {
    nodes: DependencyNode[];
    links: DependencyLink[];
    domains: any[];
    teams: any[];
    products: any[];
    businessUnits: any[];
  };
  onResetApp?: () => void;
}

const DependencyMap: React.FC<DependencyMapProps> = ({ data = dependencyMapData, onResetApp }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    selectedDomains: [], // Start with no domains selected
    selectedTeams: [], // Start with no teams selected
    selectedProducts: [], // Start with no products selected
    selectedOwners: [], // Start with no owners selected
    selectedBusinessUnits: [], // Start with no business units selected
    selectedStatuses: ['healthy', 'degraded', 'down', 'warning'],
    showBlastRadius: false,
    blastRadiusData: undefined,
    selectedDependencyTypes: ['vertical', 'horizontal'] // Show both types by default
  });
  // Removed selectedNode state to prevent unnecessary re-renders
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const [selectedNode, setSelectedNode] = useState<DependencyNode | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const currentTheme = 'light';

  // Create color scales
  const domainColorScale = d3.scaleOrdinal<string, string>()
    .domain(data.domains.map(d => d.id))
    .range(data.domains.map(d => d.color));



  // Helper function to get all owner IDs for a node
  const getNodeOwnerIds = (node: DependencyNode) => {
    const domain = data.domains.find(d => d.id === node.domain);
    const team = data.teams.find(t => t.id === node.team);
    const product = data.products.find(p => p.id === node.product);
    const businessUnit = data.businessUnits.find(bu => bu.name === node.businessUnit);
    
    const ownerIds = [];
    if (domain?.owner) ownerIds.push(domain.owner.id);
    if (team?.owner) ownerIds.push(team.owner.id);
    if (product?.owner) ownerIds.push(product.owner.id);
    if (businessUnit?.owner) ownerIds.push(businessUnit.owner.id);
    
    return ownerIds;
  };

  // Filter data based on current filters - memoized to prevent unnecessary re-renders
  const filteredNodes = useMemo(() => 
    data.nodes.filter(node => 
      (filterState.selectedDomains.length === 0 || filterState.selectedDomains.includes(node.domain)) &&
      (filterState.selectedTeams.length === 0 || filterState.selectedTeams.includes(node.team)) &&
      (filterState.selectedProducts.length === 0 || filterState.selectedProducts.includes(node.product)) &&
      (filterState.selectedOwners.length === 0 || getNodeOwnerIds(node).some(ownerId => filterState.selectedOwners.includes(ownerId))) &&
      (filterState.selectedBusinessUnits.length === 0 || filterState.selectedBusinessUnits.includes(node.businessUnit)) &&
      filterState.selectedStatuses.includes(node.status)
    ), [data.nodes, filterState.selectedDomains, filterState.selectedTeams, filterState.selectedProducts, filterState.selectedOwners, filterState.selectedBusinessUnits, filterState.selectedStatuses]
  );

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return data.links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target) &&
      filterState.selectedDependencyTypes.includes(link.type)
    );
  }, [data.links, filteredNodes, filterState.selectedDependencyTypes]);





  // Initialize D3 visualization
  useEffect(() => {
    console.log('D3 useEffect triggered - recreating visualization');
    console.log('Filtered nodes:', filteredNodes.length, 'Filtered links:', filteredLinks.length);
    if (!svgRef.current) return;
    
    // Don't recreate if we have no data
    if (filteredNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create main group
    const g = svg.append('g');

    // Create zoom behavior - enable all zoom interactions like Port.io demo
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Stop previous simulation if it exists
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Light mode colors only
    const nodeBackgroundColor = '#FFFFFF';
    const borderColor = '#DFE1E6';
    const textColor = '#172B4D';
    const linkColor = '#42526E';
    const warningIconBg = '#FFFFFF';
    const warningIconBorder = '#FF5630';

    // Create force simulation with better spacing like Port.io demo
    const simulation = d3.forceSimulation<DependencyNode>(filteredNodes)
      .force('link', d3.forceLink<DependencyNode, DependencyLink>(filteredLinks).id((d: DependencyNode) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80))
      .alphaDecay(0.05) // Slower stabilization for better layout
      .velocityDecay(0.3); // Less damping for more natural movement

    simulationRef.current = simulation;

    // Define arrow marker for vertical dependencies
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#FF69B4');

    // Create curved links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(filteredLinks)
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return '#FF5630'; // Red for all affected links
          }
          return linkColor;
        }
        // Different colors for vertical vs horizontal dependencies
        if (d.type === 'vertical') {
          return '#FF69B4'; // Pink for vertical
        } else {
          return '#36B37E'; // Green for horizontal
        }
      })
      .attr('stroke-width', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return '2';
          }
        }
        // Thicker lines for vertical dependencies
        return d.type === 'vertical' ? '2' : '1';
      })
      .attr('stroke-opacity', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return 1;
          }
          return 0.3;
        }
        return 0.8;
      })
      .attr('stroke-dasharray', (d: any) => {
        // Dashed lines for horizontal dependencies, solid for vertical
        return d.type === 'horizontal' ? '5,5' : null;
      })
      .attr('marker-end', (d: any) => {
        // Add arrow head only for vertical dependencies
        return d.type === 'vertical' ? 'url(#arrowhead)' : null;
      });

    // Create nodes with drag behavior like Port.io demo
    const nodes = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('cursor', 'grab')
      .style('pointer-events', 'all') // Ensure events are captured
      .call(d3.drag<SVGGElement, DependencyNode>()
        .on('start', (event, d) => {
          console.log('Drag start on:', d.name);
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
          event.sourceEvent.stopPropagation();
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
          event.sourceEvent.stopPropagation();
        })
        .on('end', (event, d) => {
          console.log('Drag end on:', d.name);
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          event.sourceEvent.stopPropagation();
        })
      )
      .on('mouseover', (event, d) => {
        console.log('Mouse over:', d.name);
        event.stopPropagation(); // Prevent zoom interference
        showTooltip(event, d);
      })
      .on('mouseout', (event, d) => {
        console.log('Mouse out:', d.name);
        event.stopPropagation(); // Prevent zoom interference
        hideTooltip();
      })
      .on('click', (event, d) => {
        console.log('Click on:', d.name);
        event.stopPropagation(); // Prevent zoom interference
        setSelectedNode(d);
        setIsDrawerOpen(true);
      });

    // Add rectangles to nodes - larger and more spaced like Port.io demo
    nodes.append('rect')
      .attr('width', (d: any) => Math.max(140, d.name.length * 10))
      .attr('height', 50)
      .attr('rx', 8)
      .attr('fill', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (d.id === filterState.blastRadiusData.sourceNodeId) {
            return '#DE350B'; // Darker red for the source of the incident
          }
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id)) {
            return '#FF5630'; // Solid red for direct issues
          }
          if (filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return '#FF8B00'; // Orange for potential issues
          }
        }
        
        // Check if this node's domain is selected in the filter
        const isDomainSelected = filterState.selectedDomains.length === 0 || filterState.selectedDomains.includes(d.domain);
        const isTeamSelected = filterState.selectedTeams.length === 0 || filterState.selectedTeams.includes(d.team);
        const isProductSelected = filterState.selectedProducts.length === 0 || filterState.selectedProducts.includes(d.product);
        
        // Only show domain color if the node is selected by filters
        if (isDomainSelected && isTeamSelected && isProductSelected && 
            (filterState.selectedDomains.length > 0 || filterState.selectedTeams.length > 0 || filterState.selectedProducts.length > 0)) {
          return domainColorScale(d.domain);
        }
        
        return nodeBackgroundColor;
      })
      .attr('stroke', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return '#FF5630'; // Red for all affected nodes
          }
        }
        
        // Check if this node's domain is selected in the filter
        const isDomainSelected = filterState.selectedDomains.length === 0 || filterState.selectedDomains.includes(d.domain);
        const isTeamSelected = filterState.selectedTeams.length === 0 || filterState.selectedTeams.includes(d.team);
        const isProductSelected = filterState.selectedProducts.length === 0 || filterState.selectedProducts.includes(d.product);
        
        // Only show domain color border if the node is selected by filters
        if (isDomainSelected && isTeamSelected && isProductSelected && 
            (filterState.selectedDomains.length > 0 || filterState.selectedTeams.length > 0 || filterState.selectedProducts.length > 0)) {
          return domainColorScale(d.domain);
        }
        
        return borderColor;
      })
      .attr('stroke-width', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return '3';
          }
        }
        return '1';
      })
      .attr('opacity', (d: any): number => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id) || 
              d.id === filterState.blastRadiusData.sourceNodeId) {
            return 1;
          }
          return 0.3;
        }
        return 1;
      });

    // Add warning icons to affected nodes
    nodes.filter((d: any) => {
      if (filterState.showBlastRadius && filterState.blastRadiusData) {
        return filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
               filterState.blastRadiusData.potentialIssues.nodes.includes(d.id);
      }
      return false;
    })
    .append('circle')
      .attr('cx', (d: any) => Math.max(140, d.name.length * 10) - 15)
      .attr('cy', 15)
      .attr('r', 8)
      .attr('fill', warningIconBg)
      .attr('stroke', warningIconBorder)
      .attr('stroke-width', '1');

    // Add incident source icon for the primary incident node
    nodes.filter((d: any) => {
      if (filterState.showBlastRadius && filterState.blastRadiusData) {
        return d.id === filterState.blastRadiusData.sourceNodeId;
      }
      return false;
    })
    .append('text')
      .attr('x', (d: any) => Math.max(140, d.name.length * 10) - 15)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text('💥');

    // Add warning icon symbol to other affected nodes
    nodes.filter((d: any) => {
      if (filterState.showBlastRadius && filterState.blastRadiusData) {
        return (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
                filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) &&
               d.id !== filterState.blastRadiusData.sourceNodeId;
      }
      return false;
    })
    .append('text')
      .attr('x', (d: any) => Math.max(140, d.name.length * 10) - 15)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FFFFFF')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')
      .text('!');

    // Add text to nodes - positioned for larger rectangles
    nodes.append('text')
      .attr('x', (d: any) => Math.max(140, d.name.length * 10) / 2)
      .attr('y', 32)
      .attr('text-anchor', 'middle')
      .attr('fill', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return '#FFFFFF'; // White text for all affected nodes
          }
        }
        return textColor;
      })
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none') // Prevent text from blocking events
      .text((d: any) => d.name)
      .attr('opacity', (d: any): number => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id) || 
              d.id === filterState.blastRadiusData.sourceNodeId) {
            return 1;
          }
          return 0.3;
        }
        return 1;
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links.attr('d', (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Create curved path with control points
        const midX = (d.source.x + d.target.x) / 2;
        const midY = (d.source.y + d.target.y) / 2;
        const curveOffset = Math.min(dr * 0.3, 50); // Curvature based on distance
        
        return `M${d.source.x},${d.source.y} Q${midX},${midY - curveOffset} ${d.target.x},${d.target.y}`;
      });

      nodes.attr('transform', (d: any) => `translate(${d.x - Math.max(140, d.name.length * 10) / 2},${d.y - 25})`);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [filteredNodes, filteredLinks, filterState.showBlastRadius, filterState.blastRadiusData]);

  // Removed highlightDependencies function to prevent map expansion and line disappearance

  const showTooltip = (event: any, node: DependencyNode) => {
    console.log('Show tooltip for:', node.name); // Debug log
    
    // Get owner information
    const domain = data.domains.find(d => d.id === node.domain);
    const team = data.teams.find(t => t.id === node.team);
    const product = data.products.find(p => p.id === node.product);
    const businessUnit = data.businessUnits.find(bu => bu.name === node.businessUnit);
    
    const content = `
      <strong>${node.name}</strong><br/>
      ${node.description ? `${node.description}<br/>` : ''}
      Type: ${node.type}<br/>
      Domain: ${node.domain}<br/>
      Team: ${node.team}<br/>
      Status: ${node.status}<br/>
      Version: ${node.version || 'N/A'}<br/>
      Deployment: ${node.deploymentStatus || 'N/A'}<br/>
      <br/>
      <strong>Owners:</strong><br/>
      Domain Owner: ${domain?.owner.name || 'N/A'}<br/>
      Team Owner: ${team?.owner.name || 'N/A'}<br/>
      Product Owner: ${product?.owner.name || 'N/A'}<br/>
      Business Unit Owner: ${businessUnit?.owner.name || 'N/A'}
    `;
    
    setTooltip({
      x: event.pageX + 10,
      y: event.pageY - 10,
      content
    });
  };

  const hideTooltip = () => {
    console.log('Hide tooltip'); // Debug log
    setTooltip(null);
  };

  const generateBlastRadiusScenario = () => {
    // Simulate a major database incident that cascades through the system
    const incidentSource = 'mariadb-primary'; // Primary database failure
    
    // Find all links to trace the impact path
    const directlyAffected = new Set();
    const potentiallyAffected = new Set();
    const affectedLinks = new Set();
    
    // Find all services that directly depend on the primary database
    const directDependents = data.links.filter(link => link.target === incidentSource);
    directDependents.forEach(link => {
      directlyAffected.add(link.source);
      affectedLinks.add(link.id);
    });
    
    // Find services that depend on the directly affected services (cascade effect)
    directlyAffected.forEach(affectedNode => {
      const cascadeDependents = data.links.filter(link => link.target === affectedNode);
      cascadeDependents.forEach(link => {
        potentiallyAffected.add(link.source);
        affectedLinks.add(link.id);
      });
    });
    
    // Add the source node to directly affected
    directlyAffected.add(incidentSource);
    
    return {
      sourceNodeId: incidentSource,
      directIssues: {
        nodes: Array.from(directlyAffected),
        links: Array.from(affectedLinks).slice(0, 10) // Limit for performance
      },
      potentialIssues: {
        nodes: Array.from(potentiallyAffected),
        links: Array.from(affectedLinks).slice(10, 20) // Additional affected links
      },
      severity: 'critical' as const,
      description: 'Primary database failure causing cascading service outages across Wikipedia infrastructure. Multiple frontend and API services experiencing degraded performance or complete outages.'
    };
  };

  const toggleBlastRadius = () => {
    if (filterState.showBlastRadius) {
      setFilterState(prev => ({
        ...prev,
        showBlastRadius: false,
        blastRadiusData: undefined
      }));
    } else {
      const blastRadiusData = generateBlastRadiusScenario();
      setFilterState(prev => ({
        ...prev,
        showBlastRadius: true,
        blastRadiusData
      }));
    }
  };





  const resetView = () => {
    if (onResetApp) {
      // Reset the entire application
      onResetApp();
    } else {
      // Fallback to just resetting the view
      if (svgRef.current) {
        const svg = d3.select(svgRef.current);
        svg.transition().duration(750).call(
          d3.zoom<SVGSVGElement, unknown>().transform,
          d3.zoomIdentity
        );
      }
    }
  };

  return (
    <MapContainer>
      <Header>
        <HeaderLeft>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginRight: token('space.300')
          }}>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
              <AtlassianIcon appearance="brand" />
            </div>
            <div style={{ 
              fontWeight: 'bold', 
              fontSize: 'calc(1.25rem * 0.8)', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              color: token('color.text'),
              lineHeight: 1.2
            }}>
              Dependency Map
            </div>
          </div>
          <Lozenge appearance="default" isBold>{filteredNodes.length} nodes</Lozenge>
          <Lozenge appearance="default">{filteredLinks.length} links</Lozenge>
        </HeaderLeft>
        <HeaderRight>
        </HeaderRight>
      </Header>

      <Legend>
        <ControlGroup>
          <Select
            inputId="product-select"
            className="product-select"
            classNamePrefix="react-select"
            options={data.products.map(product => ({
              label: product.name,
              value: product.id,
              color: product.color
            }))}
            value={data.products
              .filter(product => filterState.selectedProducts.includes(product.id))
              .map(product => ({
                label: product.name,
                value: product.id,
                color: product.color
              }))}
            onChange={(selectedOptions: any) => {
              const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
              setFilterState(prev => ({
                ...prev,
                selectedProducts: selectedIds
              }));
            }}
            isMulti
            placeholder="Product"
            styles={{
              container: (provided: any) => ({
                ...provided,
                width: '100%'
              }),
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px',
                width: '100%'
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                fontSize: '12px',
                padding: '8px 12px'
              }),
              multiValue: (provided: any) => ({
                ...provided,
                fontSize: '11px'
              })
            }}
          />
        </ControlGroup>

        <ControlGroup>
          <Select
            inputId="domain-select"
            className="domain-select"
            classNamePrefix="react-select"
            options={data.domains.map(domain => ({
              label: domain.name,
              value: domain.id,
              color: domain.color
            }))}
            value={data.domains
              .filter(domain => filterState.selectedDomains.includes(domain.id))
              .map(domain => ({
                label: domain.name,
                value: domain.id,
                color: domain.color
              }))}
            onChange={(selectedOptions: any) => {
              const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
              setFilterState(prev => ({
                ...prev,
                selectedDomains: selectedIds
              }));
            }}
            isMulti
            placeholder="Domain"
            styles={{
              container: (provided: any) => ({
                ...provided,
                width: '100%'
              }),
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px',
                width: '100%'
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                fontSize: '12px',
                padding: '8px 12px'
              }),
              multiValue: (provided: any) => ({
                ...provided,
                fontSize: '11px'
              })
            }}
          />
        </ControlGroup>

        <ControlGroup>
          <Select
            inputId="team-select"
            className="team-select"
            classNamePrefix="react-select"
            options={data.teams.map(team => ({
              label: team.name,
              value: team.id,
              color: team.color
            }))}
            value={data.teams
              .filter(team => filterState.selectedTeams.includes(team.id))
              .map(team => ({
                label: team.name,
                value: team.id,
                color: team.color
              }))}
            onChange={(selectedOptions: any) => {
              const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
              setFilterState(prev => ({
                ...prev,
                selectedTeams: selectedIds
              }));
            }}
            isMulti
            placeholder="Team"
            styles={{
              container: (provided: any) => ({
                ...provided,
                width: '100%'
              }),
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px',
                width: '100%'
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                fontSize: '12px',
                padding: '8px 12px'
              }),
              multiValue: (provided: any) => ({
                ...provided,
                fontSize: '11px'
              })
            }}
          />
        </ControlGroup>

        <ControlGroup>
          <Select
            inputId="owner-select"
            className="owner-select"
            classNamePrefix="react-select"
            options={[
              ...data.domains.map(domain => ({
                label: domain.owner.name,
                value: domain.owner.id,
                avatar: domain.owner.avatar,
                color: domain.color
              })),
              ...data.teams.map(team => ({
                label: team.owner.name,
                value: team.owner.id,
                avatar: team.owner.avatar,
                color: team.color
              })),
              ...data.products.map(product => ({
                label: product.owner.name,
                value: product.owner.id,
                avatar: product.owner.avatar,
                color: product.color
              })),
              ...data.businessUnits.map(bu => ({
                label: bu.owner.name,
                value: bu.owner.id,
                avatar: bu.owner.avatar,
                color: '#6B778C'
              }))
            ]}
            value={[
              ...data.domains
                .filter(domain => filterState.selectedOwners.includes(domain.owner.id))
                .map(domain => ({
                  label: domain.owner.name,
                  value: domain.owner.id,
                  avatar: domain.owner.avatar,
                  color: domain.color
                })),
              ...data.teams
                .filter(team => filterState.selectedOwners.includes(team.owner.id))
                .map(team => ({
                  label: team.owner.name,
                  value: team.owner.id,
                  avatar: team.owner.avatar,
                  color: team.color
                })),
              ...data.products
                .filter(product => filterState.selectedOwners.includes(product.owner.id))
                .map(product => ({
                  label: product.owner.name,
                  value: product.owner.id,
                  avatar: product.owner.avatar,
                  color: product.color
                })),
              ...data.businessUnits
                .filter(bu => filterState.selectedOwners.includes(bu.owner.id))
                .map(bu => ({
                  label: bu.owner.name,
                  value: bu.owner.id,
                  avatar: bu.owner.avatar,
                  color: '#6B778C'
                }))
            ]}
            onChange={(selectedOptions: any) => {
              const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
              setFilterState(prev => ({
                ...prev,
                selectedOwners: selectedIds
              }));
            }}
            isMulti
            placeholder="Owner"
            styles={{
              container: (provided: any) => ({
                ...provided,
                width: '100%'
              }),
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px',
                width: '100%'
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                fontSize: '12px',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }),
              multiValue: (provided: any) => ({
                ...provided,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              })
            }}
            components={{
              Option: ({ data, ...props }: any) => (
                <div {...props.innerProps} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>
                  <img 
                    src={data.avatar} 
                    alt={data.label}
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%',
                      border: '1px solid #DFE1E6'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.style.width = '16px';
                        fallback.style.height = '16px';
                        fallback.style.borderRadius = '50%';
                        fallback.style.backgroundColor = '#0052CC';
                        fallback.style.display = 'flex';
                        fallback.style.alignItems = 'center';
                        fallback.style.justifyContent = 'center';
                        fallback.style.color = 'white';
                        fallback.style.fontSize = '8px';
                        fallback.style.fontWeight = 'bold';
                        fallback.textContent = data.label.split(' ').map((n: string) => n[0]).join('');
                        parent.insertBefore(fallback, target);
                      }
                    }}
                  />
                  <span>{data.label}</span>
                </div>
              ),
              MultiValue: ({ data, ...props }: any) => (
                <div {...props.innerProps} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F4F5F7', borderRadius: '4px', padding: '2px 6px', margin: '2px' }}>
                  <img 
                    src={data.avatar} 
                    alt={data.label}
                    style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%',
                      border: '1px solid #DFE1E6'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.style.width = '12px';
                        fallback.style.height = '12px';
                        fallback.style.borderRadius = '50%';
                        fallback.style.backgroundColor = '#0052CC';
                        fallback.style.display = 'flex';
                        fallback.style.alignItems = 'center';
                        fallback.style.justifyContent = 'center';
                        fallback.style.color = 'white';
                        fallback.style.fontSize = '6px';
                        fallback.style.fontWeight = 'bold';
                        fallback.textContent = data.label.split(' ').map((n: string) => n[0]).join('');
                        parent.insertBefore(fallback, target);
                      }
                    }}
                  />
                  <span style={{ fontSize: '11px' }}>{data.label}</span>
                </div>
              )
            }}
          />
        </ControlGroup>

        <ControlGroup>
          <Select
            inputId="business-unit-select"
            className="business-unit-select"
            classNamePrefix="react-select"
            options={data.businessUnits.map(bu => ({
              label: bu.name,
              value: bu.id,
              color: '#6B778C'
            }))}
            value={data.businessUnits
              .filter(bu => filterState.selectedBusinessUnits.includes(bu.id))
              .map(bu => ({
                label: bu.name,
                value: bu.id,
                color: '#6B778C'
              }))}
            onChange={(selectedOptions: any) => {
              const selectedIds = selectedOptions ? selectedOptions.map((option: any) => option.value) : [];
              setFilterState(prev => ({
                ...prev,
                selectedBusinessUnits: selectedIds
              }));
            }}
            isMulti
            placeholder="Business Unit"
            styles={{
              container: (provided: any) => ({
                ...provided,
                width: '100%'
              }),
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px',
                width: '100%'
              }),
              option: (provided: any, state: any) => ({
                ...provided,
                fontSize: '12px',
                padding: '8px 12px'
              }),
              multiValue: (provided: any) => ({
                ...provided,
                fontSize: '11px'
              })
            }}
          />
        </ControlGroup>

        <ControlGroup>
          <DependencyTypeToggle>
            <CheckboxContainer>
              <Checkbox
                isChecked={filterState.selectedDependencyTypes.includes('vertical')}
                onChange={() => {
                  setFilterState(prev => ({
                    ...prev,
                    selectedDependencyTypes: prev.selectedDependencyTypes.includes('vertical')
                      ? prev.selectedDependencyTypes.filter(type => type !== 'vertical')
                      : [...prev.selectedDependencyTypes, 'vertical']
                  }));
                }}
                label="Vertical"
              />
            </CheckboxContainer>
            <CheckboxContainer>
              <Checkbox
                isChecked={filterState.selectedDependencyTypes.includes('horizontal')}
                onChange={() => {
                  setFilterState(prev => ({
                    ...prev,
                    selectedDependencyTypes: prev.selectedDependencyTypes.includes('horizontal')
                      ? prev.selectedDependencyTypes.filter(type => type !== 'horizontal')
                      : [...prev.selectedDependencyTypes, 'horizontal']
                  }));
                }}
                label="Horizontal"
              />
            </CheckboxContainer>
          </DependencyTypeToggle>
          <div style={{ display: 'flex', gap: '8px', paddingRight: '8px' }}>
            <Button
              appearance={filterState.showBlastRadius ? "primary" : "default"}
              onClick={toggleBlastRadius}
              size="small"
            >
              Blast radius
            </Button>
            <Button
              onClick={resetView}
              size="small"
            >
              Reset view
            </Button>
          </div>
        </ControlGroup>

        <div style={{ marginTop: token('space.200'), paddingTop: token('space.200'), borderTop: `1px solid ${token('color.border')}` }}>
          <LegendHeading>
            <Text weight="bold" size="small">Node Types</Text>
          </LegendHeading>
          <LegendItem>
            <LegendColor color="#0052CC" />
            <span>Frontend</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#36B37E" />
            <span>Application (MediaWiki)</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#FF8B00" />
            <span>API</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#FF69B4" />
            <span>Services</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#FF5630" />
            <span>Data</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#00B8D9" />
            <span>Infrastructure</span>
          </LegendItem>
        </div>
        <div style={{ marginTop: token('space.200'), paddingTop: token('space.200'), borderTop: `1px solid ${token('color.border')}` }}>
          <LegendHeading>
            <Text weight="bold" size="small">Dependency Types</Text>
          </LegendHeading>
          <LegendItem>
            <LegendColor color="#FF69B4" />
            <span>Vertical (Solid)</span>
          </LegendItem>
          <LegendItem>
            <LegendColor color="#36B37E" />
            <span>Horizontal (Dashed)</span>
          </LegendItem>
        </div>
        {filterState.showBlastRadius && (
          <>
            <LegendItem>
              <LegendColor color="#FF5630" />
              <span>Affected Services</span>
            </LegendItem>
          </>
        )}
      </Legend>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
      />

      {tooltip && (
        <NodeTooltip
          isDarkMode={false}
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
          dangerouslySetInnerHTML={{ __html: tooltip.content }}
        />
      )}

      {filterState.showBlastRadius && filterState.blastRadiusData && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '20px',
          background: token('color.background.neutral'),
          border: '1px solid',
          borderColor: token('color.border'),
          borderRadius: token('border.radius.300'),
          padding: token('space.200'),
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          maxWidth: '300px',
          zIndex: 1000
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: token('space.100'),
            marginBottom: token('space.100')
          }}>
            <WarningIcon label="Warning" primaryColor={token('color.icon.warning')} />
            <Heading size="small">Active Incident</Heading>
          </div>
          <Text size="small" color="color.text.subtle">
            {filterState.blastRadiusData.description}
          </Text>
          <Lozenge appearance="default" isBold>
            {filterState.blastRadiusData.severity.toUpperCase()}
          </Lozenge>
        </div>
      )}

      {/* Node Detail Drawer */}
      <NodeDrawer isOpen={isDrawerOpen}>
        {selectedNode && (
          <>
            <DrawerHeader>
              <Heading size="large">{selectedNode.name}</Heading>
              <DrawerCloseButton onClick={() => setIsDrawerOpen(false)}>
                <CrossIcon label="Close" />
              </DrawerCloseButton>
            </DrawerHeader>

            <DrawerSection>
              <DrawerSectionTitle>Description</DrawerSectionTitle>
              <DrawerContent>
                {selectedNode.description || 'No description available'}
              </DrawerContent>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>Technology Stack</DrawerSectionTitle>
              <DrawerContent>
                <strong>Type:</strong> {selectedNode.type}<br/>
                <strong>Version:</strong> {selectedNode.version || 'N/A'}<br/>
                <strong>Deployment Status:</strong> {selectedNode.deploymentStatus || 'N/A'}
              </DrawerContent>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>Organization</DrawerSectionTitle>
              <DrawerContent>
                <strong>Domain:</strong> {selectedNode.domain}<br/>
                <strong>Team:</strong> {selectedNode.team}<br/>
                <strong>Product:</strong> {selectedNode.product}<br/>
                <strong>Business Unit:</strong> {selectedNode.businessUnit}
              </DrawerContent>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>Owners</DrawerSectionTitle>
              <DrawerContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <OwnerAvatar 
                      owner={data.domains.find(d => d.id === selectedNode.domain)?.owner || { id: '', name: 'Unknown', avatar: '', email: '' }} 
                      size={20} 
                    />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Domain Owner</div>
                      <div style={{ fontSize: '11px', color: '#6B778C' }}>
                        {data.domains.find(d => d.id === selectedNode.domain)?.owner.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <OwnerAvatar 
                      owner={data.teams.find(t => t.id === selectedNode.team)?.owner || { id: '', name: 'Unknown', avatar: '', email: '' }} 
                      size={20} 
                    />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Team Owner</div>
                      <div style={{ fontSize: '11px', color: '#6B778C' }}>
                        {data.teams.find(t => t.id === selectedNode.team)?.owner.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <OwnerAvatar 
                      owner={data.products.find(p => p.id === selectedNode.product)?.owner || { id: '', name: 'Unknown', avatar: '', email: '' }} 
                      size={20} 
                    />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Product Owner</div>
                      <div style={{ fontSize: '11px', color: '#6B778C' }}>
                        {data.products.find(p => p.id === selectedNode.product)?.owner.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <OwnerAvatar 
                      owner={data.businessUnits.find(bu => bu.name === selectedNode.businessUnit)?.owner || { id: '', name: 'Unknown', avatar: '', email: '' }} 
                      size={20} 
                    />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Business Unit Owner</div>
                      <div style={{ fontSize: '11px', color: '#6B778C' }}>
                        {data.businessUnits.find(bu => bu.name === selectedNode.businessUnit)?.owner.name || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>Status</DrawerSectionTitle>
              <DrawerContent>
                <Lozenge appearance="default" isBold>
                  {selectedNode.status.toUpperCase()}
                </Lozenge>
              </DrawerContent>
            </DrawerSection>

            <DrawerSection>
              <DrawerSectionTitle>Dependencies</DrawerSectionTitle>
              <DrawerContent>
                <strong>Incoming:</strong> {filteredLinks.filter(link => link.target === selectedNode.id).length} connections<br/>
                <strong>Outgoing:</strong> {filteredLinks.filter(link => link.source === selectedNode.id).length} connections<br/>
                <strong>Total:</strong> {filteredLinks.filter(link => link.source === selectedNode.id || link.target === selectedNode.id).length} connections
              </DrawerContent>
            </DrawerSection>
          </>
        )}
      </NodeDrawer>
    </MapContainer>
  );
};

export default DependencyMap; 