import { Button } from "@/components/ui/button";
import { CameraOff, Loader2, ScanBarcode } from "lucide-react";
import { useEffect, useRef } from "react";
import { useQRScanner } from "../qr-code/useQRScanner";

interface ScannerSectionProps {
  onScan: (code: string) => void;
  isSearching: boolean;
}

export function ScannerSection({ onScan, isSearching }: ScannerSectionProps) {
  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error,
    isLoading,
    startScanning,
    stopScanning,
    clearResults,
    videoRef,
    canvasRef,
  } = useQRScanner({
    facingMode: "environment",
    scanInterval: 150,
    maxResults: 3,
  });

  const lastProcessed = useRef<string | null>(null);

  useEffect(() => {
    if (qrResults && qrResults.length > 0) {
      const latest = qrResults[0];
      if (latest.data !== lastProcessed.current) {
        lastProcessed.current = latest.data;
        clearResults();
        stopScanning();
        onScan(latest.data);
      }
    }
  }, [qrResults, onScan, clearResults, stopScanning]);

  const handleToggle = () => {
    if (isActive || isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Scanner Viewfinder */}
      <div
        className="relative w-full rounded-2xl overflow-hidden bg-muted"
        style={{ aspectRatio: "4/3" }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay when not active */}
        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
              <ScanBarcode className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {isSupported === false
                ? "Camera not supported on this device"
                : "Tap below to start scanning"}
            </p>
          </div>
        )}

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {/* Active scanning overlay */}
        {isActive && (
          <>
            {/* Corner brackets */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-6 w-10 h-10 border-l-2 border-t-2 border-primary rounded-tl-sm" />
              <div className="absolute top-6 right-6 w-10 h-10 border-r-2 border-t-2 border-primary rounded-tr-sm" />
              <div className="absolute bottom-6 left-6 w-10 h-10 border-l-2 border-b-2 border-primary rounded-bl-sm" />
              <div className="absolute bottom-6 right-6 w-10 h-10 border-r-2 border-b-2 border-primary rounded-br-sm" />
              {/* Scanning line */}
              <div
                className="scan-line absolute left-8 right-8 h-0.5 bg-primary opacity-80"
                style={{ top: "10%" }}
              />
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="inline-block bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                Point at barcode
              </span>
            </div>
          </>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
            <CameraOff className="w-8 h-8 text-destructive" />
            <p className="text-sm text-destructive font-medium px-4 text-center">
              {error.message}
            </p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <Button
        data-ocid="mediscan.scanner_toggle"
        variant={isActive ? "outline" : "default"}
        className="w-full gap-2"
        onClick={handleToggle}
        disabled={isLoading || isSearching || isSupported === false}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <ScanBarcode className="w-4 h-4" />
        )}
        {isLoading
          ? "Initializing camera..."
          : isActive
            ? "Stop Scanner"
            : "Start Barcode Scanner"}
      </Button>
    </div>
  );
}
