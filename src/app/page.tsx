"use client";

import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { DayContent } from "@/app/components/DayContent";
import { DatePicker } from "@/app/components/DatePicker";
import { PageShell } from "@/app/components/PageShell";
import { addDaysISO, formatDisplayDate, isISODateString, todayISO } from "@/lib/dateUtils";

import { IconCalendar, IconChevronLeft, IconChevronRight } from "@/app/components/Icons";
import styles from "@/app/components/planner.module.css";

export default function Home() {
  const router = useRouter();
  const today = useMemo(() => todayISO(), []);
  const [jumpDate, setJumpDate] = useState(today);

  return (
    <PageShell title="Day Planner" subtitle={`Today · ${formatDisplayDate(today)}`}>
      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconCalendar className={styles.icon} />
            <span className={styles.cardTitle}>Quick Jump</span>
          </div>
          <div className={styles.muted}>Go to any date</div>
        </div>
        <div className={styles.buttonRow}>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => router.push(`/day/${addDaysISO(today, -1)}`)}
          >
            <IconChevronLeft className={styles.icon} />
            Previous
          </button>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => router.push(`/day/${addDaysISO(today, 1)}`)}
          >
            <IconChevronRight className={styles.icon} />
            Next
          </button>
          <DatePicker value={jumpDate} onChange={setJumpDate} allowClear preferPlacement="top" />
          <button
            className={styles.button}
            type="button"
            onClick={() => router.push(`/day/${jumpDate}`)}
            disabled={!isISODateString(jumpDate)}
          >
            Go
          </button>
        </div>
      </section>

      <DayContent date={today} />
    </PageShell>
  );
}
