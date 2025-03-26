
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "heavy";
  rounded?: "sm" | "md" | "lg" | "full";
  bordered?: boolean;
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  intensity = "medium",
  rounded = "lg",
  bordered = true,
  hoverable = false,
}: GlassCardProps) {
  const intensityClasses = {
    light: "bg-white/40 backdrop-blur-sm",
    medium: "bg-white/60 backdrop-blur-md",
    heavy: "bg-white/80 backdrop-blur-lg",
  };

  const roundedClasses = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-3xl",
  };

  return (
    <div
      className={cn(
        intensityClasses[intensity],
        roundedClasses[rounded],
        bordered && "border border-white/20",
        hoverable && "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
        "shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
