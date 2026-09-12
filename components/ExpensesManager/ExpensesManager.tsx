"use client";

import { useMemo, useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList/ExpenseList";
import { Filters } from "@/components/Filters/Filters";
import { Icon } from "@/components/Icon/Icon";
import { Modal } from "@/components/Modal/Modal";
import { useExpenses } from "@/hooks/useExpenses";
import type { Expense, ExpenseInput, Room } from "@/types/expense";
import { EMPTY_FILTERS, type ExpenseFiltersState } from "@/types/filters";
import { filterExpenses } from "@/utils/filters";

type ExpensesManagerProps = {
  title: string;
  lead?: string;
  room?: Room;
};

export function ExpensesManager({ title, lead, room }: ExpensesManagerProps) {
  const { ready, expenses, addExpense, updateExpense, deleteExpense, setStatus } =
    useExpenses();
  const [filters, setFilters] = useState<ExpenseFiltersState>(
    room ? { ...EMPTY_FILTERS, room } : EMPTY_FILTERS,
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const visible = useMemo(() => {
    const scoped = room
      ? expenses.filter((expense) => expense.room === room)
      : expenses;
    return filterExpenses(scoped, { ...filters, room: room ?? filters.room });
  }, [expenses, filters, room]);

  if (!ready) {
    return <p className="loading">Wczytywanie wydatków…</p>;
  }

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(expense: Expense) {
    setEditing(expense);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  function handleSubmit(input: ExpenseInput) {
    if (editing) {
      updateExpense(editing.id, input);
    } else {
      addExpense(input);
    }
    closeForm();
  }

  function handleDelete(expense: Expense) {
    const confirmed = window.confirm(`Usunąć wydatek „${expense.name}”?`);
    if (confirmed) deleteExpense(expense.id);
  }

  return (
    <>
      <div className="pageHeader">
        <div className="pageHeaderText">
          {room ? null : (
            <p className="kicker">
              <Icon name="list" size={14} />
              Lista zakupów
            </p>
          )}
          {room ? (
            <h2 className="pageTitle">{title}</h2>
          ) : (
            <h1 className="pageTitle">{title}</h1>
          )}
          {lead ? <p className="pageLead">{lead}</p> : null}
        </div>
        <button type="button" className="btn btnPrimary" onClick={openCreate}>
          <Icon name="plus" size={16} />
          Dodaj wydatek
        </button>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        hideRoom={Boolean(room)}
      />

      <ExpenseList
        expenses={visible}
        hideRoom={Boolean(room)}
        onEdit={openEdit}
        onDelete={handleDelete}
        onMarkBought={(expense) => setStatus(expense.id, "kupione")}
        onMarkPaid={(expense) => setStatus(expense.id, "zaplacone")}
        onMarkPlanned={(expense) => setStatus(expense.id, "planowane")}
      />

      <Modal
        title={editing ? "Edytuj wydatek" : "Nowy wydatek"}
        open={formOpen}
        onClose={closeForm}
      >
        <ExpenseForm
          initial={editing}
          defaultRoom={room}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>
    </>
  );
}
