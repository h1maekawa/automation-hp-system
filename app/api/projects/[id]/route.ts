import { NextResponse } from "next/server";
import { getProject } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ project });
}
