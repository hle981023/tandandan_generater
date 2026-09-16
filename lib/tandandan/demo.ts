import { checkBrandCopy, findWarningWords } from "@/lib/tandandan/rules";
import type {
  ImageBrief,
  ImageCopyResult,
  RewriteBrief,
  RewriteResult,
} from "@/lib/tandandan/types";

const moodImages = {
  product: "/demo/product.jpg",
  ingredient: "/demo/ingredient.jpg",
  culture: "/demo/culture.jpg",
} as const;

function joinFacts(productFacts: string, nutritionFacts: string): string {
  return [productFacts.trim(), nutritionFacts.trim()].filter(Boolean).join(", ");
}

export function generateDemoImageCopy(brief: ImageBrief): ImageCopyResult {
  const product = brief.productName.trim();
  const occasion = brief.occasion.trim();
  const facts = joinFacts(brief.productFacts, brief.nutritionFacts);
  const headlineOptions = [
    `${occasion}, 가볍고 탄탄하게`,
    `오늘의 리듬을 채우는 ${product}`,
    `맛있게 채우고, 즐겁게 이어가요`,
  ];
  const captionOptions = [
    `${occasion}에 생각나는 한 끼. ${facts}을 담은 ${product}로 오늘의 리듬을 가볍게 채워보세요.`,
    `${facts}. 복잡한 준비 없이 ${occasion}에도 맛있고 탄탄하게 이어가는 루틴.`,
    `내 리듬에 맞는 식사는 어렵지 않아요. ${occasion}, ${product}로 기분 좋게 채워요.`,
  ];
  const ctaOptions = ["오늘의 한 끼 채우기", "가볍게 시작하기", "내 루틴에 더하기"];

  return {
    mode: "demo",
    image: {
      src: moodImages[brief.mood],
      alt: `${brief.mood} 무드의 ${product} 인스타그램 이미지`,
    },
    headlineOptions,
    captionOptions,
    ctaOptions,
    checks: checkBrandCopy(headlineOptions[0]),
    warnings: findWarningWords([...headlineOptions, ...captionOptions].join(" ")),
  };
}

export function rewriteDemoCopy(brief: RewriteBrief): RewriteResult {
  const occasion = brief.occasion.trim() || "오늘의 한 끼";
  const fact = brief.productFacts.trim() || "필요한 만큼의 맛과 영양";
  const texts = [
    `${occasion}, ${fact}으로 가볍고 탄탄하게 채워요.`,
    `${occasion}에 먼저 떠오르는 건 맛있는 한 끼. 오늘도 내 리듬대로 이어가요.`,
    `맛있게 채우고, 즐겁게 이어가는 루틴. ${fact}을 ${occasion}에 만나보세요.`,
  ];
  const reasons = [
    "브랜드 설명 대신 소비자가 먹는 순간에서 시작했어요.",
    "원문의 의미를 일상의 장면과 리듬으로 바꿨어요.",
    "맛과 즐거움을 앞세워 짧고 선명하게 정리했어요.",
  ];

  return {
    mode: "demo",
    options: texts.map((text, index) => ({
      text,
      reason: reasons[index],
      checks: checkBrandCopy(text),
      warnings: findWarningWords(text),
    })),
  };
}
