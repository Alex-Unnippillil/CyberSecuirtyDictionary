// Highlight management system
// Stores color, serialized range, and optional note ID for each highlight

const PRESET_COLORS = [
  "#fff59d", // yellow
  "#ffab91", // orange
  "#a5d6a7", // green
  "#90caf9", // blue
  "#f48fb1", // pink
];

class HighlightManager {
  constructor({ legendEl, panelEl } = {}) {
    this.highlights = [];
    this.legendEl = legendEl || document.getElementById("highlight-legend");
    this.panelEl = panelEl || document.getElementById("highlights-list");
    if (this.legendEl) {
      this._renderLegend();
    }
  }

  _renderLegend() {
    this.legendEl.innerHTML = "";
    PRESET_COLORS.forEach((color) => {
      const btn = document.createElement("button");
      btn.className = "highlight-color";
      btn.style.backgroundColor = color;
      btn.dataset.color = color;

      const count = document.createElement("span");
      count.className = "count";
      count.textContent = "0";

      btn.appendChild(count);
      btn.addEventListener("click", () => this.highlightSelection(color));
      this.legendEl.appendChild(btn);
    });
  }

  highlightSelection(color) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;

    const noteId = prompt("Enter note ID (optional)") || "";
    this.addHighlight(range, color, noteId);
    selection.removeAllRanges();
  }

  addHighlight(range, color, noteId = "") {
    const id = `hl-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const mark = document.createElement("mark");
    mark.id = id;
    mark.dataset.highlightId = id;
    mark.dataset.noteId = noteId;
    mark.style.backgroundColor = color;
    mark.className = "user-highlight";

    const contents = range.extractContents();
    mark.appendChild(contents);
    range.insertNode(mark);

    const serialized = this._serializeRange(range);
    const highlight = { id, color, noteId, range: serialized };
    this.highlights.push(highlight);

    this._updateLegendCounts();
    this._updatePanel();
  }

  _serializeRange(range) {
    const start = this._nodePath(range.startContainer, range.startOffset);
    const end = this._nodePath(range.endContainer, range.endOffset);
    return { start, end };
  }

  _nodePath(node, offset) {
    const path = [];
    let current = node;
    while (current && current !== document.body) {
      const parent = current.parentNode;
      if (!parent) break;
      const index = Array.prototype.indexOf.call(parent.childNodes, current);
      path.unshift(index);
      current = parent;
    }
    return { path, offset };
  }

  _updateLegendCounts() {
    const counts = PRESET_COLORS.reduce((acc, c) => ({ ...acc, [c]: 0 }), {});
    this.highlights.forEach((h) => {
      counts[h.color] = (counts[h.color] || 0) + 1;
    });
    if (!this.legendEl) return;
    Array.from(this.legendEl.querySelectorAll("button")).forEach((btn) => {
      const color = btn.dataset.color;
      const countEl = btn.querySelector(".count");
      if (countEl) {
        countEl.textContent = counts[color] || 0;
      }
    });
  }

  _updatePanel() {
    if (!this.panelEl) return;
    this.panelEl.innerHTML = "";
    this.highlights.forEach((h) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = `#${h.id}`;
      link.textContent = h.noteId || h.id;
      li.appendChild(link);
      this.panelEl.appendChild(li);
    });
  }
}

// Initialize on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  const legendEl = document.getElementById("highlight-legend");
  const panelList = document.getElementById("highlights-list");
  if (legendEl && panelList) {
    window.highlightManager = new HighlightManager({
      legendEl,
      panelEl: panelList,
    });
  }
});

export { HighlightManager, PRESET_COLORS };
