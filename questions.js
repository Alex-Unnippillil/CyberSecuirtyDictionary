const container = document.getElementById("questions-container");
const downloadBtn = document.getElementById("download-csv");

fetch("questions.json")
  .then((res) => res.json())
  .then((data) => {
    const domains = {};
    data.questions.forEach((q) => {
      if (!domains[q.domain]) domains[q.domain] = [];
      domains[q.domain].push(q);
    });
    Object.keys(domains)
      .sort()
      .forEach((domain) => {
        const section = document.createElement("section");
        const heading = document.createElement("h2");
        heading.textContent = domain;
        section.appendChild(heading);
        const list = document.createElement("ul");
        domains[domain].forEach((q) => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${q.question}</strong><p>${q.answerOutline}</p>`;
          list.appendChild(li);
        });
        section.appendChild(list);
        container.appendChild(section);
      });
  });

downloadBtn.addEventListener("click", () => {
  fetch("questions.json")
    .then((res) => res.json())
    .then((data) => {
      const rows = [["Domain", "Question", "Answer Outline"]];
      data.questions.forEach((q) => {
        rows.push([q.domain, q.question, q.answerOutline]);
      });
      const csv = rows
        .map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(","))
        .join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "questions.csv";
      a.click();
      URL.revokeObjectURL(url);
    });
});
