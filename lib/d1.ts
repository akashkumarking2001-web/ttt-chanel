// Cloudflare D1 REST API wrapper — replaces Firebase Firestore

const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const CF_D1_ID = process.env.CLOUDFLARE_D1_DATABASE_ID!;
const BASE = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/d1/database/${CF_D1_ID}`;

interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  error?: string;
}

export async function d1Query<T = Record<string, unknown>>(
  sql: string,
  params: (string | number | boolean | null)[] = []
): Promise<D1Result<T>> {
  const res = await fetch(`${BASE}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });
  const data = await res.json() as { success: boolean; result?: { results: T[] }[]; errors?: { message: string }[] };
  if (!data.success) {
    return { results: [], success: false, error: data.errors?.[0]?.message };
  }
  return { results: data.result?.[0]?.results ?? [], success: true };
}

// Initialize all D1 tables
export async function initD1Tables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      titleTa TEXT,
      description TEXT,
      descriptionTa TEXT,
      category TEXT NOT NULL DEFAULT 'mobile',
      videoType TEXT NOT NULL DEFAULT 'youtube',
      videoUrl TEXT NOT NULL,
      thumbnail TEXT,
      duration TEXT,
      views INTEGER DEFAULT 0,
      likes INTEGER DEFAULT 0,
      dislikes INTEGER DEFAULT 0,
      links TEXT DEFAULT '[]',
      createdAt INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      videoId TEXT NOT NULL,
      name TEXT NOT NULL,
      text TEXT NOT NULL,
      visitorId TEXT,
      createdAt INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS subscribers (
      id TEXT PRIMARY KEY,
      endpoint TEXT NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      createdAt INTEGER DEFAULT (unixepoch())
    )`,
    `CREATE TABLE IF NOT EXISTS votes (
      id TEXT PRIMARY KEY,
      videoId TEXT NOT NULL,
      visitorId TEXT NOT NULL,
      vote TEXT NOT NULL,
      UNIQUE(videoId, visitorId)
    )`,
  ];

  for (const sql of tables) {
    await d1Query(sql);
  }
  return { success: true };
}

// Helper: generate simple ID
export function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
