"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useMemo, useRef, useState } from "react";

import { PageShell } from "@/app/components/PageShell";
import { usePlanner } from "@/app/PlannerProvider";
import {
  addDaysISO,
  compareISODate,
  formatDisplayDate,
  todayISO,
  weekStartISO,
} from "@/lib/dateUtils";

import {
  IconBriefcase,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconHeart,
  IconNote,
  IconWeek,
} from "@/app/components/Icons";
import styles from "@/app/components/planner.module.css";

function badgeClass(date: string): string {
  const cmp = compareISODate(date, todayISO());
  if (cmp === 0) return styles.badgeToday;
  if (cmp < 0) return styles.badgePast;
  return styles.badgeFuture;
}

export default function WeekPage() {
  const { state } = usePlanner();
  const today = useMemo(() => todayISO(), []);
  const start = useMemo(() => weekStartISO(today, 1), [today]);
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysISO(start, i)), [start]);
  const days = useMemo(() => {
    const idx = weekDays.indexOf(today);
    if (idx <= 0) return weekDays;
    return [today, ...weekDays.slice(0, idx), ...weekDays.slice(idx + 1)];
  }, [weekDays, today]);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<"cards" | "grid">("cards");

  function scrollCarousel(direction: -1 | 1) {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 380, behavior: "smooth" });
  }

  return (
    <PageShell title="Week" subtitle={`Week of ${formatDisplayDate(start)}`}>
      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconWeek className={styles.icon} />
            <span className={styles.cardTitle}>7-day overview</span>
          </div>
          <div className={styles.muted}>Swipe cards to browse the week</div>
        </div>

        {(() => {
          const tasksInWeek = state.tasks.filter((t) => weekDays.includes(t.date));
          const totalTasks = tasksInWeek.length;
          const doneTasks = tasksInWeek.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
          const completionPct = totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

          const workTasks = tasksInWeek.filter((t) => (t.category ?? "work") === "work");
          const lifeTasks = tasksInWeek.filter((t) => (t.category ?? "work") === "life");

          const busiest = weekDays.reduce(
            (best, d) => {
              const count = tasksInWeek.reduce((acc, t) => acc + (t.date === d ? 1 : 0), 0);
              if (count > best.count) return { date: d, count };
              return best;
            },
            { date: weekDays[0], count: tasksInWeek.reduce((acc, t) => acc + (t.date === weekDays[0] ? 1 : 0), 0) },
          );

          const pHigh = tasksInWeek.reduce((acc, t) => acc + (t.priority === "high" ? 1 : 0), 0);
          const pMed = tasksInWeek.reduce((acc, t) => acc + (t.priority === "medium" ? 1 : 0), 0);
          const pLow = tasksInWeek.reduce((acc, t) => acc + (t.priority === "low" ? 1 : 0), 0);

          const perDay = weekDays.map((d) => {
            const dayTasks = tasksInWeek.filter((t) => t.date === d);
            const total = dayTasks.length;
            const done = dayTasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            return { date: d, total, pct };
          });

          return (
            <>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Total tasks</div>
                  <div className={styles.statValue}>{totalTasks}</div>
                  <div className={styles.statSub}>{`Work ${workTasks.length} · Life ${lifeTasks.length}`}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Weekly completion</div>
                  <div className={styles.statValue}>{`${completionPct}%`}</div>
                  <div className={styles.statSub}>{totalTasks === 0 ? "—" : `${doneTasks}/${totalTasks} done`}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Busiest day</div>
                  <div className={styles.statValue}>{busiest.count}</div>
                  <div className={styles.statSub}>{formatDisplayDate(busiest.date)}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Priority</div>
                  <div className={styles.statValue}>{pHigh}</div>
                  <div className={styles.statSub}>{`High ${pHigh} · Medium ${pMed} · Low ${pLow}`}</div>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statLabel}>Daily completion trend</div>
                <div className={styles.sparkBars} aria-hidden="true">
                  {perDay.map((d) => (
                    <div key={d.date} className={styles.sparkBar} title={`${formatDisplayDate(d.date)} · ${d.pct}%`}>
                      <div className={styles.sparkFill} style={{ height: `${Math.max(6, d.pct)}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          );
        })()}

        <div className={styles.weekControls}>
          <div className={styles.segmented} role="tablist" aria-label="Week view">
            <button
              className={view === "cards" ? styles.segButtonActive : styles.segButton}
              type="button"
              onClick={() => setView("cards")}
              role="tab"
              aria-selected={view === "cards"}
            >
              Cards
            </button>
            <button
              className={view === "grid" ? styles.segButtonActive : styles.segButton}
              type="button"
              onClick={() => setView("grid")}
              role="tab"
              aria-selected={view === "grid"}
            >
              Grid
            </button>
          </div>

          {view === "cards" ? (
            <div className={styles.weekNav}>
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => scrollCarousel(-1)}
                aria-label="Scroll left"
              >
                <IconChevronLeft className={styles.icon} />
              </button>
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => scrollCarousel(1)}
                aria-label="Scroll right"
              >
                <IconChevronRight className={styles.icon} />
              </button>
            </div>
          ) : null}
        </div>

        <div
          className={view === "cards" ? styles.weekCarousel : styles.gridWeek}
          ref={view === "cards" ? carouselRef : undefined}
        >
          {days.map((d) => {
            const tasks = state.tasks.filter((t) => t.date === d);
            const notes = state.notes.filter((n) => n.date === d);
            const blocks = state.timeBlocks.filter((b) => b.date === d);
            const previewTasks = tasks.slice(0, 2);
            const previewNote = notes[0]?.content?.slice(0, 24);
            const previewBlock = blocks[0] ? `${blocks[0].start}-${blocks[0].end} ${blocks[0].title}` : null;
            const hasAnything = tasks.length + notes.length + blocks.length > 0;
            const done = tasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
            const total = tasks.length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            const workTasks = tasks.filter((t) => (t.category ?? "work") === "work");
            const lifeTasks = tasks.filter((t) => (t.category ?? "work") === "life");
            const doneWork = workTasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
            const doneLife = lifeTasks.reduce((acc, t) => acc + (t.completed ? 1 : 0), 0);
            const totalWork = workTasks.length;
            const totalLife = lifeTasks.length;
            const pctWork = totalWork === 0 ? 0 : Math.round((doneWork / totalWork) * 100);
            const pctLife = totalLife === 0 ? 0 : Math.round((doneLife / totalLife) * 100);

            return (
              <Link
                key={d}
                className={`${styles.weekDayLink} ${view === "cards" ? styles.weekDayCard : ""}`}
                href={`/day/${d}`}
              >
                <div className={styles.weekDayHeader}>
                  <div className={styles.weekDayDate}>{formatDisplayDate(d)}</div>
                  <div className={badgeClass(d)}>
                    {d === today ? "Today" : compareISODate(d, today) < 0 ? "Past" : "Future"}
                  </div>
                </div>

                <div className={styles.weekPreview}>
                  <div className={styles.weekChips}>
                    <span className={styles.chip}>
                      <IconCheck className={styles.icon} /> Tasks {tasks.length}
                    </span>
                    <span className={styles.chip}>
                      <IconBriefcase className={styles.icon} /> Work {workTasks.length}
                    </span>
                    <span className={styles.chip}>
                      <IconHeart className={styles.icon} /> Life {lifeTasks.length}
                    </span>
                    <span className={styles.chip}>
                      <IconNote className={styles.icon} /> Notes {notes.length}
                    </span>
                    <span className={styles.chip}>
                      <IconClock className={styles.icon} /> Blocks {blocks.length}
                    </span>
                  </div>

                  <div className={styles.progressBlock}>
                    <div className={styles.progressMeta}>
                      <span>Completion</span>
                      <span>
                        {total === 0 ? "—" : `${done}/${total}`} {total === 0 ? "" : `· ${pct}%`}
                      </span>
                    </div>
                    <div className={styles.progressTrack} aria-hidden="true">
                      <div className={styles.progressFill} style={{ width: `${pct}%` }} />
                    </div>

                    <div className={styles.progressSplit}>
                      <div>
                        <div className={styles.progressLabelRow}>
                          <span>Work</span>
                          <span>{totalWork === 0 ? "—" : `${doneWork}/${totalWork} · ${pctWork}%`}</span>
                        </div>
                        <div className={styles.progressTrack} aria-hidden="true">
                          <div
                            className={`${styles.progressFill} ${styles.progressFillWork}`}
                            style={{ width: `${pctWork}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className={styles.progressLabelRow}>
                          <span>Life</span>
                          <span>{totalLife === 0 ? "—" : `${doneLife}/${totalLife} · ${pctLife}%`}</span>
                        </div>
                        <div className={styles.progressTrack} aria-hidden="true">
                          <div
                            className={`${styles.progressFill} ${styles.progressFillLife}`}
                            style={{ width: `${pctLife}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {hasAnything ? (
                    <>
                      {previewTasks.length > 0 ? (
                        <div className={styles.weekTaskLines}>
                          {previewTasks.map((t) => (
                            <div key={t.id} className={styles.weekTaskLine}>
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
                              <div className={styles.truncate}>{t.title}</div>
                            </div>
                          ))}
                          {tasks.length > previewTasks.length ? (
                            <div className={styles.muted}>{`+${tasks.length - previewTasks.length} more`}</div>
                          ) : null}
                        </div>
                      ) : null}
                      {previewBlock ? <div>Block: {previewBlock}</div> : null}
                      {previewNote ? <div>Note: {previewNote}{notes[0].content.length > previewNote.length ? " …" : ""}</div> : null}
                    </>
                  ) : (
                    <div className={styles.emptyRow}>
                      <div className={styles.emptyIcon}>
                        <IconNote className={styles.icon} />
                      </div>
                      <div className={styles.empty}>No content</div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconCheck className={styles.icon} />
            <span className={styles.cardTitle}>Tips</span>
          </div>
          <div className={styles.muted}>Quick tips</div>
        </div>
        <div className={styles.row}>
          <div className={styles.muted} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <IconCheck className={styles.icon} /> Use top priorities to reduce decision fatigue
          </div>
          <div className={styles.muted} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <IconClock className={styles.icon} /> Group deep work into one uninterrupted block
          </div>
        </div>
      </section>
    </PageShell>
  );
}
