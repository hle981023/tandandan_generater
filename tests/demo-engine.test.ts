import { describe, expect, it } from "vitest";

import {
  generateDemoImageCopy,
  rewriteDemoCopy,
} from "@/lib/tandandan/demo";

describe("demo generation", () => {
  it("uses only supplied nutrition facts", () => {
    const result = generateDemoImageCopy({
      productName: "돈백질 플러스",
      productFacts: "국내산 한돈의 담백한 맛",
      nutritionFacts: "단백질 17g",
      occasion: "운동 후",
      objective: "제품 소개",
      mood: "product",
      ratio: "4:5",
    });

    expect(result.captionOptions.join(" ")).toContain("단백질 17g");
    expect(result.captionOptions.join(" ")).not.toMatch(/\d+kcal/i);
  });

  it("does not invent nutrition facts when none are supplied", () => {
    const result = generateDemoImageCopy({
      productName: "보리단백",
      productFacts: "곡물의 고소한 맛",
      nutritionFacts: "",
      occasion: "바쁜 아침",
      objective: "루틴 제안",
      mood: "ingredient",
      ratio: "9:16",
    });

    expect(result.captionOptions.join(" ")).not.toMatch(/\d+(g|kcal)/i);
  });

  it("returns three distinct rewrites", () => {
    const result = rewriteDemoCopy({
      original: "건강한 식사를 제공합니다",
      placement: "caption",
      productFacts: "고소한 곡물 맛",
      occasion: "오후의 허기",
    });

    expect(new Set(result.options.map((option) => option.text)).size).toBe(3);
  });

  it("does not carry discouraged brand words into rewrites", () => {
    const result = rewriteDemoCopy({
      original: "완벽한 영양 설계로 당신의 기준을 완성하세요.",
      placement: "on-image",
      productFacts: "단백질 12g",
      occasion: "오후의 한 끼",
    });

    expect(result.options.flatMap((option) => option.warnings)).toEqual([]);
  });
});
