export function renderMDX(source) {
  const div = document.createElement("div");
  // Placeholder for MDX rendering. In production, compile MDX to HTML.
  div.innerHTML = source;
  return div.innerHTML;
}
