import { NextRequest, NextResponse } from "next/server";
import { analyzeUrlReference } from "@/lib/analyzer";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  const analysis = await analyzeUrlReference(url);
  return NextResponse.json({ analysis });
}
