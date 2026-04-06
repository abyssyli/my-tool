import React from "react";

type IconProps = {
  size?: number;
  className?: string;
};

function Svg({
  children,
  size = 18,
  className,
  viewBox = "0 0 24 24",
}: {
  children: React.ReactNode;
  size?: number;
  className?: string;
  viewBox?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height={size}
      viewBox={viewBox}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function IconApp(props: IconProps) {
  return (
    <Svg {...props} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="g" x1="2" x2="22" y1="2" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2F7BFF" />
          <stop offset="0.5" stopColor="#6B5CFF" />
          <stop offset="1" stopColor="#FF2D55" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="6" fill="url(#g)" />
      <path
        d="M8 10.2c0-.663.537-1.2 1.2-1.2h5.6c.663 0 1.2.537 1.2 1.2v5.6c0 .663-.537 1.2-1.2 1.2H9.2c-.663 0-1.2-.537-1.2-1.2v-5.6Z"
        fill="rgba(255,255,255,0.9)"
      />
      <path
        d="M9.4 12.2h5.2M9.4 14.4h3.4"
        stroke="rgba(0,0,0,0.45)"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </Svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M10.2 20h-4a2.2 2.2 0 0 1-2.2-2.2v-6.2a2.2 2.2 0 0 1 .76-1.67l6.4-5.5a1.8 1.8 0 0 1 2.36 0l6.4 5.5A2.2 2.2 0 0 1 20 11.6v6.2A2.2 2.2 0 0 1 17.8 20h-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M10 20v-5.2c0-.994.806-1.8 1.8-1.8h.4c.994 0 1.8.806 1.8 1.8V20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconWeek(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 4v2M17 4v2M4.5 9.2h15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M6.6 20h10.8A2.6 2.6 0 0 0 20 17.4V8.6A2.6 2.6 0 0 0 17.4 6H6.6A2.6 2.6 0 0 0 4 8.6v8.8A2.6 2.6 0 0 0 6.6 20Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M7.8 12h2.4M12 12h2.4M16.2 12h.8M7.8 15.6h2.4M12 15.6h2.4M16.2 15.6h.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M14.5 6.5 9 12l5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}

export function IconChevronRight(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M9.5 6.5 15 12l-5.5 5.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}

export function IconCalendar(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 3.8v2.4M17 3.8v2.4M5.2 8.8h13.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M7.2 20h9.6A3.2 3.2 0 0 0 20 16.8V8.4A3.2 3.2 0 0 0 16.8 5.2H7.2A3.2 3.2 0 0 0 4 8.4v8.4A3.2 3.2 0 0 0 7.2 20Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M8.4 12h2.2M13.4 12h2.2M8.4 15.6h2.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M20 6 9.5 16.5 4 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </Svg>
  );
}

export function IconNote(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M7 20h10a3 3 0 0 0 3-3V9.4a3 3 0 0 0-.88-2.12l-2.4-2.4A3 3 0 0 0 14.6 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M8.6 11h6.8M8.6 14h6.8M8.6 17h4.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 7.8V12l3 1.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconBriefcase(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M8.2 7.8V6.6A2.6 2.6 0 0 1 10.8 4h2.4a2.6 2.6 0 0 1 2.6 2.6v1.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M6.2 20h11.6A2.2 2.2 0 0 0 20 17.8V9.4A2.2 2.2 0 0 0 17.8 7.2H6.2A2.2 2.2 0 0 0 4 9.4v8.4A2.2 2.2 0 0 0 6.2 20Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M4 12.2h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M10.6 12.2h2.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 20.2s-7.2-4.4-9.2-9a5.2 5.2 0 0 1 8.4-5.8L12 6.2l.8-.8a5.2 5.2 0 0 1 8.4 5.8c-2 4.6-9.2 9-9.2 9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconSun(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 16.8a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M12 3.4v1.8M12 18.8v1.8M3.4 12h1.8M18.8 12h1.8M5.4 5.4l1.3 1.3M17.3 17.3l1.3 1.3M18.6 5.4l-1.3 1.3M6.7 17.3l-1.3 1.3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconCloud(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M8.6 18.2h8.1a4 4 0 0 0 .4-8 5.6 5.6 0 0 0-11-.9A3.4 3.4 0 0 0 8.6 18.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconRain(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M8.2 15.2h8.6a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.8-.8A3 3 0 0 0 8.2 15.2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M9 18.2l-.8 1.4M12 18.2l-.8 1.4M15 18.2l-.8 1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconSnow(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M8.2 14.8h8.6a3.6 3.6 0 0 0 .3-7.2 5 5 0 0 0-9.8-.8A3 3 0 0 0 8.2 14.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M9.2 18.2h.01M12 18.2h.01M14.8 18.2h.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3.2"
      />
    </Svg>
  );
}

export function IconBolt(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M13 2.8 6.6 13h4.9l-1.1 8.2L17.4 11h-4.9L13 2.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconFog(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M6 10.2h12M4.6 13.2h14.8M6.6 16.2h10.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
      <path
        d="M8.4 8.4a3.6 3.6 0 0 1 7.2 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

export function IconSpark(props: IconProps) {
  return (
    <Svg {...props}>
      <path
        d="M12 2.8l1.1 4.2a2.2 2.2 0 0 0 1.6 1.6l4.2 1.1-4.2 1.1a2.2 2.2 0 0 0-1.6 1.6L12 16.6l-1.1-4.2a2.2 2.2 0 0 0-1.6-1.6L5.1 9.7l4.2-1.1a2.2 2.2 0 0 0 1.6-1.6L12 2.8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.4"
      />
      <path
        d="M19 13.2l.5 1.9c.12.46.48.82.94.94l1.9.5-1.9.5a1.3 1.3 0 0 0-.94.94L19 19.8l-.5-1.9a1.3 1.3 0 0 0-.94-.94l-1.9-.5 1.9-.5c.46-.12.82-.48.94-.94l.5-1.9Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </Svg>
  );
}
