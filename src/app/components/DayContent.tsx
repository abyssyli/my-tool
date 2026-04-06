"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo } from "react";

import { usePlanner } from "@/app/PlannerProvider";
import { WeatherPill } from "@/app/components/WeatherPill";
import { compareISODate, formatDisplayDate, todayISO, timeToMinutes } from "@/lib/dateUtils";
import type { Task } from "@/lib/plannerTypes";

import { IconCheck, IconClock, IconNote, IconPlus, IconSpark } from "./Icons";
import styles from "./planner.module.css";

function priorityLabel(priority: Task["priority"]): string | null {
  if (!priority) return null;
  if (priority === "low") return "Low";
  if (priority === "medium") return "Medium";
  return "High";
}

function categoryLabel(category: Task["category"]): "Work" | "Life" {
  return category === "life" ? "Life" : "Work";
}

function priorityClass(priority: Task["priority"]): string | null {
  if (!priority) return null;
  if (priority === "low") return styles.priorityLow;
  if (priority === "medium") return styles.priorityMedium;
  return styles.priorityHigh;
}

function dateBadgeClass(date: string): string {
  const cmp = compareISODate(date, todayISO());
  if (cmp === 0) return styles.badgeToday;
  if (cmp < 0) return styles.badgePast;
  return styles.badgeFuture;
}

export function DayContent({ date }: { date: string }) {
  const { state, actions } = usePlanner();

  const tasks = useMemo(
    () =>
      state.tasks
        .filter((t) => t.date === date)
        .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)),
    [state.tasks, date],
  );

  const notes = useMemo(
    () => state.notes.filter((n) => n.date === date),
    [state.notes, date],
  );

  const timeBlocks = useMemo(
    () =>
      state.timeBlocks
        .filter((b) => b.date === date)
        .slice()
        .sort((a, b) => {
          const am = timeToMinutes(a.start) ?? Number.MAX_SAFE_INTEGER;
          const bm = timeToMinutes(b.start) ?? Number.MAX_SAFE_INTEGER;
          return am - bm;
        }),
    [state.timeBlocks, date],
  );

  return (
    <div className={styles.main}>
      <div className={styles.row}>
        <div className={styles.card} style={{ flex: 1 }}>
          <div className={styles.cardTitleRow}>
            <div className={styles.cardTitleWithIcon}>
              <IconSpark className={styles.icon} />
              <span className={styles.cardTitle}>Overview</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <WeatherPill date={date} />
              <div className={dateBadgeClass(date)}>{formatDisplayDate(date)}</div>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.buttonSecondary} href={`/new?date=${encodeURIComponent(date)}`}>
              <IconPlus className={styles.icon} />
              New
            </Link>
            <Link className={styles.buttonSecondary} href="/week">
              Week
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconCheck className={styles.icon} />
            <span className={styles.cardTitle}>Tasks</span>
          </div>
          <div className={styles.muted}>{tasks.length}</div>
        </div>
        {tasks.length === 0 ? (
          <div className={styles.emptyRow}>
            <div className={styles.emptyIcon}>
              <IconCheck className={styles.icon} />
            </div>
            <div className={styles.empty}>No tasks for this day.</div>
          </div>
        ) : (
          <div className={styles.list}>
            {tasks.map((t) => {
              const pLabel = priorityLabel(t.priority);
              const pClass = priorityClass(t.priority);
              const cLabel = categoryLabel(t.category);
              return (
                <label key={t.id} className={styles.taskItem}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => actions.toggleTask(t.id)}
                  />
                  <div className={styles.taskTitle}>
                    <div className={styles.taskTitleRow}>
                      {t.imageDataUrl ? (
                        <span className={styles.thumb} aria-hidden="true">
                          <Image
                            className={styles.thumbImg}
                            src={t.imageDataUrl}
                            alt=""
                            width={36}
                            height={36}
                            unoptimized
                          />
                        </span>
                      ) : null}
                      <div className={`${styles.truncate} ${t.completed ? styles.taskDone : ""}`}>{t.title}</div>
                    </div>
                    <div className={styles.muted}>
                      {`Category: ${cLabel}`}
                      {pLabel ? ` · Priority: ${pLabel}` : ""}
                    </div>
                  </div>
                  {pLabel && pClass ? <span className={pClass}>{pLabel}</span> : <span />}
                </label>
              );
            })}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconNote className={styles.icon} />
            <span className={styles.cardTitle}>Notes</span>
          </div>
          <div className={styles.muted}>{notes.length}</div>
        </div>
        {notes.length === 0 ? (
          <div className={styles.emptyRow}>
            <div className={styles.emptyIcon}>
              <IconNote className={styles.icon} />
            </div>
            <div className={styles.empty}>No notes for this day.</div>
          </div>
        ) : (
          <div className={styles.list}>
            {notes.map((n) => (
              <div key={n.id} className={styles.card} style={{ padding: 12 }}>
                <div style={{ whiteSpace: "pre-wrap" }}>{n.content}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconClock className={styles.icon} />
            <span className={styles.cardTitle}>Schedule</span>
          </div>
          <div className={styles.muted}>{timeBlocks.length}</div>
        </div>
        {timeBlocks.length === 0 ? (
          <div className={styles.emptyRow}>
            <div className={styles.emptyIcon}>
              <IconClock className={styles.icon} />
            </div>
            <div className={styles.empty}>No time blocks for this day.</div>
          </div>
        ) : (
          <div className={styles.list}>
            {timeBlocks.map((b) => (
              <div key={b.id} className={styles.card} style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ fontWeight: 650 }}>{b.title}</div>
                  <div className={styles.muted}>
                    {b.start} - {b.end}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
