const csvInput = document.getElementById("csvFile");
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5 MB limit
const mappingDiv = document.getElementById("mapping");
const previewDiv = document.getElementById("preview");
const summaryDiv = document.getElementById("summary");
const termSelect = document.getElementById("termColumn");
const defSelect = document.getElementById("definitionColumn");
const previewTable = document.getElementById("previewTable");
const summaryText = document.getElementById("summaryText");

let csvRows = [];
let mappedRows = [];
const collection = [];
const slugs = new Set();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

csvInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > MAX_UPLOAD_SIZE) {
    alert(`File is too large. Maximum size is ${Math.round(MAX_UPLOAD_SIZE / (1024 * 1024))} MB.`);
    e.target.value = "";
    return;
  }
  Papa.parse(file, {
    complete: (results) => {
      const isRowFilled = (row) => row.some((cell) => cell && cell.trim());
      csvRows = results.data.filter(isRowFilled);
      const headers = csvRows.shift();
      populateMapping(headers);
    },
  });
});

function populateMapping(headers) {
  termSelect.innerHTML = "";
  defSelect.innerHTML = "";
  headers.forEach((h, idx) => {
    const opt1 = document.createElement("option");
    opt1.value = idx;
    opt1.textContent = h;
    termSelect.appendChild(opt1);
    const opt2 = document.createElement("option");
    opt2.value = idx;
    opt2.textContent = h;
    defSelect.appendChild(opt2);
  });
  mappingDiv.style.display = "block";
}

document.getElementById("previewBtn").addEventListener("click", () => {
  const termIdx = parseInt(termSelect.value, 10);
  const defIdx = parseInt(defSelect.value, 10);
  if (isNaN(termIdx) || isNaN(defIdx)) return;
  mappedRows = csvRows.map((row) => ({
    term: row[termIdx] ? row[termIdx].trim() : "",
    definition: row[defIdx] ? row[defIdx].trim() : "",
  }));
  renderPreview();
});

function renderPreview() {
  previewTable.innerHTML = "";
  const thead = document.createElement("thead");
  thead.innerHTML = "<tr><th>Term</th><th>Definition</th></tr>";
  const tbody = document.createElement("tbody");
  mappedRows.slice(0, 5).forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.term}</td><td>${item.definition}</td>`;
    tbody.appendChild(tr);
  });
  previewTable.appendChild(thead);
  previewTable.appendChild(tbody);
  previewDiv.style.display = "block";
}

document.getElementById("importBtn").addEventListener("click", () => {
  let imported = 0;
  let skipped = 0;
  mappedRows.forEach((item) => {
    const slug = slugify(item.term);
    if (!slugs.has(slug)) {
      slugs.add(slug);
      collection.push({ ...item, slug });
      imported++;
    } else {
      skipped++;
    }
  });
  summaryText.textContent = `${imported} items imported, ${skipped} items skipped.`;
  summaryDiv.style.display = "block";
});
