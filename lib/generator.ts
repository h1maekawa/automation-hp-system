import Anthropic from "@anthropic-ai/sdk";
import { GeneratedContent, ShopInfo, SiteAnalysis } from "@/lib/types";

function truncate(input: string, length: number) {
  return input.length <= length ? input : `${input.slice(0, length - 1)}…`;
}

function fallbackGenerate(shopInfo: ShopInfo, siteAnalysis?: SiteAnalysis): GeneratedContent {
  const tone = siteAnalysis?.tone ?? "professional";
  const shop = shopInfo.shopName || shopInfo.projectName || "店舗名未設定";
  const genre = shopInfo.genre || "店舗";
  const target = shopInfo.target ? `${shopInfo.target}に向けた` : "";
  const concept = shopInfo.concept || "こだわりの価値を丁寧に伝える";
  const styleLead = tone === "luxury"
    ? "上質な時間を静かに引き立てる"
    : tone === "friendly"
      ? "気軽さと心地よさが伝わる"
      : tone === "professional"
        ? "必要な情報が明快に届く"
        : "洗練された印象で魅せる";

  return {
    hero: {
      title: truncate(`${shop}で叶える、${styleLead}${genre}体験`, 25),
      subtitle: truncate(`${target}${concept}を軸に、初めての来店でも魅力が伝わるホームページに仕上げます。`, 40),
      cta_text: truncate(shopInfo.reservationUrl ? "ご予約はこちら" : "お問い合わせ", 10)
    },
    about: {
      heading: truncate(`${shop}について`, 15),
      body: truncate(`${shop}は${concept}を大切にし、${shopInfo.target || "地域のお客様"}に向けて、安心して選ばれる体験を提供します。テンプレート固定により、情報が整理され読みやすい構成で魅力を届けます。`, 120),
      tagline: truncate(tone === "luxury" ? "本質が伝わる、上質な一頁" : tone === "friendly" ? "やさしく伝わる、選ばれる魅力" : "信頼につながる、明快な情報設計", 30)
    },
    services: [
      {
        service_title: truncate(`${genre}の定番プラン`, 20),
        service_description: truncate(`${concept}をわかりやすく伝える主力メニュー・サービス紹介です。`, 60),
        service_price: truncate(shopInfo.budget || "価格はお問い合わせください", 15)
      },
      {
        service_title: truncate(`${shop}のおすすめ`, 20),
        service_description: truncate(`${shopInfo.target || "新規のお客様"}にも魅力が伝わる、比較しやすい訴求文を配置します。`, 60),
        service_price: truncate(shopInfo.budget || "詳細はご相談ください", 15)
      }
    ],
    faq: [
      {
        faq_question: truncate("予約や問い合わせ方法を教えてください", 30),
        faq_answer: truncate(shopInfo.reservationUrl ? `Web予約URLまたはお電話から受け付けています。${shopInfo.phone ? `電話番号は${shopInfo.phone}です。` : ""}` : `お電話${shopInfo.phone ? `（${shopInfo.phone}）` : ""}またはフォームからお問い合わせください。`, 80)
      },
      {
        faq_question: truncate("初めてでも利用しやすいですか", 30),
        faq_answer: truncate(`${shop}では${shopInfo.target || "幅広いお客様"}に向けて、初来店でもわかりやすい案内を用意しています。`, 80)
      }
    ],
    seo: {
      title: truncate(`${shop} | ${genre}の公式ホームページ`, 60),
      description: truncate(`${shop}の公式ホームページ。${concept}をわかりやすく紹介し、営業時間・住所・予約導線まで一つに整理しています。`, 120),
      keywords: [shop, genre, shopInfo.target || "店舗情報"]
    }
  };
}

export async function generateContent(shopInfo: ShopInfo, siteAnalysis?: SiteAnalysis): Promise<GeneratedContent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return fallbackGenerate(shopInfo, siteAnalysis);

  try {
    const anthropic = new Anthropic({ apiKey });
    const prompt = `SYSTEM:\nあなたはプロの店舗ホームページコピーライターです。必ずJSONのみ返してください。\n\nUSER:\n店舗名: ${shopInfo.shopName}\n業種: ${shopInfo.genre}\nコンセプト: ${shopInfo.concept}\nターゲット: ${shopInfo.target || "未指定"}\n予算: ${shopInfo.budget || "未指定"}\nトーン: ${siteAnalysis?.tone || "professional"}\n文体: ${siteAnalysis?.writingStyle || "direct"}\n\n次のJSONスキーマで返答してください:\n{\n  \"hero\": {\"title\": \"\", \"subtitle\": \"\", \"cta_text\": \"\"},\n  \"about\": {\"heading\": \"\", \"body\": \"\", \"tagline\": \"\"},\n  \"services\": [{\"service_title\": \"\", \"service_description\": \"\", \"service_price\": \"\"}],\n  \"faq\": [{\"faq_question\": \"\", \"faq_answer\": \"\"}],\n  \"seo\": {\"title\": \"\", \"description\": \"\", \"keywords\": [\"\"]}\n}`;

    const result = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1200,
      messages: [{ role: "user", content: prompt }]
    });

    const textBlock = result.content.find((item) => item.type === "text");
    if (!textBlock || textBlock.type !== "text") return fallbackGenerate(shopInfo, siteAnalysis);
    return JSON.parse(textBlock.text) as GeneratedContent;
  } catch {
    return fallbackGenerate(shopInfo, siteAnalysis);
  }
}
