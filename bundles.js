const bundleList = document.getElementById("bundle-list");
const printBtn = document.getElementById("print-bundles");

fetch("bundles.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    data.bundles.forEach((bundle) => {
      const li = document.createElement("li");
      const title = document.createElement("h3");
      title.textContent = bundle.name;
      li.appendChild(title);
      const termsUl = document.createElement("ul");
      bundle.terms.forEach((term) => {
        const termLi = document.createElement("li");
        termLi.textContent = term;
        termsUl.appendChild(termLi);
      });
      li.appendChild(termsUl);
      bundleList.appendChild(li);
    });
  })
  .catch((err) => {
    bundleList.innerHTML = "<li>Unable to load bundles.</li>";
    console.error("Error loading bundles", err);
  });

printBtn.addEventListener("click", () => window.print());
