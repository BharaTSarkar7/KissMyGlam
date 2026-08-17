import React from "react";

export interface LoadingDialogProps {
  label?: string;
  message?: string;
  fullscreen?: boolean;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({
  label = "KISSMYGLAM",
  message = "Loading...",
  fullscreen = true,
}) => {
  const content = (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${label} ${message}`}
      className="bg-white/95 backdrop-blur-md border border-line/80 shadow-2xl shadow-ink/5 rounded-[24px] px-8 py-7 flex flex-col items-center justify-center gap-4 text-center max-w-[280px] sm:max-w-[320px] w-full mx-4 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Animated Luxury Dual-Ring Spinner */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Outer static ring */}
        <div className="absolute inset-0 rounded-full border-2 border-line/50" />
        {/* Inner spinning accent arc */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent border-r-accent/40 animate-spin [animation-duration:900ms]" />
        {/* Center pulsing luxury gem dot */}
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      </div>

      {/* Brand & Loading Status */}
      <div className="space-y-1">
        <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-ink-soft uppercase select-none">
          {label}
        </p>
        <p className="font-serif text-sm font-medium text-ink tracking-wide animate-pulse [animation-duration:1800ms]">
          {message}
        </p>
      </div>
    </div>
  );

  if (!fullscreen) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/40 backdrop-blur-[3px] transition-all">
      {content}
    </div>
  );
};
