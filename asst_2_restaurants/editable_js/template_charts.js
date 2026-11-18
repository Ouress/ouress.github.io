/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */
let activeCharts = [];

function countBy(data, field) {
  const counts = new Map();
  data.forEach((item) => {
    const value = item[field];
    const label = value === '------' || value === 'N/A' || value === undefined || value === null || value === ''
      ? 'Not listed'
      : value;
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function getTopCategories(data) {
  const categories = countBy(data, 'category');
  const topCategories = categories.slice(0, 7);
  const otherCount = categories.slice(7).reduce((total, [, count]) => total + count, 0);
  if (otherCount > 0) {
    topCategories.push(['Other business types', otherCount]);
  }
  return topCategories;
}

function showCharts(data) {
  // TODO: Replace each TODO sentence below with text that says what that chart shows.
  // Charts are drawn as pictures, so screen readers can't read them.
  const topCategories = getTopCategories(data);
  const results = countBy(data, 'inspection_results');
  const topCategory = countBy(data, 'category')[0] || ['No data', 0];
  const mostCommonResult = results[0] || ['No data', 0];

  return `
    <h2 class="view-title">📈 Charts View</h2>
    <div class="charts-grid">
      <figure class="chart-figure">
        <div class="chart-canvas-wrap">
          <canvas id="chart-one" role="img" aria-label="Bar chart showing inspection counts for the most common business types"></canvas>
        </div>
        <figcaption class="chart-summary">This is a chart comparing the number of inspections with each business type. Less common business types are combined under "Other business types".</figcaption>
      </figure>
      <figure class="chart-figure">
        <div class="chart-canvas-wrap">
          <canvas id="chart-two" role="img" aria-label="Doughnut chart showing the number of inspections by result"></canvas>
        </div>
        <figcaption class="chart-summary">This is a doughnut chart showing the distribution of inspection results. Each color represents an inspection result.</figcaption>
      </figure>
    </div>
  `;
}

function drawCharts(data) {
  // Chart.js is loaded by a <script> tag in index.html. If it didn't load, say so instead of breaking.
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  activeCharts.forEach((chart) => chart.destroy());
  activeCharts = [];

  // TODO 1: Reshape your data for the first chart.
  // Chart.js doesn't take your array of records.
  // It wants a list of labels and a matching list of numbers.
  // Example: count inspections by type of business.
  //
  //   const counts = {};
  //   data.forEach((item) => {
  //     counts[item.category] = (counts[item.category] || 0) + 1;
  //   });
  //   const labels = Object.keys(counts);
  //   const numbers = Object.values(counts);

  // TODO 2: Draw the first chart into <canvas id="chart-one">.
  // Every chart needs a title, and every axis needs a label.
  //
  //   new Chart(document.querySelector('#chart-one'), {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [{ label: 'Number of inspections', data: numbers }]
  //     },
  //     options: {
  //       plugins: { title: { display: true, text: 'Inspections by type of business' } },
  //       scales: {
  //         x: { title: { display: true, text: 'Type of business' } },
  //         y: { title: { display: true, text: 'Inspections' }, beginAtZero: true }
  //       }
  //     }
  //   });

  // TODO 3: Reshape your data again, and draw a second chart of a DIFFERENT type
  // (pie, line, scatter...) into <canvas id="chart-two">, answering a different question.
  // Ideas: inspection results as a pie, inspections per month as a line,
  // or how many "Out of Compliance" checks each type of business averages.
  const topCategories = getTopCategories(data);
  const categoryData = {
    labels: topCategories.map(([label]) => label),
    datasets: [{
      label: 'Inspections',
      data: topCategories.map(([, count]) => count),
      backgroundColor: '#007cba',
      borderRadius: 4
    }]
  };
  const categoryConfig = {
    type: 'bar',
    data: categoryData,
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Inspections by business type' },
        legend: { display: false }
      },
      scales: {
        x: {
          title: { display: true, text: 'Number of inspections' },
          beginAtZero: true,
          ticks: { precision: 0 }
        },
        y: { title: { display: true, text: 'Business type' } }
      }
    }
  };
  const categoryCanvas = document.querySelector('#chart-one');
  const categoryChart = new Chart(categoryCanvas, categoryConfig);

  const results = countBy(data, 'inspection_results');
  const resultData = {
    labels: results.map(([label]) => label),
    datasets: [{
      label: 'Inspections',
      data: results.map(([, count]) => count),
      backgroundColor: [
        '#e21515', '#ec981a', '#eeea1b', '#57e220',
        '#169ae7', '#7e60ec', '#a014fd', '#6c757d'
      ]
    }]
  };
  const resultConfig = {
    type: 'doughnut',
    data: resultData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: 'Inspections by result' },
        legend: { position: 'bottom' }
      }
    }
  };
  const resultCanvas = document.querySelector('#chart-two');
  const resultChart = new Chart(resultCanvas, resultConfig);

  activeCharts = [categoryChart, resultChart];
}

export { showCharts, drawCharts };
