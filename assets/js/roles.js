function initRolePage(roleKey, terms) {
  const list = document.getElementById("terms-list");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  const stored = JSON.parse(localStorage.getItem(roleKey) || "{}");

  function updateProgress() {
    const completed = terms.filter((t) => stored[t]).length;
    progressBar.value = completed;
    progressText.textContent = `${completed}/${terms.length} terms completed`;
  }

  progressBar.max = terms.length;

  terms.forEach((term) => {
    const li = document.createElement("li");
    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = stored[term] || false;
    checkbox.addEventListener("change", () => {
      stored[term] = checkbox.checked;
      localStorage.setItem(roleKey, JSON.stringify(stored));
      updateProgress();
    });

    const link = document.createElement("a");
    link.href = `../index.html#${encodeURIComponent(term)}`;
    link.textContent = term;

    label.appendChild(checkbox);
    label.appendChild(link);
    li.appendChild(label);
    list.appendChild(li);
  });

  updateProgress();
}

window.initRolePage = initRolePage;
