import { NextRequest, NextResponse } from "next/server";
import { createPublishedSlug, upsertProject } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await upsertProject({
    id: body.projectId,
    name: body.name,
    category: body.category,
    templateId: body.templateId,
    sourceType: body.sourceType,
    referenceUrl: body.referenceUrl,
    siteAnalysis: body.siteAnalysis,
    selectedSections: body.selectedSections,
    shopInfo: body.shopInfo,
    generatedContent: body.generatedContent,
    renderedHtml: body.renderedHtml,
    status: "previewed"
  });

  const published = await createPublishedSlug(project.id);
  if (!published) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const deployUrl = `${origin}/published/${published.slug}`;
  const updated = await upsertProject({
    ...published,
    name: published.name,
    category: published.category,
    templateId: published.templateId,
    sourceType: published.sourceType,
    deployUrl,
    status: "deployed"
  });

  return NextResponse.json({ deployUrl, project: updated });
}
