// ===== DONATE PAGE =====

let donationAmount = 5000;
let donorData = {};

// ===== STEP NAVIGATION =====
function showStep(n) {
  document.querySelectorAll('.donate-step').forEach(s => s.style.display = 'none');
  document.getElementById(`step${n}`).style.display = 'block';
  const isPayment = n === 4;
  document.getElementById('mainNav').style.display = isPayment ? 'none' : '';
  document.getElementById('secureNav').style.display = isPayment ? '' : 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== STEP 1: AMOUNT =====
document.querySelectorAll('.amount-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    donationAmount = parseInt(btn.dataset.amount);
    // Show selected amount in the custom input box
    document.getElementById('customAmount').value = donationAmount.toLocaleString();
    updateImpactPreview();
  });
});

document.getElementById('customAmount')?.addEventListener('input', e => {
  const raw = e.target.value.replace(/,/g, '');
  const val = parseInt(raw);
  if (val > 0) {
    donationAmount = val;
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    updateImpactPreview();
  }
});

function updateImpactPreview() {
  const el = document.getElementById('impactPreviewText');
  if (!el) return;
  const patients = Math.max(1, Math.floor(donationAmount / 1500));
  el.textContent = `A donation of ₦${donationAmount.toLocaleString()} provides basic screening and medication for ${patients} patient${patients > 1 ? 's' : ''} in our community sanctuary program.`;
}

document.getElementById('step1Next')?.addEventListener('click', () => {
  if (!donationAmount || donationAmount < 100) {
    alert('Please select or enter a valid donation amount (minimum ₦100).');
    return;
  }
  document.getElementById('step2Amount').textContent = `₦${donationAmount.toLocaleString()}`;
  showStep(2);
});

// ===== STEP 2: DETAILS =====
function validateStep2() {
  let valid = true;

  const fields = [
    { id: 'firstName', errId: 'firstNameErr', label: 'First name' },
    { id: 'lastName',  errId: 'lastNameErr',  label: 'Last name' },
    { id: 'email',     errId: 'emailErr',     label: 'Email address' },
    { id: 'address',   errId: 'addressErr',   label: 'Address' },
  ];

  fields.forEach(f => {
    const input = document.getElementById(f.id);
    const err = document.getElementById(f.errId);
    const val = input.value.trim();
    if (!val) {
      err.textContent = `${f.label} is required.`;
      input.classList.add('error');
      valid = false;
    } else if (f.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      err.textContent = 'Please enter a valid email address.';
      input.classList.add('error');
      valid = false;
    } else {
      err.textContent = '';
      input.classList.remove('error');
    }
  });

  // Phone — separate because it has country code dropdown
  const phone = document.getElementById('phone').value.trim();
  if (!phone) {
    document.getElementById('phoneErr').textContent = 'Phone number is required.';
    document.getElementById('phone').classList.add('error');
    valid = false;
  } else {
    document.getElementById('phoneErr').textContent = '';
    document.getElementById('phone').classList.remove('error');
  }

  return valid;
}

document.getElementById('step2Next')?.addEventListener('click', () => {
  if (!validateStep2()) return;

  donorData = {
    firstName:  document.getElementById('firstName').value.trim(),
    lastName:   document.getElementById('lastName').value.trim(),
    email:      document.getElementById('email').value.trim(),
    phone:      (document.getElementById('countryCode')?.value || '') + ' ' + document.getElementById('phone').value.trim(),
    address:    document.getElementById('address').value.trim(),
    dedication: document.getElementById('dedication').value.trim(),
  };

  populateReview();
  showStep(3);
});

document.getElementById('step2Back')?.addEventListener('click', () => showStep(1));

