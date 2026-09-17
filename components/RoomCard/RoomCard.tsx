"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon/Icon";
import { getRoomIcon, getRoomTone } from "@/utils/rooms";
import type { RoomSummary } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import styles from "./RoomCard.module.css";

function formatExpenseCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return "1 wydatek";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} wydatki`;
  }
  return `${count} wydatków`;
}

type RoomCardProps = {
  summary: RoomSummary;
  label: string;
  onDelete?: () => void;
};

export function RoomCard({ summary, label, onDelete }: RoomCardProps) {
  const tone = getRoomTone(summary.room);
  const used =
    summary.predicted > 0
      ? Math.min(100, Math.round((summary.spent / summary.predicted) * 100))
      : 0;

  return (
    <div className={`${styles.card} ${styles[tone]}`}>
      <Link href={`/rooms/${encodeURIComponent(summary.room)}`} className={styles.link}>
        <div className={styles.head}>
          <span className={styles.icon} aria-hidden="true">
            <Icon name={getRoomIcon(summary.room)} size={20} />
          </span>
          <h2>{label}</h2>
        </div>
        <dl>
          <div>
            <dt>Plan</dt>
            <dd>{formatPLN(summary.predicted)}</dd>
          </div>
          <div>
            <dt>Wydane</dt>
            <dd>{formatPLN(summary.spent)}</dd>
          </div>
          <div>
            <dt>Zostaje</dt>
            <dd>{formatPLN(summary.remaining)}</dd>
          </div>
        </dl>
        <div className={styles.bar} aria-hidden="true">
          <span style={{ width: `${used}%` }} />
        </div>
        <p className={styles.meta}>
          {formatExpenseCount(summary.expenseCount)}
          {" · "}
          must: {summary.requiredCount}
          {" · "}
          opcje: {summary.optionalCount}
        </p>
      </Link>
      {onDelete ? (
        <button
          type="button"
          className={styles.delete}
          onClick={onDelete}
          aria-label={`Usuń strefę ${label}`}
        >
          <Icon name="trash" size={16} />
        </button>
      ) : null}
    </div>
  );
}
