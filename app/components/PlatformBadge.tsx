import type { Platform } from "../lib/mockData";
import { PlatformIcon } from "./PlatformIcon";

const config: Record<
  Platform,
  { light: { bg: string; text: string }; dark: { bg: string; text: string }; label: string }
> = {
  Meta: {
    light: { bg: "#eff6ff", text: "#1d4ed8" },
    dark: { bg: "#1e3a5f", text: "#93c5fd" },
    label: "Meta",
  },
  TikTok: {
    light: { bg: "#fdf2f8", text: "#9d174d" },
    dark: { bg: "#4a0d2e", text: "#f9a8d4" },
    label: "TikTok",
  },
  Snap: {
    light: { bg: "#fef9c3", text: "#854d0e" },
    dark: { bg: "#451a03", text: "#fde68a" },
    label: "Snap",
  },
  YouTube: {
    light: { bg: "#fef2f2", text: "#b91c1c" },
    dark: { bg: "#450a0a", text: "#fca5a5" },
    label: "YouTube",
  },
  Instagram: {
    light: { bg: "#fdf4ff", text: "#7e22ce" },
    dark: { bg: "#3b0764", text: "#d8b4fe" },
    label: "Instagram",
  },
};

export default function PlatformBadge({
  platform,
  dark,
}: {
  platform: Platform;
  dark?: boolean;
}) {
  const c = config[platform];
  if (!c) return null;
  const style = dark ? c.dark : c.light;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
      style={{ background: style.bg, color: style.text }}
    >
      <PlatformIcon platform={platform} size={12} />
    </span>
  );
}
