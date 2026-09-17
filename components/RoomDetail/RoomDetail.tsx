"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BudgetCard } from "@/components/BudgetCard/BudgetCard";
import { ExpensesManager } from "@/components/ExpensesManager/ExpensesManager";
import { Icon } from "@/components/Icon/Icon";
import { useExpenses } from "@/hooks/useExpenses";
import type { Room } from "@/types/expense";
import { getRoomSummary } from "@/utils/budget";
import { getRoomIcon, getRoomLabel } from "@/utils/rooms";
import styles from "./RoomDetail.module.css";

type RoomDetailProps = {
  room: Room;
};

export function RoomDetail({ room }: RoomDetailProps) {
  const router = useRouter();
  const { ready, expenses, rooms, deleteRoom } = useExpenses();

  if (!ready) {
    return <p className="loading">Wczytywanie pomieszczenia…</p>;
  }

  const exists = rooms.some((item) => item.id === room);
  if (!exists) {
    return (
      <>
        <p className={styles.back}>
          <Link href="/rooms">
            <Icon name="arrowLeft" size={16} />
            Wszystkie pomieszczenia
          </Link>
        </p>
        <p className="loading">Nie ma takiej strefy.</p>
      </>
    );
  }

  const summary = getRoomSummary(expenses, room);
  const label = getRoomLabel(room, rooms);

  function handleDelete() {
    if (rooms.length <= 1) {
      window.alert("Musi zostać przynajmniej jedna strefa.");
      return;
    }

    const count = expenses.filter((expense) => expense.room === room).length;
    const message =
      count > 0
        ? `Usunąć strefę „${label}”? ${count === 1 ? "1 wydatek" : `${count} wydatków`} trafi do innej strefy.`
        : `Usunąć strefę „${label}”?`;

    if (!window.confirm(message)) return;
    if (deleteRoom(room)) router.push("/rooms");
  }

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
          <Icon name={getRoomIcon(room)} size={22} />
        </span>
        <div>
          <p className="kicker">Strefa domu</p>
          <h1 className="pageTitle">{label}</h1>
        </div>
        {rooms.length > 1 ? (
          <button type="button" className="btn btnDanger" onClick={handleDelete}>
            <Icon name="trash" size={16} />
            Usuń strefę
          </button>
        ) : null}
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
