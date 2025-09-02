// Sunburst visualization of term categories

document.addEventListener('DOMContentLoaded', initSunburst);

async function initSunburst(){
  try {
    const res = await fetch('terms.json');
    const data = await res.json();
    const hierarchy = buildHierarchy(data.terms || []);
    drawSunburst(hierarchy);
  } catch(err){
    console.error('Failed to load terms.json', err);
  }
}

function buildHierarchy(terms){
  const root = { name: 'Terms', children: [] };
  const categories = {};
  terms.forEach(term => {
    const category = term.category || 'Uncategorized';
    if(!categories[category]){
      categories[category] = { name: category, children: [] };
    }
    categories[category].children.push({ name: term.term || term.name, value: 1 });
  });
  root.children = Object.values(categories);
  return root;
}

function drawSunburst(data){
  const width = 600;
  const radius = width / 6;

  const partition = (data) => {
    const root = d3.hierarchy(data)
      .sum(d => d.value || 0)
      .sort((a, b) => b.value - a.value);
    return d3.partition()
      .size([2 * Math.PI, root.height + 1])(root);
  };

  const root = partition(data);
  root.each(d => d.current = d);

  const svg = d3.select('#sunburst')
    .attr('viewBox', [0, 0, width, width])
    .style('font', '10px sans-serif');

  const g = svg.append('g')
    .attr('transform', `translate(${width / 2},${width / 2})`);

  const color = d3.scaleOrdinal()
    .domain(root.children.map(d => d.data.name))
    .range(d3.quantize(d3.interpolateRainbow, root.children.length + 1));

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const path = g.append('g')
    .selectAll('path')
    .data(root.descendants().slice(1))
    .join('path')
      .attr('fill', d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr('fill-opacity', d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
      .attr('d', d => arc(d.current));

  path.filter(d => d.children)
    .style('cursor', 'pointer')
    .on('click', clicked);

  path.append('title')
    .text(d => d.ancestors().map(d => d.data.name).reverse().join(' / '));

  const label = g.append('g')
    .attr('pointer-events', 'none')
    .attr('text-anchor', 'middle')
    .style('user-select', 'none')
    .selectAll('text')
    .data(root.descendants().slice(1))
    .join('text')
      .attr('dy', '0.35em')
      .attr('fill-opacity', d => +labelVisible(d.current))
      .attr('transform', d => labelTransform(d.current))
      .text(d => d.data.name);

  const parent = g.append('circle')
    .datum(root)
    .attr('r', radius)
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on('click', clicked);

  const breadcrumbs = d3.select('#breadcrumbs');
  const backBtn = d3.select('#back-btn')
    .style('display', 'none')
    .on('click', () => clicked(null, root));

  function clicked(event, p) {
    updateBreadcrumbs(p);
    parent.datum(p.parent || root);

    root.each(d => d.target = {
      x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
      y0: Math.max(0, d.y0 - p.depth),
      y1: Math.max(0, d.y1 - p.depth)
    });

    const t = g.transition().duration(750);

    path.transition(t)
      .tween('data', d => {
        const i = d3.interpolate(d.current, d.target);
        return t => d.current = i(t);
      })
      .filter(function(d) {
        return +this.getAttribute('fill-opacity') || arcVisible(d.target);
      })
        .attr('fill-opacity', d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attr('pointer-events', d => arcVisible(d.target) ? 'auto' : 'none')
        .attrTween('d', d => () => arc(d.current));

    label.filter(function(d) {
        return +this.getAttribute('fill-opacity') || labelVisible(d.target);
      }).transition(t)
        .attr('fill-opacity', d => +labelVisible(d.target))
        .attrTween('transform', d => () => labelTransform(d.current));
  }

  function updateBreadcrumbs(node){
    breadcrumbs.text(node.ancestors().reverse().map(d => d.data.name).join(' > '));
    backBtn.style('display', node === root ? 'none' : 'inline-block');
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    const y = (d.y0 + d.y1) / 2 * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  }

  updateBreadcrumbs(root);
}
