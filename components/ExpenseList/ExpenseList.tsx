"use client";

import { ExpenseTable } from "@/components/ExpenseTable/ExpenseTable";
import { Icon } from "@/components/Icon/Icon";
import type { Expense } from "@/types/expense";
import { isSpent, sumCosts } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import styles from "./ExpenseList.module.css";

function formatCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (count === 1) return "1 pozycja";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} pozycje`;
  }
  return `${count} pozycji`;
}

type ExpenseListProps = {
  expenses: Expense[];
  hideRoom?: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onMarkBought: (expense: Expense) => void;
  onMarkPaid: (expense: Expense) => void;
  onMarkPlanned: (expense: Expense) => void;
};

export function ExpenseList({
  expenses,
  hideRoom = false,
  onEdit,
  onDelete,
  onMarkBought,
  onMarkPaid,
  onMarkPlanned,
}: ExpenseListProps) {
  const planned = expenses.filter((expense) => !isSpent(expense));
  const bought = expenses.filter(isSpent);
  const plannedTotal = sumCosts(
    planned.filter((expense) => expense.status !== "zrezygnowano"),
  );
  const boughtTotal = sumCosts(bought);

  const actions = {
    onEdit,
    onDelete,
    onMarkBought,
    onMarkPaid,
    onMarkPlanned,
  };

  if (expenses.length === 0) {
    return <p className={styles.empty}>Brak wydatków dla wybranych filtrów.</p>;
  }

  return (
    <div className={styles.board}>
      <section className={styles.panel}>
        <header className={styles.panelHead}>
          <div className={styles.title}>
            <span className={styles.glyph} aria-hidden="true">
              <Icon name="planned" size={18} />
            </span>
            <div>
              <p className={styles.kicker}>Do kupienia</p>
              <h2>Planowane</h2>
            </div>
          </div>
          <div className={styles.total}>
            <strong>{formatPLN(plannedTotal)}</strong>
            <span>{formatCount(planned.length)}</span>
          </div>
        </header>
        <ExpenseTable
          expenses={planned}
          hideRoom={hideRoom}
          emptyText="Wszystko z tej listy jest już kupione."
          variant="planned"
          {...actions}
        />
      </section>

      <section className={`${styles.panel} ${styles.bought}`}>
        <header className={styles.panelHead}>
          <div className={styles.title}>
            <span className={`${styles.glyph} ${styles.glyphBought}`} aria-hidden="true">
              <Icon name="check" size={18} />
            </span>
            <div>
              <p className={styles.kicker}>W domu / opłacone</p>
              <h2>Kupione</h2>
            </div>
          </div>
          <div className={styles.total}>
            <strong>{formatPLN(boughtTotal)}</strong>
            <span>{formatCount(bought.length)}</span>
          </div>
        </header>
        <ExpenseTable
          expenses={bought}
          hideRoom={hideRoom}
          emptyText="Kliknij „Kupione” po lewej — pozycja przeniesie się tutaj."
          variant="bought"
          {...actions}
        />
      </section>
    </div>
  );
}
