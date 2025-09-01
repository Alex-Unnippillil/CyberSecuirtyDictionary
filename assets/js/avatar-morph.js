export async function initAvatar(containerId, defaultPersona = "analyst") {
  const container = document.getElementById(containerId);
  if (!container) {
    return () => {};
  }
  const res = await fetch("assets/avatar-morphs.json");
  const data = await res.json();
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("class", "avatar-svg");
  container.appendChild(svg);
  const personas = {};
  for (const [id, d] of Object.entries(data)) {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", d);
    path.setAttribute("class", "avatar-persona");
    path.setAttribute("fill", "currentColor");
    path.style.transformOrigin = "50% 50%";
    path.style.transition = "transform 240ms ease-in-out";
    path.style.willChange = "transform";
    path.style.transform = id === defaultPersona ? "scale(1)" : "scale(0)";
    svg.appendChild(path);
    personas[id] = path;
  }
  return function morph(to) {
    for (const [id, path] of Object.entries(personas)) {
      path.style.transform = id === to ? "scale(1)" : "scale(0)";
    }
  };
}
