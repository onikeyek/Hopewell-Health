// ===== DASHBOARD PAGE =====

let allStates = [];
let chart = null;
let currentDataset = 'beneficiaries';

const RECENT_REQUESTS = [
  { icon: '💉', title: 'Polio Campaign Boost', meta: 'Lagos Outreach Team · 2h ago', status: 'FULFILLED', cls: 'req-fulfilled' },
  { icon: '🏥', title: 'Emergency Insulin Restock', meta: 'Kano Hub · 5h ago', status: 'IN REVIEW', cls: 'req-review' },
  { icon: '🚑', title: 'Ambulance Dispatch Request', meta: 'Ogun Center · 1d ago', status: 'NEW', cls: 'req-new' },
];

async function initDashboard() {
  try {
    const [states, monthly] = await Promise.all([
      apiFetch('/states'),
      apiFetch('/monthly')
    ]);
    allStates = states;
    populateStateFilter(states);
    renderChart(monthly);
  } catch (err) {
    console.error('Dashboard load error:', err);
  }

  renderRecentRequests();
  initChartToggle();
  initTimeFilters();
  initSidebarToggle();
}

function populateStateFilter(states) {
  const select = document.getElementById('stateFilter');
  if (!select) return;
  states.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.textContent = s.name + ' State';
    select.appendChild(opt);
  });
}

function renderChart(monthly) {
  const ctx = document.getElementById('outreachChart').getContext('2d');
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: monthly.map(m => m.month),
      datasets: [{
        data: monthly.map(m => m.outreach),
        borderColor: '#0f172a',
        borderWidth: 2.5,
        pointBackgroundColor: '#0f172a',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 260);
          gradient.addColorStop(0, 'rgba(13,148,136,0.18)');
          gradient.addColorStop(1, 'rgba(13,148,136,0)');
          return gradient;
        },
        tension: 0.45,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0f172a',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.8)',
          padding: 10,
          callbacks: {
            label: ctx => ' ' + formatNumber(ctx.raw) + ' outreach'
          }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#94a3b8' } },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { size: 11 },
            color: '#94a3b8',
            callback: v => v >= 1000 ? (v / 1000) + 'k' : v
          }
        }
      }
    }
  });
}

function renderRecentRequests() {
  const container = document.getElementById('recentRequestsList');
  if (!container) return;
  container.innerHTML = RECENT_REQUESTS.map(r => `
    <div class="recent-request-item">
      <div class="req-icon">${r.icon}</div>
      <div class="req-body">
        <div class="req-title">${r.title}</div>
        <div class="req-meta">${r.meta}</div>
      </div>
      <span class="req-status ${r.cls}">${r.status}</span>
    </div>
  `).join('');
}

function initChartToggle() {
  document.getElementById('btnBeneficiaries')?.addEventListener('click', () => {
    document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btnBeneficiaries').classList.add('active');
  });

  document.getElementById('btnVaccinations')?.addEventListener('click', async () => {
    document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btnVaccinations').classList.add('active');
    // Swap to vaccination data
    if (chart) {
      chart.data.datasets[0].data = allStates.map(s => s.vaccines);
      chart.data.labels = allStates.map(s => s.name);
      chart.update();
    }
  });
}

function initTimeFilters() {
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initSidebarToggle() {
  const toggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  toggle?.addEventListener('click', () => sidebar.classList.toggle('open'));
}

document.addEventListener('DOMContentLoaded', initDashboard);
