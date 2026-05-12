import { defaultAnalysis } from "@/lib/templates";
import { SectionName, SiteAnalysis } from "@/lib/types";

function detectTone(input: string) {
  const value = input.toLowerCase();
  if (value.includes("clinic") || value.includes("medical") || value.includes("歯科") || value.includes("医院")) return "professional";
  if (value.includes("salon") || value.includes("beauty") || value.includes("spa") || value.includes("美容")) return "friendly";
  if (value.includes("hotel") || value.includes("sushi") || value.includes("wagyu") || value.includes("restaurant") || value.includes("焼肉")) return "luxury";
  return "modern";
}

function inferSections(text: string) {
  const source = text.toLowerCase();
  const sections = new Set<SectionName>(["hero", "about", "services", "cta", "footer"]);
  if (source.includes("faq") || source.includes("質問") || source.includes("q&a")) sections.add("faq");
  if (source.includes("voice") || source.includes("testimonial") || source.includes("口コミ")) sections.add("testimonials");
  if (source.includes("gallery") || source.includes("menu") || source.includes("写真")) sections.add("gallery");
  return Array.from(sections);
}

export async function analyzeUrlReference(url: string): Promise<SiteAnalysis> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    const html = await response.text();
    const tone = detectTone(`${url} ${html.slice(0, 1000)}`);
    return {
      ...defaultAnalysis,
      sections: inferSections(html),
      tone,
      writingStyle: tone === "luxury" ? "elegant" : tone === "professional" ? "direct" : "storytelling",
      keyElements: tone === "luxury"
        ? ["large_hero_image", "full_width_cta", "testimonial_section"]
        : tone === "professional"
          ? ["structured_information", "faq", "appointment_cta"]
          : ["soft_visual", "simple_cards", "cta"],
      colorPalette: tone === "professional"
        ? { primary: "#185fa5", accent: "#2a7dd1", background: "#ffffff" }
        : tone === "friendly"
          ? { primary: "#7c5a45", accent: "#b68752", background: "#fffaf7" }
          : tone === "luxury"
            ? { primary: "#1a1a18", accent: "#d85a30", background: "#ffffff" }
            : { primary: "#2e3255", accent: "#6d78d8", background: "#f4f6ff" }
    };
  } catch {
    return {
      ...defaultAnalysis,
      tone: detectTone(url),
      sections: defaultAnalysis.sections
    };
  }
}

export async function analyzeScreenshotReference(fileName: string): Promise<SiteAnalysis> {
  const tone = detectTone(fileName);
  return {
    ...defaultAnalysis,
    tone,
    sections: tone === "friendly" ? ["hero", "about", "services", "gallery", "faq", "cta", "footer"] : defaultAnalysis.sections,
    writingStyle: tone === "friendly" ? "storytelling" : tone === "professional" ? "direct" : "elegant"
  };
}
