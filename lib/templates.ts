import { SectionName, SiteAnalysis, TemplateDefinition } from "./types";

const defaultAnalysis: SiteAnalysis = {
  sections: ["hero", "about", "services", "gallery", "faq", "cta", "footer"],
  colorPalette: {
    primary: "#1a1a1a",
    accent: "#d85a30",
    background: "#ffffff"
  },
  fontStyle: "sans-serif",
  layoutType: "modern-lp",
  tone: "friendly",
  keyElements: ["hero_visual", "feature_grid", "contact_form"],
  writingStyle: "polite"
};

const baseHtml = ({ brand, accent, surface, text, muted, headingFont }: any) => `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{seo_title}}</title>
  <meta name="description" content="{{seo_description}}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Noto+Serif+JP:wght@700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: ${brand};
      --accent: ${accent};
      --surface: ${surface};
      --text: ${text};
      --muted: ${muted};
    }
    body { font-family: 'Noto Sans JP', sans-serif; color: var(--text); background: var(--surface); }
    h1, h2, h3 { font-family: ${headingFont}; }
    .bg-brand { background-color: var(--brand); }
    .text-brand { color: var(--brand); }
    .bg-accent { background-color: var(--accent); }
    .text-accent { color: var(--accent); }
  </style>
</head>
<body>
  <header className="fixed top-0 z-50 w-full bg-surface/80 backdrop-blur-md border-b border-black/5">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <div className="text-xl font-bold text-brand">{{shop_name}}</div>
      <nav className="hidden space-x-6 text-sm font-medium md:flex">
        <a href="#about" className="hover:text-accent">コンセプト</a>
        <a href="#menu" className="hover:text-accent">メニュー</a>
        <a href="#contact" className="hover:text-accent">アクセス</a>
      </nav>
      <a href="{{hero_cta_url}}" className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-white hover:opacity-90">
        {{hero_cta_text}}
      </a>
    </div>
  </header>

  <section id="hero" className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-brand pt-20">
    <div className="absolute inset-0 bg-black/40"></div>
    <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
      <div className="mb-4 text-lg font-medium tracking-widest text-accent">{{shop_name}}</div>
      <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">{{hero_title}}</h1>
      <p className="mb-10 text-lg opacity-90 md:text-xl">{{hero_subtitle}}</p>
      <a href="{{hero_cta_url}}" className="inline-block rounded-full bg-accent px-10 py-4 text-lg font-bold text-white shadow-xl transition-transform hover:scale-105">
        {{hero_cta_text}}
      </a>
    </div>
  </section>

  <section id="about" className="py-20 md:py-32">
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-4 text-sm font-bold tracking-widest text-accent uppercase">{{about_tagline}}</div>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">{{about_heading}}</h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted">{{{about_body}}}</div>
        </div>
        <div className="aspect-[4/5] rounded-3xl bg-black/5 overflow-hidden">
          <div className="flex h-full items-center justify-center text-muted italic">Concept Visual</div>
        </div>
      </div>
    </div>
  </section>

  <section id="menu" className="bg-black/5 py-20 md:py-32">
    <div className="mx-auto max-w-6xl px-4 text-center">
      <h2 className="mb-16 text-3xl font-bold md:text-4xl">Menu & Services</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {{#services}}
        <div className="rounded-3xl bg-white p-8 shadow-sm transition-transform hover:-translate-y-1">
          <h3 className="mb-3 text-xl font-bold">{{service_title}}</h3>
          <p className="mb-4 text-sm text-muted leading-relaxed">{{service_description}}</p>
          <div className="text-lg font-bold text-accent">{{service_price}}</div>
        </div>
        {{/services}}
      </div>
    </div>
  </section>

  <footer id="contact" className="bg-brand py-20 text-white/90">
    <div className="mx-auto max-w-6xl px-4 text-center">
      <h2 className="mb-10 text-3xl font-bold text-white">{{shop_name}}</h2>
      <div className="mb-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="mb-2 font-bold text-white">Address</div>
          <p className="text-sm opacity-80">{{address}}</p>
        </div>
        <div>
          <div className="mb-2 font-bold text-white">Business Hours</div>
          <p className="text-sm opacity-80">{{business_hours}}</p>
        </div>
        <div>
          <div className="mb-2 font-bold text-white">Phone</div>
          <p className="text-sm opacity-80">{{phone}}</p>
        </div>
      </div>
      <div className="border-t border-white/10 pt-10 text-xs opacity-50">
        &copy; {{shop_name}} All Rights Reserved.
      </div>
    </div>
  </footer>
</body>
</html>
`;

