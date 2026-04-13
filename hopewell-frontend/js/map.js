// ===== NIGERIA INTERACTIVE MAP =====

// State data — beneficiaries mapped to state names matching GeoJSON
const STATE_DATA = {
  'Lagos':    { beneficiaries: 320000, volunteers: 820, vaccines: 18500, zone: 'Southwest' },
  'Kano':     { beneficiaries: 210000, volunteers: 610, vaccines: 14200, zone: 'Northwest' },
  'Federal Capital Territory': { beneficiaries: 175000, volunteers: 490, vaccines: 11000, zone: 'North Central' },
  'Rivers':   { beneficiaries: 198000, volunteers: 540, vaccines: 13400, zone: 'South South' },
  'Oyo':      { beneficiaries: 162000, volunteers: 430, vaccines: 10800, zone: 'Southwest' },
  'Kaduna':   { beneficiaries: 175000, volunteers: 260, vaccines: 17200, zone: 'Northwest' },
  'Katsina':  { beneficiaries: 95000,  volunteers: 180, vaccines: 8200,  zone: 'Northwest' },
  'Ogun':     { beneficiaries: 88000,  volunteers: 210, vaccines: 7600,  zone: 'Southwest' },
  'Ondo':     { beneficiaries: 72000,  volunteers: 190, vaccines: 6400,  zone: 'Southwest' },
  'Enugu':    { beneficiaries: 81000,  volunteers: 220, vaccines: 7100,  zone: 'Southeast' },
  'Delta':    { beneficiaries: 94000,  volunteers: 240, vaccines: 8800,  zone: 'South South' },
  'Anambra':  { beneficiaries: 78000,  volunteers: 200, vaccines: 6900,  zone: 'Southeast' },
  'Borno':    { beneficiaries: 110000, volunteers: 150, vaccines: 9200,  zone: 'Northeast' },
  'Imo':      { beneficiaries: 69000,  volunteers: 175, vaccines: 6100,  zone: 'Southeast' },
  'Niger':    { beneficiaries: 85000,  volunteers: 160, vaccines: 7400,  zone: 'North Central' },
  'Bauchi':   { beneficiaries: 92000,  volunteers: 145, vaccines: 8000,  zone: 'Northeast' },
  'Akwa Ibom':{ beneficiaries: 88000,  volunteers: 230, vaccines: 7800,  zone: 'South South' },
  'Sokoto':   { beneficiaries: 76000,  volunteers: 130, vaccines: 6600,  zone: 'Northwest' },
  'Plateau':  { beneficiaries: 71000,  volunteers: 185, vaccines: 6200,  zone: 'North Central' },
  'Osun':     { beneficiaries: 65000,  volunteers: 170, vaccines: 5700,  zone: 'Southwest' },
  'Kogi':     { beneficiaries: 63000,  volunteers: 145, vaccines: 5500,  zone: 'North Central' },
  'Edo':      { beneficiaries: 83000,  volunteers: 215, vaccines: 7300,  zone: 'South South' },
  'Benue':    { beneficiaries: 74000,  volunteers: 165, vaccines: 6500,  zone: 'North Central' },
  'Adamawa':  { beneficiaries: 68000,  volunteers: 140, vaccines: 5900,  zone: 'Northeast' },
  'Cross River':{ beneficiaries: 62000, volunteers: 160, vaccines: 5400, zone: 'South South' },
  'Kebbi':    { beneficiaries: 58000,  volunteers: 120, vaccines: 5000,  zone: 'Northwest' },
  'Zamfara':  { beneficiaries: 55000,  volunteers: 110, vaccines: 4800,  zone: 'Northwest' },
  'Taraba':   { beneficiaries: 52000,  volunteers: 125, vaccines: 4500,  zone: 'Northeast' },
  'Yobe':     { beneficiaries: 49000,  volunteers: 105, vaccines: 4200,  zone: 'Northeast' },
  'Gombe':    { beneficiaries: 47000,  volunteers: 115, vaccines: 4100,  zone: 'Northeast' },
  'Nassarawa':{ beneficiaries: 51000,  volunteers: 130, vaccines: 4400,  zone: 'North Central' },
  'Ekiti':    { beneficiaries: 44000,  volunteers: 120, vaccines: 3800,  zone: 'Southwest' },
  'Jigawa':   { beneficiaries: 61000,  volunteers: 135, vaccines: 5300,  zone: 'Northwest' },
  'Ebonyi':   { beneficiaries: 42000,  volunteers: 110, vaccines: 3600,  zone: 'Southeast' },
  'Abia':     { beneficiaries: 58000,  volunteers: 150, vaccines: 5100,  zone: 'Southeast' },
  'Bayelsa':  { beneficiaries: 46000,  volunteers: 125, vaccines: 4000,  zone: 'South South' },
};

