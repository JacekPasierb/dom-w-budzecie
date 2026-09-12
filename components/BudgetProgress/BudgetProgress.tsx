"use client";

import type { ProgressState } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import styles from "./BudgetProgress.module.css";

const STATE_LABEL: Record<ProgressState, string> = {
  safe: "Bezpiecznie",
  near: "Blisko limitu",
  over: "Przekroczony budżet",
};

type BudgetProgressProps = {
  used: number;
  total: number;
  percent: number;
  state: ProgressState;
};

export function BudgetProgress({
  used,
  total,
  percent,
  state,
}: BudgetProgressProps) {
  const width = Math.min(100, Math.max(0, percent));

  return (
    <section className={styles.wrap} aria-label="Postęp budżetu">
      <div className={styles.top}>
        <div>
          <p className={styles.kicker}>Warstwa budżetu</p>
          <p className={styles.amount}>
            {formatPLN(used)} <span>/ {formatPLN(total)}</span>
          </p>
        </div>
        <p className={`${styles.state} ${styles[state]}`}>
          {Math.round(percent)}% · {STATE_LABEL[state]}
        </p>
      </div>
      <div className={styles.track} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <div
          className={`${styles.fill} ${styles[state]}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </section>
  );
}
