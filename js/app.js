/**
 * European Climate Relocation & Retreat Platform (CRPR)
 * Interactive WebGIS — Static Application
 *
 * Datenquelle:
 *   - data/cases.js, generiert aus PR_Cases_Europe_AL.xlsx (Koordinaten und Falldaten)
 *
 * Technologien:
 *   - Leaflet.js 1.9 (Karte)
 *   - Leaflet.markercluster (Clustering)
 *   - OpenStreetMap (Hintergrundkarte)
 *
 * Autoren: CRPR-Projektteam
 * Datum: 2026-05-11
 */

'use strict';

// ── Farbzuordnung Gefahrentypen ────────────────────────────────────────────
const HAZARD_COLORS = {
  'Flood':      '#2196F3',
  'Landslide':  '#795548',
  'Earthquake': '#FF5722',
  'Volcanic':   '#9C27B0',
  'Coastal':    '#009688',
  'Storm':      '#00BCD4',
  'Erosion':    '#FFA726',
  'Unknown':    '#607D8B',
};

const HAZARD_TAGS = {
  'Flood':      'tag-flood',
  'Landslide':  'tag-landslide',
  'Earthquake': 'tag-earthquake',
  'Volcanic':   'tag-volcanic',
  'Coastal':    'tag-coastal',
  'Storm':      'tag-storm',
  'Unknown':    'tag-unknown',
};

// ── State ──────────────────────────────────────────────────────────────────
let map, clusterGroup;
let allCases = [];
let visibleCases = [];
let selectedId = null;
let markerMap = {};  // id → Leaflet marker

// ── Filter state ───────────────────────────────────────────────────────────
const filters = {
  search: '',
  hazard: 'all',
  country: 'all',
  status: 'all',
  retreat: 'all',
};

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    applyTranslations();   // i18n: set initial language from localStorage
    initMap();
    loadData();
    initUIEvents();
  } catch (err) {
    console.error('CRPR init error:', err);
    hideLoading();
    showToast('Fehler beim Laden: ' + err.message);
  }
});

function initMap() {
  map = L.map('map', {
    center: [47, 15],
    zoom: 5,
    zoomControl: false,
  });

  // OSM tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  // Marker cluster group
  clusterGroup = L.markerClusterGroup({
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 12,
  });
  map.addLayer(clusterGroup);

  // Zoom controls (top-right, after our overlay)
  L.control.zoom({ position: 'topright' }).addTo(map);
}

function loadData() {
  if (typeof CRPR_DATA === 'undefined') {
    hideLoading();
    showToast(t('err_no_data'));
    return;
  }

  try {
    allCases = CRPR_DATA.cases;
    applyFilters();
    populateFilterDropdowns();
  } catch (err) {
    console.error('loadData error:', err);
    showToast('Datenfehler: ' + err.message);
  } finally {
    hideLoading();
  }
}

// ── Marker-Erstellung ──────────────────────────────────────────────────────
function makeMarker(c) {
  const color = c.color || '#607D8B';
  const svgIcon = L.divIcon({
    className: '',
    html: `<svg width="22" height="28" viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C4.925 0 0 4.925 0 11c0 7.667 11 17 11 17s11-9.333 11-17C22 4.925 17.075 0 11 0z"
        fill="${color}" stroke="rgba(0,0,0,.25)" stroke-width="1"/>
      <circle cx="11" cy="11" r="4.5" fill="white" opacity=".85"/>
    </svg>`,
    iconSize: [22, 28],
    iconAnchor: [11, 28],
    popupAnchor: [0, -28],
  });

  const marker = L.marker([c.lat, c.lon], { icon: svgIcon });

  marker.bindPopup(() => {
    const div = document.createElement('div');
    div.className = 'map-popup';
    div.innerHTML = `
      <div class="map-popup-name">${esc(c.name)}</div>
      <div class="map-popup-meta">
        ${c.country ? `<strong>${esc(c.country)}</strong>` : ''}
        ${c.province ? ` · ${esc(c.province)}` : ''}
      </div>
      <div class="map-popup-meta">
        ${esc(t('lbl_hazard_type'))}: <strong>${esc(c.hazard_type)}</strong>
      </div>
      ${c.year_event ? `<div class="map-popup-meta">${esc(t('lbl_year_event'))}: ${esc(c.year_event)}</div>` : ''}
      <button class="map-popup-btn" onclick="openDetail(${c.id})">${esc(t('popup_btn'))}</button>
    `;
    return div;
  }, { maxWidth: 260 });

  marker.on('click', () => {
    highlightListItem(c.id);
  });

  return marker;
}

