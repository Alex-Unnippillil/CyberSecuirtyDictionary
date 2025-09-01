fetch("standards.json")
  .then((response) => response.json())
  .then((data) => {
    const timeline = document.getElementById("timeline");
    const citations = document.getElementById("citations");
    if (!timeline || !citations) return;

    data.sort((a, b) => a.year - b.year);

    data.forEach((item) => {
      const li = document.createElement("li");
      li.id = item.id;
      li.innerHTML = `<strong>${item.title}</strong> (${item.year}) - <a href="${item.url}">${item.citation}</a>`;
      citations.appendChild(li);

      const wrapper = document.createElement("div");
      wrapper.className = "timeline-item";

      const btn = document.createElement("button");
      btn.className = "timeline-point";
      btn.setAttribute(
        "aria-label",
        `Scroll to citation for ${item.title} (${item.year})`,
      );
      btn.addEventListener("click", () => {
        document
          .getElementById(item.id)
          ?.scrollIntoView({ behavior: "smooth" });
      });

      const label = document.createElement("span");
      label.className = "timeline-label";
      label.textContent = item.year;

      wrapper.appendChild(btn);
      wrapper.appendChild(label);
      timeline.appendChild(wrapper);
    });
  })
  .catch((err) => console.error("Unable to load standards timeline", err));
