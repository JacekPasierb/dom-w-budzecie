"use client";

import {
  PRIORITY_LABELS,
  ROOM_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/data/labels";
import type { Expense } from "@/types/expense";
import { getLineCost } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import styles from "./ExpenseItem.module.css";

const PRIORITY_CLASS: Record<Expense["priority"], string> = {
  "must-start": "badgeMust",
  "worth-now": "badgeSoon",
  "can-wait": "badgeLater",
  luxury: "badgeLuxury",
};

const STATUS_CLASS: Record<Expense["status"], string> = {
  planowane: "",
  zamowione: "",
  kupione: "badgeBought",
  zaplacone: "badgePaid",
  odlozone: "badgeLater",
  zrezygnowano: "badgeDropped",
};

type ExpenseItemProps = {
  expense: Expense;
  hideRoom?: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onMarkBought: (expense: Expense) => void;
  onMarkPaid: (expense: Expense) => void;
};

export function ExpenseItem({
  expense,
  hideRoom = false,
  onEdit,
  onDelete,
  onMarkBought,
  onMarkPaid,
}: ExpenseItemProps) {
  const lineCost = getLineCost(expense);
  const showQuantity = expense.quantity > 1;

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <div>
          <h3 className={styles.name}>{expense.name}</h3>
          <p className={styles.meta}>
            {hideRoom ? null : `${ROOM_LABELS[expense.room]} · `}
            {TYPE_LABELS[expense.type]}
            {showQuantity ? ` · ×${expense.quantity}` : ""}
          </p>
        </div>
        <p className={styles.cost}>{formatPLN(lineCost)}</p>
      </div>

      <div className={styles.badges}>
        <span className={`badge ${PRIORITY_CLASS[expense.priority]}`}>
          {PRIORITY_LABELS[expense.priority]}
        </span>
        <span className={`badge ${STATUS_CLASS[expense.status]}`}>
          {STATUS_LABELS[expense.status]}
        </span>
      </div>

      <dl className={styles.prices}>
        <div>
          <dt>Plan</dt>
          <dd>{formatPLN(expense.plannedPrice)}</dd>
        </div>
        <div>
          <dt>Rzeczywisty</dt>
          <dd>
            {expense.actualPrice === null ? "—" : formatPLN(expense.actualPrice)}
          </dd>
        </div>
      </dl>

      <div className={styles.actions}>
        {expense.status !== "kupione" && expense.status !== "zaplacone" ? (
          <button
            type="button"
            className="btn btnSmall"
            onClick={() => onMarkBought(expense)}
          >
            Kupione
          </button>
        ) : null}
        {expense.status !== "zaplacone" ? (
          <button
            type="button"
            className="btn btnSmall"
            onClick={() => onMarkPaid(expense)}
          >
            Zapłacone
          </button>
        ) : null}
        <button type="button" className="btn btnSmall" onClick={() => onEdit(expense)}>
          Edytuj
        </button>
        <button
          type="button"
          className="btn btnSmall btnDanger"
          onClick={() => onDelete(expense)}
        >
          Usuń
        </button>
      </div>
    </article>
  );
}
