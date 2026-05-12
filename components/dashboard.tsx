import { categories, getTemplateById } from "@/lib/templates";
import { ProjectRecord } from "@/lib/types";
import { Badge, Button, Card } from "@/components/ui";

const statusMap: Record<ProjectRecord["status"], { label: string; tone: "default" | "info" | "success" | "warning" }> = {
  draft: { label: "下書き", tone: "default" },
  analyzed: { label: "解析済み", tone: "info" },
  generated: { label: "生成済み", tone: "info" },
  previewed: { label: "プレビュー済み", tone: "warning" },
  deployed: { label: "公開中", tone: "success" }
};

export function Dashboard({ projects }: { projects: ProjectRecord[] }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[28px] bg-primary px-6 py-8 text-white md:px-10 md:py-10">
        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <div className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs">店舗HP生成OS</div>
            <h1 className="text-3xl font-semibold md:text-4xl">参考サイトを選ぶだけで、店舗HP初稿まで一気通貫</h1>
            <p className="mt-4 max-w-2xl text-sm text-white/80 md:text-base">
              ご提供いただいた仕様に沿って、テンプレート選択・AI解析・入力フォーム・生成・プレビュー・公開までを一続きで動かせるNext.jsアプリにしています。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/projects/new" size="lg" className="bg-white text-primary hover:bg-white/90">新規プロジェクトを作成</Button>
              <Button href="/admin/templates" variant="ghost" size="lg" className="border border-white/15 text-white hover:bg-white/10">テンプレート管理</Button>
            </div>
          </div>
          <Card className="p-5 text-primary">
            <div className="text-sm font-semibold">カテゴリ一覧</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              {categories.industry.map((category) => (
                <div key={category.id} className="rounded-xl bg-bgSecondary px-3 py-2">
                  <div>{category.icon} {category.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm text-tertiary">プロジェクト数</div>
          <div className="mt-1 text-3xl font-semibold">{projects.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-tertiary">公開済み</div>
          <div className="mt-1 text-3xl font-semibold">{projects.filter((project) => project.status === "deployed").length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm text-tertiary">テンプレート数</div>
          <div className="mt-1 text-3xl font-semibold">4</div>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">プロジェクト一覧</h2>
          <Button href="/projects/new">新規作成</Button>
        </div>
        <div className="grid gap-4">
          {projects.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-lg font-semibold">まだプロジェクトがありません</div>
              <p className="mt-2 text-sm text-secondary">まずは1件作成して、テンプレート選択〜公開URL発行までの流れを確認できます。</p>
              <div className="mt-5"><Button href="/projects/new">最初のプロジェクトを作る</Button></div>
            </Card>
          ) : (
            projects.map((project) => {
              const template = getTemplateById(project.templateId);
              return (
                <Card key={project.id} className="p-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{project.name}</h3>
                        <Badge tone={statusMap[project.status].tone}>{statusMap[project.status].label}</Badge>
                      </div>
                      <div className="mt-2 text-sm text-secondary">
                        テンプレート: {template.name} / カテゴリ: {template.category} / 更新: {new Date(project.updatedAt).toLocaleString("ja-JP")}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.deployUrl && <Button href={project.deployUrl} variant="secondary">公開ページ</Button>}
                      <Button href={`/projects/${project.id}`}>詳細を見る</Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
