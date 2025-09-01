(async function(){
  try {
    const res = await fetch('analytics/analytics.json');
    const data = await res.json();

    // Trend line chart
    const ctx = document.getElementById('trendChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.trend.map(t => t.date),
        datasets: [
          {
            label: 'Impressions',
            data: data.trend.map(t => t.impressions),
            borderColor: 'blue',
            fill: false
          },
          {
            label: 'Zero Results',
            data: data.trend.map(t => t.zeroResults),
            borderColor: 'red',
            fill: false
          }
        ]
      }
    });

    const list = document.getElementById('poor-queries');
    data.poorQueries.forEach(q => {
      const li = document.createElement('li');
      li.textContent = `${q.query} - CTR ${(q.ctr*100).toFixed(2)}% - Zero Results ${q.zeroResults}. Suggestions: ${q.suggestions.join(', ')}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Failed to load analytics', err);
  }
})();
