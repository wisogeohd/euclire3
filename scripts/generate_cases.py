#!/usr/bin/env python3
"""Generate data/cases.js from the Europe case workbook (no KML required)."""

import json
import math
from collections import Counter
from pathlib import Path

import pandas as pd


ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "PR_Cases_Europe_AL.xlsx"
OUTPUT = ROOT / "data" / "cases.js"

HAZARD_COLORS = {
    "Flood": "#2196F3",
    "Landslide": "#795548",
    "Earthquake": "#FF5722",
    "Volcanic": "#9C27B0",
    "Coastal": "#009688",
    "Storm": "#00BCD4",
    "Erosion": "#FFA726",
    "Unknown": "#607D8B",
}
HAZARD_COLOR_GROUPS = {
    "Coastal Erosion": "Coastal",
    "Tsunami": "Coastal",
    "Gravitational movement": "Landslide",
    "Avalanche": "Landslide",
}


def clean(value):
    """Convert Excel values into JSON-safe values, using None for empty cells."""
    if value is None or pd.isna(value):
        return None
    if isinstance(value, float) and not math.isfinite(value):
        return None
    if hasattr(value, "item"):
        value = value.item()
    if isinstance(value, str):
        value = value.strip()
        return value or None
    if isinstance(value, (int, float, bool)):
        return value
    return str(value).strip() or None


def main():
    df = pd.read_excel(INPUT, sheet_name=0)
    # Excel has inconsistent whitespace in a few header labels (including "lat ").
    df.columns = [str(column).strip() for column in df.columns]

    required = {"lat", "lon", "Community/Place of Origin"}
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing required workbook columns: {', '.join(sorted(missing))}")

    cases = []
    for row_number, (_, row) in enumerate(df.iterrows(), start=1):
        lat = clean(row["lat"])
        lon = clean(row["lon"])
        name = clean(row["Community/Place of Origin"])
        if name is None or lat is None or lon is None:
            raise ValueError(f"Row {row_number + 1} is missing its origin name or coordinates")

        hazard = clean(row.get("Hazard")) or "Unknown"
        resources = [
            value for column in ("Resource 1", "Resource 2", "Resource 3", "Resource 4")
            if column in df.columns and (value := clean(row.get(column))) is not None
        ]
        case = {
            "id": row_number,
            "name": name,
            "lat": lat,
            "lon": lon,
            "region": clean(row.get("Region")),
            "country": clean(row.get("Country")),
            "province": clean(row.get("Province/State")),
            "origin": name,
            "destination": clean(row.get("Community/Place of Destination")),
            "distance": clean(row.get("Distance")),
            "spatial_pattern": clean(row.get("Spatial Pattern")),
            "hazard_type": hazard,
            "hazard_subtheme": clean(row.get("Hazard Subtheme")),
            "year_event": clean(row.get("Year of hazard event")),
            "time_relocation": clean(row.get("Time of relocation")),
            "years_relocation": clean(row.get("Duration")),
            "status": clean(row.get("Completed/Ongoing")) or "Unknown",
            "details": None,
            "retreat_type": clean(row.get("Retreat/Relocation")),
            "finance": None,
            "size": clean(row.get("Size")),
            "completeness": clean(row.get("Grouping")),
            "preemptive": clean(row.get("Time of Action")),
            "voluntary": None,
            "resources": resources,
            "color": HAZARD_COLORS.get(HAZARD_COLOR_GROUPS.get(hazard, hazard), HAZARD_COLORS["Unknown"]),
            "has_full_data": True,
        }
        cases.append(case)

    stats = {
        "total": len(cases),
        "by_country": dict(Counter(case["country"] or "Unknown" for case in cases)),
        "by_hazard": dict(Counter(case["hazard_type"] for case in cases)),
        "by_status": dict(Counter(case["status"] for case in cases)),
    }
    data = {"cases": cases, "stats": stats}
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        "// CRPR-Datenbank — automatisch generiert aus PR_Cases_Europe_AL.xlsx\n"
        f"// {len(cases)} Fälle | Koordinaten aus Excel (WGS84)\n"
        "const CRPR_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"Generated {OUTPUT.relative_to(ROOT)} with {len(cases)} cases")


if __name__ == "__main__":
    main()
