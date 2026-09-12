"use client";

import { Icon } from "@/components/Icon/Icon";
import { RoomCard } from "@/components/RoomCard/RoomCard";
import { useExpenses } from "@/hooks/useExpenses";
import { getAllRoomSummaries } from "@/utils/budget";
import styles from "./RoomsView.module.css";

export function RoomsView() {
  const { ready, expenses } = useExpenses();

  if (!ready) {
    return <p className="loading">Wczytywanie pomieszczeń…</p>;
  }

  const rooms = getAllRoomSummaries(expenses);

  return (
    <>
      <div className="pageHeader">
        <div className="pageHeaderText">
          <p className="kicker">
            <Icon name="rooms" size={14} />
            Plan domu
          </p>
          <h1 className="pageTitle">Pomieszczenia</h1>
          <p className="pageLead">
            Wejdź w strefę jak w rzut — zobaczysz tylko jej wydatki i ile jeszcze
            zostaje na wykończenie.
          </p>
        </div>
      </div>
      <div className={styles.grid}>
        {rooms.map((summary) => (
          <RoomCard key={summary.room} summary={summary} />
        ))}
      </div>
    </>
  );
}
