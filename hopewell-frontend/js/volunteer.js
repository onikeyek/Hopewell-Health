// ===== VOLUNTEER APPLICATION =====

let volData = { role: '', skills: [], focusAreas: [], regions: [], schedule: [] };

function showVolStep(n) {
  document.querySelectorAll('.vol-step').forEach(s => s.style.display = 'none');
  const step = document.getElementById(`vstep${n}`);
  if (!step) return;

  if (n === 7) {
    step.style.display = 'flex';
    step.style.flexDirection = 'column';
    step.style.minHeight = '100vh';
  } else if (n >= 2 && n <= 6) {
    step.style.display = 'flex';
  } else {
    step.style.display = 'block';
  }

  // Step 4 uses block not flex
  if (n === 4) step.style.display = 'block';

  const isPortal = n >= 2 && n <= 6;
  const mainNav = document.getElementById('volNav');
  const portalNav = document.getElementById('portalNav');
  if (mainNav) mainNav.style.display = isPortal ? 'none' : '';
  if (portalNav) portalNav.style.display = isPortal ? '' : 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== STEP 1: ROLE =====
document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    volData.role = card.dataset.role;
    const preview = document.getElementById('rolePreview');
    preview.innerHTML = `<div class="role-selected-display">✓ ${volData.role}</div>`;
  });
});

document.getElementById('vstep1Next')?.addEventListener('click', () => {
  if (!volData.role) { alert('Please select a volunteer role to continue.'); return; }
  showVolStep(2);
});

// ===== STEP 2: PERSONAL INFO =====
function validateStep2() {
  let valid = true;
  const checks = [
    { id: 'vFullName',   errId: 'vFullNameErr',   label: 'Full name' },
    { id: 'vEmail',      errId: 'vEmailErr',      label: 'Email address' },
    { id: 'vPhone',      errId: 'vPhoneErr',      label: 'Phone number' },
    { id: 'vState',      errId: 'vStateErr',      label: 'Residential state' },
    { id: 'vProfession', errId: 'vProfessionErr', label: 'Current profession' },
  ];

  checks.forEach(f => {
    const input = document.getElementById(f.id);
    const err   = document.getElementById(f.errId);
    if (!input) return; // skip if element not found
    const val = input.value.trim();
    if (!val) {
      if (err) err.textContent = `${f.label} is required.`;
      input.classList.add('error');
      valid = false;
    } else if (f.id === 'vEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      if (err) err.textContent = 'Enter a valid email address.';
      input.classList.add('error');
      valid = false;
    } else {
      if (err) err.textContent = '';
      input.classList.remove('error');
    }
  });

  return valid;
}

// ===== STEP 2: PERSONAL INFO =====
function handleStep2Next() {
  if (!validateStep2()) return;
  volData.name       = document.getElementById('vFullName').value.trim();
  volData.email      = document.getElementById('vEmail').value.trim();
  volData.phone      = document.getElementById('vPhone').value.trim();
  volData.state      = document.getElementById('vState').value;
  volData.profession = document.getElementById('vProfession').value.trim();
  showVolStep(3);
}

document.getElementById('vstep2Next')?.addEventListener('click', handleStep2Next);

document.getElementById('vstep2Back')?.addEventListener('click', () => showVolStep(1));

// ===== STEP 3: EXPERIENCE =====
document.querySelectorAll('.skill-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('selected');
    const skill = tag.dataset.skill;
    if (tag.classList.contains('selected')) { volData.skills.push(skill); }
    else { volData.skills = volData.skills.filter(s => s !== skill); }
  });
});

document.getElementById('vstep3Next')?.addEventListener('click', () => {
  const cert = document.getElementById('vCert').value.trim();
  const years = document.getElementById('vYears').value;
  if (!cert) { document.getElementById('vCertErr').textContent = 'Certification is required.'; return; }
  if (!years) { document.getElementById('vYearsErr').textContent = 'Please select years of experience.'; return; }
  document.getElementById('vCertErr').textContent = '';
  document.getElementById('vYearsErr').textContent = '';
  volData.cert = cert;
  volData.years = years;
  volData.employer = document.getElementById('vEmployer').value.trim();
  showVolStep(4);
});

