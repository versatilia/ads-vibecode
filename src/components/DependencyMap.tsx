import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { token } from '@atlaskit/tokens';
import styled from '@emotion/styled';
import Button from '@atlaskit/button';
import Heading from '@atlaskit/heading';
import { Text } from '@atlaskit/primitives';
import Lozenge from '@atlaskit/lozenge';
import Toggle from '@atlaskit/toggle';
import Select from '@atlaskit/select';
import { AtlassianLogo } from '@atlaskit/logo';
import ComponentIcon from '@atlaskit/icon/glyph/component';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { DependencyNode, DependencyLink, FilterState, BlastRadius } from '../types/dependencyMap';
import { dependencyMapData, sampleBlastRadius } from '../data/dependencyMapData';

const MapContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: ${token('elevation.surface')};
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
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${token('space.200')};
`;

const Controls = styled.div`
  position: absolute;
  top: 80px;
  left: ${token('space.300')};
  z-index: 1000;
  background: ${token('color.background.neutral')};
  border: 1px solid ${token('color.border')};
  border-radius: ${token('border.radius.300')};
  padding: ${token('space.200')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  display: flex;
  gap: ${token('space.300')};
`;

const ControlGroup = styled.div`
  flex: 1;
  min-width: 180px;
`;

const ControlLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${token('color.text.subtle')};
  margin-bottom: ${token('space.100')};
`;

const Legend = styled.div`
  position: absolute;
  bottom: ${token('space.300')};
  right: ${token('space.300')};
  z-index: 1000;
  background: ${token('color.background.neutral')};
  border: 1px solid ${token('color.border')};
  border-radius: ${token('border.radius.300')};
  padding: ${token('space.200')};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-width: 150px;
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

interface DependencyMapProps {
  data?: {
    nodes: DependencyNode[];
    links: DependencyLink[];
    domains: any[];
    teams: any[];
    products: any[];
  };
  onResetApp?: () => void;
}

const DependencyMap: React.FC<DependencyMapProps> = ({ data = dependencyMapData, onResetApp }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    selectedDomains: [], // Start with no domains selected
    selectedTeams: [], // Start with no teams selected
    selectedProducts: [], // Start with no products selected
    selectedStatuses: ['healthy', 'degraded', 'down', 'warning'],
    showBlastRadius: false,
    blastRadiusData: undefined
  });
  // Removed selectedNode state to prevent unnecessary re-renders
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  // Create color scales
  const domainColorScale = d3.scaleOrdinal<string, string>()
    .domain(data.domains.map(d => d.id))
    .range(data.domains.map(d => d.color));

  const statusColorScale = d3.scaleOrdinal<string, string>()
    .domain(['healthy', 'degraded', 'down', 'warning'])
    .range(['#36B37E', '#FF8B00', '#FF5630', '#FFAB00']);

  const blastRadiusColorScale = d3.scaleOrdinal<string, string>()
    .domain(['source', 'affected', 'unaffected'])
    .range(['#FF5630', '#FF8B00', '#6B778C']);

  // Filter data based on current filters - memoized to prevent unnecessary re-renders
  const filteredNodes = useMemo(() => 
    data.nodes.filter(node => 
      (filterState.selectedDomains.length === 0 || filterState.selectedDomains.includes(node.domain)) &&
      (filterState.selectedTeams.length === 0 || filterState.selectedTeams.includes(node.team)) &&
      (filterState.selectedProducts.length === 0 || filterState.selectedProducts.includes(node.product)) &&
      filterState.selectedStatuses.includes(node.status)
    ), [data.nodes, filterState.selectedDomains, filterState.selectedTeams, filterState.selectedProducts, filterState.selectedStatuses]
  );

  const filteredLinks = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    return data.links.filter(link => 
      nodeIds.has(link.source) && nodeIds.has(link.target)
    );
  }, [data.links, filteredNodes]);



  // Check current theme
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light';
    setCurrentTheme(theme);
  });

  // Initialize D3 visualization
  useEffect(() => {
    console.log('D3 useEffect triggered - recreating visualization');
    console.log('Filtered nodes:', filteredNodes.length, 'Filtered links:', filteredLinks.length);
    if (!svgRef.current) return;
    
    // Don't recreate if we have no data
    if (filteredNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight - 80;

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

    // Get theme-aware colors
    const isDarkMode = currentTheme === 'dark';
    const nodeBackgroundColor = isDarkMode ? '#1D2125' : '#FFFFFF';
    const borderColor = isDarkMode ? '#42526E' : '#DFE1E6';
    const textColor = isDarkMode ? '#E6FCFF' : '#172B4D';

    // Create force simulation with better spacing like Port.io demo
    const simulation = d3.forceSimulation<DependencyNode>(filteredNodes)
      .force('link', d3.forceLink<DependencyNode, DependencyLink>(filteredLinks).id((d: DependencyNode) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(80))
      .alphaDecay(0.05) // Slower stabilization for better layout
      .velocityDecay(0.3); // Less damping for more natural movement

    simulationRef.current = simulation;

    // Create links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(filteredLinks)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return '#FF5630'; // Red for all affected links
          }
          return borderColor;
        }
        return borderColor;
      })
      .attr('stroke-width', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return 2;
          }
        }
        return 1;
      })
      .attr('stroke-opacity', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.links.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.links.includes(d.id)) {
            return 1;
          }
          return 0.3;
        }
        return 0.6;
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
      });

    // Add rectangles to nodes - larger and more spaced like Port.io demo
    nodes.append('rect')
      .attr('width', (d: any) => Math.max(140, d.name.length * 10))
      .attr('height', 50)
      .attr('rx', 8)
      .attr('fill', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id)) {
            return '#FF5630'; // Solid red for direct issues
          }
          if (filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return '#FF5630'; // Red for potential issues (changed from orange)
          }
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
        return borderColor;
      })
      .attr('stroke-width', (d: any) => {
        if (filterState.showBlastRadius && filterState.blastRadiusData) {
          if (filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
              filterState.blastRadiusData.potentialIssues.nodes.includes(d.id)) {
            return 3;
          }
        }
        return 1;
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
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#FF5630')
      .attr('stroke-width', 1);

    // Add warning icon symbol to affected nodes
    nodes.filter((d: any) => {
      if (filterState.showBlastRadius && filterState.blastRadiusData) {
        return filterState.blastRadiusData.directIssues.nodes.includes(d.id) || 
               filterState.blastRadiusData.potentialIssues.nodes.includes(d.id);
      }
      return false;
    })
    .append('text')
      .attr('x', (d: any) => Math.max(140, d.name.length * 10) - 15)
      .attr('y', 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#FF5630')
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
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes.attr('transform', (d: any) => `translate(${d.x - Math.max(140, d.name.length * 10) / 2},${d.y - 25})`);
    });

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [filteredNodes, filteredLinks, filterState.showBlastRadius, filterState.blastRadiusData, currentTheme]);

  // Removed highlightDependencies function to prevent map expansion and line disappearance

  const showTooltip = (event: any, node: DependencyNode) => {
    console.log('Show tooltip for:', node.name); // Debug log
    const content = `
      <strong>${node.name}</strong><br/>
      Type: ${node.type}<br/>
      Domain: ${node.domain}<br/>
      Team: ${node.team}<br/>
      Status: ${node.status}<br/>
      Version: ${node.version || 'N/A'}<br/>
      Deployment: ${node.deploymentStatus || 'N/A'}
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

  const toggleBlastRadius = () => {
    if (filterState.showBlastRadius) {
      setFilterState(prev => ({
        ...prev,
        showBlastRadius: false,
        blastRadiusData: undefined
      }));
    } else {
      setFilterState(prev => ({
        ...prev,
        showBlastRadius: true,
        blastRadiusData: sampleBlastRadius
      }));
    }
  };

  const toggleDomain = useCallback((domainId: string) => {
    setFilterState(prev => ({
      ...prev,
      selectedDomains: prev.selectedDomains.includes(domainId)
        ? prev.selectedDomains.filter(id => id !== domainId)
        : [...prev.selectedDomains, domainId]
    }));
  }, []);

  const toggleTeam = useCallback((teamId: string) => {
    setFilterState(prev => ({
      ...prev,
      selectedTeams: prev.selectedTeams.includes(teamId)
        ? prev.selectedTeams.filter(id => id !== teamId)
        : [...prev.selectedTeams, teamId]
    }));
  }, []);

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
            gap: token('space.200'),
            marginRight: token('space.300')
          }}>
            <AtlassianLogo appearance="brand" />
            <Heading size="large">Dependency Map</Heading>
          </div>
          <Lozenge appearance="inprogress" isBold>{filteredNodes.length} nodes</Lozenge>
          <Lozenge appearance="inprogress" isBold>{filteredLinks.length} links</Lozenge>
        </HeaderLeft>
        <HeaderRight>
          <Button
            appearance={filterState.showBlastRadius ? "primary" : "default"}
            onClick={toggleBlastRadius}
          >
            Blast radius
          </Button>
          <Button
            onClick={resetView}
          >
            Reset view
          </Button>
        </HeaderRight>
      </Header>

      <Controls>
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
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px'
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
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px'
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
              control: (provided: any) => ({
                ...provided,
                minHeight: '32px',
                fontSize: '12px'
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
      </Controls>

      <Legend>
        <Text weight="bold" size="small">Legend</Text>
        <LegendItem>
          <LegendColor color="#0052CC" />
          <span>Application</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#36B37E" />
          <span>Data</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#FF5630" />
          <span>Infrastructure</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#FF8B00" />
          <span>Security</span>
        </LegendItem>
        <LegendItem>
          <LegendColor color="#6554C0" />
          <span>Observability</span>
        </LegendItem>
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
        style={{ marginTop: '80px' }}
      />

      {tooltip && (
        <NodeTooltip
          isDarkMode={currentTheme === 'dark'}
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
          <Lozenge appearance="removed" isBold>
            {filterState.blastRadiusData.severity.toUpperCase()}
          </Lozenge>
        </div>
      )}
    </MapContainer>
  );
};

export default DependencyMap; 