(function () {
  const root = document.documentElement;

  const fontSlider = document.getElementById("font-size-slider");
  const lineHeightSlider = document.getElementById("line-height-slider");
  const columnWidthSlider = document.getElementById("column-width-slider");

  const storedFont = localStorage.getItem("fontSize");
  const storedLine = localStorage.getItem("lineHeight");
  const storedColumn = localStorage.getItem("columnWidth");

  const fontValue = storedFont || (fontSlider ? fontSlider.value : null);
  const lineValue =
    storedLine || (lineHeightSlider ? lineHeightSlider.value : null);
  const columnValue =
    storedColumn || (columnWidthSlider ? columnWidthSlider.value : null);

  if (fontValue) {
    root.style.setProperty("--font-size", fontValue + "px");
    if (fontSlider) fontSlider.value = fontValue;
  }
  if (lineValue) {
    root.style.setProperty("--line-height", lineValue);
    if (lineHeightSlider) lineHeightSlider.value = lineValue;
  }
  if (columnValue) {
    root.style.setProperty("--column-width", columnValue + "px");
    if (columnWidthSlider) columnWidthSlider.value = columnValue;
  }

  if (fontSlider) {
    fontSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      root.style.setProperty("--font-size", val + "px");
      localStorage.setItem("fontSize", val);
    });
  }

  if (lineHeightSlider) {
    lineHeightSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      root.style.setProperty("--line-height", val);
      localStorage.setItem("lineHeight", val);
    });
  }

  if (columnWidthSlider) {
    columnWidthSlider.addEventListener("input", (e) => {
      const val = e.target.value;
      root.style.setProperty("--column-width", val + "px");
      localStorage.setItem("columnWidth", val);
    });
  }
})();
