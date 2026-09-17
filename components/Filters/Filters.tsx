"use client";

import { Icon } from "@/components/Icon/Icon";
import { useExpenses } from "@/hooks/useExpenses";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TYPE_LABELS,
} from "@/data/labels";
import type { ExpenseFiltersState } from "@/types/filters";
import {
  EXPENSE_PRIORITIES,
  EXPENSE_STATUSES,
  EXPENSE_TYPES,
} from "@/types/expense";
import styles from "./Filters.module.css";

type FiltersProps = {
  value: ExpenseFiltersState;
  onChange: (next: ExpenseFiltersState) => void;
  hideRoom?: boolean;
};

export function Filters({ value, onChange, hideRoom = false }: FiltersProps) {
  const { rooms } = useExpenses();

  function patch(partial: Partial<ExpenseFiltersState>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className={styles.wrap}>
      <label className={`field ${styles.search}`}>
        <span>Szukaj po nazwie</span>
        <span className={styles.searchBox}>
          <Icon name="search" size={16} />
          <input
            className="input"
            value={value.query}
            onChange={(event) => patch({ query: event.target.value })}
            placeholder="np. piekarnik, gres, bateria"
          />
        </span>
      </label>

      {hideRoom ? null : (
        <label className="field">
          <span>Pomieszczenie</span>
          <select
            className="select"
            value={value.room}
            onChange={(event) =>
              patch({ room: event.target.value as ExpenseFiltersState["room"] })
            }
          >
            <option value="all">Wszystkie</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="field">
        <span>Status</span>
        <select
          className="select"
          value={value.status}
          onChange={(event) =>
            patch({ status: event.target.value as ExpenseFiltersState["status"] })
          }
        >
          <option value="all">Wszystkie</option>
          {EXPENSE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Priorytet</span>
        <select
          className="select"
          value={value.priority}
          onChange={(event) =>
            patch({
              priority: event.target.value as ExpenseFiltersState["priority"],
            })
          }
        >
          <option value="all">Wszystkie</option>
          {EXPENSE_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {PRIORITY_LABELS[priority]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Typ</span>
        <select
          className="select"
          value={value.type}
          onChange={(event) =>
            patch({ type: event.target.value as ExpenseFiltersState["type"] })
          }
        >
          <option value="all">Wszystkie</option>
          {EXPENSE_TYPES.map((type) => (
            <option key={type} value={type}>
              {TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
