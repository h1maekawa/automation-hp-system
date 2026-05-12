import Mustache from "mustache";
import { GeneratedContent, ShopInfo, TemplateDefinition } from "@/lib/types";

export function renderTemplate(template: TemplateDefinition, shopInfo: ShopInfo, generatedContent: GeneratedContent) {
  const view = {
    shop_name: shopInfo.shopName,
    genre: shopInfo.genre,
    hero_title: generatedContent.hero.title,
    hero_subtitle: generatedContent.hero.subtitle,
    hero_cta_text: generatedContent.hero.cta_text,
    hero_cta_url: shopInfo.reservationUrl || (shopInfo.phone ? `tel:${shopInfo.phone}` : "#contact"),
    about_heading: generatedContent.about.heading,
    about_body: generatedContent.about.body,
    about_tagline: generatedContent.about.tagline,
    services: generatedContent.services,
    faq: generatedContent.faq,
    business_hours: shopInfo.hours || "未設定",
    holiday: shopInfo.holiday || "未設定",
    address: shopInfo.address || "未設定",
    phone: shopInfo.phone || "未設定",
    instagram_url: shopInfo.instagram || "",
    if_instagram: Boolean(shopInfo.instagram),
    seo_title: generatedContent.seo.title,
    seo_description: generatedContent.seo.description,
    seo_keywords: generatedContent.seo.keywords.join(", ")
  };

  return Mustache.render(template.html, view);
}
