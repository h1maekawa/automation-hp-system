import { NextRequest, NextResponse } from "next/server";
import { generateContent } from "@/lib/generator";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { shopInfo, siteAnalysis } = await request.json();
  const content = await generateContent(shopInfo, siteAnalysis);
  return NextResponse.json({ content });
}
