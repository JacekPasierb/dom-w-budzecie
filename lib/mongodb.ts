import { Resolver } from "node:dns/promises";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

declare global {
  var domMongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(uri);
}

async function toDirectMongoUri(connectionString: string): Promise<string> {
  if (!connectionString.startsWith("mongodb+srv://")) {
    return connectionString;
  }

  const withoutProtocol = connectionString.slice("mongodb+srv://".length);
  const at = withoutProtocol.lastIndexOf("@");
  const auth = at === -1 ? "" : withoutProtocol.slice(0, at);
  const rest = at === -1 ? withoutProtocol : withoutProtocol.slice(at + 1);
  const [hostAndPath, ...queryParts] = rest.split("?");
  const hostname = hostAndPath.split("/")[0].split(":")[0];
  const existingQuery = queryParts.join("?");

  const resolver = new Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);

  const srv = await resolver.resolveSrv(`_mongodb._tcp.${hostname}`);
  const txtRecords = await resolver.resolveTxt(hostname).catch(() => []);
  const txt = txtRecords.flat().join("");
  const txtParams = new URLSearchParams(txt);
  const params = new URLSearchParams(existingQuery);

  params.set("ssl", "true");
  if (!params.has("authSource") && txtParams.get("authSource")) {
    params.set("authSource", txtParams.get("authSource")!);
  }
  if (!params.has("replicaSet") && txtParams.get("replicaSet")) {
    params.set("replicaSet", txtParams.get("replicaSet")!);
  }

  const hosts = srv.map((record) => `${record.name}:${record.port}`).join(",");
  return `mongodb://${auth}@${hosts}/?${params.toString()}`;
}

async function connectMongo(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Brak MONGODB_URI w pliku .env.local");
  }

  try {
    const directUri = await toDirectMongoUri(uri);
    if (directUri.startsWith("mongodb+srv://")) {
      throw new Error("Nie udało się zamienić adresu Atlas SRV na bezpośredni.");
    }

    const client = new MongoClient(directUri, {
      family: 4,
      serverSelectionTimeoutMS: 20_000,
    });
    await client.connect();
    return client;
  } catch (error) {
    const message = error instanceof Error ? error.message : "nieznany błąd";
    throw new Error(`Połączenie z MongoDB nie powiodło się: ${message}`);
  }
}

export function getMongoClient(): Promise<MongoClient> {
  if (!global.domMongoClientPromise) {
    global.domMongoClientPromise = connectMongo().catch((error) => {
      global.domMongoClientPromise = undefined;
      throw error;
    });
  }

  return global.domMongoClientPromise;
}
