if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

const darkModeToggle = document.getElementById("dark-mode-toggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });
}

fetch("timeline.json")
  .then((resp) => resp.json())
  .then((data) => {
    const timelineEl = document.getElementById("timeline");
    const list = document.createElement("ol");
    list.className = "timeline";

    data.events
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach((ev) => {
        const li = document.createElement("li");

        const timeEl = document.createElement("time");
        timeEl.setAttribute("datetime", ev.date);
        timeEl.textContent = new Date(ev.date).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        li.appendChild(timeEl);

        const title = document.createElement("h3");
        title.textContent = ev.title;
        li.appendChild(title);

        if (ev.description) {
          const p = document.createElement("p");
          p.textContent = ev.description;
          li.appendChild(p);
        }

        list.appendChild(li);
      });

    timelineEl.appendChild(list);
  })
  .catch(() => {
    const timelineEl = document.getElementById("timeline");
    timelineEl.textContent = "Unable to load timeline.";
  });

