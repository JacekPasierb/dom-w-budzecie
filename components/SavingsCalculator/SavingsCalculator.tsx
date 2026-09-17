"use client";

import { useMemo, useState } from "react";
import { PRIORITY_LABELS } from "@/data/labels";
import { useExpenses } from "@/hooks/useExpenses";
import { getLineCost, getOptionalOpenExpenses, sumCosts } from "@/utils/budget";
import { formatPLN } from "@/utils/currency";
import { getRoomLabel } from "@/utils/rooms";
import styles from "./SavingsCalculator.module.css";

export function SavingsCalculator() {
  const { expenses, rooms, summary } = useExpenses();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const optional = useMemo(() => getOptionalOpenExpenses(expenses), [expenses]);
  const selected = optional.filter((expense) => selectedIds.includes(expense.id));
  const selectedTotal = sumCosts(selected);

  function toggle(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <section>
      <div className={styles.hero}>
        <p className={styles.kicker}>Co mogę odłożyć?</p>
        <p className={styles.total}>
          Możesz zaoszczędzić do {formatPLN(summary.potentialSavings)}, odkładając
          wszystkie opcjonalne rzeczy.
        </p>
      </div>

      {optional.length === 0 ? (
        <p className={styles.empty}>
          Nie masz teraz otwartych wydatków z priorytetem „Może poczekać” albo
          „Luksus / opcja”.
        </p>
      ) : (
        <>
          <div className={styles.selectedBox}>
            {selected.length === 0
              ? "Zaznacz wydatki, żeby zobaczyć, ile dodatkowo zostanie w budżecie."
              : `Jeżeli odłożysz zaznaczone rzeczy, zostanie Ci dodatkowo ${formatPLN(selectedTotal)}.`}
          </div>

          <ul className={styles.list}>
            {optional.map((expense) => (
              <li key={expense.id}>
                <label className={styles.item}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(expense.id)}
                    onChange={() => toggle(expense.id)}
                  />
                  <span className={styles.body}>
                    <strong>{expense.name}</strong>
                    <span>
                      {getRoomLabel(expense.room, rooms)} · {PRIORITY_LABELS[expense.priority]}
                    </span>
                  </span>
                  <span className={styles.amount}>{formatPLN(getLineCost(expense))}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
