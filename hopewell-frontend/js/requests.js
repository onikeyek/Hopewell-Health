// ===== REQUESTS PAGE =====

let allRequests = [];
let currentStatus = 'all';
let currentState = '';
let currentPriority = '';
let searchQuery = '';
const PAGE_SIZE = 5;
let currentPage = 1;

const PRIORITY_COLORS = {
  urgent: { bg: '#fee2e2', color: '#b91c1c', iconBg: '#fee2e2' },
  high:   { bg: '#fef3c7', color: '#92400e', iconBg: '#fef9c3' },
  normal: { bg: '#dbeafe', color: '#1d4ed8', iconBg: '#eff6ff' },
  low:    { bg: '#f0fdf4', color: '#166534', iconBg: '#f0fdf4' },
};

async function initRequests() {
  try {
    allRequests = await apiFetch('/requests');
    renderRequests();
  } catch (err) {
    document.getElementById('requestsList').innerHTML =
      '<div class="error-state">⚠ Could not load requests. Is the server running?</div>';
  }
}

function getFiltered() {
  return allRequests.filter(r => {
    const matchStatus   = currentStatus === 'all' || r.status === currentStatus;
    const matchState    = !currentState || r.state.toLowerCase() === currentState.toLowerCase();
    const matchPriority = !currentPriority || r.priority === currentPriority;
    const matchSearch   = !searchQuery ||
      r.title.toLowerCase().includes(searchQuery) ||
      r.description.toLowerCase().includes(searchQuery) ||
      r.requester.toLowerCase().includes(searchQuery);
    return matchStatus && matchState && matchPriority && matchSearch;
  });
}

function renderRequests() {
  const filtered = getFiltered();
  const total    = filtered.length;
  const start    = (currentPage - 1) * PAGE_SIZE;
  const paged    = filtered.slice(start, start + PAGE_SIZE);
  const container = document.getElementById('requestsList');

  if (paged.length === 0) {
    container.innerHTML = '<div class="loading-state"><p>No requests match your filters.</p></div>';
  } else {
    container.innerHTML = paged.map(r => buildCard(r)).join('');
  }

  // Pagination info
  const end = Math.min(start + PAGE_SIZE, total);
  document.getElementById('paginationInfo').textContent =
    total > 0 ? `Showing ${start + 1} to ${end} of ${total} requests` : '';

  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = start + PAGE_SIZE >= total;

  // Show/hide pagination
  document.getElementById('pagination').style.display = total > 0 ? 'flex' : 'none';
}

function buildCard(r) {
  const colors = PRIORITY_COLORS[r.priority] || PRIORITY_COLORS.normal;
  const isResolved = r.status === 'resolved';
  const isInProgress = r.status === 'in-progress';
  const icon = r.icon || '📋';

  const actions = isResolved
    ? `<div class="completed-badge">✅ COMPLETED</div>
       <button class="btn-archive">View Archive</button>`
    : isInProgress
    ? `<button class="btn-progress-indicator" title="In Progress"></button>
       <a href="request-detail.html?id=${r.id}" class="btn-details">View Details</a>`
    : `<button class="btn-assign">Assign</button>
       <a href="request-detail.html?id=${r.id}" class="btn-details">View Details</a>`;

  return `
    <div class="request-card">
      <div class="request-icon" style="background:${colors.iconBg}">${icon}</div>
      <div class="request-body">
        <div class="request-title-row">
          <span class="request-title">${r.title}</span>
          <span class="badge badge-priority" style="background:${colors.bg};color:${colors.color}">${r.priority.toUpperCase()}</span>
          <span class="badge badge-${r.status}">${r.status.replace('-', ' ').toUpperCase()}</span>
        </div>
        <p class="request-desc">${r.description}</p>
        <div class="request-meta">
          <span>👤 ${r.requester.toUpperCase()}</span>
          <span>📍 ${(r.location || r.state).toUpperCase()}</span>
          <span>📅 ${r.date}</span>
        </div>
      </div>
      <div class="request-actions">${actions}</div>
    </div>
  `;
}

// ===== EVENT LISTENERS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentStatus = btn.dataset.status;
    currentPage = 1;
    renderRequests();
  });
});

document.getElementById('stateFilter')?.addEventListener('change', e => {
  currentState = e.target.value;
  currentPage = 1;
  renderRequests();
});

document.getElementById('priorityFilter')?.addEventListener('change', e => {
  currentPriority = e.target.value;
  currentPage = 1;
  renderRequests();
});

document.getElementById('searchInput')?.addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase().trim();
  currentPage = 1;
  renderRequests();
});

document.getElementById('prevBtn')?.addEventListener('click', () => {
  if (currentPage > 1) { currentPage--; renderRequests(); window.scrollTo(0, 200); }
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
  currentPage++;
  renderRequests();
  window.scrollTo(0, 200);
});

document.addEventListener('DOMContentLoaded', initRequests);
