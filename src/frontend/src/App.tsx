import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertCircle, Loader2, Pill, ScanBarcode, Search } from "lucide-react";
import { useState } from "react";
import type { MedicineInfo } from "./backend.d";
import { MedicineDetail } from "./components/MedicineDetail";
import { ScannerSection } from "./components/ScannerSection";
import { useSearchByDrugName, useSearchByNdcCode } from "./hooks/useQueries";

const queryClient = new QueryClient();

function AppContent() {
  const [drugName, setDrugName] = useState("");
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [view, setView] = useState<"search" | "result">("search");

  const drugSearch = useSearchByDrugName();
  const ndcSearch = useSearchByNdcCode();

  const isSearching = drugSearch.isPending || ndcSearch.isPending;
  const error = drugSearch.error || ndcSearch.error;

  const handleDrugSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drugName.trim()) return;
    drugSearch.reset();
    ndcSearch.reset();
    try {
      const data = await drugSearch.mutateAsync(drugName.trim());
      setResult(data);
      setView("result");
    } catch (_) {
      // error handled via mutation state
    }
  };

  const handleScan = async (code: string) => {
    drugSearch.reset();
    ndcSearch.reset();
    try {
      const data = await ndcSearch.mutateAsync(code);
      setResult(data);
      setView("result");
    } catch (_) {
      // error handled via mutation state
    }
  };

  const handleBack = () => {
    setView("search");
    setResult(null);
    drugSearch.reset();
    ndcSearch.reset();
    setDrugName("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.88 0.07 192 / 0.35), transparent)",
        }}
      />

      {/* Header */}
      <header className="relative sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Pill className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-none">
              MediScan
            </h1>
            <p className="text-xs text-muted-foreground leading-tight">
              Medicine Information Scanner
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-lg mx-auto px-4 py-6 pb-16">
        {view === "result" && result ? (
          <MedicineDetail info={result} onBack={handleBack} />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Scanner Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ScanBarcode className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Scan Barcode
                </h2>
                <span className="text-xs text-muted-foreground">
                  — Point at medicine packaging
                </span>
              </div>
              <ScannerSection onScan={handleScan} isSearching={isSearching} />
            </section>

            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium">
                or search by name
              </span>
              <Separator className="flex-1" />
            </div>

            {/* Text Search */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  Search by Drug Name
                </h2>
              </div>
              <form onSubmit={handleDrugSearch} className="flex gap-2">
                <Input
                  data-ocid="mediscan.search_input"
                  type="text"
                  placeholder="e.g. Ibuprofen, Amoxicillin..."
                  value={drugName}
                  onChange={(e) => setDrugName(e.target.value)}
                  disabled={isSearching}
                  className="flex-1 bg-card border-border placeholder:text-muted-foreground/60"
                />
                <Button
                  data-ocid="mediscan.search_button"
                  type="submit"
                  disabled={isSearching || !drugName.trim()}
                  className="gap-1.5"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isSearching ? "Searching" : "Search"}
                </Button>
              </form>
            </section>

            {/* Loading State */}
            {isSearching && (
              <Card
                data-ocid="mediscan.loading_state"
                className="border-border animate-fade-in"
              >
                <CardContent className="pt-5 pb-5 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Looking up medicine...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fetching from medical database
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error State */}
            {error && !isSearching && (
              <Card
                data-ocid="mediscan.error_state"
                className="border-destructive/30 bg-destructive/5 animate-fade-in"
              >
                <CardContent className="pt-5 pb-5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-destructive">
                      Medicine not found
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {error.message ||
                        "Please try a different name or scan the barcode again."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample suggestions */}
            {!isSearching && !error && (
              <div
                className="animate-fade-up"
                style={{ animationDelay: "200ms" }}
              >
                <p className="text-xs text-muted-foreground mb-2 font-medium">
                  Try searching for:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Ibuprofen",
                    "Amoxicillin",
                    "Metformin",
                    "Lisinopril",
                    "Atorvastatin",
                  ].map((drug) => (
                    <button
                      type="button"
                      key={drug}
                      onClick={() => {
                        setDrugName(drug);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-secondary hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {drug}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border py-4 mt-8">
        <div className="max-w-lg mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()}. Built with{" "}
            <span className="text-destructive">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
