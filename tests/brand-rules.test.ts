import { describe, expect, it } from "vitest";

import {
  checkBrandCopy,
  findWarningWords,
  validateImageBrief,
  validateRewriteBrief,
} from "@/lib/tandandan/rules";

describe("Tandandan brand rules", () => {
  it("flags discouraged vocabulary in text order", () => {
    expect(findWarningWords("완벽한 기준, 타협하지 않는 선택")).toEqual([
      "완벽한",
      "기준",
      "타협하지 않는",
    ]);
  });

  it("recognizes a concrete, rhythmic consumer moment", () => {
    const checks = checkBrandCopy(
      "오후가 길어질 때, 고소하게 채우고 가볍게 이어가요.",
    );

    expect(checks.every((check) => check.passed)).toBe(true);
  });

  it("requires product facts before image generation", () => {
    expect(
      validateImageBrief({
        productName: "보리단백",
        productFacts: "",
        nutritionFacts: "",
        occasion: "바쁜 아침",
        objective: "제품 소개",
        mood: "ingredient",
        ratio: "4:5",
      }),
    ).toEqual({ productFacts: "제품 사실을 한 가지 이상 입력해 주세요." });
  });

  it("requires an original sentence for rewriting", () => {
    expect(
      validateRewriteBrief({
        original: "",
        placement: "caption",
        productFacts: "고소한 곡물 맛",
        occasion: "오후의 허기",
      }),
    ).toEqual({ original: "바꾸고 싶은 문장을 입력해 주세요." });
  });
});
