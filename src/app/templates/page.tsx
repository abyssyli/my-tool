"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { DatePicker } from "@/app/components/DatePicker";
import { PageShell } from "@/app/components/PageShell";
import { usePlanner } from "@/app/PlannerProvider";
import { isISODateString, todayISO } from "@/lib/dateUtils";

import styles from "@/app/components/planner.module.css";

type TemplateDefinition = {
  id: "workday" | "studyday" | "gymday";
  title: string;
  subtitle: string;
  tasks: Array<{ title: string; priority?: "low" | "medium" | "high"; category?: "work" | "life" }>;
  notes: Array<{ content: string }>;
  blocks: Array<{ start: string; end: string; title: string }>;
};

const TEMPLATES: TemplateDefinition[] = [
  {
    id: "workday",
    title: "Workday template",
    subtitle: "Deep work + meetings + end-of-day review",
    tasks: [
      { title: "Top 3 priorities", priority: "high", category: "work" },
      { title: "Process inbox (15 min)", priority: "medium", category: "work" },
      { title: "Daily wrap-up", priority: "low", category: "work" },
    ],
    notes: [{ content: "One focus block before any meetings." }],
    blocks: [
      { start: "09:30", end: "11:00", title: "Deep work" },
      { start: "14:00", end: "14:30", title: "Sync / standup" },
      { start: "17:10", end: "17:30", title: "Review + plan tomorrow" },
    ],
  },
  {
    id: "studyday",
    title: "Studyday template",
    subtitle: "Learning blocks + recall + summary note",
    tasks: [
      { title: "Read & annotate (45 min)", priority: "high", category: "work" },
      { title: "Active recall (20 min)", priority: "high", category: "work" },
      { title: "Write summary note", priority: "medium", category: "work" },
    ],
    notes: [{ content: "If you can't explain it simply, you don't understand it yet." }],
    blocks: [
      { start: "10:00", end: "11:30", title: "Learning block" },
      { start: "15:00", end: "15:30", title: "Active recall" },
    ],
  },
  {
    id: "gymday",
    title: "Gymday template",
    subtitle: "Workout + prep + recovery",
    tasks: [
      { title: "Workout session", priority: "high", category: "life" },
      { title: "Meal prep", priority: "medium", category: "life" },
      { title: "Stretching (10 min)", priority: "low", category: "life" },
    ],
    notes: [{ content: "Warm up first. Keep it consistent." }],
    blocks: [
      { start: "18:00", end: "19:00", title: "Workout" },
      { start: "19:15", end: "19:35", title: "Stretching" },
    ],
  },
];

export default function TemplatesPage() {
  const router = useRouter();
  const { actions } = usePlanner();

  const today = useMemo(() => todayISO(), []);
  const [date, setDate] = useState(today);
  const [error, setError] = useState<string | null>(null);

  function applyTemplate(template: TemplateDefinition) {
    setError(null);
    if (!isISODateString(date)) {
      setError("Invalid date format. Expected YYYY-MM-DD.");
      return;
    }

    template.tasks.forEach((t) => {
      actions.addTask({
        date,
        title: t.title,
        priority: t.priority,
        category: t.category,
      });
    });

    template.notes.forEach((n) => {
      actions.addNote({ date, content: n.content });
    });

    template.blocks.forEach((b) => {
      actions.addTimeBlock({ date, start: b.start, end: b.end, title: b.title });
    });

    router.push(`/day/${date}`);
  }

  return (
    <PageShell title="Templates" subtitle="Apply a preset day plan to any date">
      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitle}>Apply</div>
          <div className={styles.muted}>Adds items to client-side state</div>
        </div>
        <div className={styles.buttonRow}>
          <DatePicker value={date} onChange={setDate} />
          {error ? <span className={styles.empty}>{error}</span> : null}
        </div>
      </section>

      <div className={styles.gridWeek} style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {TEMPLATES.map((t) => (
          <section key={t.id} className={styles.weekDayLink} style={{ gap: 10 }}>
            <div className={styles.cardTitleRow} style={{ marginBottom: 0 }}>
              <div className={styles.cardTitle}>{t.title}</div>
            </div>
            <div className={styles.muted}>{t.subtitle}</div>
            <div className={styles.weekChips}>
              <span className={styles.chip}>
                <span>{`Tasks ${t.tasks.length}`}</span>
              </span>
              <span className={styles.chip}>
                <span>{`Blocks ${t.blocks.length}`}</span>
              </span>
              <span className={styles.chip}>
                <span>{`Notes ${t.notes.length}`}</span>
              </span>
            </div>
            <div className={styles.weekTaskLines}>
              {t.tasks.slice(0, 2).map((x) => (
                <div key={x.title} className={styles.weekTaskLine}>
                  <div className={styles.truncate}>{x.title}</div>
                </div>
              ))}
              {t.tasks.length > 2 ? <div className={styles.muted}>{`+${t.tasks.length - 2} more`}</div> : null}
            </div>
            <div className={styles.buttonRow}>
              <button className={styles.button} type="button" onClick={() => applyTemplate(t)}>
                Apply
              </button>
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
