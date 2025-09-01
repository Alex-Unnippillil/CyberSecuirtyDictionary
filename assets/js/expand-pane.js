export default function expandPane(container, contentHtml) {
  const wrapper = document.createElement("div");
  const toggle = document.createElement("button");
  toggle.textContent = "Expand";
  const content = document.createElement("div");
  content.innerHTML = contentHtml;
  content.style.display = "none";

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = content.style.display === "block";
    content.style.display = open ? "none" : "block";
    toggle.textContent = open ? "Expand" : "Collapse";
  });

  wrapper.appendChild(toggle);
  wrapper.appendChild(content);
  container.appendChild(wrapper);
}
