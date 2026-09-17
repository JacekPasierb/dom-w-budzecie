import {
  CERTAINTY_LABELS,
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/data/labels";
import type { Expense, RoomDefinition, StoredData } from "@/types/expense";
import { getLineCost } from "@/utils/budget";
import { getRoomLabel } from "@/utils/rooms";

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function expensesToCsv(
  expenses: Expense[],
  rooms: RoomDefinition[],
): string {
  const header = [
    "Nazwa",
    "Pomieszczenie",
    "Priorytet",
    "Plan (szt.)",
    "Rzeczywisty koszt (szt.)",
    "Ilość",
    "Koszt do budżetu",
    "Status",
    "Typ",
    "Pewność ceny",
    "Notatka",
  ];

  const rows = expenses.map((expense) => [
    csvCell(expense.name),
    csvCell(getRoomLabel(expense.room, rooms)),
    csvCell(PRIORITY_LABELS[expense.priority]),
    csvCell(expense.plannedPrice),
    csvCell(expense.actualPrice ?? ""),
    csvCell(expense.quantity),
    csvCell(getLineCost(expense)),
    csvCell(STATUS_LABELS[expense.status]),
    csvCell(TYPE_LABELS[expense.type]),
    csvCell(CERTAINTY_LABELS[expense.priceCertainty]),
    csvCell(expense.note),
  ]);

  return `\uFEFF${[header.join(","), ...rows.map((row) => row.join(","))].join("\n")}`;
}

export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function downloadJsonBackup(data: StoredData): void {
  const payload = {
    ...data,
    exportedAt: new Date().toISOString(),
  };

  downloadTextFile(
    JSON.stringify(payload, null, 2),
    `budzet-domu-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json",
  );
}

export function downloadCsv(
  expenses: Expense[],
  rooms: RoomDefinition[],
): void {
  downloadTextFile(
    expensesToCsv(expenses, rooms),
    `wydatki-domu-${new Date().toISOString().slice(0, 10)}.csv`,
    "text/csv;charset=utf-8",
  );
}
