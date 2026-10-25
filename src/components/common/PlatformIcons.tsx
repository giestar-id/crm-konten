import React from "react";
import { Platform } from "@/types";

export function YouTubeIcon({ className = "w-5 h-5", size }: { className?: string; size?: number }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        fill="#FF0000"
      />
      <polygon points="9.545,8.432 9.545,15.568 15.818,12" fill="#FFFFFF" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5", size }: { className?: string; size?: number }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <radialGradient id="ig-rg" r="150%" cx="30%" cy="107%">
          <stop stopColor="#fdf497" offset="0%" />
          <stop stopColor="#fdf497" offset="5%" />
          <stop stopColor="#fd5949" offset="45%" />
          <stop stopColor="#d6249f" offset="60%" />
          <stop stopColor="#285AEB" offset="90%" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-rg)" />
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.6" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="16.5" cy="7.5" r="1.1" fill="#FFFFFF" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5", size }: { className?: string; size?: number }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <rect width="24" height="24" rx="6" fill="#000000" />
      {/* Cyan shadow */}
      <path
        d="M17.2 8.35a4.7 4.7 0 0 1-2.9-1.32v6.23a4.26 4.26 0 1 1-3.66-4.22v2.33a2.02 2.02 0 1 0 1.42 1.94V3.5h2.24a4.7 4.7 0 0 0 2.9 2.58v2.27z"
        fill="#00F2FE"
        transform="translate(-0.6, -0.6)"
        opacity="0.85"
      />
      {/* Red shadow */}
      <path
        d="M17.2 8.35a4.7 4.7 0 0 1-2.9-1.32v6.23a4.26 4.26 0 1 1-3.66-4.22v2.33a2.02 2.02 0 1 0 1.42 1.94V3.5h2.24a4.7 4.7 0 0 0 2.9 2.58v2.27z"
        fill="#FE2C55"
        transform="translate(0.6, 0.6)"
        opacity="0.85"
      />
      {/* White main */}
      <path
        d="M17.2 8.35a4.7 4.7 0 0 1-2.9-1.32v6.23a4.26 4.26 0 1 1-3.66-4.22v2.33a2.02 2.02 0 1 0 1.42 1.94V3.5h2.24a4.7 4.7 0 0 0 2.9 2.58v2.27z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function FacebookIcon({ className = "w-5 h-5", size }: { className?: string; size?: number }) {
  const style = size ? { width: size, height: size } : undefined;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        d="M15.5 12h-2.5v8h-3.3v-8H8V9.3h1.7V7.5c0-2.4 1.4-3.8 3.6-3.8 1.1 0 2.1.1 2.4.1v2.8h-1.6c-1.1 0-1.4.5-1.4 1.4v1.3h3.1l-.3 2.7z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function PlatformLogo({
  platform,
  className = "w-5 h-5",
  size,
}: {
  platform: Platform;
  className?: string;
  size?: number;
}) {
  switch (platform) {
    case "youtube":
      return <YouTubeIcon className={className} size={size} />;
    case "instagram":
      return <InstagramIcon className={className} size={size} />;
    case "tiktok":
      return <TikTokIcon className={className} size={size} />;
    case "facebook":
      return <FacebookIcon className={className} size={size} />;
    default:
      return null;
  }
}
