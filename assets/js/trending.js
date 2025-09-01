(function () {
  const ANALYTICS_BASE =
    window.__ANALYTICS_BASE__ || "https://analytics.example.com";

  async function fetchCounts(range) {
    const url = `${ANALYTICS_BASE}/trending?range=${range}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch ${range} data`);
    }
    return res.json();
  }

  function buildChart(canvas, items, label) {
    if (!canvas) return;
    const labels = items.map((i) => i.term || i.label || i.date || "");
    const counts = items.map((i) => i.count || i.value || 0);
    new Chart(canvas.getContext("2d"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label,
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const [weekly, monthly] = await Promise.all([
        fetchCounts("week"),
        fetchCounts("month"),
      ]);
      buildChart(document.getElementById("weeklyChart"), weekly, "Weekly");
      buildChart(document.getElementById("monthlyChart"), monthly, "Monthly");
    } catch (err) {
      console.error("Error loading analytics data", err);
    }
  });
})();
