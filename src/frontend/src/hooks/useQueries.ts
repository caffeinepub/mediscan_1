import { useMutation } from "@tanstack/react-query";
import type { MedicineInfo } from "../backend.d";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFdaResult(data: any, searchTerm?: string): MedicineInfo {
  const results = data?.results;
  if (!results || results.length === 0) {
    throw new Error("Medicine not found. Please try a different name.");
  }
  const r = results[0];
  const openfda = r.openfda || {};

  const brandName =
    openfda.brand_name?.[0] ||
    openfda.substance_name?.[0] ||
    searchTerm ||
    "Unknown";
  const genericName =
    openfda.generic_name?.[0] || openfda.substance_name?.[0] || "";

  const purpose = (r.purpose?.[0] || r.indications_and_usage?.[0] || "").slice(
    0,
    600,
  );
  const howToTake = (r.dosage_and_administration?.[0] || "").slice(0, 600);
  const whenToTake = (
    r.when_using?.[0] ||
    r.dosage_forms_and_strengths?.[0] ||
    ""
  ).slice(0, 400);
  const warnings = (
    r.warnings?.[0] ||
    r.warnings_and_cautions?.[0] ||
    ""
  ).slice(0, 600);
  const whoShouldTake = (
    r.indications_and_usage?.[0] ||
    r.contraindications?.[0] ||
    ""
  ).slice(0, 500);
  const activeIngredients = (r.active_ingredient?.[0] || "").slice(0, 400);

  const similarMedicines: string[] = [];
  const relatedDrugs = openfda.brand_name || [];
  for (const name of relatedDrugs) {
    if (name !== brandName && similarMedicines.length < 5) {
      similarMedicines.push(name);
    }
  }

  return {
    brandName,
    genericName,
    purpose,
    howToTake,
    whenToTake,
    whoShouldTake,
    warnings,
    activeIngredients,
    similarMedicines,
  };
}

async function fetchFromFDA(
  url: string,
  searchTerm?: string,
): Promise<MedicineInfo> {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(
      data.error?.message ||
        "Medicine not found. Please try a different name or scan.",
    );
  }
  return parseFdaResult(data, searchTerm);
}

export function useSearchByDrugName() {
  return useMutation<MedicineInfo, Error, string>({
    mutationFn: async (name: string) => {
      const encoded = encodeURIComponent(name);
      // Try brand name first, then generic name
      try {
        return await fetchFromFDA(
          `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"&limit=1`,
          name,
        );
      } catch {
        return await fetchFromFDA(
          `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encoded}"&limit=1`,
          name,
        );
      }
    },
  });
}

export function useSearchByNdcCode() {
  return useMutation<MedicineInfo, Error, string>({
    mutationFn: async (code: string) => {
      const encoded = encodeURIComponent(code);
      return await fetchFromFDA(
        `https://api.fda.gov/drug/label.json?search=openfda.product_ndc:"${encoded}"&limit=1`,
        code,
      );
    },
  });
}
