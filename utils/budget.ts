import type {
  AppSettings,
  Expense,
  ExpensePriority,
  ExpenseStatus,
  Room,
  RoomDefinition,
} from "@/types/expense";

export type ProgressState = "safe" | "near" | "over";

export type BudgetSummary = {
  spent: number;
  planned: number;
  predictedTotal: number;
  remaining: number;
  reserve: number;
  totalBudget: number;
  safeAvailable: number;
  overBudgetBy: number;
  isOverBudget: boolean;
  isUsingReserve: boolean;
  potentialSavings: number;
  percent: number;
  progressState: ProgressState;
};

export type RoomSummary = {
  room: Room;
  spent: number;
  planned: number;
  predicted: number;
  remaining: number;
  requiredCount: number;
  optionalCount: number;
  expenseCount: number;
};

const SPENT_STATUSES: ExpenseStatus[] = ["kupione", "zaplacone"];
const OPEN_STATUSES: ExpenseStatus[] = ["planowane", "zamowione", "odlozone"];
const REQUIRED_PRIORITIES: ExpensePriority[] = ["must-start", "worth-now"];
const OPTIONAL_PRIORITIES: ExpensePriority[] = ["can-wait", "luxury"];

export function getUnitCost(expense: Expense): number {
  return expense.actualPrice ?? expense.plannedPrice;
}

export function getLineCost(expense: Expense): number {
  return getUnitCost(expense) * expense.quantity;
}

export function isSpent(expense: Expense): boolean {
  return SPENT_STATUSES.includes(expense.status);
}

export function isOpen(expense: Expense): boolean {
  return OPEN_STATUSES.includes(expense.status);
}

export function isCancelled(expense: Expense): boolean {
  return expense.status === "zrezygnowano";
}

export function isOptional(expense: Expense): boolean {
  return OPTIONAL_PRIORITIES.includes(expense.priority);
}

export function isRequired(expense: Expense): boolean {
  return REQUIRED_PRIORITIES.includes(expense.priority);
}

export function sumCosts(expenses: Expense[]): number {
  return expenses.reduce((total, expense) => total + getLineCost(expense), 0);
}

export function getOptionalOpenExpenses(expenses: Expense[]): Expense[] {
  return expenses.filter((expense) => isOpen(expense) && isOptional(expense));
}

export function calculateBudget(
  expenses: Expense[],
  settings: AppSettings,
): BudgetSummary {
  const spent = sumCosts(expenses.filter(isSpent));
  const planned = sumCosts(expenses.filter(isOpen));
  const predictedTotal = spent + planned;
  const remaining = settings.totalBudget - predictedTotal;
  const safeAvailable = remaining - settings.reserve;
  const overBudgetBy = Math.max(0, predictedTotal - settings.totalBudget);
  const isOverBudget = predictedTotal > settings.totalBudget;
  const isUsingReserve = remaining < settings.reserve;
  const potentialSavings = sumCosts(getOptionalOpenExpenses(expenses));
  const percent =
    settings.totalBudget > 0 ? (predictedTotal / settings.totalBudget) * 100 : 0;

  let progressState: ProgressState = "safe";
  if (isOverBudget) {
    progressState = "over";
  } else if (isUsingReserve) {
    progressState = "near";
  }

  return {
    spent,
    planned,
    predictedTotal,
    remaining,
    reserve: settings.reserve,
    totalBudget: settings.totalBudget,
    safeAvailable,
    overBudgetBy,
    isOverBudget,
    isUsingReserve,
    potentialSavings,
    percent,
    progressState,
  };
}

export function getRoomSummary(
  expenses: Expense[],
  room: Room,
): RoomSummary {
  const items = expenses.filter((expense) => expense.room === room);
  const active = items.filter((expense) => !isCancelled(expense));
  const spent = sumCosts(items.filter(isSpent));
  const planned = sumCosts(items.filter(isOpen));

  return {
    room,
    spent,
    planned,
    predicted: spent + planned,
    remaining: planned,
    requiredCount: active.filter(isRequired).length,
    optionalCount: active.filter(isOptional).length,
    expenseCount: items.length,
  };
}

export function getAllRoomSummaries(
  expenses: Expense[],
  rooms: RoomDefinition[],
): RoomSummary[] {
  return rooms.map((room) => getRoomSummary(expenses, room.id));
}
