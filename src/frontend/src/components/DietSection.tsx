import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Salad } from "lucide-react";
import { useState } from "react";
import type { MedicineInfo } from "../backend.d";
import { useLanguage } from "../contexts/LanguageContext";

interface DietItem {
  emoji: string;
  label: string;
  description: string;
  imageQuery: string;
}

interface DietRecommendation {
  eat: DietItem[];
  avoid: DietItem[];
}

function getDietRecommendations(medicine: MedicineInfo): DietRecommendation {
  const text =
    `${medicine.purpose ?? ""} ${medicine.warnings ?? ""} ${medicine.genericName ?? ""}`.toLowerCase();

  if (/antibiotic|amoxicillin|azithromycin|infection/.test(text)) {
    return {
      eat: [
        {
          emoji: "🥛",
          label: "Yogurt & Probiotics",
          description: "Restores good gut bacteria depleted by antibiotics",
          imageQuery: "yogurt,probiotic",
        },
        {
          emoji: "🥦",
          label: "Whole Grains & Vegetables",
          description:
            "Fiber supports digestive health during antibiotic course",
          imageQuery: "whole,grains,vegetables",
        },
        {
          emoji: "🍊",
          label: "Fresh Fruits",
          description: "Vitamin C boosts immune response and recovery",
          imageQuery: "fresh,fruits,orange",
        },
        {
          emoji: "💧",
          label: "Plenty of Water",
          description: "Helps flush the medicine and toxins from your body",
          imageQuery: "water,hydration,drink",
        },
      ],
      avoid: [
        {
          emoji: "🍺",
          label: "Alcohol",
          description: "Reduces antibiotic effectiveness and strains the liver",
          imageQuery: "alcohol,beer,avoid",
        },
        {
          emoji: "🥛",
          label: "Dairy within 2 Hours",
          description:
            "Calcium can bind to certain antibiotics, reducing absorption",
          imageQuery: "dairy,milk,calcium",
        },
        {
          emoji: "🍋",
          label: "Grapefruit",
          description: "Interferes with drug metabolism enzymes in the gut",
          imageQuery: "grapefruit,citrus",
        },
      ],
    };
  }

  if (/pain|ibuprofen|naproxen|anti-inflammatory|nsaid/.test(text)) {
    return {
      eat: [
        {
          emoji: "🍞",
          label: "Food With Every Dose",
          description: "Always take NSAIDs with food to protect stomach lining",
          imageQuery: "bread,food,meal",
        },
        {
          emoji: "🥬",
          label: "Leafy Greens",
          description: "Anti-inflammatory vitamins support healing",
          imageQuery: "leafy,greens,spinach",
        },
        {
          emoji: "🍌",
          label: "Bananas",
          description: "Gentle on the stomach and rich in potassium",
          imageQuery: "banana,potassium",
        },
        {
          emoji: "🐟",
          label: "Omega-3 Rich Fish",
          description:
            "Natural anti-inflammatory properties complement treatment",
          imageQuery: "salmon,fish,omega3",
        },
      ],
      avoid: [
        {
          emoji: "🍺",
          label: "Alcohol",
          description: "Increases risk of stomach bleeding with NSAIDs",
          imageQuery: "alcohol,beer,avoid",
        },
        {
          emoji: "🌶️",
          label: "Spicy Food",
          description:
            "Irritates the stomach lining already stressed by NSAIDs",
          imageQuery: "spicy,chili,pepper",
        },
        {
          emoji: "☕",
          label: "Coffee on Empty Stomach",
          description:
            "Acidic drinks worsen stomach irritation from pain relievers",
          imageQuery: "coffee,caffeine,cup",
        },
      ],
    };
  }

  if (/metformin|diabetes|blood sugar|insulin/.test(text)) {
    return {
      eat: [
        {
          emoji: "🥦",
          label: "Fiber-Rich Vegetables",
          description:
            "Slows glucose absorption and improves insulin sensitivity",
          imageQuery: "fiber,vegetables,broccoli",
        },
        {
          emoji: "🌾",
          label: "Whole Grains",
          description: "Complex carbs maintain steady blood sugar levels",
          imageQuery: "whole,grains,oats",
        },
        {
          emoji: "🍗",
          label: "Lean Protein",
          description: "Stabilizes blood sugar without carbohydrate spikes",
          imageQuery: "lean,protein,chicken",
        },
        {
          emoji: "🫐",
          label: "Berries",
          description: "Low glycemic index fruits packed with antioxidants",
          imageQuery: "berries,blueberry,antioxidant",
        },
      ],
      avoid: [
        {
          emoji: "🥤",
          label: "Sugary Drinks",
          description:
            "Cause rapid blood sugar spikes that interfere with medication",
          imageQuery: "soda,sugary,drink",
        },
        {
          emoji: "🍞",
          label: "White Bread & Processed Carbs",
          description: "High glycemic foods spike blood sugar quickly",
          imageQuery: "white,bread,refined",
        },
        {
          emoji: "🍺",
          label: "Alcohol",
          description:
            "Can cause dangerous low blood sugar with diabetes medication",
          imageQuery: "alcohol,beer,avoid",
        },
      ],
    };
  }

  if (
    /lisinopril|blood pressure|hypertension|atorvastatin|statin|cholesterol/.test(
      text,
    )
  ) {
    return {
      eat: [
        {
          emoji: "🍌",
          label: "Potassium-Rich Foods",
          description:
            "Bananas & spinach help regulate blood pressure naturally",
          imageQuery: "banana,spinach,potassium",
        },
        {
          emoji: "🌾",
          label: "Oats & Whole Grains",
          description: "Beta-glucan fiber reduces cholesterol absorption",
          imageQuery: "oats,fiber,grain",
        },
        {
          emoji: "🫐",
          label: "Berries",
          description: "Antioxidants protect arteries and support heart health",
          imageQuery: "berries,heart,healthy",
        },
        {
          emoji: "🥗",
          label: "DASH Diet Foods",
          description: "Low-sodium fruits and veggies proven to lower BP",
          imageQuery: "salad,dash,diet",
        },
      ],
      avoid: [
        {
          emoji: "🧂",
          label: "Salt & Sodium",
          description: "Sodium raises blood pressure and strains the heart",
          imageQuery: "salt,sodium,avoid",
        },
        {
          emoji: "🍋",
          label: "Grapefruit",
          description:
            "Blocks enzymes that break down statins, causing toxicity",
          imageQuery: "grapefruit,citrus,avoid",
        },
        {
          emoji: "🥩",
          label: "Saturated Fats",
          description: "Red meat and fried food worsen cholesterol levels",
          imageQuery: "saturated,fat,red,meat",
        },
      ],
    };
  }

  if (/antacid|omeprazole|stomach|acid|reflux/.test(text)) {
    return {
      eat: [
        {
          emoji: "🍌",
          label: "Bananas",
          description: "Natural antacid effect, soothes stomach lining",
          imageQuery: "banana,soothe,stomach",
        },
        {
          emoji: "🫚",
          label: "Oatmeal",
          description: "Absorbs stomach acid and provides gentle nutrition",
          imageQuery: "oatmeal,porridge,bland",
        },
        {
          emoji: "🫚",
          label: "Ginger Tea",
          description:
            "Natural anti-inflammatory that calms stomach inflammation",
          imageQuery: "ginger,tea,herbal",
        },
        {
          emoji: "🥗",
          label: "Small, Frequent Meals",
          description: "Smaller portions reduce acid production and reflux",
          imageQuery: "small,meal,portion",
        },
      ],
      avoid: [
        {
          emoji: "🌶️",
          label: "Spicy Food",
          description: "Triggers acid reflux and irritates the esophagus",
          imageQuery: "spicy,chili,hot",
        },
        {
          emoji: "🍊",
          label: "Citrus Fruits",
          description: "High acidity worsens reflux and stomach discomfort",
          imageQuery: "citrus,lemon,acid",
        },
        {
          emoji: "☕",
          label: "Coffee & Carbonated Drinks",
          description:
            "Relaxes the lower esophageal sphincter, worsening reflux",
          imageQuery: "coffee,soda,carbonated",
        },
      ],
    };
  }

  // Default
  return {
    eat: [
      {
        emoji: "🥗",
        label: "Balanced Meals",
        description: "Nutritious meals ensure medicine is absorbed effectively",
        imageQuery: "balanced,meal,healthy,plate",
      },
      {
        emoji: "💧",
        label: "Stay Well Hydrated",
        description: "Water helps transport medicine through your body",
        imageQuery: "water,hydration,glass",
      },
      {
        emoji: "🍎",
        label: "Fresh Fruits & Vegetables",
        description: "Vitamins and minerals support recovery and immunity",
        imageQuery: "fresh,fruits,vegetables",
      },
      {
        emoji: "🌾",
        label: "Whole Grains",
        description: "Steady energy without interfering with medication",
        imageQuery: "whole,grains,bread",
      },
    ],
    avoid: [
      {
        emoji: "🍺",
        label: "Alcohol",
        description:
          "Alcohol interferes with most medications and liver function",
        imageQuery: "alcohol,beer,avoid",
      },
      {
        emoji: "🍋",
        label: "Grapefruit Juice",
        description: "Blocks drug-metabolizing enzymes in the intestine",
        imageQuery: "grapefruit,juice,avoid",
      },
      {
        emoji: "☕",
        label: "Excessive Caffeine",
        description:
          "Can amplify side effects or reduce medication effectiveness",
        imageQuery: "coffee,caffeine,excess",
      },
    ],
  };
}

