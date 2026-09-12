import type {
  ExpensePriority,
  ExpenseStatus,
  ExpenseType,
  PriceCertainty,
  Room,
} from "@/types/expense";

export const ROOM_LABELS: Record<Room, string> = {
  kuchnia: "Kuchnia",
  salon: "Salon",
  wiatrolap: "Wiatrołap",
  "wc-dol": "WC dół",
  "lazienka-gora": "Łazienka góra",
  schody: "Schody",
  korytarz: "Korytarz / przedpokój",
  sypialnia: "Sypialnia",
  "pokoj-chlopca-1": "Pokój chłopca 1",
  "pokoj-chlopca-2": "Pokój chłopca 2",
  garderoba: "Garderoba",
  garaz: "Garaż",
  podlogi: "Podłogi",
  malowanie: "Malowanie",
  elektryka: "Elektryka / oświetlenie",
  inne: "Inne",
};

export const STATUS_LABELS: Record<ExpenseStatus, string> = {
  planowane: "Planowane",
  zamowione: "Zamówione",
  kupione: "Kupione",
  zaplacone: "Zapłacone",
  odlozone: "Odłożone na później",
  zrezygnowano: "Zrezygnowano",
};

export const PRIORITY_LABELS: Record<ExpensePriority, string> = {
  "must-start": "Muszę zrobić na start",
  "worth-now": "Warto zrobić od razu",
  "can-wait": "Może poczekać",
  luxury: "Luksus / opcja",
};

export const TYPE_LABELS: Record<ExpenseType, string> = {
  robocizna: "Robocizna",
  materialy: "Materiały budowlane",
  meble: "Meble",
  agd: "AGD",
  armatura: "Armatura",
  oswietlenie: "Oświetlenie",
  elektryka: "Elektryka",
  dekoracje: "Dekoracje",
  inne: "Inne",
};

export const CERTAINTY_LABELS: Record<PriceCertainty, string> = {
  estimated: "Szacunkowa",
  confirmed: "Potwierdzona",
};
