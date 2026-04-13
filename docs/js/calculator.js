// ===== DONATION CALCULATOR =====

let rates = null;

// Fallback rates if API unavailable
const DEFAULT_RATES = {
  health_kits_per_1000: 0.24,
  vaccinations_per_1000: 0.5,
  clinic_hours_per_1000: 0.09,
  volunteers_per_1000: 0.16
};

async function initCalculator() {
  try {
    rates = await apiFetch('/donations');
  } catch {
    rates = DEFAULT_RATES;
  }
  calculateImpact();
}

function calculateImpact() {
  const amount = parseFloat(document.getElementById('donationInput').value) || 0;
  const per1000 = amount / 1000;

  animateValue('impactKits',      Math.floor(per1000 * rates.health_kits_per_1000 * 1000));
  animateValue('impactVaccines',  Math.floor(per1000 * rates.vaccinations_per_1000 * 1000));
  setTextValue('impactHours',     (per1000 * rates.clinic_hours_per_1000 * 1000).toFixed(1));
  animateValue('impactVolunteers', Math.floor(per1000 * rates.volunteers_per_1000 * 1000));
}

function animateValue(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  const diff = target - start;
  const duration = 400;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + diff * ease);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function setTextValue(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ===== PRESET BUTTONS =====
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (btn.dataset.amount !== 'custom') {
      document.getElementById('donationInput').value = btn.dataset.amount;
      calculateImpact();
    } else {
      document.getElementById('donationInput').focus();
      document.getElementById('donationInput').select();
    }
  });
});

// ===== LIVE INPUT =====
document.getElementById('donationInput')?.addEventListener('input', () => {
  document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
  // Highlight matching preset
  const val = document.getElementById('donationInput').value;
  document.querySelectorAll('.preset-btn').forEach(b => {
    if (b.dataset.amount === val) b.classList.add('active');
  });
  calculateImpact();
});

// ===== SHARE BUTTON =====
document.getElementById('shareBtn')?.addEventListener('click', () => {
  const amount = document.getElementById('donationInput').value;
  const kits = document.getElementById('impactKits').textContent;
  const vaccines = document.getElementById('impactVaccines').textContent;
  const text = `I'm donating ₦${Number(amount).toLocaleString()} to HopeWell Healthcare — funding ${kits} health kits and ${vaccines} vaccinations in Nigeria! 🇳🇬 #HopeWell`;

  if (navigator.share) {
    navigator.share({ title: 'HopeWell Impact', text });
  } else {
    navigator.clipboard.writeText(text)
      .then(() => {
        const btn = document.getElementById('shareBtn');
        const original = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = original, 2000);
      });
  }
});

document.addEventListener('DOMContentLoaded', initCalculator);
