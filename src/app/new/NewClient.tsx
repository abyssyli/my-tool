"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { PageShell } from "@/app/components/PageShell";
import { usePlanner } from "@/app/PlannerProvider";
import { isISODateString, timeToMinutes, todayISO } from "@/lib/dateUtils";
import type { Task } from "@/lib/plannerTypes";

import {
  IconBriefcase,
  IconClock,
  IconHeart,
  IconNote,
  IconPlus,
  IconSpark,
} from "@/app/components/Icons";
import styles from "@/app/components/planner.module.css";

type NewType = "task" | "note" | "timeBlock";
type TaskCategory = NonNullable<Task["category"]>;

export function NewClient({ presetDate }: { presetDate?: string }) {
  const router = useRouter();
  const { actions } = usePlanner();

  const today = useMemo(() => todayISO(), []);
  const initialDate = presetDate && isISODateString(presetDate) ? presetDate : today;

  const [type, setType] = useState<NewType>("task");
  const [date, setDate] = useState(initialDate);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"] | "">("");
  const [category, setCategory] = useState<TaskCategory>("work");
  const [content, setContent] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [error, setError] = useState<string | null>(null);

  function goBack(targetDate: string) {
    if (targetDate === today) router.push("/");
    else router.push(`/day/${targetDate}`);
  }

  function submit() {
    setError(null);

    if (!isISODateString(date)) {
      setError("Invalid date format. Expected YYYY-MM-DD.");
      return;
    }

    if (type === "task") {
      if (!title.trim()) {
        setError("Task title is required.");
        return;
      }
      actions.addTask({
        date,
        title: title.trim(),
        priority: priority === "" ? undefined : priority,
        category,
      });
      goBack(date);
      return;
    }

    if (type === "note") {
      if (!content.trim()) {
        setError("Note content is required.");
        return;
      }
      actions.addNote({ date, content: content.trim() });
      goBack(date);
      return;
    }

    if (!title.trim()) {
      setError("Time block title is required.");
      return;
    }
    const startM = timeToMinutes(start);
    const endM = timeToMinutes(end);
    if (startM === null || endM === null) {
      setError("Invalid time format. Expected HH:mm.");
      return;
    }
    if (endM <= startM) {
      setError("End time must be later than start time.");
      return;
    }
    actions.addTimeBlock({
      date,
      title: title.trim(),
      start,
      end,
    });
    goBack(date);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submit();
  }

  return (
    <PageShell title="New" subtitle="Add task / note / time block">
      <form className={styles.card} onSubmit={onSubmit}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconPlus className={styles.icon} />
            <span className={styles.cardTitle}>Create</span>
          </div>
          <div className={styles.muted}>Saved to client-side state</div>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span className={styles.muted}>Date</span>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <div className={styles.field}>
            <span className={styles.muted}>Type</span>
            <div className={styles.segmented}>
              <button
                className={type === "task" ? styles.segButtonActive : styles.segButton}
                type="button"
                onClick={() => setType("task")}
              >
                <IconSpark className={styles.icon} /> Task
              </button>
              <button
                className={type === "note" ? styles.segButtonActive : styles.segButton}
                type="button"
                onClick={() => setType("note")}
              >
                <IconNote className={styles.icon} /> Note
              </button>
              <button
                className={type === "timeBlock" ? styles.segButtonActive : styles.segButton}
                type="button"
                onClick={() => setType("timeBlock")}
              >
                <IconClock className={styles.icon} /> Block
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formDivider} />

        {type === "task" ? (
          <div className={styles.formGrid}>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span className={styles.muted}>Title</span>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Weekly review / Gym"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.muted}>Priority</span>
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task["priority"] | "")}
              >
                <option value="">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <div className={styles.field}>
              <span className={styles.muted}>Category</span>
              <div className={styles.segmented}>
                <button
                  className={category === "work" ? styles.segButtonActive : styles.segButton}
                  type="button"
                  onClick={() => setCategory("work")}
                >
                  <IconBriefcase className={styles.icon} /> Work
                </button>
                <button
                  className={category === "life" ? styles.segButtonActive : styles.segButton}
                  type="button"
                  onClick={() => setCategory("life")}
                >
                  <IconHeart className={styles.icon} /> Life
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {type === "note" ? (
          <div className={styles.formGrid}>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span className={styles.muted}>Content</span>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write something…"
              />
            </label>
          </div>
        ) : null}

        {type === "timeBlock" ? (
          <div className={styles.formGrid}>
            <label className={`${styles.field} ${styles.fullWidth}`}>
              <span className={styles.muted}>Title</span>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Deep work / Meeting"
              />
            </label>
            <label className={styles.field}>
              <span className={styles.muted}>Start</span>
              <input
                className={styles.input}
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.muted}>End</span>
              <input
                className={styles.input}
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </label>
          </div>
        ) : null}

        <div className={styles.formDivider} />

        {error ? <div className={styles.empty}>{error}</div> : null}

        <div className={styles.buttonRow}>
          <button className={styles.button} type="button" onClick={submit}>
            {type === "task" ? <IconSpark className={styles.iconOnDark} /> : null}
            {type === "note" ? <IconNote className={styles.iconOnDark} /> : null}
            {type === "timeBlock" ? <IconClock className={styles.iconOnDark} /> : null}
            Save
          </button>
          <button className={styles.buttonSecondary} type="button" onClick={() => goBack(date)}>
            Cancel
          </button>
        </div>
      </form>
    </PageShell>
  );
}
