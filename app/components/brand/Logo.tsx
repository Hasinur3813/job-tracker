import Link from "next/link";
import { Briefcase, Plus } from "lucide-react";

type LogoSize = "sm" | "md" | "lg";

const markSizes: Record<LogoSize, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const wordSizes: Record<LogoSize, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

interface LogoMarkProps {
  size?: LogoSize;
  className?: string;
}

export function LogoMark({ size = "md", className = "" }: LogoMarkProps) {
  const px = markSizes[size];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-[30%] bg-[linear-gradient(140deg,#7159ff_0%,#5b3df5_48%,#3f28b8_100%)] text-white shadow-[0_10px_24px_-12px_rgba(91,61,245,0.9)] ${className}`}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      <Briefcase size={Math.round(px * 0.44)} strokeWidth={2.6} />
      <span
        className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-accent-400 text-white ring-2 ring-white"
        style={{
          width: Math.round(px * 0.32),
          height: Math.round(px * 0.32),
        }}
      >
        <Plus size={Math.round(px * 0.2)} strokeWidth={3.5} />
      </span>
    </span>
  );
}

interface LogoProps {
  href?: string;
  size?: LogoSize;
  showTagline?: boolean;
  light?: boolean;
  className?: string;
}

export function Logo({
  href = "/",
  size = "md",
  showTagline = true,
  light = false,
  className = "",
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="চাকরি ট্র্যাকার হোমপেজ"
    >
      <LogoMark size={size} className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105" />
      <span className="flex flex-col text-left leading-none">
        <span
          className={`${wordSizes[size]} font-black tracking-tight ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          চাকরি{" "}
          <span className={light ? "text-accent-300" : "text-brand-600"}>
            ট্র্যাকার
          </span>
        </span>
        {showTagline && (
          <span
            className={`mt-1 font-mono text-[10.5px] font-semibold uppercase tracking-[0.22em] ${
              light ? "text-white/70" : "text-slate-500"
            }`}
          >
            Chakri Tracker
          </span>
        )}
      </span>
    </Link>
  );
}
