import React from "react";

type Tone = "brand" | "light" | "gold" | "inverse";
type Size = "sm" | "md" | "lg";

interface IconTileProps {
  icon: React.ElementType;
  tone?: Tone;
  size?: Size;
  className?: string;
}

// Subtle gradient + inner highlight + ring, instead of a flat filled square.
// The highlight is what reads as "premium" — it suggests a lit surface rather
// than a coloured box.
const TONES: Record<Tone, string> = {
  brand:
    "bg-gradient-to-br from-[#1f5054] to-[#123032] text-white ring-1 ring-inset ring-white/15 shadow-md shadow-[#173d40]/20",
  light:
    "bg-gradient-to-br from-teal-50 to-white text-[#173d40] ring-1 ring-inset ring-teal-200/80 shadow-sm",
  gold: "bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 ring-1 ring-inset ring-white/25 shadow-md shadow-amber-500/20",
  inverse:
    "bg-white/10 text-[#f59e0b] ring-1 ring-inset ring-white/15 backdrop-blur-xs",
};

const SIZES: Record<Size, { box: string; icon: string; stroke: number }> = {
  sm: { box: "w-9 h-9 rounded-lg", icon: "w-4 h-4", stroke: 2 },
  md: { box: "w-11 h-11 rounded-xl", icon: "w-[18px] h-[18px]", stroke: 1.9 },
  lg: { box: "w-14 h-14 rounded-2xl", icon: "w-6 h-6", stroke: 1.75 },
};

export const IconTile: React.FC<IconTileProps> = ({
  icon: Icon,
  tone = "brand",
  size = "md",
  className = "",
}) => {
  const { box, icon, stroke } = SIZES[size];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center flex-shrink-0 ${box} ${TONES[tone]} ${className}`}
    >
      <Icon className={icon} strokeWidth={stroke} />
    </span>
  );
};
