"use client";

import { useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon/Icon";
import { DEFAULT_RESERVE, DEFAULT_TOTAL_BUDGET } from "@/data/defaults";
import { useExpenses } from "@/hooks/useExpenses";
import { parseAmount, formatPLN } from "@/utils/currency";
import { downloadCsv, downloadJsonBackup } from "@/utils/export";
import { parseStoredData } from "@/utils/storage";
import styles from "./SettingsForm.module.css";

export function SettingsForm() {
  const { ready } = useExpenses();

  if (!ready) {
    return <p className="loading">Wczytywanie ustawień…</p>;
  }

  return <SettingsFormReady />;
}

function SettingsFormReady() {
  const {
    settings,
    expenses,
    storageSource,
    storageError,
    updateSettings,
    resetData,
    importData,
  } = useExpenses();
  const [budget, setBudget] = useState(String(settings.totalBudget));
  const [reserve, setReserve] = useState(String(settings.reserve));
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const totalBudget = parseAmount(budget);
    const reserveValue = parseAmount(reserve);

    if (totalBudget === null || totalBudget <= 0) {
      setMessage("Podaj poprawny budżet całkowity.");
      return;
    }

    if (reserveValue === null || reserveValue < 0) {
      setMessage("Podaj poprawną rezerwę.");
      return;
    }

    updateSettings({ totalBudget, reserve: reserveValue });
    setMessage("Ustawienia zapisane.");
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Na pewno zresetować wszystkie dane do wartości startowych? Tej operacji nie da się cofnąć.",
    );
    if (!confirmed) return;
    resetData();
    setBudget(String(DEFAULT_TOTAL_BUDGET));
    setReserve(String(DEFAULT_RESERVE));
    setMessage("Przywrócono dane startowe.");
  }

  async function handleImport(file: File | undefined) {
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseStoredData(JSON.parse(text));
      if (!parsed) {
        setMessage("Plik JSON ma nieprawidłową strukturę.");
        return;
      }
      importData(parsed);
      setBudget(String(parsed.settings.totalBudget));
      setReserve(String(parsed.settings.reserve));
      setMessage("Zaimportowano dane z JSON.");
    } catch {
      setMessage("Nie udało się wczytać pliku JSON.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <>
      <div className="pageHeader">
        <div className="pageHeaderText">
          <p className="kicker">
            <Icon name="settings" size={14} />
            Pracownia
          </p>
          <h1 className="pageTitle">Ustawienia</h1>
          <p className="pageLead">
            {storageSource === "mongo"
              ? "Dane zapisują się w MongoDB (baza dom-budzet, kolekcja state). JSON zostaje jako dodatkowy backup."
              : "MongoDB jest niedostępne — chwilowo zapis jest tylko w przeglądarce."}
          </p>
          {storageError ? <p className={styles.error}>{storageError}</p> : null}
        </div>
      </div>

      <form className={styles.card} onSubmit={handleSave}>
        <h2>
          <Icon name="budget" size={18} />
          Budżet
        </h2>
        <label className="field">
          <span>Budżet całkowity</span>
          <input
            className="input"
            inputMode="decimal"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Rezerwa</span>
          <input
            className="input"
            inputMode="decimal"
            value={reserve}
            onChange={(event) => setReserve(event.target.value)}
          />
        </label>
        <p className={styles.hint}>
          Domyślnie {formatPLN(DEFAULT_TOTAL_BUDGET)} budżetu i{" "}
          {formatPLN(DEFAULT_RESERVE)} rezerwy.
        </p>
        <button type="submit" className="btn btnPrimary">
          <Icon name="check" size={16} />
          Zapisz budżet
        </button>
      </form>

      <section className={styles.card}>
        <h2>
          <Icon name="download" size={18} />
          Eksport / backup
        </h2>
        <div className={styles.row}>
          <button
            type="button"
            className="btn"
            onClick={() =>
              downloadJsonBackup({ version: 1, expenses, settings })
            }
          >
            <Icon name="download" size={16} />
            Eksportuj JSON
          </button>
          <button type="button" className="btn" onClick={() => downloadCsv(expenses)}>
            <Icon name="list" size={16} />
            Eksportuj CSV
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => fileRef.current?.click()}
          >
            <Icon name="upload" size={16} />
            Importuj JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => handleImport(event.target.files?.[0])}
          />
        </div>
      </section>

      <section className={styles.card}>
        <h2>
          <Icon name="reset" size={18} />
          Reset
        </h2>
        <p className={styles.hint}>
          Przywraca przykładowe wydatki oraz domyślny budżet 150 000 zł i rezerwę
          15 000 zł.
        </p>
        <button type="button" className="btn btnDanger" onClick={handleReset}>
          <Icon name="trash" size={16} />
          Resetuj dane
        </button>
      </section>

      {message ? <p className={styles.message}>{message}</p> : null}
    </>
  );
}
