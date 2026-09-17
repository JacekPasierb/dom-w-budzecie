import type { IconName } from "@/components/Icon/Icon";
import type { Expense, RoomDefinition } from "@/types/expense";
import { DEFAULT_ROOMS } from "@/data/defaultRooms";
import { ROOM_LABELS } from "@/data/labels";
import { ROOM_ICONS, ROOM_TONES } from "@/data/roomIcons";

const TONES = ["clay", "moss", "brass", "ink"] as const;

export function cloneDefaultRooms(): RoomDefinition[] {
  return DEFAULT_ROOMS.map((room) => ({ ...room }));
}

export function getRoomLabel(id: string, rooms: RoomDefinition[]): string {
  const match = rooms.find((room) => room.id === id);
  if (match) return match.name;
  return ROOM_LABELS[id] ?? id;
}

export function getRoomIcon(id: string): IconName {
  return ROOM_ICONS[id] ?? "box";
}

export function getRoomTone(id: string): (typeof TONES)[number] {
  if (ROOM_TONES[id]) return ROOM_TONES[id];
  let hash = 0;
  for (const char of id) hash += char.charCodeAt(0);
  return TONES[hash % TONES.length];
}

export function slugifyRoomName(name: string): string {
  const base = name
    .trim()
    .toLowerCase()
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return base || "strefa";
}

export function uniqueRoomId(name: string, rooms: RoomDefinition[]): string {
  const base = slugifyRoomName(name);
  if (!rooms.some((room) => room.id === base)) return base;

  let index = 2;
  while (rooms.some((room) => room.id === `${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

export function normalizeRooms(
  raw: unknown,
  expenses: Expense[],
): RoomDefinition[] {
  const rooms: RoomDefinition[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const record = item as Record<string, unknown>;
      if (typeof record.id !== "string" || typeof record.name !== "string") {
        continue;
      }
      const id = record.id.trim();
      const name = record.name.trim();
      if (!id || !name) continue;
      if (rooms.some((room) => room.id === id)) continue;
      rooms.push({ id, name });
    }
  }

  const resolved = rooms.length > 0 ? rooms : cloneDefaultRooms();

  for (const expense of expenses) {
    if (!resolved.some((room) => room.id === expense.room)) {
      resolved.push({
        id: expense.room,
        name: ROOM_LABELS[expense.room] ?? expense.room,
      });
    }
  }

  return resolved;
}

export function fallbackRoomId(
  rooms: RoomDefinition[],
  deletingId: string,
): string | null {
  const remaining = rooms.filter((room) => room.id !== deletingId);
  if (remaining.length === 0) return null;
  return remaining.find((room) => room.id === "inne")?.id ?? remaining[0].id;
}
