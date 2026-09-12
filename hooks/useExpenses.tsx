"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  AppSettings,
  Expense,
  ExpenseInput,
  ExpenseStatus,
  StoredData,
} from "@/types/expense";
import { calculateBudget, type BudgetSummary } from "@/utils/budget";
import {
  getBudgetSnapshot,
  getServerBudgetSnapshot,
  getServerLoaded,
  getServerStorageError,
  getStorageError,
  getStorageSource,
  getStoreLoaded,
  hydrateBudgetStore,
  setBudgetSnapshot,
  subscribeBudgetStore,
} from "@/utils/budgetStore";
import { getInitialState } from "@/utils/storage";

type ExpensesContextValue = {
  ready: boolean;
  storageSource: "mongo" | "local";
  storageError: string | null;
  expenses: Expense[];
  settings: AppSettings;
  summary: BudgetSummary;
  addExpense: (input: ExpenseInput) => void;
  updateExpense: (id: string, input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
  setStatus: (id: string, status: ExpenseStatus) => void;
  updateSettings: (next: AppSettings) => void;
  resetData: () => void;
  importData: (data: StoredData) => void;
};

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

function createId(): string {
  return crypto.randomUUID();
}

function getServerStorageSource(): "mongo" | "local" {
  return "local";
}

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const ready = useSyncExternalStore(
    subscribeBudgetStore,
    getStoreLoaded,
    getServerLoaded,
  );
  const storageSource = useSyncExternalStore(
    subscribeBudgetStore,
    getStorageSource,
    getServerStorageSource,
  );
  const storageError = useSyncExternalStore(
    subscribeBudgetStore,
    getStorageError,
    getServerStorageError,
  );
  const state = useSyncExternalStore(
    subscribeBudgetStore,
    getBudgetSnapshot,
    getServerBudgetSnapshot,
  );

  useEffect(() => {
    void hydrateBudgetStore();
  }, []);

  const addExpense = useCallback((input: ExpenseInput) => {
    const current = getBudgetSnapshot();
    setBudgetSnapshot({
      ...current,
      expenses: [{ ...input, id: createId() }, ...current.expenses],
    });
  }, []);

  const updateExpense = useCallback((id: string, input: ExpenseInput) => {
    const current = getBudgetSnapshot();
    setBudgetSnapshot({
      ...current,
      expenses: current.expenses.map((expense) =>
        expense.id === id ? { ...input, id } : expense,
      ),
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    const current = getBudgetSnapshot();
    setBudgetSnapshot({
      ...current,
      expenses: current.expenses.filter((expense) => expense.id !== id),
    });
  }, []);

  const setStatus = useCallback((id: string, status: ExpenseStatus) => {
    const current = getBudgetSnapshot();
    setBudgetSnapshot({
      ...current,
      expenses: current.expenses.map((expense) =>
        expense.id === id ? { ...expense, status } : expense,
      ),
    });
  }, []);

  const updateSettings = useCallback((next: AppSettings) => {
    const current = getBudgetSnapshot();
    setBudgetSnapshot({
      ...current,
      settings: next,
    });
  }, []);

  const resetData = useCallback(() => {
    setBudgetSnapshot(getInitialState());
  }, []);

  const importData = useCallback((data: StoredData) => {
    setBudgetSnapshot(data);
  }, []);

  const summary = useMemo(
    () => calculateBudget(state.expenses, state.settings),
    [state.expenses, state.settings],
  );

  const value = useMemo(
    () => ({
      ready,
      storageSource,
      storageError,
      expenses: state.expenses,
      settings: state.settings,
      summary,
      addExpense,
      updateExpense,
      deleteExpense,
      setStatus,
      updateSettings,
      resetData,
      importData,
    }),
    [
      ready,
      storageSource,
      storageError,
      state.expenses,
      state.settings,
      summary,
      addExpense,
      updateExpense,
      deleteExpense,
      setStatus,
      updateSettings,
      resetData,
      importData,
    ],
  );

  return (
    <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
  );
}

export function useExpenses(): ExpensesContextValue {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses musi być użyty wewnątrz ExpensesProvider");
  }
  return context;
}
