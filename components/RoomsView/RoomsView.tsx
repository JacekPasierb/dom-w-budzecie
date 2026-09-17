"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon/Icon";
import { Modal } from "@/components/Modal/Modal";
import { RoomCard } from "@/components/RoomCard/RoomCard";
import { useExpenses } from "@/hooks/useExpenses";
import { getAllRoomSummaries } from "@/utils/budget";
import { getRoomLabel } from "@/utils/rooms";
import styles from "./RoomsView.module.css";

export function RoomsView() {
  const { ready, expenses, rooms, addRoom, deleteRoom } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  if (!ready) {
    return <p className="loading">Wczytywanie pomieszczeń…</p>;
  }

  const summaries = getAllRoomSummaries(expenses, rooms);

  function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = addRoom(name);
    if (!created) {
      setError("Podaj unikalną nazwę strefy.");
      return;
    }
    setName("");
    setError("");
    setFormOpen(false);
  }

  function handleDelete(id: string) {
    if (rooms.length <= 1) {
      window.alert("Musi zostać przynajmniej jedna strefa.");
      return;
    }

    const label = getRoomLabel(id, rooms);
    const count = expenses.filter((expense) => expense.room === id).length;
    const message =
      count > 0
        ? `Usunąć strefę „${label}”? ${count === 1 ? "1 wydatek" : `${count} wydatków`} trafi do innej strefy.`
        : `Usunąć strefę „${label}”?`;

    if (!window.confirm(message)) return;
    deleteRoom(id);
  }

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
            Dodawaj i usuwaj strefy. Wejdź w wybraną, żeby zobaczyć tylko jej
            wydatki.
          </p>
        </div>
        <button
          type="button"
          className="btn btnPrimary"
          onClick={() => {
            setError("");
            setFormOpen(true);
          }}
        >
          <Icon name="plus" size={16} />
          Dodaj strefę
        </button>
      </div>

      {summaries.length === 0 ? (
        <p className={styles.empty}>Nie masz jeszcze żadnej strefy.</p>
      ) : (
        <div className={styles.grid}>
          {summaries.map((summary) => (
            <RoomCard
              key={summary.room}
              summary={summary}
              label={getRoomLabel(summary.room, rooms)}
              onDelete={
                rooms.length > 1 ? () => handleDelete(summary.room) : undefined
              }
            />
          ))}
        </div>
      )}

      <Modal
        title="Nowa strefa"
        open={formOpen}
        onClose={() => setFormOpen(false)}
      >
        <form className={styles.form} onSubmit={handleAdd}>
          {error ? <p className={styles.error}>{error}</p> : null}
          <label className="field">
            <span>Nazwa</span>
            <input
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="np. Taras, pralnia, kotłownia"
              autoFocus
            />
          </label>
          <div className={styles.formActions}>
            <button
              type="button"
              className="btn"
              onClick={() => setFormOpen(false)}
            >
              Anuluj
            </button>
            <button type="submit" className="btn btnPrimary">
              <Icon name="plus" size={16} />
              Dodaj
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
