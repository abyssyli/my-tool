"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

import { DayContent } from "@/app/components/DayContent";
import { IconCalendar, IconChevronLeft, IconChevronRight, IconSpark } from "@/app/components/Icons";
import { PageShell } from "@/app/components/PageShell";
import styles from "@/app/components/planner.module.css";
import { addDaysISO, formatDisplayDate, isISODateString, todayISO } from "@/lib/dateUtils";

export function DayClient({ date }: { date: string }) {
  const router = useRouter();
  const today = useMemo(() => todayISO(), []);
  const [jumpDate, setJumpDate] = useState(isISODateString(date) ? date : today);

  if (!isISODateString(date)) {
    return (
      <PageShell title="Invalid Date" subtitle={`URL param: ${date}`}>
        <section className={styles.card}>
          <div className={styles.cardTitleRow}>
            <div className={styles.cardTitleWithIcon}>
              <IconCalendar className={styles.icon} />
              <span className={styles.cardTitle}>Cannot parse date</span>
            </div>
            <div className={styles.muted}>Expected YYYY-MM-DD</div>
          </div>
          <div className={styles.buttonRow}>
            <Link className={styles.buttonSecondary} href="/">
              Back to Home
            </Link>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell title="Day" subtitle={formatDisplayDate(date)}>
      <section className={styles.card}>
        <div className={styles.cardTitleRow}>
          <div className={styles.cardTitleWithIcon}>
            <IconSpark className={styles.icon} />
            <span className={styles.cardTitle}>Navigation</span>
          </div>
          <div className={styles.muted}>Previous / next day · jump</div>
        </div>
        <div className={styles.buttonRow}>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => router.push(`/day/${addDaysISO(date, -1)}`)}
          >
            <IconChevronLeft className={styles.icon} />
            Previous
          </button>
          <button
            className={styles.buttonSecondary}
            type="button"
            onClick={() => router.push(`/day/${addDaysISO(date, 1)}`)}
          >
            <IconChevronRight className={styles.icon} />
            Next
          </button>
          <Link className={styles.buttonSecondary} href="/">
            Today
          </Link>
          <input
            className={styles.input}
            type="date"
            value={jumpDate}
            onChange={(e) => setJumpDate(e.target.value)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={() => router.push(`/day/${jumpDate}`)}
          >
            Go
          </button>
        </div>
      </section>

      <DayContent date={date} />
    </PageShell>
  );
}
