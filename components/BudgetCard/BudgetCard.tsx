"use client";

import { Icon, type IconName } from "@/components/Icon/Icon";
import { formatPLN } from "@/utils/currency";
import styles from "./BudgetCard.module.css";

type Tone = "default" | "safe" | "warning" | "danger";

type BudgetCardProps = {
  label: string;
  value: number;
  hint?: string;
  tone?: Tone;
  icon?: IconName;
};

export function BudgetCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: BudgetCardProps) {
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <div className={styles.top}>
        {icon ? (
          <span className={styles.iconWrap} aria-hidden="true">
            <Icon name={icon} size={18} />
          </span>
        ) : null}
        <p className={styles.label}>{label}</p>
      </div>
      <p className={styles.value}>{formatPLN(value)}</p>
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </article>
  );
}