interface DietItemCardProps {
  item: DietItem;
  index: number;
}

function DietItemCard({ item, index }: DietItemCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {!imgError ? (
        <img
          src={`https://source.unsplash.com/80x80/?${item.imageQuery}`}
          alt={item.label}
          width={48}
          height={48}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0 shadow-sm"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-muted flex items-center justify-center text-xl">
          {item.emoji}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {item.emoji} {item.label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}

interface DietSectionProps {
  medicine: MedicineInfo;
}

export function DietSection({ medicine }: DietSectionProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const diet = getDietRecommendations(medicine);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      data-ocid="diet.section"
      className="animate-fade-up"
      style={{ animationDelay: "480ms" }}
    >
      <CollapsibleTrigger asChild>
        <button
          data-ocid="diet.toggle"
          className="w-full flex items-center gap-3 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors shadow-sm group"
          type="button"
        >
          <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Salad className="w-4 h-4 text-green-700 dark:text-green-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-green-900 dark:text-green-100">
              {t.dietSection}
            </p>
            <p className="text-xs text-green-700 dark:text-green-400">
              {open ? t.dietCollapse : t.dietTip}
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-green-700 dark:text-green-400 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="mt-3 flex flex-col gap-3 md:flex-row">
          {/* What to Eat */}
          <div
            data-ocid="diet.eat_panel"
            className="flex-1 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20 p-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-widest text-green-800 dark:text-green-300 mb-3 flex items-center gap-1.5">
              <span>✅</span> {t.whatToEat}
            </h4>
            <div className="flex flex-col gap-1">
              {diet.eat.map((item, i) => (
                <DietItemCard key={item.label} item={item} index={i} />
              ))}
            </div>
            {/* Eat tips video */}
            <div className="mt-4 rounded-xl overflow-hidden shadow-sm">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">
                🎥 {t.dietTip} — Healthy Eating
              </p>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/UExOSsMbSNs"
                  title="Healthy Eating Tips"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>
            </div>
          </div>

          {/* What to Avoid */}
          <div
            data-ocid="diet.avoid_panel"
            className="flex-1 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4"
          >
            <h4 className="text-xs font-bold uppercase tracking-widest text-red-800 dark:text-red-300 mb-3 flex items-center gap-1.5">
              <span>🚫</span> {t.whatToAvoid}
            </h4>
            <div className="flex flex-col gap-1">
              {diet.avoid.map((item, i) => (
                <DietItemCard key={item.label} item={item} index={i} />
              ))}
            </div>
            {/* Avoid tips video */}
            <div className="mt-4 rounded-xl overflow-hidden shadow-sm">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">
                🎥 {t.dietTip} — Foods to Avoid
              </p>
              <div
                className="relative w-full"
                style={{ paddingBottom: "56.25%" }}
              >
                <iframe
                  className="absolute inset-0 w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/VHMqDmQDjDg"
                  title="Foods to Avoid with Medication"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-presentation"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
