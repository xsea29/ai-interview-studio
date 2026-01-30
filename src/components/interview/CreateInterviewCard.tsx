import { motion } from "framer-motion";
import { Plus, Sparkles, Upload, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Animated floating shapes component
function FloatingShapes() {
  const shapes = [
    { type: "circle", size: 120, x: "5%", y: "10%", delay: 0, duration: 15 },
    { type: "hexagon", size: 90, x: "75%", y: "20%", delay: 1, duration: 18 },
    { type: "square", size: 60, x: "55%", y: "65%", delay: 0.5, duration: 14 },
    { type: "circle", size: 140, x: "85%", y: "75%", delay: 2, duration: 16 },
    { type: "hexagon", size: 70, x: "20%", y: "70%", delay: 0.3, duration: 17 },
    { type: "square", size: 50, x: "40%", y: "5%", delay: 1.2, duration: 13 },
    { type: "circle", size: 65, x: "65%", y: "5%", delay: 1.8, duration: 15 },
    { type: "hexagon", size: 55, x: "3%", y: "45%", delay: 0.6, duration: 16 },
    { type: "dot", size: 8, x: "30%", y: "30%", delay: 0, duration: 10 },
    { type: "dot", size: 6, x: "50%", y: "50%", delay: 0.5, duration: 12 },
    { type: "dot", size: 10, x: "70%", y: "40%", delay: 1, duration: 11 },
    { type: "dot", size: 7, x: "15%", y: "60%", delay: 1.5, duration: 9 },
    { type: "dot", size: 5, x: "90%", y: "50%", delay: 2, duration: 10 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className={`absolute ${shape.type === "dot" ? "opacity-10" : "opacity-[0.06]"}`}
          style={{ left: shape.x, top: shape.y }}
          animate={{
            y: [0, -25, 0, 25, 0],
            x: [0, 15, 0, -15, 0],
            rotate: shape.type === "dot" ? [0, 0, 0] : [0, 180, 360],
            scale: [1, 1.15, 1, 0.85, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {shape.type === "circle" && (
            <div
              className="rounded-full border-2 border-primary/80"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === "hexagon" && (
            <svg width={shape.size} height={shape.size} viewBox="0 0 100 100">
              <polygon
                points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          )}
          {shape.type === "square" && (
            <div
              className="border-2 border-primary/80 rounded-lg"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
          {shape.type === "dot" && (
            <div
              className="rounded-full bg-primary"
              style={{ width: shape.size, height: shape.size }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Animated grid lines
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
      <svg className="w-full h-full">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Sweeping highlight */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        style={{ width: "50%" }}
        animate={{ x: ["-50%", "200%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// Flowing energy lines
function EnergyLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[1px] w-full"
          style={{ top: `${15 + i * 18}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.2, 0] }}
          transition={{
            duration: 3,
            delay: i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-primary to-transparent"
            animate={{ x: ["-100%", "400%"] }}
            transition={{
              duration: 2.5,
              delay: i * 0.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// Pulsing orbs in background
function PulsingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        style={{ left: "-5%", top: "50%", transform: "translateY(-50%)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-primary/5 blur-3xl"
        style={{ right: "5%", top: "20%" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.25, 0.15, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-primary/5 blur-2xl"
        style={{ right: "30%", bottom: "10%" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// Particle field effect
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.5, 1, 0.5],
            y: [0, -20, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function CreateInterviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border p-5 sm:p-8 md:p-10 card-elevated"
    >
      {/* Animated background layers */}
      <AnimatedGrid />
      <PulsingOrbs />
      <FloatingShapes />
      <EnergyLines />
      <ParticleField />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 ai-gradient-subtle opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-primary/10 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-primary mb-3 sm:mb-4">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              AI-Powered Interviews
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-2 sm:mb-3">
              Create AI Interview
            </h1>
            
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
              Upload candidates from any ATS or spreadsheet and run AI interviews at scale.
              <span className="hidden sm:inline"> No integration required — works with any hiring workflow.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <Link to="/create" className="w-full sm:w-auto">
                <Button size="lg" className="ai-gradient ai-glow-sm gap-2 font-medium w-full sm:w-auto">
                  <Plus className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                  Create AI Interview
                </Button>
              </Link>
              
              <Link to="/interviews" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  View All Interviews
                </Button>
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-border/60">
              <FeatureChip icon={<Upload className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="CSV & Excel" />
              <FeatureChip icon={<Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="Text, Audio & Video" />
              <FeatureChip icon={<Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />} text="AI-adaptive" />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <div className="relative w-48 h-48">
              <motion.div 
                className="absolute inset-0 rounded-full ai-gradient opacity-20 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="relative flex items-center justify-center w-full h-full">
                <motion.div 
                  className="w-32 h-32 rounded-2xl ai-gradient flex items-center justify-center ai-glow"
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-14 w-14 text-primary-foreground" />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {text}
    </div>
  );
}