// ── Filter & Rendering ────────────────────────────────────────────────────
function applyFilters() {
  const q = filters.search.toLowerCase().trim();

  visibleCases = allCases.filter(c => {
    if (filters.hazard !== 'all' && c.hazard_type !== filters.hazard) return false;
    if (filters.country !== 'all' && (c.country || 'Unknown') !== filters.country) return false;
    if (filters.status !== 'all' && (c.status || 'Unknown') !== filters.status) return false;
    if (filters.retreat !== 'all' && (c.retreat_type || 'Unknown') !== filters.retreat) return false;
    if (q) {
      const haystack = [c.name, c.country, c.province, c.hazard_type,
        c.details, c.origin, c.destination].filter(Boolean).join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  renderMarkers();
  renderList();
  updateCount();
}

function renderMarkers() {
  clusterGroup.clearLayers();
  markerMap = {};

  for (const c of visibleCases) {
    const m = makeMarker(c);
    markerMap[c.id] = m;
    clusterGroup.addLayer(m);
  }
}

function renderList() {
  const list = document.getElementById('case-list');
  if (!list) return;
  list.innerHTML = '';

  if (visibleCases.length === 0) {
    list.innerHTML = `<div class="no-data">
      <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 16.5a7.5 7.5 0 0012.15.15z"/>
      </svg>
      ${esc(t('no_results'))}</div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  for (const c of visibleCases) {
    const el = document.createElement('div');
    el.className = 'case-item' + (c.id === selectedId ? ' selected' : '');
    el.dataset.id = c.id;
    el.innerHTML = `
      <div class="case-dot" style="background:${c.color}"></div>
      <div class="case-item-info">
        <div class="case-item-name">${esc(c.name)}</div>
        <div class="case-item-sub">${[c.country, c.province].filter(Boolean).map(esc).join(' · ') || 'Unbekannt'}</div>
        <div class="case-item-badges">
          <span class="badge badge-status-${c.status}">${esc(c.status)}</span>
          ${c.year_event ? `<span class="badge" style="background:#f1f5f9;color:#475569;border-color:#dce4ed">${esc(c.year_event)}</span>` : ''}
        </div>
      </div>`;
    el.addEventListener('click', () => {
      flyToCase(c.id);
      openDetail(c.id);
    });
    frag.appendChild(el);
  }
  list.appendChild(frag);
}

function updateCount() {
  const el = document.getElementById('case-count');
  if (el) el.textContent = `${visibleCases.length} ${t('case_count_of')} ${allCases.length} ${t('case_count_cases')}`;
}

// ── Detail Panel ──────────────────────────────────────────────────────────
function openDetail(id) {
  const c = allCases.find(x => x.id === id);
  if (!c) return;
  selectedId = id;

  // Highlight list
  document.querySelectorAll('.case-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.id) === id);
  });

  const panel = document.getElementById('detail-panel');
  const body  = document.getElementById('detail-body');

  // Hazard tag class
  let tagClass = 'tag-unknown';
  for (const [k, v] of Object.entries(HAZARD_TAGS)) {
    if (c.hazard_type.toLowerCase().includes(k.toLowerCase())) { tagClass = v; break; }
  }

  const dataQuality = c.has_full_data
    ? `<span class="has-data-badge full">${esc(t('badge_full'))}</span>`
    : `<span class="has-data-badge partial">${esc(t('badge_partial'))}</span>`;

  function row(key, val, long = false) {
    if (!val) return '';
    return `<div class="detail-row">
      <div class="detail-key">${key}</div>
      <div class="detail-val${long ? ' long' : ''}">${val}</div>
    </div>`;
  }

  function linkify(text) {
    return esc(text).replace(/(https?:\/\/\S+)/g,
      '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  const resources = (c.resources || []).map((r, i) =>
    `<div style="margin-bottom:6px;font-size:11px;line-height:1.5">${i+1}. ${linkify(r)}</div>`
  ).join('');

  body.innerHTML = `
    <div style="margin-bottom:10px">${dataQuality}</div>

    <div class="detail-section">
      <div class="detail-section-title">${esc(t('detail_location'))}</div>
      ${row(t('lbl_country'),    c.country)}
      ${row(t('lbl_region'),     c.region)}
      ${row(t('lbl_province'),   c.province)}
      ${row(t('lbl_origin'),     c.origin)}
      ${row(t('lbl_destination'),c.destination)}
      ${row(t('lbl_distance'),   c.distance)}
      ${row(t('lbl_spatial'),    c.spatial_pattern)}
      <div class="detail-row">
        <div class="detail-key">${esc(t('lbl_coords'))}</div>
        <div class="detail-val" style="font-size:11px;color:#6b7280">
          ${c.lat.toFixed(5)}, ${c.lon.toFixed(5)}
        </div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">${esc(t('detail_hazard'))}</div>
      <div class="detail-row">
        <div class="detail-key">${esc(t('lbl_hazard_type'))}</div>
        <div class="detail-val"><span class="tag ${tagClass}">${esc(c.hazard_type)}</span></div>
      </div>
      ${row(t('lbl_hazard_sub'), c.hazard_subtheme)}
      ${row(t('lbl_year_event'), c.year_event)}
    </div>

    <div class="detail-section">
      <div class="detail-section-title">${esc(t('detail_relocation'))}</div>
      ${row(t('lbl_retreat_type'), c.retreat_type)}
      ${row(t('lbl_timeframe'),    c.time_relocation)}
      ${row(t('lbl_duration'),     c.years_relocation)}
      ${row(t('lbl_status'),       c.status)}
      ${row(t('lbl_completeness'), c.completeness)}
      ${row(t('lbl_preemptive'),   c.preemptive)}
      ${row(t('lbl_voluntary'),    c.voluntary)}
      ${row(t('lbl_size'),         c.size)}
      ${row(t('lbl_finance'),      c.finance, true)}
    </div>

    ${c.details ? `<div class="detail-section">
      <div class="detail-section-title">${esc(t('detail_desc'))}</div>
      <div class="detail-val long">${esc(c.details)}</div>
    </div>` : ''}

    ${resources ? `<div class="detail-section">
      <div class="detail-section-title">${esc(t('detail_sources'))}</div>
      ${resources}
    </div>` : ''}
  `;

  // Header
  document.getElementById('detail-title').textContent = c.name;
  document.getElementById('detail-subtitle').textContent =
    [c.country, c.province].filter(Boolean).join(' · ') || t('unknown_location');

  panel.classList.add('open');
  document.getElementById('detail-overlay')?.classList.add('open');
}

function closeDetail() {
  document.getElementById('detail-panel')?.classList.remove('open');
  document.getElementById('detail-overlay')?.classList.remove('open');
  selectedId = null;
  document.querySelectorAll('.case-item.selected').forEach(el => el.classList.remove('selected'));
}

// ── Map helpers ───────────────────────────────────────────────────────────
function flyToCase(id) {
  const c = allCases.find(x => x.id === id);
  if (!c) return;
  map.flyTo([c.lat, c.lon], Math.max(map.getZoom(), 11), { duration: 1 });

  // Open popup after flight
  setTimeout(() => {
    const m = markerMap[id];
    if (m) {
      clusterGroup.zoomToShowLayer(m, () => m.openPopup());
    }
  }, 800);
}

function highlightListItem(id) {
  selectedId = id;
  document.querySelectorAll('.case-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.id) === id);
  });
  // Scroll into view
  const el = document.querySelector(`.case-item[data-id="${id}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function fitAll() {
  if (visibleCases.length === 0) return;
  const bounds = L.latLngBounds(visibleCases.map(c => [c.lat, c.lon]));
  map.fitBounds(bounds, { padding: [40, 40] });
}

// ── Filter UI events ──────────────────────────────────────────────────────
function initUIEvents() {
  // Search
  const searchEl = document.getElementById('search-input');
  searchEl?.addEventListener('input', e => {
    filters.search = e.target.value;
    applyFilters();
  });

  // Hazard chips
  document.getElementById('chips-hazard')?.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    filters.hazard = chip.dataset.value;
    document.querySelectorAll('#chips-hazard .chip').forEach(c =>
      c.classList.toggle('active', c.dataset.value === filters.hazard));
    applyFilters();
  });

  // Country select
  document.getElementById('filter-country')?.addEventListener('change', e => {
    filters.country = e.target.value;
    applyFilters();
  });

  // Status select
  document.getElementById('filter-status')?.addEventListener('change', e => {
    filters.status = e.target.value;
    applyFilters();
  });

  // Retreat type select
  document.getElementById('filter-retreat')?.addEventListener('change', e => {
    filters.retreat = e.target.value;
    applyFilters();
  });

  // Reset button
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    filters.search = '';
    filters.hazard = 'all';
    filters.country = 'all';
    filters.status = 'all';
    filters.retreat = 'all';
    document.getElementById('search-input').value = '';
    document.getElementById('filter-country').value = 'all';
    document.getElementById('filter-status').value = 'all';
    document.getElementById('filter-retreat').value = 'all';
    document.querySelectorAll('#chips-hazard .chip').forEach(c =>
      c.classList.toggle('active', c.dataset.value === 'all'));
    applyFilters();
  });

  // Fit-all button
  document.getElementById('btn-fit-all')?.addEventListener('click', fitAll);

  // Close detail — drei Wege: Header-Button, Tab, Overlay, ESC
  document.getElementById('btn-close-detail')?.addEventListener('click', closeDetail);
  document.getElementById('detail-close-tab')?.addEventListener('click', closeDetail);
  document.getElementById('detail-overlay')?.addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetail(); });

  // Mobile panel toggle
  document.getElementById('toggle-panel-btn')?.addEventListener('click', () => {
    document.getElementById('left-panel').classList.toggle('open');
  });
}

