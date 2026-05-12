import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { ProjectRecord } from "@/lib/types";

const dataFile = path.join(process.cwd(), "data", "projects.json");

async function readAll(): Promise<ProjectRecord[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf8");
    return JSON.parse(raw) as ProjectRecord[];
  } catch {
    return [];
  }
}

async function writeAll(projects: ProjectRecord[]) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(projects, null, 2), "utf8");
}

export async function listProjects() {
  const projects = await readAll();
  return projects.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export async function getProject(id: string) {
  const projects = await readAll();
  return projects.find((project) => project.id === id) ?? null;
}

export async function upsertProject(project: Partial<ProjectRecord> & Pick<ProjectRecord, "name" | "category" | "templateId" | "sourceType" | "status">) {
  const projects = await readAll();
  const now = new Date().toISOString();
  const existingIndex = project.id ? projects.findIndex((item) => item.id === project.id) : -1;
  const record: ProjectRecord = {
    id: project.id || crypto.randomUUID(),
    name: project.name,
    category: project.category,
    templateId: project.templateId,
    sourceType: project.sourceType,
    referenceUrl: project.referenceUrl,
    siteAnalysis: project.siteAnalysis,
    selectedSections: project.selectedSections,
    shopInfo: project.shopInfo,
    generatedContent: project.generatedContent,
    renderedHtml: project.renderedHtml,
    deployUrl: project.deployUrl,
    slug: project.slug,
    status: project.status,
    createdAt: existingIndex >= 0 ? projects[existingIndex].createdAt : now,
    updatedAt: now
  };

  if (existingIndex >= 0) {
    projects[existingIndex] = { ...projects[existingIndex], ...record, updatedAt: now };
  } else {
    projects.push(record);
  }

  await writeAll(projects);
  return record;
}

export async function createPublishedSlug(projectId: string) {
  const projects = await readAll();
  const index = projects.findIndex((item) => item.id === projectId);
  if (index < 0) return null;
  const slug = projects[index].slug || crypto.randomBytes(4).toString("hex");
  projects[index] = {
    ...projects[index],
    slug,
    status: "deployed",
    updatedAt: new Date().toISOString()
  };
  await writeAll(projects);
  return projects[index];
}
