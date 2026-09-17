"use client";

import { useState, type FormEvent } from "react";
import {
  CERTAINTY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/data/labels";
import type {
  Expense,
  ExpenseInput,
  ExpensePriority,
  ExpenseStatus,
  ExpenseType,
  PriceCertainty,
  Room,
} from "@/types/expense";
import {
  EXPENSE_PRIORITIES,
  EXPENSE_STATUSES,
  EXPENSE_TYPES,
  PRICE_CERTAINTIES,
} from "@/types/expense";
import { Icon } from "@/components/Icon/Icon";
import { useExpenses } from "@/hooks/useExpenses";
import { parseAmount } from "@/utils/currency";
import styles from "./ExpenseForm.module.css";

type ExpenseFormProps = {
  initial?: Expense | null;
  defaultRoom?: Room;
  onSubmit: (input: ExpenseInput) => void;
  onCancel: () => void;
};

type FormState = {
  name: string;
  room: Room;
  plannedPrice: string;
  actualPrice: string;
  quantity: string;
  status: ExpenseStatus;
  priority: ExpensePriority;
  type: ExpenseType;
  note: string;
  priceCertainty: PriceCertainty;
};

function toFormState(
  expense: Expense | null | undefined,
  defaultRoom: Room | undefined,
  fallbackRoom: Room,
): FormState {
  return {
    name: expense?.name ?? "",
    room: expense?.room ?? defaultRoom ?? fallbackRoom,
    plannedPrice: expense ? String(expense.plannedPrice) : "",
    actualPrice:
      expense?.actualPrice === null || expense?.actualPrice === undefined
        ? ""
        : String(expense.actualPrice),
    quantity: String(expense?.quantity ?? 1),
    status: expense?.status ?? "planowane",
    priority: expense?.priority ?? "must-start",
    type: expense?.type ?? "inne",
    note: expense?.note ?? "",
    priceCertainty: expense?.priceCertainty ?? "estimated",
  };
}

export function ExpenseForm({
  initial,
  defaultRoom,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const { rooms } = useExpenses();
  const fallbackRoom = rooms[0]?.id ?? "inne";
  const [form, setForm] = useState<FormState>(() =>
    toFormState(initial, defaultRoom, fallbackRoom),
  );
  const [error, setError] = useState("");
  const selectedRoom = rooms.some((item) => item.id === form.room)
    ? form.room
    : fallbackRoom;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const plannedPrice = parseAmount(form.plannedPrice);
    const actualPrice = parseAmount(form.actualPrice);
    const quantity = Number(form.quantity);

    if (!name) {
      setError("Podaj nazwę wydatku.");
      return;
    }

    if (plannedPrice === null || plannedPrice < 0) {
      setError("Podaj poprawną cenę planowaną.");
      return;
    }

    if (form.actualPrice.trim() !== "" && (actualPrice === null || actualPrice < 0)) {
      setError("Podaj poprawną cenę rzeczywistą albo zostaw puste pole.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Ilość musi być liczbą całkowitą większą od 0.");
      return;
    }

    const room = rooms.some((item) => item.id === form.room)
      ? form.room
      : fallbackRoom;

    if (!room || !rooms.some((item) => item.id === room)) {
      setError("Dodaj najpierw pomieszczenie.");
      return;
    }

    onSubmit({
      name,
      room,
      plannedPrice,
      actualPrice,
      quantity,
      status: form.status,
      priority: form.priority,
      type: form.type,
      note: form.note.trim(),
      priceCertainty: form.priceCertainty,
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error ? <p className={styles.error}>{error}</p> : null}

      <label className="field">
        <span>Nazwa</span>
        <input
          className="input"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          placeholder="np. Piekarnik Bosch"
          required
        />
      </label>

      <div className={styles.grid}>
        <label className="field">
          <span>Pomieszczenie</span>
          <select
            className="select"
            value={selectedRoom}
            onChange={(event) => update("room", event.target.value as Room)}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Typ wydatku</span>
          <select
            className="select"
            value={form.type}
            onChange={(event) => update("type", event.target.value as ExpenseType)}
          >
            {EXPENSE_TYPES.map((type) => (
              <option key={type} value={type}>
                {TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.grid}>
        <label className="field">
          <span>Cena planowana (za szt.)</span>
          <input
            className="input"
            inputMode="decimal"
            value={form.plannedPrice}
            onChange={(event) => update("plannedPrice", event.target.value)}
            placeholder="1800"
            required
          />
        </label>

        <label className="field">
          <span>Cena rzeczywista (za szt.)</span>
          <input
            className="input"
            inputMode="decimal"
            value={form.actualPrice}
            onChange={(event) => update("actualPrice", event.target.value)}
            placeholder="puste, dopóki nie kupisz"
          />
        </label>
      </div>

      <div className={styles.grid}>
        <label className="field">
          <span>Ilość</span>
          <input
            className="input"
            type="number"
            min={1}
            step={1}
            value={form.quantity}
            onChange={(event) => update("quantity", event.target.value)}
          />
        </label>

        <label className="field">
          <span>Pewność ceny</span>
          <select
            className="select"
            value={form.priceCertainty}
            onChange={(event) =>
              update("priceCertainty", event.target.value as PriceCertainty)
            }
          >
            {PRICE_CERTAINTIES.map((certainty) => (
              <option key={certainty} value={certainty}>
                {CERTAINTY_LABELS[certainty]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.grid}>
        <label className="field">
          <span>Status</span>
          <select
            className="select"
            value={form.status}
            onChange={(event) => update("status", event.target.value as ExpenseStatus)}
          >
            {EXPENSE_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Priorytet</span>
          <select
            className="select"
            value={form.priority}
            onChange={(event) =>
              update("priority", event.target.value as ExpensePriority)
            }
          >
            {EXPENSE_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Notatka</span>
        <textarea
          className="textarea"
          value={form.note}
          onChange={(event) => update("note", event.target.value)}
          placeholder="np. kupione w Castoramie, kolor dąb"
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className="btn" onClick={onCancel}>
          Anuluj
        </button>
        <button type="submit" className="btn btnPrimary">
          <Icon name={initial ? "check" : "plus"} size={16} />
          {initial ? "Zapisz zmiany" : "Dodaj wydatek"}
        </button>
      </div>
    </form>
  );
}
