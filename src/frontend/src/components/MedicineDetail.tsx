import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle,
  ArrowLeft,
  ClipboardList,
  Clock,
  FlaskConical,
  Loader2,
  Pill,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import type { MedicineInfo } from "../backend.d";
import { useLanguage } from "../contexts/LanguageContext";
import { DietSection } from "./DietSection";

interface MedicineDetailProps {
  info: MedicineInfo;
  onBack: () => void;
  isTranslating?: boolean;
}

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
  variant?: "default" | "warning";
  delay?: number;
}

function InfoCard({
  icon,
  title,
  content,
  variant = "default",
  delay = 0,
}: InfoCardProps) {
  const isWarning = variant === "warning";
  return (
    <Card
      className={`shadow-card animate-fade-up border ${
        isWarning
          ? "border-warning-border bg-warning-bg"
          : "border-border bg-card"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent className="pt-5 pb-5">
        <div className="flex gap-3 items-start">
          <div
            className={`mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
              isWarning ? "bg-warning/20" : "bg-secondary"
            }`}
          >
            <span
              className={isWarning ? "text-warning-foreground" : "text-primary"}
            >
              {icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className={`text-xs font-semibold uppercase tracking-widest mb-1.5 ${
                isWarning ? "text-warning-foreground" : "text-muted-foreground"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                isWarning ? "text-warning-foreground" : "text-foreground"
              }`}
            >
              {content}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MedicineDetail({
  info,
  onBack,
  isTranslating = false,
}: MedicineDetailProps) {
  const { t } = useLanguage();

  return (
    <div
      className="flex flex-col gap-4 animate-fade-in"
      data-ocid="mediscan.result_panel"
    >
      {/* Back button */}
      <Button
        data-ocid="mediscan.back_button"
        variant="ghost"
        className="self-start -ml-2 gap-1.5 text-muted-foreground hover:text-foreground"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        {t.searchAgain}
      </Button>

      {/* Medicine Name Hero */}
      <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 pulse-ring">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-2xl font-bold text-foreground leading-tight truncate">
                {info.brandName || "Unknown Medicine"}
              </h1>
              {isTranslating && (
                <span
                  data-ocid="mediscan.loading_state"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {t.translating}
                </span>
              )}
            </div>
            {info.genericName && (
              <p className="text-sm text-muted-foreground truncate">
                {info.genericName}
              </p>
            )}
          </div>
        </div>
        <Separator className="mt-4" />
      </div>

      {/* Info Cards */}
      <div className="flex flex-col gap-3">
        {info.purpose && (
          <InfoCard
            icon={<Target className="w-4 h-4" />}
            title={t.usedFor}
            content={info.purpose}
            delay={60}
          />
        )}
        {info.howToTake && (
          <InfoCard
            icon={<ClipboardList className="w-4 h-4" />}
            title={t.howToTake}
            content={info.howToTake}
            delay={120}
          />
        )}
        {info.whenToTake && (
          <InfoCard
            icon={<Clock className="w-4 h-4" />}
            title={t.whenToTake}
            content={info.whenToTake}
            delay={180}
          />
        )}
        {info.whoShouldTake && (
          <InfoCard
            icon={<Users className="w-4 h-4" />}
            title={t.whoShouldTake}
            content={info.whoShouldTake}
            delay={240}
          />
        )}
        {info.warnings && (
          <InfoCard
            icon={<AlertTriangle className="w-4 h-4" />}
            title={t.warnings}
            content={info.warnings}
            variant="warning"
            delay={300}
          />
        )}
        {info.activeIngredients && (
          <InfoCard
            icon={<FlaskConical className="w-4 h-4" />}
            title={t.activeIngredients}
            content={info.activeIngredients}
            delay={360}
          />
        )}
      </div>

      {/* Similar Medicines */}
      {info.similarMedicines && info.similarMedicines.length > 0 && (
        <Card
          className="shadow-card border-border animate-fade-up"
          style={{ animationDelay: "420ms" }}
        >
          <CardContent className="pt-5 pb-5">
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  {t.similarMedicines}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {info.similarMedicines.map((med, index) => (
                    <Badge
                      key={`similar-${med}`}
                      data-ocid={`mediscan.similar.item.${index + 1}`}
                      variant="secondary"
                      className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-default text-xs py-1 px-2.5 rounded-full"
                    >
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Diet During Medication */}
      <DietSection medicine={info} />
    </div>
  );
}
