export type SectionName =
  | "hero"
  | "about"
  | "services"
  | "gallery"
  | "faq"
  | "cta"
  | "footer"
  | "testimonials"
  | "pricing";

export interface SiteAnalysis {
  sections: SectionName[];
  colorPalette: {
    primary: string;
    accent: string;
    background: string;
  };
  fontStyle: string;
  layoutType: string;
  tone: string;
  keyElements: string[];
  writingStyle: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  style: string;
  size: string;
  tags: string[];
  description: string;
  previewTitle: string;
  thumbnailGradient: string;
  referenceUrl?: string;
  html: string;
  variables: string[];
  sampleAnalysis: SiteAnalysis;
}

export interface ShopInfo {
  projectName: string;
  shopName: string;
  catchphrase?: string;
  genre: string;
  concept: string;
  target?: string;
  budget?: string;
  hours?: string;
  holiday?: string;
  address?: string;
  phone?: string;
  instagram?: string;
  reservationUrl?: string;
}

export interface GeneratedContent {
  hero: {
    title: string;
    subtitle: string;
    cta_text: string;
  };
  about: {
    heading: string;
    body: string;
    tagline: string;
  };
  services: Array<{
    service_title: string;
    service_description: string;
    service_price: string;
  }>;
  faq: Array<{
    faq_question: string;
    faq_answer: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface ProjectRecord {
  id: string;
  name: string;
  category: string;
  templateId: string;
  sourceType: "gallery" | "external-url" | "screenshot";
  referenceUrl?: string;
  siteAnalysis?: SiteAnalysis;
  selectedSections?: SectionName[];
  shopInfo?: ShopInfo;
  generatedContent?: GeneratedContent;
  renderedHtml?: string;
  deployUrl?: string;
  slug?: string;
  status: "draft" | "analyzed" | "generated" | "previewed" | "deployed";
  createdAt: string;
  updatedAt: string;
}