document.getElementById('vstep3Back')?.addEventListener('click', () => showVolStep(2));

// ===== STEP 4: AVAILABILITY =====
document.querySelectorAll('.avail-cell').forEach(cell => {
  cell.addEventListener('click', () => {
    cell.classList.toggle('selected');
    const slot = `${cell.dataset.day}-${cell.dataset.time}`;
    if (cell.classList.contains('selected')) { volData.schedule.push(slot); }
    else { volData.schedule = volData.schedule.filter(s => s !== slot); }
  });
});

document.getElementById('vstep4Next')?.addEventListener('click', () => {
  volData.hours = document.getElementById('vHours').value;
  volData.startDate = document.getElementById('vStartDate').value;
  showVolStep(5);
});

document.getElementById('vstep4Back')?.addEventListener('click', () => showVolStep(3));

// ===== STEP 5: PREFERENCES =====
document.querySelectorAll('.pref-focus-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    const check = card.querySelector('.fac-check');
    if (check) check.checked = card.classList.contains('selected');
    const focus = card.dataset.focus;
    if (card.classList.contains('selected')) { volData.focusAreas.push(focus); }
    else { volData.focusAreas = volData.focusAreas.filter(f => f !== focus); }
  });
});

document.querySelectorAll('.pref-region-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('selected');
    const check = card.querySelector('.pref-region-check');
    if (check) check.checked = card.classList.contains('selected');
    const region = card.dataset.region;
    if (card.classList.contains('selected')) { volData.regions.push(region); }
    else { volData.regions = volData.regions.filter(r => r !== region); }
  });
});

document.getElementById('vstep5Next')?.addEventListener('click', () => {
  populateReview();
  showVolStep(6);
});

document.getElementById('vstep5Back')?.addEventListener('click', () => showVolStep(4));

// ===== STEP 6: REVIEW =====
function populateReview() {
  document.getElementById('reviewRole').textContent = volData.role || '—';
  document.getElementById('reviewName').textContent = volData.name || '—';
  document.getElementById('reviewEmail').textContent = volData.email || '—';
  document.getElementById('reviewPhone').textContent = volData.phone || '—';
  document.getElementById('reviewState').textContent = (volData.state || '—') + ', Nigeria';
  document.getElementById('reviewCert').textContent = volData.cert || '—';
  document.getElementById('reviewYears').textContent = volData.years || '—';
  document.getElementById('reviewSkills').textContent = volData.skills.length ? volData.skills.join(', ') : '—';
  document.getElementById('reviewHours').textContent = volData.hours ? volData.hours + ' hours / week' : '—';
  document.getElementById('reviewStartDate').textContent = volData.startDate ? new Date(volData.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';
  document.getElementById('reviewFocus').textContent = volData.focusAreas.length ? volData.focusAreas.join(', ') : '—';
  document.getElementById('reviewRegions').textContent = volData.regions.length ? volData.regions.join(', ') : '—';
}

function submitApplication() {
  if (!document.getElementById('consentCheck').checked) {
    document.getElementById('consentErr').textContent = 'You must confirm the information and agree to the terms.';
    return;
  }
  document.getElementById('consentErr').textContent = '';
  // Populate email confirmation (step 8)
  document.getElementById('emailToName').textContent = volData.name || 'Volunteer';
  document.getElementById('emailToAddr').textContent = volData.email || 'volunteer@email.com';
  document.getElementById('emailDearName').textContent = (volData.name || 'Volunteer').split(' ')[0];
  showVolStep(7); // Show success page first
}

document.getElementById('vstep6Submit')?.addEventListener('click', submitApplication);
document.getElementById('vstep6SubmitSide')?.addEventListener('click', submitApplication);
document.getElementById('vstep6Back')?.addEventListener('click', () => showVolStep(5));

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => showVolStep(1));
