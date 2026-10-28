# European Climate Relocation & Retreat Platform (CRPR)
## Interaktives WebGIS — Dokumentation

---

## Übersicht

Dieses WebGIS visualisiert Fälle **klimabedingter geplanter Umsiedlungen und Siedlungsrückzüge in Europa** auf einer interaktiven Karte. Die Anwendung läuft vollständig **statisch im Browser** — kein Server, keine API, keine Installation nötig.

| Eigenschaft | Wert |
|---|---|
| Anwendungstyp | Statische Single-Page-App (HTML + CSS + JavaScript) |
| Kartenbibliothek | [Leaflet.js 1.9.4](https://leafletjs.com/) |
| Clustering | [Leaflet.markercluster 1.5.3](https://github.com/Leaflet/Leaflet.markercluster) |
| Hintergrundkarte | OpenStreetMap (© OpenStreetMap-Mitwirkende) |
| Datenquelle | Excel-Falldatenbank inklusive Koordinaten |
| Fälle gesamt | Wird beim Generieren aus Excel übernommen |
| Letzte Datengenerierung | Siehe Kopfzeile in `data/cases.js` |

---

## Projektstruktur

```
webgis/
├── index.html          ← Hauptdatei (Browser einfach öffnen)
├── css/
│   └── style.css       ← Gesamtes Styling (CRPR-Farbschema)
├── js/
│   └── app.js          ← Anwendungslogik (Karte, Filter, Detailansicht)
├── data/
│   └── cases.js        ← Alle Falldaten als JavaScript-Objekt
├── scripts/
│   └── generate_cases.py ← Generiert cases.js aus der Excel-Datei
└── README.md           ← Diese Dokumentation
```

---

## Schnellstart

```bash
# Option 1: Datei direkt im Browser öffnen
open webgis/index.html        # macOS
start webgis/index.html       # Windows

# Option 2: Lokaler Server (empfohlen für Entwicklung)
cd webgis
python3 -m http.server 8080
# → http://localhost:8080
```

> **Hinweis:** Für `file://`-Protokoll im Browser muss ggf. CORS deaktiviert sein. Einfachste Lösung: lokaler HTTP-Server (wie oben).

---

## Funktionen

### Karte
- **OSM-Hintergrundkarte** (OpenStreetMap Standard-Tiles)
- **Cluster-Ansicht**: Fälle nahe beieinander werden zu nummerierten Clustern zusammengefasst (Leaflet.markercluster)
- **Automatisches Auflösen**: Bei Zoom ≥ 12 werden individuelle Marker angezeigt
- **Farbkodierte Marker** nach Gefahrentyp (siehe Legende unten links)
- **Popup** beim Klick auf Marker: Name, Land, Gefahrentyp, Jahr, „Details"-Button
- **Zur Gesamtansicht** (Button oben rechts): Springt zurück zur Europa-Übersicht

### Linkes Panel — Filter
| Filter | Beschreibung |
|---|---|
| **Volltext-Suche** | Sucht in Name, Land, Provinz, Gefahrentyp, Beschreibung |
| **Gefahrentyp-Chips** | Filtert nach Flut, Erdbeben, Hangrutsch, Vulkan, Küste, Sturm |
| **Land** | Dropdown mit allen vorhandenen Ländern |
| **Status** | Completed / Ongoing |
| **Maßnahmentyp** | Retreat (Rückzug) / Relocation (Umsiedlung) |
| **Zurücksetzen** | Alle Filter auf Ausgangszustand |

### Statistik-Leiste
- Gesamtzahl Fälle
- Anzahl repräsentierter Länder
- Abgeschlossene Fälle
- Fälle mit vollständigen Daten (aus Excel)

### Fallliste
- Scrollbare Liste aller gefilterten Fälle
- Klick auf Listeneintrag → Karte zoomt zum Ort + Detailansicht öffnet sich
- Farbpunkt entspricht Marker-Farbe auf der Karte
- Status-Badge (Completed / Ongoing)

### Detailansicht (rechtes Panel)
Erscheint beim Klick auf Marker oder Listeneintrag:
- Standortdaten (Land, Region, Provinz, Herkunfts- und Zielort)
- Gefahrentyp und -unterthema
- Zeitlicher Verlauf (Ereignisjahr, Umsiedlungszeitraum, Dauer)
- Maßnahmendetails (Art, Vollständigkeit, freiwillig/erzwungen, präventiv/reaktiv)
- Größenordnung und Finanzierung
- Vollständige Beschreibung
- Literaturreferenzen (klickbare Links)

---

## Gefahrentypen — Farbkodierung

| Gefahrentyp | Farbe | Hex-Code |
|---|---|---|
| Flut / Hochwasser | Blau | `#2196F3` |
| Erdbeben | Rot-Orange | `#FF5722` |
| Hangrutsch / Erdrutsch | Braun | `#795548` |
| Vulkanismus | Lila | `#9C27B0` |
| Küstenerosion / -flut | Türkis | `#009688` |
| Sturm / Wind | Cyan | `#00BCD4` |
| Erosion | Orange | `#FFA726` |
| Unbekannt / Sonstige | Grau-Blau | `#607D8B` |

---

## Datenstruktur

### Excel-Datei (`PR_Cases_Europe_AL.xlsx`)
Tabellenblatt `Tabelle1` mit folgenden Spalten:

| Spalte | Beschreibung |
|---|---|
| Region | Geografische Großregion (CE = Central Europe etc.) |
| Country | Land |
| Province/State | Bundesland / Provinz |
| Community/Place of Origin | Ortsname und Herkunftsort |
| lat / lon | Koordinaten des Herkunftsorts (WGS84) |
| Community/Place of Destination | Zielort der Umsiedlung |
| Distance | Distanz zum Zielort |
| Spatial Pattern | Räumliches Muster (E1, E2, ...) |
| Hazard Subtheme | Genauere Gefahrenbeschreibung |
| Year of hazard event | Jahr des auslösenden Ereignisses |
| Time of relocation | Zeitraum der Umsiedlung |
| Duration | Dauer der Umsiedlung |
| Completed/Ongoing | Abgeschlossen oder laufend |
| Retreat/Relocation | Art der Maßnahme |
| Size | Größenordnung (Einwohner / Haushalte) |
| Grouping | Gruppierung des Falls |
| Time of Action | Präventiv oder als Reaktion auf Ereignis |
| Hazard | Haupt-Gefahrentyp (für Farbkodierung) |
| Resource 1–4 | Literaturquellen / Weblinks |

### `data/cases.js` — Datenformat
```javascript
const CRPR_DATA = {
  cases: [
    {
      id: 1,                        // Interne ID
      name: "...",                  // Ortsname (aus Excel)
      lat: 37.5988577,              // Breitengrad (WGS84)
      lon: 15.1521685,              // Längengrad (WGS84)
      country: "...",               // Land (aus Excel)
      region: "SE",                 // Region (aus Excel, sonst null)
      province: "...",
      origin: "...",                // Herkunftsort
      destination: "...",           // Zielort
      hazard_type: "Unknown",       // Gefahrentyp
      hazard_subtheme: null,
      year_event: null,             // Ereignisjahr
      time_relocation: null,        // Umsiedlungszeitraum
      status: "Unknown",            // Completed / Ongoing
      details: null,                // Beschreibungstext
      retreat_type: null,           // Retreat / Relocation
      finance: null,                // Finanzierung
      size: null,                   // Größenordnung
      completeness: null,           // complete / partial
      preemptive: null,             // preemptive / reactive
      voluntary: null,              // voluntary / forced
      resources: [],                // Literaturquellen
      color: "#607D8B",             // Marker-Farbe (aus hazard_type)
      has_full_data: true           // true = Falldaten vorhanden
    },
    // ...
  ],
  stats: {
    total: 175,                     // automatisch aus Excel berechnet
    by_country: { ... },
    by_hazard:  { ... },
    by_status:  { ... }
  }
};
```

---

## Daten aktualisieren

### Workflow: Excel ergänzen → cases.js neu generieren

Die Koordinaten werden direkt aus den Spalten `lat` und `lon` gelesen. KML ist nicht erforderlich. Nach Änderungen an der Arbeitsmappe:

```bash
python3 -m pip install pandas openpyxl  # einmalig, falls noch nicht installiert
python3 scripts/generate_cases.py
```

Das Skript schreibt `data/cases.js`, erstellt fortlaufende interne IDs und aktualisiert die Statistiken. Die Excel-Spalte `ID` kann mehrfach vorkommen und wird daher nicht als interne Karten-ID verwendet.

---

## Design-Anpassungen

### Farbschema ändern
In `css/style.css` die CSS-Variablen am Anfang anpassen:
```css
:root {
  --navy:       #1a3558;   /* Hauptfarbe (Navbar, Panel-Header) */
  --blue:       #1e5799;   /* Sekundärfarbe */
  --blue-med:   #2e6db4;   /* Buttons, Links */
  --blue-light: #4a8fd4;   /* Akzente */
}
```

### Neue Gefahrentypen ergänzen
In `js/app.js`, Objekt `HAZARD_COLORS`:
```javascript
const HAZARD_COLORS = {
  'Flood':      '#2196F3',
  'MeinTyp':    '#FF9800',  // ← neu hinzufügen
  ...
};
```
Entsprechend in `css/style.css` eine `.tag-meintyp`-Klasse ergänzen und in `index.html` einen Chip hinzufügen.

### Logo anpassen
Das Inline-SVG in `index.html` im `<nav>`-Block ersetzen (aktuell: stilisierter Map-Pin).

---

## Browser-Kompatibilität

Getestet mit:
- Chrome / Chromium 120+
- Firefox 121+
- Safari 17+
- Edge 120+

Keine Abhängigkeiten von Backend/API. Läuft vollständig offline (nach erstem Laden der CDN-Bibliotheken; für echten Offline-Betrieb die CDN-Dateien lokal ablegen).

---

## Erweiterungsideen (für spätere Versionen)

| Feature | Aufwand | Beschreibung |
|---|---|---|
| Zeitregler | mittel | Slider, der Fälle nach Ereignisjahr filtert |
| Vergleichsansicht | hoch | Zwei Fälle nebeneinander vergleichen |
| Heatmap-Layer | gering | Dichtekarte als alternativer Layer |
| CSV-Export | gering | Gefilterte Ergebnisse als CSV herunterladen |
| Mehrsprachigkeit | mittel | DE/EN Umschalter |
| Vollständige Daten | laufend | Excel-Datenbank mit allen 172 Fällen befüllen |

---

## Technische Abhängigkeiten (CDN)

```html
<!-- Leaflet 1.9.4 -->
https://unpkg.com/leaflet@1.9.4/dist/leaflet.css
https://unpkg.com/leaflet@1.9.4/dist/leaflet.js

<!-- Leaflet.markercluster 1.5.3 -->
https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css
https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css
https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js
```

Für Offline-Betrieb: Dateien unter `js/lib/` und `css/lib/` ablegen und Pfade in `index.html` anpassen.

---

## Lizenz & Attributionen

- **Website-Inhalte und Forschungsdaten**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — Namensnennung und Weitergabe unter gleichen Bedingungen.
- **Kartendaten**: © [OpenStreetMap](https://www.openstreetmap.org/copyright)-Mitwirkende (ODbL)
- **Kartentechnologie**: [Leaflet.js](https://leafletjs.com/) (BSD 2-Clause)
- **Clustering**: [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) (MIT)
- **Karteninfrastruktur**: [HeiGIT.org](https://heigit.org) — Heidelberg Institute for Geoinformation Technology
- **Forschungsdaten**: CRPR-Projektteam

---

*Erstellt mit Claude Code · CRPR-Projektteam · 2026*
