import { NextResponse } from "next/server";
import { readBudget, writeBudget } from "@/lib/budgetRepository";
import { isMongoConfigured } from "@/lib/mongodb";
import { parseStoredData } from "@/utils/storage";

export const runtime = "nodejs";

export async function GET() {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Brak MONGODB_URI. Dodaj connection string w .env.local." },
      { status: 503 },
    );
  }

  try {
    const { data, seeded } = await readBudget();
    return NextResponse.json({ ...data, seeded, source: "mongo" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nie udało się odczytać MongoDB.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isMongoConfigured()) {
    return NextResponse.json(
      { error: "Brak MONGODB_URI. Dodaj connection string w .env.local." },
      { status: 503 },
    );
  }

  try {
    const parsed = parseStoredData(await request.json());
    if (!parsed) {
      return NextResponse.json(
        { error: "Nieprawidłowa struktura budżetu." },
        { status: 400 },
      );
    }

    await writeBudget(parsed);
    return NextResponse.json({ ...parsed, source: "mongo" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Nie udało się zapisać do MongoDB.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
