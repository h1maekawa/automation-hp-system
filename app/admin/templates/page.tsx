import Link from "next/link";
import { templateCatalog } from "@/lib/templates";
import { Badge, Button, Card } from "@/components/ui";

export default function AdminTemplatesPage() {
  return (
    <main className="min-h-screen bg-bgSecondary">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm text-secondary">← ダッシュボードへ</Link>
            <h1 className="mt-2 text-3xl font-semibold">テンプレート管理</h1>
          </div>
          <Button href="/projects/new">新規プロジェクト</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {templateCatalog.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="h-40" style={{ background: template.thumbnailGradient }} />
              <div className="space-y-3 p-5">
                <div>
                  <div className="text-lg font-semibold">{template.name}</div>
                  <div className="mt-1 text-sm text-secondary">{template.description}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
                <div className="rounded-xl bg-bgSecondary p-3 text-sm text-secondary">
                  <div>preview: {template.previewTitle}</div>
                  <div>style: {template.style}</div>
                  <div>size: {template.size}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
