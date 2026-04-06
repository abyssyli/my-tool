"use client";

import React, { createContext, useContext, useMemo } from "react";

import { getPseudoWeather } from "@/lib/weatherUtils";

type WeatherContextValue = {
  getForDate: (date: string) => ReturnType<typeof getPseudoWeather>;
};

const WeatherContext = createContext<WeatherContextValue | null>(null);

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<WeatherContextValue>(() => ({ getForDate: getPseudoWeather }), []);
  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather(date: string) {
  const ctx = useContext(WeatherContext);
  if (!ctx) throw new Error("useWeather must be used within WeatherProvider");
  return ctx.getForDate(date);
}
