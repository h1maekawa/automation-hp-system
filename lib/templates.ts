import { SiteAnalysis, TemplateDefinition } from "@/lib/types";

export const defaultAnalysis: SiteAnalysis = {
  sections: ["hero", "about", "services", "faq", "cta", "footer"],
  colorPalette: {
    primary: "#1a1a18",
    accent: "#d85a30",
    background: "#ffffff"
  },
  fontStyle: "serif_heading + sans_body",
  layoutType: "single_column_lp",
  tone: "professional",
  keyElements: ["large_hero_image", "full_width_cta", "testimonial_section"],
  writingStyle: "elegant"
};

const baseHtml = ({
  brand,
  accent,
  surface,
  text,
  muted,
  headingFont
}: {
  brand: string;
  accent: string;
  surface: string;
  text: string;
  muted: string;
  headingFont: string;
}) => `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{seo_title}}</title>
    <meta name="description" content="{{seo_description}}" />
    <style>
      :root {
        --brand: ${brand};
        --accent: ${accent};
        --surface: ${surface};
        --text: ${text};
        --muted: ${muted};
      }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, "Noto Sans JP", sans-serif; color: var(--text); background: #fff; line-height: 1.7; }
      h1,h2,h3 { margin: 0 0 16px; font-family: ${headingFont}; line-height: 1.2; }
      p { margin: 0; }
      a { color: inherit; text-decoration: none; }
      .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
      .hero { background: linear-gradient(140deg, var(--brand), color-mix(in srgb, var(--brand) 70%, #fff)); color: #fff; padding: 96px 0 84px; }
      .hero-grid { display: grid; gap: 32px; grid-template-columns: 1.2fr 0.8fr; align-items: center; }
      .hero-card { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 28px; backdrop-filter: blur(8px); }
      .eyebrow { display: inline-block; padding: 8px 12px; border-radius: 999px; background: rgba(255,255,255,0.14); font-size: 12px; margin-bottom: 18px; }
      .hero h1 { font-size: clamp(36px, 5vw, 64px); letter-spacing: -0.04em; }
      .hero p { font-size: 18px; color: rgba(255,255,255,0.88); max-width: 720px; }
      .cta { margin-top: 28px; display: inline-flex; background: #fff; color: var(--brand); padding: 14px 22px; border-radius: 999px; font-weight: 700; }
      .section { padding: 72px 0; }
      .section-alt { background: var(--surface); }
      .section-head { display: flex; align-items: end; justify-content: space-between; gap: 24px; margin-bottom: 28px; }
      .section-head p { color: var(--muted); max-width: 720px; }
      .cards { display: grid; gap: 20px; grid-template-columns: repeat(2, minmax(0,1fr)); }
      .card { background: #fff; border: 1px solid rgba(0,0,0,0.08); border-radius: 20px; padding: 24px; }
      .price { margin-top: 12px; font-weight: 700; color: var(--accent); }
      .faq-item { border-bottom: 1px solid rgba(0,0,0,0.08); padding: 18px 0; }
      .faq-item strong { display: block; margin-bottom: 8px; }
      .about-copy { max-width: 860px; color: var(--muted); }
      .tagline { margin-top: 18px; color: var(--accent); font-weight: 700; }
      .info-list { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 14px; }
      .info-item { background: #fff; padding: 18px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.08); }
      footer { padding: 30px 0 50px; color: var(--muted); }
      @media (max-width: 860px) {
        .hero-grid, .cards, .info-list { grid-template-columns: 1fr; }
        .section-head { flex-direction: column; align-items: start; }
      }
    </style>
  </head>
  <body>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">{{shop_name}} / {{genre}}</span>
          <h1>{{hero_title}}</h1>
          <p>{{hero_subtitle}}</p>
          <a class="cta" href="{{hero_cta_url}}">{{hero_cta_text}}</a>
        </div>
        <div class="hero-card">
          <h3>${brand === "#1a1a18" ? "店舗情報" : "ご案内"}</h3>
          <p>営業時間: {{business_hours}}</p>
          <p>定休日: {{holiday}}</p>
          <p>住所: {{address}}</p>
          <p>電話: {{phone}}</p>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>{{about_heading}}</h2>
            <p class="about-copy">{{about_body}}</p>
            <p class="tagline">{{about_tagline}}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>サービス・メニュー</h2>
            <p>AI生成テキストをMustache変数でテンプレートに注入しています。</p>
          </div>
        </div>
        <div class="cards">
          {{#services}}
          <article class="card">
            <h3>{{service_title}}</h3>
            <p>{{service_description}}</p>
            <div class="price">{{service_price}}</div>
          </article>
          {{/services}}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>よくある質問</h2>
            <p>公開前プレビューで文言を再編集できます。</p>
          </div>
        </div>
        <div>
          {{#faq}}
          <div class="faq-item">
            <strong>Q. {{faq_question}}</strong>
            <p>A. {{faq_answer}}</p>
          </div>
          {{/faq}}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          <div>
            <h2>ご予約・お問い合わせ</h2>
            <p>店舗情報はそのまま表示。AIが生成しないデータも固定変数として扱えます。</p>
          </div>
          <a class="cta" href="{{hero_cta_url}}" style="background: var(--accent); color: #fff;">{{hero_cta_text}}</a>
        </div>
        <div class="info-list">
          <div class="info-item"><strong>営業時間</strong><br />{{business_hours}}</div>
          <div class="info-item"><strong>定休日</strong><br />{{holiday}}</div>
          <div class="info-item"><strong>住所</strong><br />{{address}}</div>
          <div class="info-item"><strong>電話番号</strong><br />{{phone}}</div>
        </div>
      </div>
    </section>

    <footer>
      <div class="container">
        <p>{{shop_name}} / {{genre}}</p>
        <p>{{address}}</p>
        {{#if_instagram}}<p>Instagram: {{instagram_url}}</p>{{/if_instagram}}
      </div>
    </footer>
  </body>
</html>`;

