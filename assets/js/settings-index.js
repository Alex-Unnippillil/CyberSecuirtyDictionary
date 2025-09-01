export function indexSettings(root) {
  var items = [];
  root.querySelectorAll("[data-setting]").forEach(function (el) {
    var labelEl = el.querySelector("label");
    var label = labelEl ? (labelEl.textContent || "").trim() : "";
    var keywordsAttr = el.getAttribute("data-keywords") || "";
    var keywords = keywordsAttr
      .split(",")
      .map(function (k) {
        return k.trim().toLowerCase();
      })
      .filter(Boolean);
    items.push({ id: el.id, label: label, keywords: keywords, element: el });
  });
  return items;
}
