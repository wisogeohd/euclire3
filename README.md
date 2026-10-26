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
| Datenquellen | KML-Herkunftsorte + Excel-Falldatenbank |
| Fälle gesamt | 172 (KML) + erweiterbar über Excel |
| Letzte Aktualisierung | 2026-05-11 |

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

### KML-Datei (`20260217_Originsites.kml`)
- **172 Placemarks** mit Name und GPS-Koordinaten (WGS84, EPSG:4326)
- Herkunftsort-Koordinaten (lon, lat)
- Wird bei jedem Daten-Update neu verarbeitet

### Excel-Datei (`CRPR_Datenbank.xlsx`)
Tabellenblatt `Tabelle1` mit folgenden Spalten:

| Spalte | Beschreibung |
|---|---|
| Region | Geografische Großregion (CE = Central Europe etc.) |
| Country | Land |
| Province/State | Bundesland / Provinz |
| Community/Place of Origin | **Schlüsselspalte** für KML-Zuordnung |
| Community/Place of Destination | Zielort der Umsiedlung |
| Distance | Distanz zum Zielort |
| Spatial Pattern | Räumliches Muster (E1, E2, ...) |
| Hazard Subtheme | Genauere Gefahrenbeschreibung |
| Year of hazard event | Jahr des auslösenden Ereignisses |
| Time of relocation | Zeitraum der Umsiedlung |
| Years of relocation | Dauer in Jahren |
| Completed/Ongoing | Abgeschlossen oder laufend |
| Details | Ausführliche Fallbeschreibung |
| Retreat/Relocation | Art der Maßnahme |
| Finance | Finanzierungsdetails |
| Size | Größenordnung (Einwohner / Haushalte) |
| Complete/partial | Vollständige oder teilweise Umsiedlung |
| preemptive/reactive | Präventiv oder als Reaktion auf Ereignis |
| Voluntary/Forced | Freiwillig oder erzwungen |
| Hazard Type | Haupt-Gefahrentyp (für Farbkodierung) |
| Resource 1–4 | Literaturquellen / Weblinks |

### `data/cases.js` — Datenformat
```javascript
const CRPR_DATA = {
  cases: [
    {
      id: 1,                        // Interne ID
      name: "Aci Platani",          // Ortsname (aus KML)
      lat: 37.5988577,              // Breitengrad (WGS84)
      lon: 15.1521685,              // Längengrad (WGS84)
      country: "Italy",             // Land (aus Excel, sonst null)
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
      has_full_data: false          // true = Excel-Daten vorhanden
    },
    // ...
  ],
  stats: {
    total: 172,
    by_country: { "Germany": 5, "Austria": 3, ... },
    by_hazard:  { "Flood": 8, "Unknown": 164 },
    by_status:  { "Completed": 5, "Ongoing": 3, "Unknown": 164 }
  }
};
```

---

## Daten aktualisieren

### Workflow: Excel ergänzen → cases.js neu generieren

1. Excel-Datei erweitern (`CRPR_Datenbank.xlsx`)
2. KML-Datei ggf. aktualisieren
3. Skript neu ausführen:

```bash
cd /Users/azipf/az/Projekte/2026/KlimaUmsiedlungWebGIS

python3 << 'EOF'
import xml.etree.ElementTree as ET
import pandas as pd, json, re

def norm(s):
    if not s: return ''
    s = str(s).lower()
    for old, new in [('ö','o'),('ü','u'),('ä','a'),('ß','ss'),('é','e'),('è','e'),
                     ('ê','e'),('ñ','n'),('ó','o'),('á','a'),('ú','u'),('í','i'),
                     ('ç','c'),('ğ','g'),('ş','s'),('ı','i'),('â','a')]:
        s = s.replace(old, new)
    return re.sub(r'[^a-z0-9]', '', s)

# KML einlesen
tree = ET.parse('20260217_Originsites.kml')
root = tree.getroot()
ns = {'kml': 'http://www.opengis.net/kml/2.2'}
placemarks = root.findall('.//kml:Placemark', ns)
kml_points = []
for pm in placemarks:
    name_el = pm.find('kml:name', ns)
    coords_el = pm.find('.//kml:coordinates', ns)
    if name_el is None or coords_el is None: continue
    coords = coords_el.text.strip().split(',')
    kml_points.append({'name': name_el.text.strip(), 'norm': norm(name_el.text),
                       'lon': float(coords[0]), 'lat': float(coords[1])})

# Excel einlesen und Matching
df = pd.read_excel('CRPR_Datenbank.xlsx')
df = df.where(pd.notna(df), None)
excel_map = {norm(row.get('Community/Place of Origin')): row.to_dict()
             for _, row in df.iterrows() if row.get('Community/Place of Origin')}

# ... (Rest des Skripts wie oben, Ausgabe nach webgis/data/cases.js)
EOF
```

### KML-Name ↔ Excel-Name: Zuordnungsregeln
Das Skript verknüpft KML-Placemarks mit Excel-Zeilen über den normalisierten Ortsnamen:
1. **Exakter Match** (nach Normalisierung: Kleinbuchstaben, Umlaute ersetzt, Sonderzeichen entfernt)
2. **Teilstring-Match** (KML-Name ist Teilstring des Excel-Namens oder umgekehrt)

**Derzeit nicht gematchte Fälle:**
- `Kreis Ahrweiler` (Excel) ↔ `Bad Neuenahr-Ahrweiler` (KML) — manuell zuordnen, falls gewünscht

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
