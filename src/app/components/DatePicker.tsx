"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { formatISODate, isISODateString, parseISODateToLocalDate, todayISO } from "@/lib/dateUtils";

import { IconChevronLeft, IconChevronRight } from "./Icons";
import styles from "./planner.module.css";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function monthLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(date);
}

function dayOfWeekMon0(date: Date): number {
  const d = date.getDay();
  return (d + 6) % 7;
}

export function DatePicker({
  value,
  onChange,
  allowClear = false,
  preferPlacement = "auto",
}: {
  value: string;
  onChange: (next: string) => void;
  allowClear?: boolean;
  preferPlacement?: "auto" | "bottom" | "top";
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const selectedDate = useMemo(() => {
    if (!isISODateString(value)) return null;
    return parseISODateToLocalDate(value);
  }, [value]);

  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(selectedDate ?? new Date()));

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const el = wrapperRef.current;
      const pop = popoverRef.current;
      if (!el || !pop) return;
      const target = e.target as Node | null;
      if (target && (el.contains(target) || pop.contains(target))) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const host = wrapperRef.current;
      const pop = popoverRef.current;
      if (!host || !pop) return;
      const rect = host.getBoundingClientRect();
      const popWidth = Math.min(360, Math.max(320, rect.width));
      const margin = 8;

      const maxLeft = window.innerWidth - popWidth - margin;
      const left = Math.max(margin, Math.min(rect.left, maxLeft));

      const estimatedHeight = pop.offsetHeight || 360;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const nextPlacement =
        preferPlacement === "top"
          ? spaceAbove >= estimatedHeight
            ? "top"
            : "bottom"
          : preferPlacement === "bottom"
            ? "bottom"
            : spaceBelow < estimatedHeight && spaceAbove > spaceBelow
              ? "top"
              : "bottom";

      const top =
        nextPlacement === "top"
          ? Math.max(margin, rect.top - estimatedHeight - margin)
          : Math.min(window.innerHeight - estimatedHeight - margin, rect.bottom + margin);

      setPlacement(nextPlacement);
      setPopoverPos({ top, left, width: popWidth });
    }

    const raf = window.requestAnimationFrame(() => updatePosition());
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, preferPlacement]);

  const today = useMemo(() => todayISO(), []);
  const todayDate = useMemo(() => parseISODateToLocalDate(today), [today]);
  const monthStart = useMemo(() => startOfMonth(viewMonth), [viewMonth]);
  const offset = useMemo(() => dayOfWeekMon0(monthStart), [monthStart]);
  const daysInMonth = useMemo(() => new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate(), [monthStart]);

  const label = isISODateString(value) ? value : "Select date";

  return (
    <div className={styles.datePicker} ref={wrapperRef}>
      <button
        className={styles.dateTrigger}
        type="button"
        onClick={() =>
          setOpen((v) => {
            if (!v) {
              setViewMonth(startOfMonth(selectedDate ?? new Date()));
            }
            return !v;
          })
        }
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        {label}
      </button>

      {open
        ? createPortal(
            <div
              ref={popoverRef}
              className={styles.datePopover}
              role="dialog"
              aria-label="Date picker"
              style={
                popoverPos
                  ? {
                      position: "fixed",
                      top: popoverPos.top,
                      left: popoverPos.left,
                      width: popoverPos.width,
                      zIndex: 9999,
                    }
                  : { position: "fixed", zIndex: 9999 }
              }
              data-placement={placement}
            >
              <div className={styles.dateHeader}>
                <button
                  className={styles.iconButton}
                  type="button"
                  onClick={() => setViewMonth((d) => addMonths(d, -1))}
                  aria-label="Previous month"
                >
                  <IconChevronLeft className={styles.icon} />
                </button>
                <div className={styles.dateMonthLabel}>{monthLabel(monthStart)}</div>
                <button
                  className={styles.iconButton}
                  type="button"
                  onClick={() => setViewMonth((d) => addMonths(d, 1))}
                  aria-label="Next month"
                >
                  <IconChevronRight className={styles.icon} />
                </button>
              </div>

              <div className={styles.dateWeekRow} aria-hidden="true">
                {WEEKDAYS.map((w) => (
                  <div key={w} className={styles.dateWeekCell}>
                    {w}
                  </div>
                ))}
              </div>

              <div className={styles.dateGrid}>
                {Array.from({ length: 42 }, (_, i) => {
                  const day = i - offset + 1;
                  const inThisMonth = day >= 1 && day <= daysInMonth;
                  if (!inThisMonth) {
                    return <div key={`empty-${i}`} className={styles.dateCellEmpty} aria-hidden="true" />;
                  }

                  const dt = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
                  const iso = formatISODate(dt);
                  const isSelected = value === iso;
                  const isToday = iso === today;

                  return (
                    <button
                      key={iso}
                      type="button"
                      className={isSelected ? styles.dateCellSelected : isToday ? styles.dateCellToday : styles.dateCell}
                      onClick={() => {
                        onChange(iso);
                        setOpen(false);
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className={styles.dateFooter}>
                <button
                  className={styles.buttonSecondary}
                  type="button"
                  onClick={() => {
                    onChange(today);
                    setViewMonth(startOfMonth(todayDate));
                    setOpen(false);
                  }}
                >
                  Today
                </button>
                {allowClear ? (
                  <button
                    className={styles.buttonSecondary}
                    type="button"
                    onClick={() => {
                      onChange("");
                      setOpen(false);
                    }}
                  >
                    Clear
                  </button>
                ) : null}
                <button className={styles.button} type="button" onClick={() => setOpen(false)}>
                  Done
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
