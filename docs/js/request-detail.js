// ===== REQUEST DETAIL PAGE =====

// SVG icon set
const ICONS = {
  clinical: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  logistics: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  timeline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  location: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  map: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  warning: `<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19h-17L12 5.5zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>`,
  refresh: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
  message: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  pdf: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
};

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

async function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = 'requests.html'; return; }
  try {
    const request = await apiFetch(`/requests/${id}`);
    renderDetail(request);
  } catch (err) {
    document.getElementById('detailMain').innerHTML =
      `<div class="error-state">⚠ Request not found. <a href="requests.html">Go back</a></div>`;
  }
}

function statusLabel(status) {
  const map = { 'open':'OPEN','in-progress':'IN PROGRESS','in-transit':'IN TRANSIT','resolved':'RESOLVED' };
  return map[status] || status.toUpperCase();
}

function renderDetail(r) {
  const main = document.getElementById('detailMain');
  const isTransit = r.status === 'in-transit';
  const statusBadge = isTransit
    ? `<span class="badge-transit-pill">${statusLabel(r.status)}</span>`
    : `<span class="badge badge-${r.status}">${statusLabel(r.status)}</span>`;

  const needsHTML = (r.immediate_needs || []).map(n => `<li>${n}</li>`).join('');

  const timelineHTML = (r.timeline || []).map(t => `
    <div class="timeline-item">
      <div class="timeline-dot-wrap">
        <div class="timeline-dot"></div>
        <div class="timeline-line"></div>
      </div>
      <div class="timeline-content">
        <div class="timeline-event-row">
          <span class="timeline-event">${t.event}</span>
          <span class="timeline-time">${t.time}</span>
        </div>
        <p class="timeline-detail">${t.detail}</p>
      </div>
    </div>
  `).join('');

  main.innerHTML = `
    <div class="detail-breadcrumb">
      <a href="requests.html">Requests</a>
      <span>›</span>
      <span class="ref">${r.ref || 'REQ-' + String(r.id).padStart(4,'0')}</span>
    </div>

    <div class="detail-title-row">
      <h1>${r.title} for ${r.requester} in ${r.state}</h1>
      <div class="detail-badges">
        <span class="badge-urgent-pill">
          ${ICONS.warning} ${r.priority.toUpperCase()}
        </span>
        ${statusBadge}
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-left">

        <!-- PATIENT CARD -->
        <div class="patient-card">
          <div class="patient-avatar patient-initials-avatar">${getInitials(r.requester)}</div>
          <div class="patient-info">
            <div class="patient-name">${r.requester}</div>
            <div class="patient-meta">
              ${r.age ? `<span>${r.age} years old</span><span>•</span>` : ''}
              ${r.gender ? `<span>${r.gender}</span><span>•</span>` : ''}
              <span>${ICONS.location} ${r.full_location || r.location || r.state}</span>
            </div>
          </div>
          <a href="#" class="view-record-link">View Full Record ↗</a>
        </div>

        <!-- CLINICAL + LOGISTICS -->
        <div class="case-logistics-grid">
          <div class="case-card">
            <div class="card-section-title">
              <span class="section-icon">${ICONS.clinical}</span> Clinical Case
            </div>
            ${r.diagnosis ? `<div class="case-label">DIAGNOSIS</div><p class="case-diagnosis">${r.diagnosis}</p>` : ''}
            ${needsHTML ? `<div class="case-label">IMMEDIATE NEEDS</div><ul class="needs-list">${needsHTML}</ul>`
              : `<p class="case-diagnosis">${r.description}</p>`}
          </div>

          <div class="logistics-card">
            <div class="card-section-title">
              <span class="section-icon">${ICONS.logistics}</span> Logistics
            </div>
            ${r.logistics_origin ? `
              <div class="logistics-route">
                <div class="logistics-stop">
                  <div class="stop-dot active"></div>
                  <span class="stop-name">${r.logistics_origin}</span>
                  <span class="stop-time">${r.logistics_origin_time || ''}</span>
                </div>
                <div class="logistics-progress"><div class="logistics-progress-fill"></div></div>
                <div class="logistics-stop">
                  <div class="stop-dot pending"></div>
                  <span class="stop-name">${r.logistics_destination}</span>
                  <span class="stop-time">${r.logistics_eta || ''}</span>
                </div>
              </div>
              <div class="logistics-position">
                <div class="logistics-position-icon">${ICONS.map}</div>
                <div>
                  <div class="logistics-position-label">Current Position</div>
                  <div class="logistics-position-value">${r.logistics_position}</div>
                </div>
              </div>
            ` : `<p style="font-size:0.85rem;color:var(--text-muted)">${r.description}</p>`}
          </div>
        </div>

        ${timelineHTML ? `
          <div class="timeline-card">
            <div class="card-section-title">
              <span class="section-icon">${ICONS.timeline}</span> Case Timeline
            </div>
            <div class="timeline-list">${timelineHTML}</div>
          </div>
        ` : ''}

      </div>

      <!-- RIGHT SIDEBAR -->
      <div class="detail-right">
        <div class="assigned-card">
          <div class="assigned-title">Assigned Team</div>
          <div class="doctor-row">
            <div class="doctor-avatar">${getInitials(r.assigned_doctor || 'Unassigned')}</div>
            <div>
              <div class="doctor-name">${r.assigned_doctor || 'Unassigned'}</div>
              <div class="doctor-role">${r.doctor_role || ''}</div>
            </div>
          </div>
          ${r.team && r.team.length > 1 ? `
            <div class="team-list">
              ${r.team.slice(1).map(m => `
                <div class="team-member">
                  <div class="team-avatar ${m.name === 'Volunteer needed' ? 'team-avatar-empty' : ''}">${m.name === 'Volunteer needed' ? '+' : getInitials(m.name)}</div>
                  <div>
                    <div class="team-member-name">${m.name}</div>
                    <div class="team-member-role">${m.role}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${r.volunteers_needed ? `
            <div class="volunteers-needed-banner">
              <span>${ICONS.warning}</span>
              <div>
                <div class="volunteers-needed-title">Volunteers Needed</div>
                <div class="volunteers-needed-msg">${r.volunteers_message}</div>
              </div>
            </div>
          ` : ''}
          <div class="assigned-meta" style="margin-top:0.75rem">
            <div class="assigned-meta-row"><span>Duty Station</span><span>${r.duty_station || '—'}</span></div>
            <div class="assigned-meta-row"><span>Availability</span><span class="on-call-badge">● ${r.availability || 'Available'}</span></div>
          </div>
        </div>

        <div class="actions-card">
          <div class="actions-title">Actions</div>
          <button class="action-btn action-btn-primary" onclick="alert('Status updated!')">${ICONS.refresh} Update Status</button>
          <button class="action-btn action-btn-secondary" onclick="alert('Contacting clinic...')">${ICONS.message} Contact Clinic</button>
          <button class="action-btn action-btn-secondary" onclick="window.print()">${ICONS.pdf} Export PDF</button>
        </div>

        ${r.system_note ? `<div class="note-card"><p class="note-text">"${r.system_note}"</p></div>` : ''}
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initDetail);
