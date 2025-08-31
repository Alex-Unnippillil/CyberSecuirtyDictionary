(function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const svg = d3
    .select("#graph")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("width", "100%")
    .style("height", "100%")
    .style("touch-action", "none");

  const container = svg.append("g");

  const zoom = d3.zoom().on("zoom", (event) => {
    container.attr("transform", event.transform);
  });
  svg.call(zoom);

  let graphData = { nodes: [], links: [] };
  let nodes = [];
  let links = [];

  const simulation = d3
    .forceSimulation(nodes)
    .force("charge", d3.forceManyBody().strength(-300))
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(120),
    )
    .force("center", d3.forceCenter(width / 2, height / 2));

  const linkGroup = container.append("g").attr("class", "links");
  const nodeGroup = container.append("g").attr("class", "nodes");

  fetch("graph.json")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
    .then((data) => {
      graphData = data;
      // start with roots or first node
      const roots = graphData.nodes.filter((n) => !hasIncoming(n.id));
      roots.forEach((r) => nodes.push({ ...r, expanded: false }));
      update();
    })
    .catch((err) => {
      console.error("Failed to load graph.json", err);
    });

  function hasIncoming(id) {
    return graphData.links.some((l) => l.target === id);
  }

  function update() {
    const linkSel = linkGroup
      .selectAll("line")
      .data(links, (d) => `${d.source.id}->${d.target.id}`);

    linkSel.exit().remove();
    linkSel
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5);

    const nodeSel = nodeGroup.selectAll("g.node").data(nodes, (d) => d.id);

    const nodeEnter = nodeSel.enter().append("g").attr("class", "node");

    nodeEnter
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#1f77b4")
      .on("click", (event, d) => toggle(d));

    nodeEnter
      .append("text")
      .attr("x", 24)
      .attr("y", 5)
      .style("font-size", "12px")
      .text((d) => d.name || d.id);

    nodeSel.exit().remove();

    simulation.nodes(nodes).on("tick", () => {
      linkGroup
        .selectAll("line")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      nodeGroup
        .selectAll("g.node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);
    });
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
  }

  function toggle(node) {
    if (node.expanded) {
      collapse(node);
    } else {
      expand(node);
    }
    node.expanded = !node.expanded;
    update();
  }

  function expand(node) {
    const neighborIds = graphData.links
      .filter((l) => l.source === node.id)
      .map((l) => l.target);
    neighborIds.forEach((id) => {
      if (!nodes.some((n) => n.id === id)) {
        const n = graphData.nodes.find((x) => x.id === id);
        if (n) nodes.push({ ...n, expanded: false });
      }
      const target = nodes.find((n) => n.id === id);
      if (
        target &&
        !links.some((l) => l.source.id === node.id && l.target.id === id)
      ) {
        links.push({ source: node, target });
      }
    });
  }

  function collapse(node) {
    const toRemove = links
      .filter((l) => l.source.id === node.id)
      .map((l) => l.target);
    links = links.filter((l) => l.source.id !== node.id);
    toRemove.forEach((n) => {
      if (!links.some((l) => l.source.id === n.id || l.target.id === n.id)) {
        nodes = nodes.filter((x) => x.id !== n.id);
      }
    });
  }

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    simulation.force("center", d3.forceCenter(w / 2, h / 2));
    simulation.alpha(1).restart();
  });
})();
