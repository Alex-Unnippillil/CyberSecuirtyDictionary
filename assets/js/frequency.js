(function () {
  fetch('frequency.json')
    .then((response) => response.json())
    .then((data) => {
      const svg = document.getElementById('frequency-sparkline');
      if (!svg || !data.values) return;
      sparkline.sparkline(svg, data.values);
    })
    .catch(() => {
      // Ignore fetch errors
    });
})();
