import type { StoredData } from "@/types/expense";
import { getMongoClient } from "@/lib/mongodb";
import { getEmptyState, parseStoredData } from "@/utils/storage";

const DB_NAME = process.env.MONGODB_DB ?? "dom-budzet";
const COLLECTION = "state";
const LEGACY_ID = "main";

type BudgetDocument = StoredData & {
  _id: string;
  updatedAt: Date;
  claimedBy?: string;
  claimedAt?: Date;
  inheritedFrom?: string;
};

function collection() {
  return getMongoClient().then((client) =>
    client.db(DB_NAME).collection<BudgetDocument>(COLLECTION),
  );
}

async function claimLegacyBudget(userId: string): Promise<StoredData | null> {
  const col = await collection();

  const claimed = await col.findOneAndUpdate(
    { _id: LEGACY_ID, claimedBy: { $exists: false } },
    { $set: { claimedBy: userId, claimedAt: new Date() } },
    { returnDocument: "after" },
  );

  const legacy =
    claimed ?? (await col.findOne({ _id: LEGACY_ID, claimedBy: userId }));
  if (!legacy) return null;

  return parseStoredData(legacy);
}

export async function readBudget(userId: string): Promise<{
  data: StoredData;
  seeded: boolean;
}> {
  const col = await collection();
  const doc = await col.findOne({ _id: userId });

  if (doc) {
    const parsed = parseStoredData(doc);
    return {
      data: parsed ?? getEmptyState(),
      seeded: false,
    };
  }

  const inherited = await claimLegacyBudget(userId);
  const data = inherited ?? getEmptyState();
  await writeBudget(userId, data);
  return { data, seeded: !inherited };
}

export async function writeBudget(
  userId: string,
  data: StoredData,
): Promise<void> {
  const col = await collection();
  await col.updateOne(
    { _id: userId },
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