export const templateCatalog: TemplateDefinition[] = [
  {
    id: "restaurant-luxury-01",
    name: "高級飲食 LP",
    category: "restaurant",
    style: "luxury",
    size: "1ページLP",
    tags: ["飲食", "高級感", "LP"],
    description: "高級店や記念日利用向け。落ち着いた余白と上品な見出し。",
    previewTitle: "黒毛和牛・鮨・割烹向け",
    thumbnailGradient: "linear-gradient(135deg,#1a1a18,#564331)",
    html: baseHtml({ brand: "#1a1a18", accent: "#d85a30", surface: "#f5f5f4", text: "#1a1a18", muted: "#5f5e5a", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "faq", "business_hours", "address", "phone", "instagram_url", "seo_title", "seo_description"],
    sampleAnalysis: { ...defaultAnalysis, tone: "luxury" }
  },
  {
    id: "beauty-natural-01",
    name: "美容サロン ナチュラル",
    category: "beauty",
    style: "natural",
    size: "1ページLP",
    tags: ["美容", "ナチュラル", "予約導線"],
    description: "サロン・整体・エステ向け。柔らかい配色と安心感重視。",
    previewTitle: "エステ・ヘアサロン向け",
    thumbnailGradient: "linear-gradient(135deg,#9b7b64,#e5d2bd)",
    html: baseHtml({ brand: "#7c5a45", accent: "#b68752", surface: "#f8f2eb", text: "#342821", muted: "#6b5a50", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "faq", "business_hours", "address", "phone", "instagram_url", "seo_title", "seo_description"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly", colorPalette: { primary: "#7c5a45", accent: "#b68752", background: "#fffaf7" }, keyElements: ["soft_hero_visual", "reservation_cta", "profile_section"] }
  },
  {
    id: "medical-clean-01",
    name: "医療・クリニック クリーン",
    category: "medical",
    style: "minimal",
    size: "3〜5ページ風LP",
    tags: ["医療", "清潔感", "信頼感"],
    description: "医院・歯科・整体向け。清潔な白ベースと情報整理に強い構成。",
    previewTitle: "クリニック向け",
    thumbnailGradient: "linear-gradient(135deg,#185fa5,#7db6ea)",
    html: baseHtml({ brand: "#185fa5", accent: "#2a7dd1", surface: "#eef6fd", text: "#15314c", muted: "#4c6478", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "faq", "business_hours", "address", "phone", "instagram_url", "seo_title", "seo_description"],
    sampleAnalysis: { ...defaultAnalysis, tone: "professional", colorPalette: { primary: "#185fa5", accent: "#2a7dd1", background: "#ffffff" }, keyElements: ["trust_badges", "faq", "cta"] }
  },
  {
    id: "custom-reference-01",
    name: "外部参考サイトベース",
    category: "custom",
    style: "adaptive",
    size: "1ページLP",
    tags: ["外部参照", "可変トーン", "AI解析"],
    description: "URLやスクリーンショットから取得した分析結果を反映する汎用テンプレート。",
    previewTitle: "外部サイト参照向け",
    thumbnailGradient: "linear-gradient(135deg,#2e3255,#8790d8)",
    html: baseHtml({ brand: "#2e3255", accent: "#6d78d8", surface: "#f4f6ff", text: "#1c2140", muted: "#5b6387", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "faq", "business_hours", "address", "phone", "instagram_url", "seo_title", "seo_description"],
    sampleAnalysis: defaultAnalysis
  }
];

export const categories = {
  industry: [
    { id: "restaurant", label: "飲食・カフェ", icon: "🍽️" },
    { id: "beauty", label: "美容・サロン", icon: "💇" },
    { id: "medical", label: "医療・クリニック", icon: "🏥" },
    { id: "retail", label: "物販・買取", icon: "📦" },
    { id: "fitness", label: "フィットネス", icon: "💪" },
    { id: "service", label: "サービス業", icon: "🤝" }
  ],
  style: [
    { id: "luxury", label: "高級感", description: "上品・落ち着き" },
    { id: "minimal", label: "ミニマル", description: "シンプル・清潔感" },
    { id: "natural", label: "ナチュラル", description: "温かみ・癒し" },
    { id: "modern", label: "モダン", description: "スタイリッシュ" },
    { id: "pop", label: "ポップ", description: "明るい・親しみやすい" }
  ],
  size: [
    { id: "lp", label: "1ページLP" },
    { id: "mid", label: "3〜5ページ" },
    { id: "large", label: "多ページ" }
  ]
};

export function getTemplateById(id: string) {
  return templateCatalog.find((template) => template.id === id) ?? templateCatalog[0];
}
