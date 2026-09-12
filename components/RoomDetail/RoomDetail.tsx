"use client";

import Link from "next/link";
import { BudgetCard } from "@/components/BudgetCard/BudgetCard";
import { ExpensesManager } from "@/components/ExpensesManager/ExpensesManager";
import { Icon } from "@/components/Icon/Icon";
import { ROOM_LABELS } from "@/data/labels";
import { ROOM_ICONS } from "@/data/roomIcons";
import { useExpenses } from "@/hooks/useExpenses";
import type { Room } from "@/types/expense";
import { getRoomSummary } from "@/utils/budget";
import styles from "./RoomDetail.module.css";

type RoomDetailProps = {
  room: Room;
};

export function RoomDetail({ room }: RoomDetailProps) {
  const { ready, expenses } = useExpenses();

  if (!ready) {
    return <p className="loading">Wczytywanie pomieszczenia…</p>;
  }

  const summary = getRoomSummary(expenses, room);
  const label = ROOM_LABELS[room];

  return (
    <>
      <p className={styles.back}>
        <Link href="/rooms">
          <Icon name="arrowLeft" size={16} />
          Wszystkie pomieszczenia
        </Link>
      </p>
      <div className={styles.titleRow}>
        <span className={styles.mark} aria-hidden="true">
          <Icon name={ROOM_ICONS[room]} size={22} />
        </span>
        <div>
          <p className="kicker">Strefa domu</p>
          <h1 className="pageTitle">{label}</h1>
        </div>
      </div>
      <div className="cardsGrid">
        <BudgetCard icon="planned" label="Planowany budżet" value={summary.predicted} />
        <BudgetCard icon="spent" label="Wydane" value={summary.spent} />
        <BudgetCard icon="remaining" label="Pozostało" value={summary.remaining} />
        <article className={styles.counts}>
          <p>
            <Icon name="check" size={16} />
            Obowiązkowe: {summary.requiredCount}
          </p>
          <p>
            <Icon name="spark" size={16} />
            Opcjonalne: {summary.optionalCount}
          </p>
        </article>
      </div>
      <div className={styles.list}>
        <ExpensesManager
          title="Wydatki tej strefy"
          lead="Lista tylko dla tego pomieszczenia — planowane po lewej, kupione po prawej."
          room={room}
        />
      </div>
    </>
  );
}
