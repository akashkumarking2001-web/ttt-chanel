// Cloudflare R2 upload via REST API — replaces Firebase Storage

const CF_ACCOUNT = process.env.CLOUDFLARE_ACCOUNT_ID!;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN!;
const CF_BUCKET = process.env.CLOUDFLARE_R2_BUCKET!;

export async function uploadToR2(
  key: string,
  data: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/r2/buckets/${CF_BUCKET}/objects/${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": contentType,
    },
    body: data as any,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`R2 upload failed: ${err}`);
  }

  // Return public URL (set up R2 public access or use worker URL)
  return `https://pub-${CF_ACCOUNT.slice(0, 8)}.r2.dev/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT}/r2/buckets/${CF_BUCKET}/objects/${encodeURIComponent(key)}`;
  await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${CF_TOKEN}` },
  });
}
