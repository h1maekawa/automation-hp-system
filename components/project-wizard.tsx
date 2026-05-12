"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categories, getTemplateById, templateCatalog } from "@/lib/templates";
import { GeneratedContent, ProjectRecord, SectionName, ShopInfo, SiteAnalysis } from "@/lib/types";
import {
  Badge,
  Button,
  Card,
  CheckRow,
  EditableBlock,
  Input,
  Label,
  Modal,
  ProjectSidebar,
  SectionTitle,
  StepNav,
  TemplateCard,
  Textarea
} from "@/components/ui";

const shopSchema = z.object({
  projectName: z.string().min(1, "プロジェクト名は必須です"),
  shopName: z.string().min(1, "店舗名は必須です"),
  catchphrase: z.string().optional(),
  genre: z.string().min(1, "業種は必須です"),
  concept: z.string().min(1, "コンセプトは必須です"),
  target: z.string().optional(),
  budget: z.string().optional(),
  hours: z.string().optional(),
  holiday: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  instagram: z.string().optional(),
  reservationUrl: z.string().optional()
});

type ShopFormValues = z.infer<typeof shopSchema>;

type SourceType = "gallery" | "external-url" | "screenshot";

export function ProjectWizard({ initialProject }: { initialProject?: ProjectRecord | null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | undefined>(initialProject?.id);
  const [category, setCategory] = useState(initialProject?.category || "restaurant");
  const [templateId, setTemplateId] = useState(initialProject?.templateId || "restaurant-luxury-01");
  const [sourceType, setSourceType] = useState<SourceType>(initialProject?.sourceType || "gallery");
  const [referenceUrl, setReferenceUrl] = useState(initialProject?.referenceUrl || "");
  const [urlModalOpen, setUrlModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SiteAnalysis | null>(initialProject?.siteAnalysis || null);
  const [selectedSections, setSelectedSections] = useState<SectionName[]>(initialProject?.selectedSections || []);
  const [phase3Mode, setPhase3Mode] = useState<"form" | "review">(initialProject?.shopInfo ? "review" : "form");
  const [shopInfo, setShopInfo] = useState<ShopInfo | null>(initialProject?.shopInfo || null);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(initialProject?.generatedContent || null);
  const [renderedHtml, setRenderedHtml] = useState(initialProject?.renderedHtml || "");
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState(initialProject?.deployUrl || "");
  const [error, setError] = useState<string | null>(null);

  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const filteredTemplates = useMemo(() => templateCatalog.filter((item) => item.category === category || item.category === "custom"), [category]);

  const form = useForm<ShopFormValues>({
    resolver: zodResolver(shopSchema),
    defaultValues: {
      projectName: initialProject?.shopInfo?.projectName || initialProject?.name || "",
      shopName: initialProject?.shopInfo?.shopName || "",
      catchphrase: initialProject?.shopInfo?.catchphrase || "",
      genre: initialProject?.shopInfo?.genre || "",
      concept: initialProject?.shopInfo?.concept || "",
      target: initialProject?.shopInfo?.target || "",
      budget: initialProject?.shopInfo?.budget || "",
      hours: initialProject?.shopInfo?.hours || "",
      holiday: initialProject?.shopInfo?.holiday || "",
      address: initialProject?.shopInfo?.address || "",
      phone: initialProject?.shopInfo?.phone || "",
      instagram: initialProject?.shopInfo?.instagram || "",
      reservationUrl: initialProject?.shopInfo?.reservationUrl || ""
    }
  });

  const projectSidebarItems = [
    { label: "プロジェクト名", value: form.watch("projectName") || initialProject?.name || "新規プロジェクト" },
    { label: "テンプレート", value: template.name },
    { label: "参照方法", value: sourceType === "gallery" ? "ギャラリー" : sourceType === "external-url" ? "外部URL" : "スクリーンショット" },
    { label: "作成日", value: initialProject?.createdAt ? new Date(initialProject.createdAt).toLocaleDateString("ja-JP") : new Date().toLocaleDateString("ja-JP") }
  ];

  const variableChecks = useMemo(() => {
    const values = form.getValues();
    return [
      { label: "店舗名", ok: Boolean(values.shopName), note: "ヒーローとSEOに反映" },
      { label: "コンセプト・強み", ok: Boolean(values.concept), note: "About文とサービス説明に反映" },
      { label: "電話番号", ok: Boolean(values.phone), note: "CTAと問い合わせ導線に影響" },
      { label: "営業時間", ok: Boolean(values.hours), note: "固定情報としてそのまま表示" },
      { label: "Instagram", ok: Boolean(values.instagram), note: "未入力ならSNS表記をスキップ" }
    ];
  }, [form]);

  async function saveProject(status: ProjectRecord["status"], extra?: Partial<ProjectRecord>) {
    const payload = {
      id: projectId,
      name: form.getValues("projectName") || initialProject?.name || template.name,
      category,
      templateId,
      sourceType,
      referenceUrl,
      siteAnalysis: analysis || undefined,
      selectedSections,
      shopInfo: shopInfo || undefined,
      generatedContent: generatedContent || undefined,
      renderedHtml: renderedHtml || undefined,
      deployUrl: deployUrl || undefined,
      status,
      ...extra
    };
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = (await response.json()) as ProjectRecord;
    setProjectId(result.id);
    return result;
  }

  async function handleTemplateAnalyze() {
    setError(null);
    setAnalysis(template.sampleAnalysis);
    setSelectedSections(template.sampleAnalysis.sections);
    setCurrentStep(2);
  }

  async function handleAnalyzeUrl() {
    if (!referenceUrl) return;
    setAnalysisLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/analyze-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: referenceUrl })
      });
      const result = (await response.json()) as { analysis: SiteAnalysis };
      setSourceType("external-url");
      setTemplateId("custom-reference-01");
      setAnalysis(result.analysis);
      setSelectedSections(result.analysis.sections);
      setUrlModalOpen(false);
      setCurrentStep(2);
    } catch {
      setError("URL解析に失敗しました。もう一度お試しください。");
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function handleAnalyzeScreenshot(file?: File | null) {
    if (!file) return;
    setAnalysisLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/analyze-screenshot", { method: "POST", body: formData });
      const result = (await response.json()) as { analysis: SiteAnalysis };
      setSourceType("screenshot");
      setTemplateId("custom-reference-01");
      setAnalysis(result.analysis);
      setSelectedSections(result.analysis.sections);
      setUploadModalOpen(false);
      setCurrentStep(2);
    } catch {
      setError("スクリーンショット解析に失敗しました。");
    } finally {
      setAnalysisLoading(false);
    }
  }

  async function confirmAnalysis() {
    await saveProject("analyzed");
    setCurrentStep(3);
  }

  async function onSubmitForm(values: ShopFormValues) {
    setShopInfo(values);
    setPhase3Mode("review");
    await saveProject("analyzed", { name: values.projectName, shopInfo: values });
  }

  async function runGeneration() {
    const values = shopInfo || form.getValues();
    setGenerationLoading(true);
    setError(null);
    setGenerationProgress(10);
    const progressTimer = window.setInterval(() => {
      setGenerationProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 350);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopInfo: values, siteAnalysis: analysis, templateId })
      });
      const result = (await response.json()) as { content: GeneratedContent };
      setGeneratedContent(result.content);
      setGenerationProgress(100);
      setCurrentStep(4);
      await saveProject("generated", { shopInfo: values, generatedContent: result.content });
    } catch {
      setError("コンテンツ生成に失敗しました。");
    } finally {
      window.clearInterval(progressTimer);
      setGenerationLoading(false);
    }
  }

  async function runRender(nextStep = true) {
    if (!generatedContent) return;
    const values = shopInfo || form.getValues();
    const response = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId, shopInfo: values, generatedContent })
    });
    const result = (await response.json()) as { html: string };
    setRenderedHtml(result.html);
    await saveProject("previewed", { shopInfo: values, generatedContent, renderedHtml: result.html });
    if (nextStep) setCurrentStep(5);
  }

  async function runDeploy() {
    if (!renderedHtml) return;
    setDeploying(true);
    setError(null);
    try {
      const response = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, templateId, category, sourceType, referenceUrl, siteAnalysis: analysis, selectedSections, shopInfo: shopInfo || form.getValues(), generatedContent, renderedHtml, name: form.getValues("projectName") })
      });
      const result = (await response.json()) as { deployUrl: string; project: ProjectRecord };
      setDeployUrl(result.deployUrl);
      setProjectId(result.project.id);
      setCurrentStep(6);
    } catch {
      setError("公開処理に失敗しました。");
    } finally {
      setDeploying(false);
    }
  }

  useEffect(() => {
    if (initialProject?.status === "deployed") {
      setCurrentStep(6);
    } else if (initialProject?.status === "previewed") {
      setCurrentStep(5);
    } else if (initialProject?.status === "generated") {
      setCurrentStep(4);
    } else if (initialProject?.status === "analyzed") {
      setCurrentStep(3);
    }
  }, [initialProject]);

  const previewWidthClass = previewMode === "desktop" ? "w-full" : previewMode === "tablet" ? "mx-auto w-[768px] max-w-full" : "mx-auto w-[375px] max-w-full";

  return (
    <div className="min-h-screen bg-bgSecondary">
      <StepNav current={currentStep} />
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          {error && (
            <Card className="border-danger bg-dangerBg p-4 text-sm text-danger">{error}</Card>
          )}

          {currentStep === 1 && (
            <Card className="p-6">
              <SectionTitle title="STEP1: テンプレート選択" description="カテゴリからテンプレートを選ぶか、外部URL/スクリーンショットを参照元にできます。" />
              <div className="grid gap-6">
                <div>
                  <Label>業種カテゴリ</Label>
                  <div className="grid gap-3 md:grid-cols-3">
                    {categories.industry.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCategory(item.id)}
                        className={`rounded-2xl border p-4 text-left ${category === item.id ? "border-primary bg-bgSecondary" : "border-black/10 bg-white"}`}
                      >
                        <div className="text-2xl">{item.icon}</div>
                        <div className="mt-2 font-semibold">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" onClick={() => setUrlModalOpen(true)}>外部URLを解析</Button>
                  <Button variant="secondary" onClick={() => setUploadModalOpen(true)}>スクリーンショットを添付</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredTemplates.map((item) => (
                    <TemplateCard
                      key={item.id}
                      title={item.name}
                      subtitle={item.description}
                      tags={item.tags}
                      gradient={item.thumbnailGradient}
                      selected={templateId === item.id}
                      onClick={() => {
                        setSourceType("gallery");
                        setTemplateId(item.id);
                      }}
                    />
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button size="lg" onClick={handleTemplateAnalyze}>このテンプレートで進む</Button>
                </div>
              </div>
            </Card>
          )}

          {currentStep === 2 && analysis && (
            <Card className="p-6">
              <SectionTitle title="STEP2: AI解析結果の確認" description="抽出されたセクションを必要に応じてON/OFFできます。" />
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-5">
                  <div className="text-sm font-semibold">抽出セクション</div>
                  <div className="mt-4 grid gap-3">
                    {analysis.sections.map((section) => {
                      const enabled = selectedSections.includes(section);
                      return (
                        <label key={section} className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-sm">
                          <span>{section}</span>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={() => setSelectedSections((prev) => prev.includes(section) ? prev.filter((item) => item !== section) : [...prev, section])}
                          />
                        </label>
                      );
                    })}
                  </div>
                </Card>
                <div className="space-y-4">
                  <Card className="p-5">
                    <div className="text-sm font-semibold">トーン / レイアウト</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="info">tone: {analysis.tone}</Badge>
                      <Badge>font: {analysis.fontStyle}</Badge>
                      <Badge>layout: {analysis.layoutType}</Badge>
                      <Badge>writing: {analysis.writingStyle}</Badge>
                    </div>
                  </Card>
                  <Card className="p-5">
                    <div className="text-sm font-semibold">カラーパレット</div>
                    <div className="mt-4 flex gap-3">
                      {[analysis.colorPalette.primary, analysis.colorPalette.accent, analysis.colorPalette.background].map((color) => (
                        <div key={color} className="space-y-2 text-center text-xs">
                          <div className="h-16 w-16 rounded-2xl border border-black/10" style={{ background: color }} />
                          <div>{color}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                  <Card className="p-5">
                    <div className="text-sm font-semibold">主要要素</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {analysis.keyElements.map((item) => <Badge key={item}>{item}</Badge>)}
                    </div>
                  </Card>
                </div>
              </div>
              <div className="mt-6 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(1)}>戻る</Button>
                <Button size="lg" onClick={confirmAnalysis}>このまま次へ</Button>
              </div>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="p-6">
              <SectionTitle title="STEP3: 店舗情報入力" description="テンプレート固定・AIテキスト生成前提の入力フォームです。" />
              {phase3Mode === "form" ? (
                <form onSubmit={form.handleSubmit(onSubmitForm)} className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label required>プロジェクト名</Label>
                      <Input {...form.register("projectName")} placeholder="例: 和牛苑 LP制作" />
                      <p className="mt-1 text-xs text-danger">{form.formState.errors.projectName?.message}</p>
                    </div>
                    <div>
                      <Label required>店舗名</Label>
                      <Input {...form.register("shopName")} placeholder="例: 焼肉 和牛苑" />
                      <p className="mt-1 text-xs text-danger">{form.formState.errors.shopName?.message}</p>
                    </div>
                    <div>
                      <Label>キャッチフレーズ</Label>
                      <Input {...form.register("catchphrase")} placeholder="例: こだわりの一頭買い" />
                    </div>
                    <div>
                      <Label required>業種</Label>
                      <Input {...form.register("genre")} placeholder="例: 高級焼肉" />
                      <p className="mt-1 text-xs text-danger">{form.formState.errors.genre?.message}</p>
                    </div>
                  </div>

                  <div>
                    <Label required>コンセプト・強み</Label>
                    <Textarea rows={4} {...form.register("concept")} placeholder="厳選和牛を一頭買いで仕入れ、完全個室で接待や記念日に使いやすい。" />
                    <p className="mt-1 text-xs text-danger">{form.formState.errors.concept?.message}</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label>ターゲット顧客</Label>
                      <Input {...form.register("target")} placeholder="例: 接待・記念日" />
                    </div>
                    <div>
                      <Label>予算目安</Label>
                      <Input {...form.register("budget")} placeholder="例: 8,000〜15,000円" />
                    </div>
                    <div>
                      <Label>営業時間</Label>
                      <Input {...form.register("hours")} placeholder="例: 17:00〜23:00" />
                    </div>
                    <div>
                      <Label>定休日</Label>
                      <Input {...form.register("holiday")} placeholder="例: 月曜日" />
                    </div>
                    <div>
                      <Label>住所</Label>
                      <Input {...form.register("address")} placeholder="例: 東京都渋谷区..." />
                    </div>
                    <div>
                      <Label>電話番号</Label>
                      <Input {...form.register("phone")} placeholder="例: 03-1234-5678" />
                    </div>
                    <div>
                      <Label>Instagram URL</Label>
                      <Input {...form.register("instagram")} placeholder="例: https://instagram.com/yourshop" />
                    </div>
                    <div>
                      <Label>予約URL</Label>
                      <Input {...form.register("reservationUrl")} placeholder="例: https://example.com/reserve" />
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => setCurrentStep(2)}>戻る</Button>
                    <Button type="submit" size="lg">変数チェックへ</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  {variableChecks.map((item) => (
                    <CheckRow key={item.label} label={item.label} status={item.ok ? "ok" : item.label === "Instagram" ? "optional" : "missing"} note={item.note} />
                  ))}
                  <div className="flex justify-between pt-2">
                    <Button variant="secondary" onClick={() => setPhase3Mode("form")}>入力に戻る</Button>
                    <Button size="lg" onClick={() => setCurrentStep(4)}>生成へ進む</Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="p-6">
              <SectionTitle title="STEP4: AI生成エンジン" description="JSON生成結果はそのまま編集できます。必要なら再生成も可能です。" />
              {!generatedContent ? (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-black/10 p-5">
                    <div className="mb-2 text-sm font-semibold">生成進捗</div>
                    <div className="h-3 overflow-hidden rounded-full bg-bgSecondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${generationProgress}%` }} />
                    </div>
                    <div className="mt-2 text-sm text-secondary">{generationLoading ? `${generationProgress}% 生成中` : "生成開始前"}</div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="secondary" onClick={() => setCurrentStep(3)}>戻る</Button>
                    <Button size="lg" onClick={runGeneration} disabled={generationLoading}>{generationLoading ? "生成中..." : "コンテンツ生成を開始"}</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <EditableBlock title="Heroタイトル" value={generatedContent.hero.title} onChange={(value) => setGeneratedContent({ ...generatedContent, hero: { ...generatedContent.hero, title: value } })} />
                    <EditableBlock title="Heroサブタイトル" value={generatedContent.hero.subtitle} onChange={(value) => setGeneratedContent({ ...generatedContent, hero: { ...generatedContent.hero, subtitle: value } })} multiline />
                    <EditableBlock title="CTAテキスト" value={generatedContent.hero.cta_text} onChange={(value) => setGeneratedContent({ ...generatedContent, hero: { ...generatedContent.hero, cta_text: value } })} />
                    <EditableBlock title="About見出し" value={generatedContent.about.heading} onChange={(value) => setGeneratedContent({ ...generatedContent, about: { ...generatedContent.about, heading: value } })} />
                  </div>
                  <EditableBlock title="About本文" value={generatedContent.about.body} onChange={(value) => setGeneratedContent({ ...generatedContent, about: { ...generatedContent.about, body: value } })} multiline />
                  <div className="grid gap-4 md:grid-cols-2">
                    {generatedContent.services.map((service, index) => (
                      <Card key={`${service.service_title}-${index}`} className="space-y-3 p-4">
                        <div className="text-sm font-semibold">サービス {index + 1}</div>
                        <Input value={service.service_title} onChange={(event) => {
                          const services = [...generatedContent.services];
                          services[index] = { ...services[index], service_title: event.target.value };
                          setGeneratedContent({ ...generatedContent, services });
                        }} />
                        <Textarea rows={3} value={service.service_description} onChange={(event) => {
                          const services = [...generatedContent.services];
                          services[index] = { ...services[index], service_description: event.target.value };
                          setGeneratedContent({ ...generatedContent, services });
                        }} />
                        <Input value={service.service_price} onChange={(event) => {
                          const services = [...generatedContent.services];
                          services[index] = { ...services[index], service_price: event.target.value };
                          setGeneratedContent({ ...generatedContent, services });
                        }} />
                      </Card>
                    ))}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {generatedContent.faq.map((faq, index) => (
                      <Card key={`${faq.faq_question}-${index}`} className="space-y-3 p-4">
                        <div className="text-sm font-semibold">FAQ {index + 1}</div>
                        <Input value={faq.faq_question} onChange={(event) => {
                          const faqList = [...generatedContent.faq];
                          faqList[index] = { ...faqList[index], faq_question: event.target.value };
                          setGeneratedContent({ ...generatedContent, faq: faqList });
                        }} />
                        <Textarea rows={3} value={faq.faq_answer} onChange={(event) => {
                          const faqList = [...generatedContent.faq];
                          faqList[index] = { ...faqList[index], faq_answer: event.target.value };
                          setGeneratedContent({ ...generatedContent, faq: faqList });
                        }} />
                      </Card>
                    ))}
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="secondary" onClick={runGeneration}>このセクション群を再生成</Button>
                    <Button size="lg" onClick={() => runRender(true)}>プレビューへ</Button>
                  </div>
                </div>
              )}
            </Card>
          )}

          {currentStep === 5 && (
            <Card className="p-6">
              <SectionTitle title="STEP5: プレビュー" description="デスクトップ / タブレット / スマホ表示を切り替えて確認できます。" />
              <div className="mb-4 flex gap-2">
                <Button variant={previewMode === "desktop" ? "primary" : "secondary"} onClick={() => setPreviewMode("desktop")}>Desktop</Button>
                <Button variant={previewMode === "tablet" ? "primary" : "secondary"} onClick={() => setPreviewMode("tablet")}>Tablet</Button>
                <Button variant={previewMode === "mobile" ? "primary" : "secondary"} onClick={() => setPreviewMode("mobile")}>Mobile</Button>
              </div>
              <div className="overflow-auto rounded-2xl border border-black/10 bg-bgSecondary p-3">
                <div className={previewWidthClass}>
                  <iframe title="preview" srcDoc={renderedHtml} className="h-[780px] w-full rounded-2xl border border-black/10 bg-white" />
                </div>
              </div>
              <div className="mt-5 flex justify-between">
                <Button variant="secondary" onClick={() => setCurrentStep(4)}>生成へ戻る</Button>
                <Button size="lg" onClick={runDeploy}>公開処理へ進む</Button>
              </div>
            </Card>
          )}

          {currentStep === 6 && (
            <Card className="p-6">
              <SectionTitle title="STEP6: 公開完了" description="ローカル永続化付きで公開URLを発行しています。Vercel移行時はこのAPI部分を置き換えればOKです。" />
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-5">
                  <div className="text-sm text-tertiary">公開URL</div>
                  <div className="mt-2 break-all text-base font-semibold text-primary">{deployUrl}</div>
                  <div className="mt-4 flex gap-2">
                    <Button href={deployUrl} size="lg">公開ページを開く</Button>
                    {projectId && <Button href={`/projects/${projectId}`} variant="secondary">詳細を見る</Button>}
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="text-sm font-semibold">次の作業候補</div>
                  <ul className="mt-3 space-y-2 text-sm text-secondary">
                    <li>・GitHub上のテンプレートHTMLに差し替える</li>
                    <li>・Supabaseへ永続保存を移行する</li>
                    <li>・Vercel API / Deploy Hook連携へ置き換える</li>
                    <li>・Claude APIキー設定で本番生成へ切り替える</li>
                  </ul>
                </Card>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button href="/projects/new">新規プロジェクトを作成</Button>
                {projectId && <Button href={`/projects/${projectId}`} variant="secondary">この案件を再確認</Button>}
              </div>
            </Card>
          )}
        </div>

        <ProjectSidebar items={projectSidebarItems} />
      </div>

      <Modal open={urlModalOpen} title="外部URLを解析" onClose={() => setUrlModalOpen(false)}>
        <div className="space-y-4">
          <div>
            <Label>URL</Label>
            <Input value={referenceUrl} onChange={(event) => setReferenceUrl(event.target.value)} placeholder="https://example.com" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setUrlModalOpen(false)}>キャンセル</Button>
            <Button onClick={handleAnalyzeUrl} disabled={analysisLoading}>{analysisLoading ? "解析中..." : "解析開始"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={uploadModalOpen} title="スクリーンショットを添付" onClose={() => setUploadModalOpen(false)}>
        <div className="space-y-4">
          <label className="flex min-h-[180px] cursor-pointer items-center justify-center rounded-2xl border border-dashed border-black/20 bg-bgSecondary p-6 text-center text-sm text-secondary">
            PNG / JPG / WebP を選択
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => handleAnalyzeScreenshot(event.target.files?.[0])}
            />
          </label>
          <div className="text-xs text-tertiary">アップロード後に自動で解析を開始します。</div>
        </div>
      </Modal>

      {(analysisLoading || deploying) && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-sm p-6 text-center">
            <div className="text-lg font-semibold">{deploying ? "公開処理中" : "AI解析中"}</div>
            <div className="mt-2 text-sm text-secondary">少々お待ちください...</div>
          </Card>
        </div>
      )}
    </div>
  );
}
