import type { ExpensePriority, ExpenseStatus, ExpenseType, Room } from "@/types/expense";

export type ExpenseFiltersState = {
  query: string;
  room: Room | "all";
  status: ExpenseStatus | "all";
  priority: ExpensePriority | "all";
  type: ExpenseType | "all";
};

export const EMPTY_FILTERS: ExpenseFiltersState = {
  query: "",
  room: "all",
  status: "all",
  priority: "all",
  type: "all",
};
