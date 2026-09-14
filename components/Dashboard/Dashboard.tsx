"use client";

import { useState } from "react";
import { BudgetCard } from "@/components/BudgetCard/BudgetCard";
import { BudgetProgress } from "@/components/BudgetProgress/BudgetProgress";
import { ExpenseForm } from "@/components/ExpenseForm/ExpenseForm";
import { Icon } from "@/components/Icon/Icon";
import { Modal } from "@/components/Modal/Modal";
import { useExpenses } from "@/hooks/useExpenses";
import type { ExpenseInput } from "@/types/expense";
import { formatPLN } from "@/utils/currency";
import styles from "./Dashboard.module.css";

export function Dashboard() {
  const { ready, summary, addExpense } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);

  if (!ready) {
    return <p className="loading">Wczytywanie budżetu…</p>;
  }

  function handleAdd(input: ExpenseInput) {
    addExpense(input);
    setFormOpen(false);
  }

  const remainingTone =
    summary.remaining < 0 ? "danger" : summary.isUsingReserve ? "warning" : "safe";
  const safeTone = summary.safeAvailable < 0 ? "danger" : "safe";

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className="kicker">
            <Icon name="spark" size={14} />
            Pracownia budżetu
          </p>
          <h1 className="pageTitle">Wykończenie domu, jeden rzut oka.</h1>
          <p className="pageLead">
            Śledź planowane i kupione wydatki na wykończenie. Każda zmiana od razu
            pokazuje, ile jeszcze zostaje w budżecie i czy ruszasz rezerwę.
          </p>
          <button
            type="button"
            className="btn btnPrimary"
            onClick={() => setFormOpen(true)}
          >
            <Icon name="plus" size={16} />
            Dodaj wydatek
          </button>
        </div>

        <div className={`${styles.remain} ${styles[remainingTone]}`}>
          <p className={styles.remainLabel}>
            <Icon name="remaining" size={16} />
            Zostało z budżetu
          </p>
          <p className={styles.remainValue}>{formatPLN(summary.remaining)}</p>
          <p className={styles.remainHint}>
            {summary.isOverBudget
              ? `Przekroczenie o ${formatPLN(summary.overBudgetBy)}`
              : summary.isUsingReserve
                ? "Zaczynasz ruszać rezerwę"
                : "Rezerwa nadal nietknięta"}
          </p>
        </div>
      </section>

      {summary.isOverBudget ? (
        <p className="alert alertDanger">
          <Icon name="spent" size={18} />
          Przekraczasz budżet o {formatPLN(summary.overBudgetBy)}
        </p>
      ) : null}

      {summary.isUsingReserve ? (
        <p className="alert alertWarning">
          <Icon name="reserve" size={18} />
          Zaczynasz wykorzystywać rezerwę.
        </p>
      ) : null}

      <BudgetProgress
        used={summary.predictedTotal}
        total={summary.totalBudget}
        percent={summary.percent}
        state={summary.progressState}
      />

      <div className="cardsGrid">
        <BudgetCard icon="budget" label="Budżet całkowity" value={summary.totalBudget} />
        <BudgetCard
          icon="spent"
          label="Wydane"
          value={summary.spent}
          hint="Kupione i zapłacone"
        />
        <BudgetCard
          icon="planned"
          label="Planowane"
          value={summary.planned}
          hint="Jeszcze niekupione"
        />
        <BudgetCard
          icon="list"
          label="Przewidywany koszt"
          value={summary.predictedTotal}
        />
        <BudgetCard icon="reserve" label="Rezerwa" value={summary.reserve} />
        <BudgetCard
          icon="safe"
          label="Bezpiecznie dostępne"
          value={summary.safeAvailable}
          hint="Pozostało minus rezerwa"
          tone={safeTone}
        />
      </div>

      <Modal title="Nowy wydatek" open={formOpen} onClose={() => setFormOpen(false)}>
        <ExpenseForm onSubmit={handleAdd} onCancel={() => setFormOpen(false)} />
      </Modal>
    </>
  );
}
