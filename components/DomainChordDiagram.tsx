import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";

interface Domain {
  name: string;
  color: string;
  url: string;
}

interface DomainChordDiagramProps {
  /**
   * Array of domains represented in the diagram.
   * The order of domains must align with the matrix indices.
   */
  domains: Domain[];
  /**
   * Square matrix describing the connections between domains.
   */
  matrix: number[][];
}

const DomainChordDiagram: React.FC<DomainChordDiagramProps> = ({
  domains,
  matrix,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 600;
    const outerRadius = Math.min(width, height) / 2 - 40;
    const innerRadius = outerRadius - 20;

    const chords = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(
      matrix,
    );

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon().radius(innerRadius);

    svg.attr("viewBox", [-width / 2, -height / 2, width, height].join(" "));

    const group = svg.append("g").selectAll("g").data(chords.groups).join("g");

    group
      .append("path")
      .attr("d", arc as any)
      .attr("fill", (d) => domains[d.index].color)
      .attr("stroke", (d) => d3.rgb(domains[d.index].color).darker().toString())
      .style("cursor", "pointer")
      .on("click", (_, d) => router.push(domains[d.index].url));

    group
      .append("text")
      .each((d: any) => (d.angle = (d.startAngle + d.endAngle) / 2))
      .attr("dy", ".35em")
      .attr(
        "transform",
        (d: any) =>
          `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${outerRadius + 10}) ${
            d.angle > Math.PI ? "rotate(180)" : ""
          }`,
      )
      .attr("text-anchor", (d: any) => (d.angle > Math.PI ? "end" : "start"))
      .text((d) => domains[d.index].name);

    const chordSelection = svg
      .append("g")
      .attr("fill-opacity", 0.75)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("d", ribbon as any)
      .attr("fill", (d) => domains[d.target.index].color)
      .attr("stroke", (d) =>
        d3.rgb(domains[d.target.index].color).darker().toString(),
      )
      .style("cursor", "pointer")
      .on("mouseover", (_, d) => {
        chordSelection.attr("opacity", (o) =>
          o.source.index === d.source.index ||
          o.source.index === d.target.index ||
          o.target.index === d.source.index ||
          o.target.index === d.target.index
            ? 1
            : 0.1,
        );
      })
      .on("mouseout", () => chordSelection.attr("opacity", 0.75))
      .on("click", (_, d) => router.push(domains[d.target.index].url));
  }, [domains, matrix, router]);

  return (
    <div>
      <svg ref={svgRef} width={600} height={600}></svg>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {domains.map((domain) => (
          <li
            key={domain.name}
            style={{ display: "flex", alignItems: "center", marginBottom: 4 }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                backgroundColor: domain.color,
                display: "inline-block",
                marginRight: 8,
              }}
            ></span>
            {domain.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DomainChordDiagram;
