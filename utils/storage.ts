import { DEFAULT_SETTINGS } from "@/data/defaults";
import { INITIAL_EXPENSES } from "@/data/initialExpenses";
import type {
  AppSettings,
  Expense,
  ExpensePriority,
  ExpenseStatus,
  ExpenseType,
  PriceCertainty,
  StoredData,
} from "@/types/expense";
import {
  EXPENSE_PRIORITIES,
  EXPENSE_STATUSES,
  EXPENSE_TYPES,
  PRICE_CERTAINTIES,
} from "@/types/expense";
import { cloneDefaultRooms, normalizeRooms } from "@/utils/rooms";

export const STORAGE_KEY = "dom-budzet-v1";

function isRoomId(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
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
  if (!isRoomId(item.room)) return null;

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
    room: item.room.trim(),
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
    rooms: normalizeRooms(data.rooms, expenses),
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

export function getEmptyState(): StoredData {
  return {
    version: 1,
    expenses: [],
    settings: { ...DEFAULT_SETTINGS },
    rooms: cloneDefaultRooms(),
  };
}

export function getInitialState(): StoredData {
  return {
    version: 1,
    expenses: INITIAL_EXPENSES.map((expense) => ({ ...expense })),
    settings: { ...DEFAULT_SETTINGS },
    rooms: cloneDefaultRooms(),
  };
}

export function loadOrSeedState(): StoredData {
  return loadState() ?? getEmptyState();
}
