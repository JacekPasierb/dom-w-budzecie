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
import { useAuth } from "@clerk/nextjs";
import type {
  AppSettings,
  Expense,
  ExpenseInput,
  ExpenseStatus,
  RoomDefinition,
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
import { fallbackRoomId, uniqueRoomId } from "@/utils/rooms";

type ExpensesContextValue = {
  ready: boolean;
  storageSource: "mongo" | "local";
  storageError: string | null;
  expenses: Expense[];
  rooms: RoomDefinition[];
  settings: AppSettings;
  summary: BudgetSummary;
  addExpense: (input: ExpenseInput) => void;
  updateExpense: (id: string, input: ExpenseInput) => void;
  deleteExpense: (id: string) => void;
  setStatus: (id: string, status: ExpenseStatus) => void;
  addRoom: (name: string) => string | null;
  deleteRoom: (id: string) => boolean;
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
  const { isLoaded, userId } = useAuth();
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
    if (!isLoaded || !userId) return;
    void hydrateBudgetStore(true);
  }, [isLoaded, userId]);

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

  const addRoom = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return null;

    const current = getBudgetSnapshot();
    const duplicate = current.rooms.some(
      (room) => room.name.trim().toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) return null;

    const id = uniqueRoomId(trimmed, current.rooms);
    setBudgetSnapshot({
      ...current,
      rooms: [...current.rooms, { id, name: trimmed }],
    });
    return id;
  }, []);

  const deleteRoom = useCallback((id: string) => {
    const current = getBudgetSnapshot();
    const fallback = fallbackRoomId(current.rooms, id);
    if (!fallback) return false;

    setBudgetSnapshot({
      ...current,
      rooms: current.rooms.filter((room) => room.id !== id),
      expenses: current.expenses.map((expense) =>
        expense.room === id ? { ...expense, room: fallback } : expense,
      ),
    });
    return true;
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
      rooms: state.rooms,
      settings: state.settings,
      summary,
      addExpense,
      updateExpense,
      deleteExpense,
      setStatus,
      addRoom,
      deleteRoom,
      updateSettings,
      resetData,
      importData,
    }),
    [
      ready,
      storageSource,
      storageError,
      state.expenses,
      state.rooms,
      state.settings,
      summary,
      addExpense,
      updateExpense,
      deleteExpense,
      setStatus,
      addRoom,
      deleteRoom,
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
