/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */
function showCategories(data) {
  // Requirements:
  // - Group data by one meaningful field (category, city, inspection result, etc.)
  // - Show how many records are in each group, plus one other number per group
  //   (an average, a highest, a lowest)
  // - Show items within each group
  // - Make the groups easy to compare, and visually distinct from their items
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

  const groups = new Map();
  data.forEach((inspection) => {
    const category = displayValue(inspection.category);
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category).push(inspection);
  });

  const sections = [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .map(([category, inspections]) => {
      const complaintCount = inspections.filter(
        (inspection) => inspection.inspection_type === 'Food Complaint'
      ).length;
      const inspectionLabel = inspections.length === 1 ? 'inspection' : 'inspections';
      const complaintLabel = complaintCount === 1 ? 'complaint' : 'complaints';
      const items = inspections
        .map(
          (inspection) => `
            <div class="category-item">
              <div class="category-item-details">
                <strong>${displayValue(inspection.name)}</strong>
                <span>${displayValue(inspection.city)} &middot; ${formatDate(inspection.inspection_date)}</span>
              </div>
              <span class="category-result">${displayValue(inspection.inspection_results)}</span>
            </div>
          `
        )
        .join('');

      /*html*/
      return `
        <section class="category-section" aria-label="${category}">
          <h3 class="category-header">
            <span>${category}</span>
            <span class="category-summary">${inspections.length} ${inspectionLabel} | ${complaintCount} ${complaintLabel}</span>
          </h3>
          <div class="category-items">${items}</div>
        </section>
      `;
    })
    .join('');

  return `
    <h2 class="view-title">📂 Category View</h2>
    <div class="category-groups">${sections}</div>
  `;
}

export default showCategories;