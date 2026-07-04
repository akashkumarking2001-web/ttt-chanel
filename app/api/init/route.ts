// D1 Init API — POST /api/init (run once to create tables)
import { NextResponse } from "next/server";
import { initD1Tables } from "@/lib/d1";

export async function POST() {
  const result = await initD1Tables();
  return NextResponse.json(result);
}
