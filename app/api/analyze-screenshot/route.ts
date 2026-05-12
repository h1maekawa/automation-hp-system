import { NextResponse } from "next/server";
import { analyzeScreenshotReference } from "@/lib/analyzer";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const fileName = file instanceof File ? file.name : "reference.png";
  const analysis = await analyzeScreenshotReference(fileName);
  return NextResponse.json({ analysis });
}
