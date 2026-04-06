"use client";

import React, { useMemo } from "react";

import { useWeather } from "@/app/WeatherProvider";
import { formatTempRange } from "@/lib/weatherUtils";

import { IconCloud, IconRain, IconSun } from "./Icons";
import styles from "./planner.module.css";

export function WeatherPill({ date }: { date: string }) {
  const day = useWeather(date);

  const Icon = useMemo(() => {
    if (day.kind === "sun") return IconSun;
    if (day.kind === "cloud") return IconCloud;
    return IconRain;
  }, [day.kind]);

  return (
    <span className={styles.chip}>
      <Icon className={styles.icon} />
      <span>{`${day.label} · ${formatTempRange(day.tempMinC, day.tempMaxC)}`}</span>
    </span>
  );
}
