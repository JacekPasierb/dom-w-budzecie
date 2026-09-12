export const ROOMS = [
  "kuchnia",
  "salon",
  "wiatrolap",
  "wc-dol",
  "lazienka-gora",
  "schody",
  "korytarz",
  "sypialnia",
  "pokoj-chlopca-1",
  "pokoj-chlopca-2",
  "garderoba",
  "garaz",
  "podlogi",
  "malowanie",
  "elektryka",
  "inne",
] as const;

export type Room = (typeof ROOMS)[number];

export const EXPENSE_STATUSES = [
  "planowane",
  "zamowione",
  "kupione",
  "zaplacone",
  "odlozone",
  "zrezygnowano",
] as const;

export type ExpenseStatus = (typeof EXPENSE_STATUSES)[number];

export const EXPENSE_PRIORITIES = [
  "must-start",
  "worth-now",
  "can-wait",
  "luxury",
] as const;

export type ExpensePriority = (typeof EXPENSE_PRIORITIES)[number];

export const EXPENSE_TYPES = [
  "robocizna",
  "materialy",
  "meble",
  "agd",
  "armatura",
  "oswietlenie",
  "elektryka",
  "dekoracje",
  "inne",
] as const;

export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export const PRICE_CERTAINTIES = ["estimated", "confirmed"] as const;

export type PriceCertainty = (typeof PRICE_CERTAINTIES)[number];

export type Expense = {
  id: string;
  name: string;
  room: Room;
  plannedPrice: number;
  actualPrice: number | null;
  quantity: number;
  status: ExpenseStatus;
  priority: ExpensePriority;
  type: ExpenseType;
  note: string;
  priceCertainty: PriceCertainty;
};

export type ExpenseInput = Omit<Expense, "id">;

export type AppSettings = {
  totalBudget: number;
  reserve: number;
};

export type StoredData = {
  version: 1;
  expenses: Expense[];
  settings: AppSettings;
};
