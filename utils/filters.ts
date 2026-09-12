import type { Expense } from "@/types/expense";
import type { ExpenseFiltersState } from "@/types/filters";

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFiltersState,
): Expense[] {
  const query = filters.query.trim().toLowerCase();

  return expenses.filter((expense) => {
    if (query && !expense.name.toLowerCase().includes(query)) return false;
    if (filters.room !== "all" && expense.room !== filters.room) return false;
    if (filters.status !== "all" && expense.status !== filters.status) return false;
    if (filters.priority !== "all" && expense.priority !== filters.priority) {
      return false;
    }
    if (filters.type !== "all" && expense.type !== filters.type) return false;
    return true;
  });
}
