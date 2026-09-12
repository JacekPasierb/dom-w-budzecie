# Budżet domu

Prosta aplikacja do kontroli budżetu wykończenia domu. Dane trzyma **MongoDB**. Nie ma logowania.

## Jak uruchomić

1. Skopiuj zmienne środowiska:

```bash
cp .env.example .env.local
```

2. W `.env.local` wstaw connection string:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=dom-budzet
```

Albo Atlas:

```env
MONGODB_URI=mongodb+srv://USER:HASLO@CLUSTER.mongodb.net
MONGODB_DB=dom-budzet
```

3. Uruchom aplikację:

```bash
npm install
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000).

Przy pierwszym starcie, jeśli baza jest pusta, aplikacja wstawia plan startowy. Jeśli w przeglądarce były już wydatki, przy pierwszym połączeniu z MongoDB spróbuje je przenieść.

Gdy MongoDB nie działa, aplikacja chwilowo zapisuje w `localStorage` i wraca do bazy przy kolejnym udanym zapisie.

## Jak działają dane

- API: `GET` / `PUT` `/api/budget`
- baza: `dom-budzet`
- kolekcja: `state`
- jeden dokument: `_id: "main"` — wydatki + ustawienia

Backup JSON i CSV zostaje w **Ustawieniach**.

Reset w ustawieniach nadpisuje dokument w MongoDB planem startowym.

## Gdzie zmienić początkowy budżet i rezerwę

W aplikacji: zakładka **Ustawienia**.

W kodzie, przed pierwszym zapisem do pustej bazy albo po resecie:

- `data/defaults.ts` — `DEFAULT_TOTAL_BUDGET` i `DEFAULT_RESERVE`
- `data/initialExpenses.ts` — startowa lista wydatków

## Jak liczony jest budżet

- **Wydane** — suma kosztów ze statusem Kupione lub Zapłacone
- **Planowane** — suma wydatków jeszcze niekupionych (Planowane, Zamówione, Odłożone)
- **Przewidywany koszt** — wydane + planowane
- **Pozostało** — budżet − przewidywany koszt
- **Bezpiecznie dostępne** — pozostało − rezerwa

Jeśli cena rzeczywista jest pusta, do obliczeń idzie cena planowana. Ilość mnoży cenę.
