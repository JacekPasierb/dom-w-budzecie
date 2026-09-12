import type { StoredData } from "@/types/expense";
import { getMongoClient } from "@/lib/mongodb";
import { getInitialState, parseStoredData } from "@/utils/storage";

const DB_NAME = process.env.MONGODB_DB ?? "dom-budzet";
const COLLECTION = "state";
const DOC_ID = "main";

type BudgetDocument = StoredData & {
  _id: string;
  updatedAt: Date;
};

function collection() {
  return getMongoClient().then((client) =>
    client.db(DB_NAME).collection<BudgetDocument>(COLLECTION),
  );
}

export async function readBudget(): Promise<{
  data: StoredData;
  seeded: boolean;
}> {
  const col = await collection();
  const doc = await col.findOne({ _id: DOC_ID });

  if (!doc) {
    const data = getInitialState();
    await writeBudget(data);
    return { data, seeded: true };
  }

  const parsed = parseStoredData(doc);
  if (!parsed) {
    const data = getInitialState();
    await writeBudget(data);
    return { data, seeded: true };
  }

  return { data: parsed, seeded: false };
}

export async function writeBudget(data: StoredData): Promise<void> {
  const col = await collection();
  await col.updateOne(
    { _id: DOC_ID },
    {
      $set: {
        version: data.version,
        expenses: data.expenses,
        settings: data.settings,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
}
