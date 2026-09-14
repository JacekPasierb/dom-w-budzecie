import type { StoredData } from "@/types/expense";
import {
  getEmptyState,
  loadOrSeedState,
  parseStoredData,
  saveState,
} from "@/utils/storage";

type Listener = () => void;

const listeners = new Set<Listener>();
const serverSnapshot = getEmptyState();
let cached: StoredData = serverSnapshot;
let loaded = false;
let storageSource: "mongo" | "local" = "local";
let storageError: string | null = null;
let hydrateStarted = false;

function notify(): void {
  listeners.forEach((listener) => listener());
}

async function persistToMongo(state: StoredData): Promise<void> {
  const response = await fetch("/api/budget", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? "Zapis do MongoDB nie powiódł się.");
  }
}

export function subscribeBudgetStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBudgetSnapshot(): StoredData {
  return cached;
}

export function getServerBudgetSnapshot(): StoredData {
  return serverSnapshot;
}

export function getStoreLoaded(): boolean {
  return loaded;
}

export function getServerLoaded(): boolean {
  return false;
}

export function getStorageSource(): "mongo" | "local" {
  return storageSource;
}

export function getStorageError(): string | null {
  return storageError;
}

export function getServerStorageError(): string | null {
  return null;
}

export function setBudgetSnapshot(next: StoredData): void {
  cached = next;
  saveState(next);
  notify();

  void persistToMongo(next).then(
    () => {
      storageSource = "mongo";
      storageError = null;
      notify();
    },
    (error: unknown) => {
      storageSource = "local";
      storageError =
        error instanceof Error ? error.message : "Zapis do MongoDB nie powiódł się.";
      notify();
    },
  );
}

export async function hydrateBudgetStore(): Promise<void> {
  if (hydrateStarted) return;
  hydrateStarted = true;

  try {
    const response = await fetch("/api/budget");
    if (response.ok) {
      const json: unknown = await response.json();
      const parsed = parseStoredData(json);

      if (parsed) {
        cached = parsed;
        saveState(parsed);
        storageSource = "mongo";
        storageError = null;
        loaded = true;
        notify();
        return;
      }
    } else {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      storageError = payload?.error ?? `MongoDB zwróciło błąd ${response.status}.`;
    }
  } catch (error) {
    storageError =
      error instanceof Error ? error.message : "Nie udało się połączyć z MongoDB.";
  }

  cached = loadOrSeedState();
  storageSource = "local";
  loaded = true;
  notify();
}