function populateFilterDropdowns() {
  const stats = CRPR_DATA.stats;

  // Countries
  const countrySel = document.getElementById('filter-country');
  if (countrySel) {
    const sorted = Object.entries(stats.by_country)
      .filter(([k]) => k !== 'Unknown')
      .sort((a, b) => b[1] - a[1]);
    sorted.forEach(([k, v]) => {
      const o = document.createElement('option');
      o.value = k; o.textContent = `${k} (${v})`;
      countrySel.appendChild(o);
    });
  }

  // Statuses
  const statusSel = document.getElementById('filter-status');
  if (statusSel) {
    ['Completed', 'Ongoing', 'Planning'].forEach(s => {
      if (stats.by_status[s]) {
        const o = document.createElement('option');
        o.value = s; o.textContent = `${s} (${stats.by_status[s]})`;
        statusSel.appendChild(o);
      }
    });
  }

  // Stats bar
  document.getElementById('stat-total').textContent = stats.total;
  const countries = Object.keys(stats.by_country).filter(k => k !== 'Unknown').length;
  document.getElementById('stat-countries').textContent = countries || Object.keys(stats.by_country).length;
  const completed = stats.by_status['Completed'] || 0;
  document.getElementById('stat-completed').textContent = completed;
  const withData = allCases.filter(c => c.has_full_data).length;
  document.getElementById('stat-withdata').textContent = withData;
}

// ── Utilities ─────────────────────────────────────────────────────────────
function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function hideLoading() {
  const el = document.getElementById('loading');
  if (el) {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }
}

function showToast(msg, duration = 3000) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), duration);
}

// ── expose for inline onclick ─────────────────────────────────────────────
window.openDetail = openDetail;
