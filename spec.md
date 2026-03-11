# MediScan

## Current State
MediScan displays medicine info cards (purpose, how to take, when to take, who should take, warnings, active ingredients, similar medicines) after searching by name or barcode scan. The app supports 10+ Indian languages with translation of medicine info.

## Requested Changes (Diff)

### Add
- A "Diet During Medication" section in MedicineDetail, shown after the existing info cards.
- Two sub-sections: "What to Eat" (green-themed) and "What to Avoid" (red-themed).
- Each diet item has an emoji/icon, a food label, a short description, and a small food image.
- Embedded short YouTube video tips relevant to diet during medication.
- Diet recommendations derived from the medicine's purpose/category (e.g. antibiotics -> avoid dairy/alcohol; NSAIDs -> eat with food, avoid alcohol; diabetes meds -> low sugar, avoid processed carbs).
- A collapsible/expandable card for the diet section.

### Modify
- MedicineDetail.tsx: add DietSection component below the similar medicines card.
- Add translation keys for diet section labels.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/DietSection.tsx` with getDietRecommendations logic and UI.
2. Add diet translation keys to LanguageContext/translations.
3. Wire DietSection into MedicineDetail.tsx.