const MAX_BENEFICIARIES = 320000;

function getColor(stateName) {
  const d = STATE_DATA[stateName];
  if (!d) return '#e8f5f3';
  const ratio = d.beneficiaries / MAX_BENEFICIARIES;
  if (ratio > 0.8) return '#0d9488';
  if (ratio > 0.5) return '#2dd4bf';
  if (ratio > 0.3) return '#99f6e4';
  if (ratio > 0.15) return '#ccfbf1';
  return '#e8f5f3';
}

function styleFeature(feature) {
  const name = feature.properties.admin1Name || feature.properties.NAME_1 || feature.properties.state;
  return {
    fillColor: getColor(name),
    weight: 1,
    opacity: 1,
    color: '#0d9488',
    fillOpacity: 0.75,
  };
}

function onEachFeature(feature, layer) {
  const name = feature.properties.admin1Name || feature.properties.NAME_1 || feature.properties.state || 'Unknown';
  const data = STATE_DATA[name] || { beneficiaries: 'N/A', volunteers: 'N/A', vaccines: 'N/A', zone: 'N/A' };

  layer.bindPopup(`
    <div class="map-popup-title">${name}</div>
    <div class="map-popup-row"><span>Beneficiaries</span><span>${typeof data.beneficiaries === 'number' ? data.beneficiaries.toLocaleString() : data.beneficiaries}</span></div>
    <div class="map-popup-row"><span>Volunteers</span><span>${typeof data.volunteers === 'number' ? data.volunteers.toLocaleString() : data.volunteers}</span></div>
    <div class="map-popup-row"><span>Vaccines</span><span>${typeof data.vaccines === 'number' ? data.vaccines.toLocaleString() : data.vaccines}</span></div>
    <div class="map-popup-row"><span>Zone</span><span>${data.zone}</span></div>
  `);

  layer.on({
    mouseover(e) {
      e.target.setStyle({ weight: 2, fillOpacity: 0.95, color: '#0f172a' });
      e.target.bringToFront();
    },
    mouseout(e) {
      geojsonLayer.resetStyle(e.target);
    },
    click(e) {
      map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
    }
  });
}

const MAP_DATA_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/data/nigeria-states.geojson'
  : 'https://hopewell-backend.onrender.com/data/nigeria-states.geojson';

async function initMap() {
  const el = document.getElementById('nigeriaMap');
  if (!el) return;

  map = L.map('nigeriaMap', {
    zoomControl: true,
    scrollWheelZoom: false,
    attributionControl: false,
  });

  // Clean tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    maxZoom: 10,
  }).addTo(map);

  try {
    // Load from local file served by Express (or same origin on GitHub Pages)
    const res = await fetch(MAP_DATA_URL);
    const geo = await res.json();
    renderMap(geo);
  } catch (err) {
    el.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;font-size:0.8rem;padding:1rem;text-align:center;">Map requires the backend server to be running.<br>Run: npm start in hopewell-backend</div>';
  }
}

function renderMap(geo) {
  geojsonLayer = L.geoJSON(geo, {
    style: (f) => ({
      fillColor: getColor(f.properties.name),
      weight: 1,
      opacity: 1,
      color: '#0d9488',
      fillOpacity: 0.75,
    }),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.name || 'Unknown';
      const data = STATE_DATA[name] || { beneficiaries: 'N/A', volunteers: 'N/A', vaccines: 'N/A', zone: 'N/A' };
      layer.bindPopup(`
        <div class="map-popup-title">${name}</div>
        <div class="map-popup-row"><span>Beneficiaries</span><span>${typeof data.beneficiaries === 'number' ? data.beneficiaries.toLocaleString() : data.beneficiaries}</span></div>
        <div class="map-popup-row"><span>Volunteers</span><span>${typeof data.volunteers === 'number' ? data.volunteers.toLocaleString() : data.volunteers}</span></div>
        <div class="map-popup-row"><span>Vaccines</span><span>${typeof data.vaccines === 'number' ? data.vaccines.toLocaleString() : data.vaccines}</span></div>
        <div class="map-popup-row"><span>Zone</span><span>${data.zone}</span></div>
      `);
      layer.on({
        mouseover(e) {
          e.target.setStyle({ weight: 2.5, fillOpacity: 0.95, color: '#0f172a' });
          e.target.bringToFront();
        },
        mouseout(e) { geojsonLayer.resetStyle(e.target); },
        click(e) { map.fitBounds(e.target.getBounds(), { padding: [20, 20] }); }
      });
    }
  }).addTo(map);

  map.fitBounds(geojsonLayer.getBounds());
}

document.addEventListener('DOMContentLoaded', initMap);
