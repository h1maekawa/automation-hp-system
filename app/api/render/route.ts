import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "@/lib/templates";
import { renderTemplate } from "@/lib/render";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const { templateId, shopInfo, generatedContent } = await request.json();
  const template = getTemplateById(templateId);
  const html = renderTemplate(template, shopInfo, generatedContent);
  return NextResponse.json({ html });
}
