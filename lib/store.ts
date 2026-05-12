import { createClient } from "@supabase/supabase-js";
import { ProjectRecord } from "@/lib/types";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

// Initialize only if URL is present to avoid build-time crashes
const supabase = supabaseUrl ? createClient(supabaseUrl, supabaseKey) : null;

function mapFromDb(record: any): ProjectRecord {
  return {
    id: record.id,
    name: record.name,
    category: record.category,
    templateId: record.template_id,
    sourceType: record.source_type,
    referenceUrl: record.reference_url,
    siteAnalysis: record.site_analysis,
    selectedSections: record.selected_sections,
    shopInfo: record.shop_info,
    generatedContent: record.generated_content,
    renderedHtml: record.rendered_html,
    deployUrl: record.deploy_url,
    slug: record.slug,
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

function mapToDb(project: Partial<ProjectRecord>) {
  const data: any = {};
  if (project.name !== undefined) data.name = project.name;
  if (project.category !== undefined) data.category = project.category;
  if (project.templateId !== undefined) data.template_id = project.templateId;
  if (project.sourceType !== undefined) data.source_type = project.sourceType;
  if (project.referenceUrl !== undefined) data.reference_url = project.referenceUrl;
  if (project.siteAnalysis !== undefined) data.site_analysis = project.siteAnalysis;
  if (project.selectedSections !== undefined) data.selected_sections = project.selectedSections;
  if (project.shopInfo !== undefined) data.shop_info = project.shopInfo;
  if (project.generatedContent !== undefined) data.generated_content = project.generatedContent;
  if (project.renderedHtml !== undefined) data.rendered_html = project.renderedHtml;
  if (project.deployUrl !== undefined) data.deploy_url = project.deployUrl;
  if (project.slug !== undefined) data.slug = project.slug;
  if (project.status !== undefined) data.status = project.status;
  data.updated_at = new Date().toISOString();
  return data;
}

export async function listProjects() {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  
  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return (data || []).map(mapFromDb);
}

export async function getProject(id: string) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !data) return null;
  return mapFromDb(data);
}

export async function upsertProject(project: Partial<ProjectRecord> & Pick<ProjectRecord, "name" | "category" | "templateId" | "sourceType" | "status">) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const dbData = mapToDb(project);
  
  if (project.id) {
    const { data, error } = await supabase
      .from("projects")
      .update(dbData)
      .eq("id", project.id)
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data);
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...dbData, created_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return mapFromDb(data);
  }
}

export async function createPublishedSlug(projectId: string) {
  const project = await getProject(projectId);
  if (!project) return null;

  const slug = project.slug || Math.random().toString(36).substring(2, 10);
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase
    .from("projects")
    .update({
      slug,
      status: "deployed",
      updated_at: new Date().toISOString()
    })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return mapFromDb(data);
}
