'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface LoreNode {
  _id: string;
  title: string;
  slug: { current: string };
  constellation: string;
  timestamp?: string;
  connectedRituals: Array<{ _id: string; title: string }>;
  connectedLore: Array<{ _id: string; title: string }>;
  positionX?: number;
  positionY?: number;
}

interface VoidMapProps {
  loreNodes: LoreNode[];
}

interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  title: string;
  constellation: string;
  timestamp?: string;
  slug: string;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
}

export default function VoidMap({ loreNodes }: VoidMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<LoreNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !loreNodes.length) return;

    const width = 1200;
    const height = 800;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    // Add gradient definitions
    const defs = svg.append('defs');
    const gradient = defs.append('radialGradient')
      .attr('id', 'node-glow')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#c0003f')
      .attr('stop-opacity', 0.8);
    
    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#c0003f')
      .attr('stop-opacity', 0);

    // Transform data into D3 nodes
    const nodes: D3Node[] = loreNodes.map(node => ({
      id: node._id,
      title: node.title,
      constellation: node.constellation,
      timestamp: node.timestamp,
      slug: node.slug.current,
      x: node.positionX || undefined,
      y: node.positionY || undefined,
    }));

    // Create links from connectedLore references
    const links: D3Link[] = [];
    loreNodes.forEach(node => {
      node.connectedLore.forEach(connected => {
        links.push({
          source: node._id,
          target: connected._id,
        });
      });
    });

    // Color scale by constellation
    const constellations = Array.from(new Set(nodes.map(n => n.constellation)));
    const colorScale = d3.scaleOrdinal<string>()
      .domain(constellations)
      .range(['#c0003f', '#e8b86d', '#6a4f5e', '#8a0f26', '#f41e42', '#c8b0bc']);

    // Force simulation
    const simulation = d3.forceSimulation<D3Node>(nodes)
      .force('link', d3.forceLink<D3Node, D3Link>(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Draw links
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#1e0012')
      .attr('stroke-width', 1)
      .attr('opacity', 0.6);

    // Draw node glows
    const glow = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 30)
      .attr('fill', 'url(#node-glow)')
      .attr('opacity', 0);

    // Draw nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 8)
      .attr('fill', d => colorScale(d.constellation))
      .attr('stroke', '#0a0005')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('mouseenter', function(event, d) {
        setHoveredNode(d.id);
        d3.select(this).transition().duration(200).attr('r', 12);
        glow.filter(g => g.id === d.id).transition().duration(200).attr('opacity', 0.6);
      })
      .on('mouseleave', function(event, d) {
        setHoveredNode(null);
        d3.select(this).transition().duration(200).attr('r', 8);
        glow.filter(g => g.id === d.id).transition().duration(200).attr('opacity', 0);
      })
      .on('click', (event, d) => {
        const fullNode = loreNodes.find(n => n._id === d.id);
        setSelectedNode(fullNode || null);
      });

    // Node labels
    const label = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .text(d => d.title)
      .attr('font-size', 10)
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('fill', '#6a4f5e')
      .attr('text-anchor', 'middle')
      .attr('dy', 20)
      .attr('pointer-events', 'none')
      .attr('opacity', 0);

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as D3Node).x!)
        .attr('y1', d => (d.source as D3Node).y!)
        .attr('x2', d => (d.target as D3Node).x!)
        .attr('y2', d => (d.target as D3Node).y!);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      glow
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      label
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);
    });

    // Show labels on hover
    node.on('mouseenter', function(event, d) {
      label.filter(l => l.id === d.id).transition().duration(200).attr('opacity', 1);
    }).on('mouseleave', function(event, d) {
      label.filter(l => l.id === d.id).transition().duration(200).attr('opacity', 0);
    });

    // Drag behavior
    const drag = d3.drag<SVGCircleElement, D3Node>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag as any);

  }, [loreNodes]);

  return (
    <div className="relative w-full">
      {/* Map Canvas */}
      <div className="relative w-full overflow-hidden rounded-lg border border-border bg-void-deep">
        <svg ref={svgRef} className="w-full h-auto" style={{ minHeight: '600px' }} />
        
        {/* Scanline overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(192,0,63,0.1) 2px, rgba(192,0,63,0.1) 4px)'
          }}
        />
      </div>

      {/* Selected Node Panel */}
      {selectedNode && (
        <div className="mt-6 p-6 bg-card border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-2xl text-soft">{selectedNode.title}</h3>
              {selectedNode.timestamp && (
                <p className="font-mono text-xs text-muted mt-1 uppercase tracking-wider">
                  {selectedNode.timestamp}
                </p>
              )}
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-crimson hover:text-gold transition-colors font-mono text-xs uppercase tracking-wider"
            >
              [CLOSE]
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <span className="font-mono text-xs text-muted uppercase tracking-wider">Constellation:</span>
              <p className="font-mono text-sm text-gold mt-1">{selectedNode.constellation}</p>
            </div>
            
            {selectedNode.connectedRituals.length > 0 && (
              <div>
                <span className="font-mono text-xs text-muted uppercase tracking-wider">Connected Rituals:</span>
                <ul className="mt-2 space-y-1">
                  {selectedNode.connectedRituals.map(ritual => (
                    <li key={ritual._id} className="text-sm text-text-body font-mono">
                      → {ritual.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-4 p-4 bg-card border border-border rounded-lg">
        <p className="font-mono text-xs text-muted uppercase tracking-wider mb-3">Constellation Map</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from(new Set(loreNodes.map(n => n.constellation))).map(constellation => (
            <div key={constellation} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{
                backgroundColor: d3.scaleOrdinal<string>()
                  .domain(['BLACKBURN_SCAR', 'SYSTEM_ORIGINS', 'MEMORY_FRAGMENTS', 'EMOTIONAL_LEAKS', 'TRANSMISSION_PROTOCOLS', 'RUINED_VOID'])
                  .range(['#c0003f', '#e8b86d', '#6a4f5e', '#8a0f26', '#f41e42', '#c8b0bc'])(constellation)
              }} />
              <span className="font-mono text-xs text-text-body">{constellation.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
