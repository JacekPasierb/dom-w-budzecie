"use client";

import { Icon } from "@/components/Icon/Icon";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/data/labels";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense } from "@/types/expense";
import { getLineCost } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import { getRoomLabel } from "@/utils/rooms";
import styles from "./ExpenseTable.module.css";

type ExpenseTableProps = {
  expenses: Expense[];
  hideRoom?: boolean;
  emptyText: string;
  variant: "planned" | "bought";
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onMarkBought: (expense: Expense) => void;
  onMarkPaid: (expense: Expense) => void;
  onMarkPlanned: (expense: Expense) => void;
};

export function ExpenseTable({
  expenses,
  hideRoom = false,
  emptyText,
  variant,
  onEdit,
  onDelete,
  onMarkBought,
  onMarkPaid,
  onMarkPlanned,
}: ExpenseTableProps) {
  const { rooms } = useExpenses();

  if (expenses.length === 0) {
    return <p className={styles.empty}>{emptyText}</p>;
  }

  return (
    <ul className={styles.list}>
      {expenses.map((expense) => (
        <li key={expense.id} className={styles.row}>
          <div className={styles.info}>
            <h3>{expense.name}</h3>
            <p>
              {hideRoom ? null : `${getRoomLabel(expense.room, rooms)} · `}
              {TYPE_LABELS[expense.type]}
              {expense.quantity > 1 ? ` · ×${expense.quantity}` : ""}
            </p>
            <div className={styles.tags}>
              <span className="badge">{PRIORITY_LABELS[expense.priority]}</span>
              <span
                className={
                  variant === "bought" ? "badge badgeBought" : "badge"
                }
              >
                {STATUS_LABELS[expense.status]}
              </span>
            </div>
          </div>

          <div className={styles.price}>
            <strong>{formatPLN(getLineCost(expense))}</strong>
            {expense.actualPrice !== null ? (
              <span>plan {formatPLN(expense.plannedPrice)}</span>
            ) : (
              <span>cena planowana</span>
            )}
          </div>

          <div className={styles.side}>
            {variant === "planned" ? (
              expense.status !== "zrezygnowano" ? (
                <button
                  type="button"
                  className="btn btnPrimary btnSmall"
                  onClick={() => onMarkBought(expense)}
                >
                  <Icon name="cart" size={14} />
                  Kupione
                </button>
              ) : null
            ) : (
              <button
                type="button"
                className="btn btnSmall"
                onClick={() => onMarkPlanned(expense)}
              >
                <Icon name="undo" size={14} />
                Wróć
              </button>
            )}
            <div className={styles.links}>
              {expense.status !== "zaplacone" ? (
                <button type="button" onClick={() => onMarkPaid(expense)}>
                  <Icon name="paid" size={13} />
                  Zapłacone
                </button>
              ) : null}
              <button type="button" onClick={() => onEdit(expense)}>
                <Icon name="edit" size={13} />
                Edytuj
              </button>
              <button
                type="button"
                className={styles.danger}
                onClick={() => onDelete(expense)}
              >
                <Icon name="trash" size={13} />
                Usuń
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
