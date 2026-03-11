import { useQuery } from "@tanstack/react-query";
import type { MedicineInfo } from "../backend.d";
import type { LanguageCode } from "../lib/translations";
import { translateText } from "./useTranslate";

export function useTranslatedMedicine(
  medicine: MedicineInfo | null,
  language: LanguageCode,
): { translatedMedicine: MedicineInfo | null; isTranslating: boolean } {
  const shouldTranslate = language !== "en" && medicine !== null;

  const query = useQuery<MedicineInfo>({
    queryKey: ["translate-medicine", medicine?.brandName ?? "", language],
    queryFn: async () => {
      if (!medicine) return medicine as unknown as MedicineInfo;

      // activeIngredients, brandName, genericName, similarMedicines kept in English
      const fields: (keyof MedicineInfo)[] = [
        "purpose",
        "howToTake",
        "whenToTake",
        "whoShouldTake",
        "warnings",
      ];

      const results = await Promise.allSettled(
        fields.map((field) => {
          const val = medicine[field];
          if (typeof val === "string" && val.trim()) {
            return translateText(val, language);
          }
          return Promise.resolve(val as string);
        }),
      );

      const translated: MedicineInfo = { ...medicine };
      fields.forEach((field, i) => {
        const result = results[i];
        if (result.status === "fulfilled" && result.value) {
          (translated as unknown as Record<string, unknown>)[field] =
            result.value;
        }
      });

      return translated;
    },
    enabled: shouldTranslate,
    staleTime: Number.POSITIVE_INFINITY,
  });

  if (!medicine) {
    return { translatedMedicine: null, isTranslating: false };
  }

  if (!shouldTranslate) {
    return { translatedMedicine: medicine, isTranslating: false };
  }

  return {
    translatedMedicine: query.data ?? medicine,
    isTranslating: query.isFetching || query.isPending,
  };
}
