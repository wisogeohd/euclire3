/**
 * CRPR — Internationalisierung (i18n)
 * Sprachen: Deutsch (de) | English (en)
 */

const TRANSLATIONS = {
  de: {
    // Navbar
    nav_map:          'Karte',
    nav_cases:        'Fallstudien',
    nav_compare:      'Vergleich',
    nav_insights:     'Erkenntnisse',
    nav_resources:    'Ressourcen',

    // Left panel
    panel_header:     'Fallsuche & Filter',
    search_placeholder: 'Ort, Land, Stichwort …',
    filter_hazard:    'Gefahrentyp',
    chip_all:         'Alle',
    chip_flood:       'Flut',
    chip_earthquake:  'Erdbeben',
    chip_landslide:   'Hangrutsch',
    chip_volcanic:    'Vulkan',
    chip_coastal:     'Küste',
    chip_storm:       'Sturm',
    chip_unknown:     'Unbekannt',
    filter_country:   'Land',
    filter_status:    'Status',
    filter_retreat_lbl: 'Maßnahmentyp',
    opt_all_countries:'Alle Länder',
    opt_all_status:   'Alle Status',
    opt_all_types:    'Alle Typen',
    opt_retreat:      'Retreat (Rückzug)',
    opt_relocation:   'Relocation (Umsiedlung)',
    btn_reset:        'Filter zurücksetzen',

    // Stats
    stat_total:       'Fälle gesamt',
    stat_countries:   'Länder',
    stat_completed:   'Abgeschlossen',
    stat_withdata:    'Mit Volldaten',
    case_count_of:    'von',       // "12 von 172 Fällen"
    case_count_cases: 'Fällen',

    // Map controls
    btn_fit_all:      'Alle Fälle anzeigen',

    // Legend
    legend_title:     'Gefahrentyp',
    legend_flood:     'Flut / Hochwasser',
    legend_earthquake:'Erdbeben',
    legend_landslide: 'Hangrutsch / Erdrutsch',
    legend_volcanic:  'Vulkanismus',
    legend_coastal:   'Küstenerosion / Küstenflut',
    legend_storm:     'Sturm / Wind',
    legend_unknown:   'Unbekannt / Sonstige',

    // Detail panel
    close_tab:        'Schließen',
    close_btn:        'Schließen',
    detail_location:  'Standort',
    detail_hazard:    'Gefahren & Ereignis',
    detail_relocation:'Umsiedlung / Rückzug',
    detail_desc:      'Beschreibung',
    detail_sources:   'Quellen & Links',

    // Detail field labels
    lbl_country:      'Land',
    lbl_region:       'Region',
    lbl_province:     'Provinz/Staat',
    lbl_origin:       'Herkunftsort',
    lbl_destination:  'Zielort',
    lbl_distance:     'Distanz',
    lbl_spatial:      'Räuml. Muster',
    lbl_coords:       'Koordinaten',
    lbl_hazard_type:  'Gefahrentyp',
    lbl_hazard_sub:   'Unterthema',
    lbl_year_event:   'Ereignisjahr',
    lbl_retreat_type: 'Art',
    lbl_timeframe:    'Zeitraum',
    lbl_duration:     'Dauer (Jahre)',
    lbl_status:       'Status',
    lbl_completeness: 'Vollständigkeit',
    lbl_preemptive:   'Präventiv/reaktiv',
    lbl_voluntary:    'Freiwillig/erzwungen',
    lbl_size:         'Größenordnung',
    lbl_finance:      'Finanzierung',

    // Data quality badges
    badge_full:       '✓ Vollständige Daten',
    badge_partial:    '○ Koordinaten verfügbar – Details noch nicht erfasst',

    // Misc
    no_results:       'Keine Einträge gefunden',
    loading:          'Karte wird geladen …',
    popup_btn:        'Details anzeigen →',
    unknown_location: 'Unbekannter Standort',
    err_no_data:      'Fehler: Datendatei nicht geladen.',
  },

  en: {
    // Navbar
    nav_map:          'Map',
    nav_cases:        'Case Studies',
    nav_compare:      'Comparisons',
    nav_insights:     'Insights',
    nav_resources:    'Resources',

    // Left panel
    panel_header:     'Case Search & Filter',
    search_placeholder: 'Place, country, keyword …',
    filter_hazard:    'Hazard Type',
    chip_all:         'All',
    chip_flood:       'Flood',
    chip_earthquake:  'Earthquake',
    chip_landslide:   'Landslide',
    chip_volcanic:    'Volcanic',
    chip_coastal:     'Coastal',
    chip_storm:       'Storm',
    chip_unknown:     'Unknown',
    filter_country:   'Country',
    filter_status:    'Status',
    filter_retreat_lbl: 'Measure Type',
    opt_all_countries:'All Countries',
    opt_all_status:   'All Statuses',
    opt_all_types:    'All Types',
    opt_retreat:      'Retreat',
    opt_relocation:   'Relocation',
    btn_reset:        'Reset filters',

    // Stats
    stat_total:       'Total cases',
    stat_countries:   'Countries',
    stat_completed:   'Completed',
    stat_withdata:    'With full data',
    case_count_of:    'of',        // "12 of 172 cases"
    case_count_cases: 'cases',

    // Map controls
    btn_fit_all:      'Show all cases',

    // Legend
    legend_title:     'Hazard Type',
    legend_flood:     'Flood / River flooding',
    legend_earthquake:'Earthquake',
    legend_landslide: 'Landslide / Rockfall',
    legend_volcanic:  'Volcanic activity',
    legend_coastal:   'Coastal erosion / flooding',
    legend_storm:     'Storm / Wind',
    legend_unknown:   'Unknown / Other',

    // Detail panel
    close_tab:        'Close',
    close_btn:        'Close',
    detail_location:  'Location',
    detail_hazard:    'Hazard & Event',
    detail_relocation:'Relocation / Retreat',
    detail_desc:      'Description',
    detail_sources:   'Sources & Links',

    // Detail field labels
    lbl_country:      'Country',
    lbl_region:       'Region',
    lbl_province:     'Province/State',
    lbl_origin:       'Place of origin',
    lbl_destination:  'Destination',
    lbl_distance:     'Distance',
    lbl_spatial:      'Spatial pattern',
    lbl_coords:       'Coordinates',
    lbl_hazard_type:  'Hazard type',
    lbl_hazard_sub:   'Hazard subtheme',
    lbl_year_event:   'Year of event',
    lbl_retreat_type: 'Type',
    lbl_timeframe:    'Timeframe',
    lbl_duration:     'Duration (years)',
    lbl_status:       'Status',
    lbl_completeness: 'Completeness',
    lbl_preemptive:   'Preemptive/reactive',
    lbl_voluntary:    'Voluntary/forced',
    lbl_size:         'Scale',
    lbl_finance:      'Financing',

    // Data quality badges
    badge_full:       '✓ Full data available',
    badge_partial:    '○ Coordinates available – detailed records not yet entered',

    // Misc
    no_results:       'No results found',
    loading:          'Loading map …',
    popup_btn:        'View details →',
    unknown_location: 'Unknown location',
    err_no_data:      'Error: data file not loaded.',
  }
};

