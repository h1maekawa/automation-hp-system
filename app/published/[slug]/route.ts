import { NextResponse } from "next/server";
import { listProjects } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const projects = await listProjects();
  const project = projects.find((item) => item.slug === params.slug);
  if (!project?.renderedHtml) {
    return new NextResponse("Not found", { status: 404 });
  }
  return new NextResponse(project.renderedHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}