export const templateCatalog: TemplateDefinition[] = [
  // ■ 居酒屋・和食・焼き鳥系
  {
    id: "izakaya-utaya",
    name: "小料理 歌屋 スタイル",
    category: "izakaya-washoku",
    style: "traditional",
    size: "1ページLP",
    tags: ["和食", "小料理", "落ち着いた"],
    description: "情緒ある和風デザイン。割烹や小料理店に最適。",
    previewTitle: "小料理 歌屋",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/koryouri-utaya/",
    thumbnailGradient: "linear-gradient(135deg,#262626,#404040)",
    html: baseHtml({ brand: "#171717", accent: "#991b1b", surface: "#fafaf9", text: "#171717", muted: "#404040", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "luxury" }
  },
  {
    id: "izakaya-rakusyaku",
    name: "らくしゃく スタイル",
    category: "izakaya-washoku",
    style: "traditional-wa",
    size: "1ページLP",
    tags: ["居酒屋", "和食", "親しみやすい"],
    description: "地域に根ざした親しみやすい和風デザイン。",
    previewTitle: "らくしゃく",
    referenceUrl: "https://keikokamiya-spec.github.io/rakusyaku/",
    thumbnailGradient: "linear-gradient(135deg,#78350f,#92400e)",
    html: baseHtml({ brand: "#78350f", accent: "#d97706", surface: "#fffbeb", text: "#451a03", muted: "#92400e", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },
  {
    id: "izakaya-torisichi",
    name: "焼き鳥 鳥七 スタイル",
    category: "izakaya-washoku",
    style: "yakitori",
    size: "1ページLP",
    tags: ["焼き鳥", "専門", "活気"],
    description: "炭火の香りが伝わるような、焼き鳥専門店向けデザイン。",
    previewTitle: "焼き鳥 鳥七",
    referenceUrl: "https://keikokamiya-spec.github.io/yakitori-torisichi/",
    thumbnailGradient: "linear-gradient(135deg,#111827,#374151)",
    html: baseHtml({ brand: "#111827", accent: "#ef4444", surface: "#f9fafb", text: "#111827", muted: "#4b5563", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },
  {
    id: "izakaya-emi",
    name: "たこ焼き居酒屋 笑実 スタイル",
    category: "izakaya-washoku",
    style: "pop-wa",
    size: "1ページLP",
    tags: ["たこ焼き", "居酒屋", "カジュアル"],
    description: "明るく楽しい雰囲気を演出する、カジュアルな居酒屋デザイン。",
    previewTitle: "たこ焼き居酒屋 笑実",
    referenceUrl: "https://keikokamiya-spec.github.io/takoyakiizakaya-emi/",
    thumbnailGradient: "linear-gradient(135deg,#ea580c,#f97316)",
    html: baseHtml({ brand: "#ea580c", accent: "#facc15", surface: "#fff7ed", text: "#7c2d12", muted: "#9a3412", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },

  // ■ バー・パブ系
  {
    id: "bar-charlie",
    name: "Charlie's Bar スタイル",
    category: "bar-pub",
    style: "classic-bar",
    size: "1ページLP",
    tags: ["オーセンティック", "バー", "高級感"],
    description: "重厚感のあるクラシックなバー向けデザイン。",
    previewTitle: "Charlie's Bar",
    referenceUrl: "https://keikokamiya-spec.github.io/basyadou-Charlie-s-Bar/",
    thumbnailGradient: "linear-gradient(135deg,#000000,#262626)",
    html: baseHtml({ brand: "#0a0a0a", accent: "#b45309", surface: "#171717", text: "#f5f5f5", muted: "#a3a3a3", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "luxury" }
  },
  {
    id: "bar-peat",
    name: "BAR PEAT スタイル",
    category: "bar-pub",
    style: "modern-bar",
    size: "1ページLP",
    tags: ["ウイスキー", "モダン", "スタイリッシュ"],
    description: "洗練された都会的なバー向けデザイン。",
    previewTitle: "BAR PEAT",
    referenceUrl: "https://keikokamiya-spec.github.io/BAR-PEAT/",
    thumbnailGradient: "linear-gradient(135deg,#1e1b4b,#312e81)",
    html: baseHtml({ brand: "#1e1b4b", accent: "#4338ca", surface: "#1e1b4b", text: "#eef2ff", muted: "#a5b4fc", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "professional" }
  },
  {
    id: "bar-21st",
    name: "パブ 21世紀 スタイル",
    category: "bar-pub",
    style: "retro-pub",
    size: "1ページLP",
    tags: ["パブ", "レトロ", "カラオケ"],
    description: "懐かしさと賑やかさを感じさせるパブデザイン。",
    previewTitle: "パブ 21世紀",
    referenceUrl: "https://keikokamiya-spec.github.io/pabu21seiki/",
    thumbnailGradient: "linear-gradient(135deg,#312e81,#4338ca)",
    html: baseHtml({ brand: "#312e81", accent: "#fbbf24", surface: "#1e1b4b", text: "#f8fafc", muted: "#94a3b8", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },

  // ■ カフェ系
  {
    id: "cafe-poplar",
    name: "Poplar Coffee スタイル",
    category: "cafe",
    style: "natural-cafe",
    size: "1ページLP",
    tags: ["カフェ", "ナチュラル", "温かみ"],
    description: "柔らかい配色と余白が特徴のカフェデザイン。",
    previewTitle: "Poplar Coffee",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/Poplar-Coffee-site/",
    thumbnailGradient: "linear-gradient(135deg,#9b7b64,#e5d2bd)",
    html: baseHtml({ brand: "#7c5a45", accent: "#b68752", surface: "#f8f2eb", text: "#342821", muted: "#6b5a50", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },
  {
    id: "cafe-akubi",
    name: "cafe Akubi スタイル",
    category: "cafe",
    style: "stylish-cafe",
    size: "1ページLP",
    tags: ["カフェ", "モダン", "お洒落"],
    description: "都会的で洗練されたカフェ向けデザイン。",
    previewTitle: "cafe Akubi",
    referenceUrl: "https://keikokamiya-spec.github.io/-cafe--Akubi/",
    thumbnailGradient: "linear-gradient(135deg,#111827,#4b5563)",
    html: baseHtml({ brand: "#111827", accent: "#6366f1", surface: "#f9fafb", text: "#111827", muted: "#6b7280", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "professional" }
  },

  // ■ スナック・カラオケ系
  {
    id: "snack-chance",
    name: "Snack Chance スタイル",
    category: "snack",
    style: "neon-snack",
    size: "1ページLP",
    tags: ["スナック", "華やか", "夜"],
    description: "夜の街を彩る華やかなスナックデザイン。",
    previewTitle: "Snack Chance",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/snack-Chance/",
    thumbnailGradient: "linear-gradient(135deg,#4c1d95,#7c3aed)",
    html: baseHtml({ brand: "#4c1d95", accent: "#ec4899", surface: "#2e1065", text: "#f5f3ff", muted: "#c4b5fd", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },
  {
    id: "snack-kannnamu",
    name: "スナック カンナム スタイル",
    category: "snack",
    style: "home-snack",
    size: "1ページLP",
    tags: ["スナック", "アットホーム", "カラオケ"],
    description: "親しみやすさとアットホームな雰囲気を伝えるスナックデザイン。",
    previewTitle: "スナック カンナム",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/Sunack-Kannnamu/",
    thumbnailGradient: "linear-gradient(135deg,#831843,#be185d)",
    html: baseHtml({ brand: "#831843", accent: "#f472b6", surface: "#fff1f2", text: "#831843", muted: "#be185d", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "friendly" }
  },

  // ■ 洋食・その他
  {
    id: "western-mitsuwa",
    name: "洋食 みつわ スタイル",
    category: "western-others",
    style: "retro-western",
    size: "1ページLP",
    tags: ["洋食", "レトロ", "安心感"],
    description: "伝統的な洋食店を感じさせるデザイン。",
    previewTitle: "洋食 みつわ",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/Western-style-restaurant-Mitsuwa/",
    thumbnailGradient: "linear-gradient(135deg,#7f1d1d,#b91c1c)",
    html: baseHtml({ brand: "#7f1d1d", accent: "#ea580c", surface: "#fff7ed", text: "#450a0a", muted: "#78716c", headingFont: '"Noto Serif JP", serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "professional" }
  },
  {
    id: "western-hanzo",
    name: "HANZO KITCHEN スタイル",
    category: "western-others",
    style: "modern-kitchen",
    size: "1ページLP",
    tags: ["イタリアン", "モダン", "お洒落"],
    description: "都会的でお洒落なイタリアン・キッチン向けデザイン。",
    previewTitle: "HANZO KITCHEN",
    referenceUrl: "https://hiroyukimaekawa-lang.github.io/hanzo-kicthen/",
    thumbnailGradient: "linear-gradient(135deg,#111827,#374151)",
    html: baseHtml({ brand: "#111827", accent: "#10b981", surface: "#f9fafb", text: "#111827", muted: "#6b7280", headingFont: '"Noto Sans JP", sans-serif' }),
    variables: ["shop_name", "hero_title", "hero_subtitle", "hero_cta_text", "about_heading", "about_body", "about_tagline", "services", "business_hours", "address", "phone"],
    sampleAnalysis: { ...defaultAnalysis, tone: "professional" }
  }
];

export const categories = {
  industry: [
    { id: "izakaya-washoku", label: "居酒屋・和食", icon: "🏮" },
    { id: "bar-pub", label: "バー・パブ", icon: "🍸" },
    { id: "cafe", label: "カフェ", icon: "☕" },
    { id: "snack", label: "スナック", icon: "🎤" },
    { id: "western-others", label: "洋食・その他", icon: "🍽️" }
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

export const getTemplateById = (id: string) => {
  return templateCatalog.find((t) => t.id === id) || templateCatalog[0];
};
