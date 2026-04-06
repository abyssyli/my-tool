"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import styles from "./planner.module.css";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <IconApp className={styles.brandIcon} size={36} />
          <div className={styles.brandText}>
            <div className={styles.title}>{title}</div>
            {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
          </div>
        </div>
        <nav className={styles.nav}>
          <Link className={pathname === "/" ? styles.navActive : styles.navLink} href="/">
            <IconHome className={styles.icon} />
            Today
          </Link>
          <Link className={pathname === "/week" ? styles.navActive : styles.navLink} href="/week">
            <IconWeek className={styles.icon} />
            Week
          </Link>
          <Link className={pathname === "/new" ? styles.navActive : styles.navLink} href="/new">
            <IconPlus className={styles.icon} />
            New
          </Link>
          </Link>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
