import { DEFAULT_SETTINGS } from "@/data/defaults";
import { INITIAL_EXPENSES } from "@/data/initialExpenses";
import type {
  AppSettings,
  Expense,
  ExpensePriority,
  ExpenseStatus,
  ExpenseType,
  PriceCertainty,
  Room,
  StoredData,
} from "@/types/expense";
import {
  EXPENSE_PRIORITIES,
  EXPENSE_STATUSES,
  EXPENSE_TYPES,
  PRICE_CERTAINTIES,
  ROOMS,
} from "@/types/expense";

export const STORAGE_KEY = "dom-budzet-v1";

function isRoom(value: unknown): value is Room {
  return typeof value === "string" && (ROOMS as readonly string[]).includes(value);
}

function isStatus(value: unknown): value is ExpenseStatus {
  return (
    typeof value === "string" &&
    (EXPENSE_STATUSES as readonly string[]).includes(value)
  );
}

function isPriority(value: unknown): value is ExpensePriority {
  return (
    typeof value === "string" &&
    (EXPENSE_PRIORITIES as readonly string[]).includes(value)
  );
}

function isType(value: unknown): value is ExpenseType {
  return (
    typeof value === "string" &&
    (EXPENSE_TYPES as readonly string[]).includes(value)
  );
}

function isCertainty(value: unknown): value is PriceCertainty {
  return (
    typeof value === "string" &&
    (PRICE_CERTAINTIES as readonly string[]).includes(value)
  );
}

function toAmount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const amount = Number(value.trim().replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(amount) ? amount : null;
  }
  return null;
}

function normalizeExpense(value: unknown): Expense | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || typeof item.name !== "string") return null;
  if (!isRoom(item.room)) return null;

  const plannedPrice = toAmount(item.plannedPrice);
  if (plannedPrice === null) return null;

  const actualPrice =
    item.actualPrice === null ||
    item.actualPrice === undefined ||
    item.actualPrice === ""
      ? null
      : toAmount(item.actualPrice);
  if (item.actualPrice !== null &&
      item.actualPrice !== undefined &&
      item.actualPrice !== "" &&
      actualPrice === null) {
    return null;
  }

  const quantity = toAmount(item.quantity) ?? 1;

  return {
    id: item.id,
    name: item.name,
    room: item.room,
    plannedPrice,
    actualPrice,
    quantity: quantity >= 1 ? Math.round(quantity) : 1,
    status: isStatus(item.status) ? item.status : "planowane",
    priority: isPriority(item.priority) ? item.priority : "must-start",
    type: isType(item.type) ? item.type : "inne",
    note: typeof item.note === "string" ? item.note : "",
    priceCertainty: isCertainty(item.priceCertainty)
      ? item.priceCertainty
      : "estimated",
  };
}

function normalizeSettings(value: unknown): AppSettings {
  if (!value || typeof value !== "object") return { ...DEFAULT_SETTINGS };
  const item = value as Record<string, unknown>;
  const totalBudget = toAmount(item.totalBudget);
  const reserve = toAmount(item.reserve);
  return {
    totalBudget:
      totalBudget !== null && totalBudget > 0
        ? totalBudget
        : DEFAULT_SETTINGS.totalBudget,
    reserve: reserve !== null && reserve >= 0 ? reserve : DEFAULT_SETTINGS.reserve,
  };
}

export function parseStoredData(value: unknown): StoredData | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (!Array.isArray(data.expenses)) return null;

  const expenses = data.expenses
    .map(normalizeExpense)
    .filter((expense): expense is Expense => expense !== null);

  if (data.expenses.length > 0 && expenses.length === 0) return null;

  return {
    version: 1,
    expenses,
    settings: normalizeSettings(data.settings),
  };
}

export function isStoredData(value: unknown): value is StoredData {
  return parseStoredData(value) !== null;
}

export function loadState(): StoredData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parseStoredData(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveState(state: StoredData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeRestoredExpenses(state: StoredData): StoredData {
  const names = new Set(
    state.expenses.map((expense) => expense.name.trim().toLowerCase()),
  );
  const hasSplitAgd = ["płyta indukcyjna", "piekarnik", "zmywarka", "okap kuchenny"].some(
    (name) => names.has(name),
  );

  let expenses = state.expenses;
  if (hasSplitAgd) {
    expenses = expenses.filter(
      (expense) => expense.name.trim().toLowerCase() !== "agd kuchenne",
    );
  }

  const currentNames = new Set(
    expenses.map((expense) => expense.name.trim().toLowerCase()),
  );
  const missing = INITIAL_EXPENSES.filter(
    (expense) => !currentNames.has(expense.name.trim().toLowerCase()),
  ).map((expense) => ({ ...expense }));

  if (missing.length === 0 && expenses.length === state.expenses.length) {
    return state;
  }

  return { ...state, expenses: [...missing, ...expenses] };
}

export function getInitialState(): StoredData {
  return {
    version: 1,
    expenses: INITIAL_EXPENSES.map((expense) => ({ ...expense })),
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function loadOrSeedState(): StoredData {
  const existing = loadState();
  if (existing) {
    const merged = mergeRestoredExpenses(existing);
    saveState(merged);
    return merged;
  }

  const alreadyHasData =
    typeof window !== "undefined" &&
    window.localStorage.getItem(STORAGE_KEY);

  if (alreadyHasData) {
    return {
      version: 1,
      expenses: [],
      settings: { ...DEFAULT_SETTINGS },
    };
  }

  const seeded = getInitialState();
  saveState(seeded);
  return seeded;
}