// ===== STEP 3: REVIEW =====
function populateReview() {
  const fmt = `₦${donationAmount.toLocaleString()}.00`;
  document.getElementById('reviewAmount').textContent = fmt;
  document.getElementById('reviewImpactAmount').textContent = fmt;
  document.getElementById('reviewName').textContent = `${donorData.firstName} ${donorData.lastName}`;
  document.getElementById('reviewEmail').textContent = donorData.email;
  document.getElementById('reviewAddress').textContent = donorData.address;

  const dedCard = document.getElementById('dedicationReviewCard');
  if (donorData.dedication) {
    document.getElementById('reviewDedication').textContent = `"${donorData.dedication}"`;
    dedCard.style.display = 'flex';
  } else {
    dedCard.style.display = 'none';
  }
}

document.getElementById('step3Next')?.addEventListener('click', () => {
  const txId = '#HPW-' + Math.floor(1000 + Math.random() * 9000) + '-X';
  const fmt = `₦${donationAmount.toLocaleString()}.00`;
  document.getElementById('paymentAmount').textContent = fmt;
  document.getElementById('transactionId').textContent = txId;
  document.getElementById('consentAmount').textContent = fmt;
  document.getElementById('cardName').value = `${donorData.firstName} ${donorData.lastName}`;
  showStep(4);
});

document.getElementById('step3Back')?.addEventListener('click', () => showStep(2));

// ===== STEP 4: PAYMENT =====

// Card number auto-format
document.getElementById('cardNumber')?.addEventListener('input', e => {
  let val = e.target.value.replace(/\D/g, '').slice(0, 16);
  e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
});

// CVV toggle show/hide
document.getElementById('cvvToggle')?.addEventListener('click', () => {
  const cvv = document.getElementById('cvv');
  cvv.type = cvv.type === 'password' ? 'text' : 'password';
});

function validatePayment() {
  let valid = true;

  const cardName   = document.getElementById('cardName').value.trim();
  const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
  const cvv        = document.getElementById('cvv').value.trim();
  const expiryMonth = document.getElementById('expiryMonth').value;
  const expiryYear  = document.getElementById('expiryYear').value;

  if (!cardName) {
    document.getElementById('cardNameErr').textContent = 'Cardholder name is required.';
    valid = false;
  } else {
    document.getElementById('cardNameErr').textContent = '';
  }

  if (cardNumber.length !== 16) {
    document.getElementById('cardNumberErr').textContent = 'Enter a valid 16-digit card number.';
    valid = false;
  } else {
    document.getElementById('cardNumberErr').textContent = '';
  }

  if (!expiryMonth || !expiryYear) {
    document.getElementById('expiryErr').textContent = 'Please select expiry month and year.';
    valid = false;
  } else {
    document.getElementById('expiryErr').textContent = '';
  }

  if (cvv.length < 3) {
    document.getElementById('cvvErr').textContent = 'Enter a valid CVV (3-4 digits).';
    valid = false;
  } else {
    document.getElementById('cvvErr').textContent = '';
  }

  return valid;
}

document.getElementById('completeDonation')?.addEventListener('click', () => {
  if (!validatePayment()) return;

  const btn = document.getElementById('completeDonation');
  btn.textContent = 'Processing...';
  btn.disabled = true;

  setTimeout(() => {
    const txId = document.getElementById('transactionId').textContent;
    const cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const last4 = cardNum.slice(-4) || '----';
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const kits = Math.max(1, Math.floor(donationAmount / 500));

    document.getElementById('successRef').textContent = txId;
    document.getElementById('successDate').textContent = dateStr;
    document.getElementById('successPayment').textContent = `Mastercard •••• ${last4}`;
    document.getElementById('successImpactHeading').textContent =
      `Your contribution of ₦${donationAmount.toLocaleString()} will provide ${kits} health kit${kits > 1 ? 's' : ''}.`;

    showStep(5);
  }, 2000);
});

document.getElementById('step4Back')?.addEventListener('click', () => showStep(3));

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const preAmount = params.get('amount');
  if (preAmount && parseInt(preAmount) > 0) {
    donationAmount = parseInt(preAmount);
    document.getElementById('customAmount').value = donationAmount.toLocaleString();
    document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
  } else {
    // Show default amount in input box
    document.getElementById('customAmount').value = donationAmount.toLocaleString();
  }
  updateImpactPreview();
  showStep(1);
});
