const params = new URLSearchParams(window.location.search);
const termName = params.get("term");
const titleEl = document.getElementById("term-title");
const revASelect = document.getElementById("revA");
const revBSelect = document.getElementById("revB");
const diffOutput = document.getElementById("diff-output");
const promoteBtn = document.getElementById("promote-btn");
let currentTerm;

fetch("terms.json")
  .then((res) => res.json())
  .then((data) => {
    currentTerm = data.terms.find((t) => t.term === termName);
    if (!currentTerm) {
      titleEl.textContent = "Term not found";
      return;
    }
    titleEl.textContent = currentTerm.term;
    currentTerm.revisions.forEach((r) => {
      const optA = document.createElement("option");
      optA.value = r.version;
      optA.textContent = `v${r.version} (${r.updated})`;
      revASelect.appendChild(optA);
      const optB = optA.cloneNode(true);
      revBSelect.appendChild(optB);
    });
    revASelect.value = currentTerm.revisions[0].version;
    revBSelect.value =
      currentTerm.revisions[currentTerm.revisions.length - 1].version;
    if (currentTerm.status === "draft") {
      promoteBtn.style.display = "block";
    }
  });

document.getElementById("compare").addEventListener("click", () => {
  if (!currentTerm) return;
  const revA = currentTerm.revisions.find((r) => r.version == revASelect.value);
  const revB = currentTerm.revisions.find((r) => r.version == revBSelect.value);
  const diff = Diff.diffWords(revA.definition, revB.definition);
  diffOutput.innerHTML = diff
    .map((part) => {
      const tag = part.added ? "ins" : part.removed ? "del" : "span";
      return `<${tag}>${part.value}</${tag}>`;
    })
    .join("");
});

promoteBtn.addEventListener("click", () => {
  currentTerm.status = "published";
  promoteBtn.style.display = "none";
  alert("Term promoted to published (local only)");
});
