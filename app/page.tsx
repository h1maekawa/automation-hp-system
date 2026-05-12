import { Dashboard } from "@/components/dashboard";
import { listProjects } from "@/lib/store";
import { Button } from "@/components/ui";

export default async function HomePage() {
  const projects = await listProjects();

  return (
    <main className="min-h-screen bg-bgSecondary">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-secondary">社員向け業務ツール</div>
            <div className="text-2xl font-semibold">店舗HP生成OS</div>
          </div>
          <div className="flex gap-2">
            <Button href="/projects/new">新規プロジェクト</Button>
          </div>
        </header>
        <Dashboard projects={projects} />
      </div>
    </main>
  );
}
