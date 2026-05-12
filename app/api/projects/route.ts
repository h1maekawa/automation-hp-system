import { NextRequest, NextResponse } from "next/server";
import { listProjects, upsertProject } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const projects = await listProjects();
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const project = await upsertProject(body);
  return NextResponse.json(project);
}
