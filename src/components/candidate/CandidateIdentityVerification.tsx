import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, RotateCcw, CheckCircle, User, CreditCard, ArrowRight, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type VerificationStep = "photo" | "aadhaar";

interface CandidateIdentityVerificationProps {
  onComplete: (photoData: string, aadhaarData: string) => void;
}

export function CandidateIdentityVerification({ onComplete }: CandidateIdentityVerificationProps) {
  const [step, setStep] = useState<VerificationStep>("photo");
  const [photoCapture, setPhotoCapture] = useState<string | null>(null);
  const [aadhaarCapture, setAadhaarCapture] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    try {
      setCameraError(null);
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please grant camera permissions and try again.");
      setIsCameraActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    const facing = step === "photo" ? "user" : "environment";
    setFacingMode(facing);
    
    // Only start camera if no capture for current step
    const hasCapture = step === "photo" ? photoCapture : aadhaarCapture;
    if (!hasCapture) {
      startCamera(facing);
    }

    return () => stopCamera();
  }, [step]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Mirror for selfie
    if (step === "photo") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);

    if (step === "photo") {
      setPhotoCapture(dataUrl);
      stopCamera();
      toast.success("Photo captured successfully");
    } else {
      setAadhaarCapture(dataUrl);
      stopCamera();
      toast.success("Aadhaar card captured successfully");
    }
  };

  const retakePhoto = () => {
    if (step === "photo") {
      setPhotoCapture(null);
    } else {
      setAadhaarCapture(null);
    }
    const facing = step === "photo" ? "user" : "environment";
    startCamera(facing);
  };

  const handleNext = () => {
    if (step === "photo" && photoCapture) {
      setStep("aadhaar");
    } else if (step === "aadhaar" && aadhaarCapture && photoCapture) {
      onComplete(photoCapture, aadhaarCapture);
    }
  };

  const currentCapture = step === "photo" ? photoCapture : aadhaarCapture;
  const isPhotoStep = step === "photo";

  return (
    <motion.div
      key="identity-verification"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl w-full mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
          <Camera className="h-3.5 w-3.5" />
          Identity Verification
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1.5">
          {isPhotoStep ? "Capture Your Photo" : "Scan Aadhaar Card"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {isPhotoStep
            ? "Take a clear photo of your face for identity verification"
            : "Place your Aadhaar card on a flat surface and capture a clear photo"
          }
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="flex items-center gap-2 flex-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
            photoCapture ? "bg-primary text-primary-foreground" : isPhotoStep ? "bg-primary/20 text-primary border-2 border-primary" : "bg-muted text-muted-foreground"
          }`}>
            {photoCapture ? <CheckCircle className="h-4 w-4" /> : <User className="h-4 w-4" />}
          </div>
          <span className={`text-xs font-medium ${isPhotoStep ? "text-foreground" : "text-muted-foreground"}`}>Photo</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex items-center gap-2 flex-1">
          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
            aadhaarCapture ? "bg-primary text-primary-foreground" : !isPhotoStep ? "bg-primary/20 text-primary border-2 border-primary" : "bg-muted text-muted-foreground"
          }`}>
            {aadhaarCapture ? <CheckCircle className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
          </div>
          <span className={`text-xs font-medium ${!isPhotoStep ? "text-foreground" : "text-muted-foreground"}`}>Aadhaar</span>
        </div>
      </div>

      {/* Camera / Preview area */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-card mb-4 aspect-[4/3]">
        {cameraError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-muted/50">
            <AlertCircle className="h-10 w-10 text-destructive mb-3" />
            <p className="text-sm text-destructive font-medium mb-1">Camera Access Required</p>
            <p className="text-xs text-muted-foreground mb-4">{cameraError}</p>
            <Button size="sm" variant="outline" onClick={() => startCamera(facingMode)}>
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Try Again
            </Button>
          </div>
        ) : currentCapture ? (
          <>
            <img src={currentCapture} alt="Captured" className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/90 text-success-foreground text-xs font-medium">
                <CheckCircle className="h-3.5 w-3.5" />
                Captured
              </div>
            </div>
          </>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isPhotoStep ? "scale-x-[-1]" : ""}`}
            />
            {/* Overlay guide */}
            {isPhotoStep ? (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-60 sm:w-56 sm:h-72 border-2 border-primary/50 rounded-[40%] relative">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-primary bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
                    Align your face here
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-8">
                <div className="w-full max-w-xs aspect-[1.6/1] border-2 border-primary/50 rounded-xl relative">
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br-lg" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-primary bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full whitespace-nowrap">
                    Place Aadhaar card inside frame
                  </div>
                </div>
              </div>
            )}
            {/* Camera active indicator */}
            {isCameraActive && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-destructive/90 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive-foreground animate-pulse" />
                <span className="text-[10px] text-destructive-foreground font-bold tracking-wide">LIVE</span>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-border bg-muted/30 p-3 mb-5">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            {isPhotoStep ? (
              <>
                <p className="text-xs text-muted-foreground">• Ensure good lighting on your face</p>
                <p className="text-xs text-muted-foreground">• Remove glasses, hats, or face coverings</p>
                <p className="text-xs text-muted-foreground">• Look directly at the camera</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">• Place card on a flat, well-lit surface</p>
                <p className="text-xs text-muted-foreground">• Ensure all text and photo are clearly visible</p>
                <p className="text-xs text-muted-foreground">• Avoid glare or shadows on the card</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {currentCapture ? (
          <>
            <Button variant="outline" onClick={retakePhoto} className="flex-1 h-11 gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake
            </Button>
            <Button onClick={handleNext} className="flex-1 h-11 ai-gradient gap-2 font-semibold group">
              {step === "aadhaar" ? "Proceed to Interview" : "Next: Aadhaar Card"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </>
        ) : (
          <Button
            onClick={captureImage}
            disabled={!isCameraActive}
            className="w-full h-12 ai-gradient gap-2 font-semibold text-sm"
          >
            <Camera className="h-5 w-5" />
            {isPhotoStep ? "Capture Photo" : "Capture Aadhaar Card"}
          </Button>
        )}
      </div>

      {/* Privacy note */}
      <p className="text-center text-[10px] text-muted-foreground/60 mt-3">
        Your identity documents are encrypted and used solely for verification purposes
      </p>
    </motion.div>
  );
}