// ── Active language (default: Deutsch) ──────────────────────────────────────
let currentLang = localStorage.getItem('crpr_lang') || 'de';

function t(key) {
  return (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key])
    || (TRANSLATIONS['de'][key])
    || key;
}

function setLang(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('crpr_lang', lang);
  applyTranslations();
}

function applyTranslations() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.title = t(el.getAttribute('data-i18n-title'));
  });

  // Loading text (special: contains spinner div)
  const loadingText = document.getElementById('loading-text');
  if (loadingText) loadingText.textContent = t('loading');

  // Language toggle buttons: highlight active
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });

  // Close button in detail panel: icon + text
  const closeBtn = document.getElementById('btn-close-detail');
  if (closeBtn) {
    closeBtn.innerHTML = `<span class="close-icon">✕</span> ${t('close_btn')}`;
  }

  // Update case count text if already visible
  updateCount();

  // Update dropdown option labels (rebuilt on filter changes; update static ones here)
  const optAllCountries = document.getElementById('opt-all-countries');
  if (optAllCountries) optAllCountries.textContent = t('opt_all_countries');
  const optAllStatus = document.getElementById('opt-all-status');
  if (optAllStatus) optAllStatus.textContent = t('opt_all_status');
  const optAllTypes = document.getElementById('opt-all-types');
  if (optAllTypes) optAllTypes.textContent = t('opt_all_types');
  const optRetreat = document.getElementById('opt-retreat');
  if (optRetreat) optRetreat.textContent = t('opt_retreat');
  const optRelocation = document.getElementById('opt-relocation');
  if (optRelocation) optRelocation.textContent = t('opt_relocation');
}
