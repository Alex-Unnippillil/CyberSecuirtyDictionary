import React, { useEffect, useRef } from 'react';
import { select } from 'd3-selection';
import { forceSimulation, forceManyBody, forceLink, forceCenter } from 'd3-force';
import { drag as d3drag } from 'd3-drag';

interface Node {
  id: string;
}

interface Link {
  source: string;
  target: string;
}

interface RelatedGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const RelatedGraph: React.FC<RelatedGraphProps> = ({
  nodes,
  links,
  width = 400,
  height = 300,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll('*').remove();

    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-100))
      .force('link', forceLink(links).id((d: any) => d.id).distance(80))
      .force('center', forceCenter(width / 2, height / 2))
      .alphaMin(0.001)
      .alphaDecay(0.05);

    const link = svg
      .append('g')
      .attr('stroke', '#aaa')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', 1);

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 6)
      .attr('fill', '#69b3a2')
      .call(
        d3drag<SVGCircleElement, Node>()
          .on('start', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d: any) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d: any) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    simulation.on('tick', () => {
      node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      link
        .attr('x1', (d: any) => (d.source as any).x)
        .attr('y1', (d: any) => (d.source as any).y)
        .attr('x2', (d: any) => (d.target as any).x)
        .attr('y2', (d: any) => (d.target as any).y);
    });

    return () => simulation.stop();
  }, [nodes, links, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default RelatedGraph;
