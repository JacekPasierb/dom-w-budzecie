import { ExpensesManager } from "@/components/ExpensesManager/ExpensesManager";

export default function ExpensesPage() {
  return (
    <ExpensesManager
      title="Wydatki"
      lead="Lewa strona to lista zakupów, prawa — to, co już jest w domu. Kupione przesuwa pozycję."
    />
  );
}
