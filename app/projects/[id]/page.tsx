import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, Card, Badge } from "@/components/ui";
import { getProject } from "@/lib/store";
import { getTemplateById } from "@/lib/templates";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();
  const template = getTemplateById(project.templateId);

  return (
    <main className="min-h-screen bg-bgSecondary">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-secondary">← ダッシュボードへ</Link>
            <h1 className="mt-2 text-3xl font-semibold">{project.name}</h1>
          </div>
          <div className="flex gap-2">
            {project.deployUrl && <Button href={project.deployUrl}>公開ページ</Button>}
            <Button href="/projects/new" variant="secondary">別案件を作成</Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-sm text-tertiary">ステータス</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="text-lg font-semibold">{project.status}</div>
              <Badge tone={project.status === "deployed" ? "success" : "info"}>{project.status === "deployed" ? "公開中" : "進行中"}</Badge>
            </div>
            <div className="mt-4 text-sm text-secondary">テンプレート: {template.name}</div>
            <div className="mt-1 text-sm text-secondary">カテゴリ: {project.category}</div>
            <div className="mt-1 text-sm text-secondary">参照方法: {project.sourceType}</div>
          </Card>
          <Card className="p-5">
            <div className="text-sm text-tertiary">解析情報</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(project.selectedSections || []).map((section) => <Badge key={section}>{section}</Badge>)}
            </div>
            {project.siteAnalysis && (
              <div className="mt-4 space-y-1 text-sm text-secondary">
                <div>tone: {project.siteAnalysis.tone}</div>
                <div>layout: {project.siteAnalysis.layoutType}</div>
                <div>font: {project.siteAnalysis.fontStyle}</div>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <div className="text-lg font-semibold">店舗情報</div>
            <div className="mt-3 space-y-2 text-sm text-secondary">
              <div>店舗名: {project.shopInfo?.shopName || "-"}</div>
              <div>業種: {project.shopInfo?.genre || "-"}</div>
              <div>コンセプト: {project.shopInfo?.concept || "-"}</div>
              <div>営業時間: {project.shopInfo?.hours || "-"}</div>
              <div>住所: {project.shopInfo?.address || "-"}</div>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-lg font-semibold">生成結果サマリー</div>
            <div className="mt-3 space-y-3 text-sm text-secondary">
              <div>
                <div className="font-medium text-primary">Hero</div>
                <div>{project.generatedContent?.hero.title || "未生成"}</div>
              </div>
              <div>
                <div className="font-medium text-primary">About</div>
                <div>{project.generatedContent?.about.body || "未生成"}</div>
              </div>
            </div>
          </Card>
        </div>

        {project.renderedHtml && (
          <Card className="mt-5 p-3">
            <div className="mb-3 flex items-center justify-between px-2 pt-2">
              <div className="text-lg font-semibold">HTMLプレビュー</div>
              {project.deployUrl && <Button href={project.deployUrl} variant="secondary">公開URLへ</Button>}
            </div>
            <iframe title="project-preview" srcDoc={project.renderedHtml} className="h-[720px] w-full rounded-2xl border border-black/10 bg-white" />
          </Card>
        )}
      </div>
    </main>
  );
}
