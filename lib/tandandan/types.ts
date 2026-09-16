export type Mood = "product" | "ingredient" | "culture";
export type Ratio = "4:5" | "9:16";
export type CopyPlacement = "on-image" | "caption" | "cta";

export interface ImageBrief {
  productName: string;
  productFacts: string;
  nutritionFacts: string;
  occasion: string;
  objective: string;
  mood: Mood;
  ratio: Ratio;
}

export interface RewriteBrief {
  original: string;
  placement: CopyPlacement;
  productFacts: string;
  occasion: string;
}

export interface BrandCheck {
  id: "consumer" | "light" | "joy" | "concrete" | "rhythm";
  label: string;
  passed: boolean;
}

export interface ImageCopyResult {
  mode: "demo" | "live";
  image: { src: string; alt: string };
  headlineOptions: string[];
  captionOptions: string[];
  ctaOptions: string[];
  checks: BrandCheck[];
  warnings: string[];
}

export interface RewriteOption {
  text: string;
  reason: string;
  checks: BrandCheck[];
  warnings: string[];
}

export interface RewriteResult {
  mode: "demo" | "live";
  options: RewriteOption[];
}

export type FieldErrors<T> = Partial<Record<keyof T, string>>;
