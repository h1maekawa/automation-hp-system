import { NextResponse } from "next/server";
import { templateCatalog } from "@/lib/templates";

export async function GET() {
  return NextResponse.json({ templates: templateCatalog });
}
