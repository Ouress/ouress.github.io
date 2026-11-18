/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */
function displayValue(value) {
  if (value === '------' || value === 'N/A' || value === undefined || value === null || value === '') {
    return 'Not listed';
  }
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  if (!value || value === '------' || value === 'N/A') {
    return 'Not listed';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Not listed'
    : displayValue(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
}

function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Use a real HTML <table>, with <th> header cells and a <caption> saying what the table shows
  // - Include the 4-6 most useful fields
  // - Show "Not listed" instead of undefined when a value is missing
  // - Optional: add sorting
  const rows = [...data]
    .sort((a, b) => {
      const dateA = new Date(a.inspection_date).getTime();
      const dateB = new Date(b.inspection_date).getTime();
      const validA = Number.isNaN(dateA) ? Number.NEGATIVE_INFINITY : dateA;
      const validB = Number.isNaN(dateB) ? Number.NEGATIVE_INFINITY : dateB;
      return validB - validA;
    })
    .map(
      (inspection) => `
        <tr>
          <th scope="row">${displayValue(inspection.name)}</th>
          <td>${displayValue(inspection.category)}</td>
          <td>${displayValue(inspection.city)}</td>
          <td>${formatDate(inspection.inspection_date)}</td>
          <td>${displayValue(inspection.inspection_results)}</td>
          <td>${displayValue(inspection.inspection_type)}</td>
        </tr>
      `
    )
    .join('');

  /*html*/
  return `
    <h2 class="view-title">📊 Table View</h2>
    <div class="table-scroll" role="region" aria-label="Food safety inspections table" tabindex="0">
      <table class="restaurant-table">
        <caption>Food Safety Inspections by Establishment, Business Type, City, Inspection Date, Result, and Inspection Type.</caption>
        <thead>
          <tr>
            <th scope="col">Establishment</th>
            <th scope="col">Business type</th>
            <th scope="col">City</th>
            <th scope="col">Inspection date</th>
            <th scope="col">Result</th>
            <th scope="col">Inspection type</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export default showTable;
