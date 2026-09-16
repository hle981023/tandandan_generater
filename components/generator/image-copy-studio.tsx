"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, LoaderCircle, WandSparkles } from "lucide-react";

import { ResultBoard } from "@/components/generator/result-board";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { generateDemoImageCopy } from "@/lib/tandandan/demo";
import { validateImageBrief } from "@/lib/tandandan/rules";
import type { FieldErrors, ImageBrief, ImageCopyResult, Mood } from "@/lib/tandandan/types";

const initialBrief: ImageBrief = {
  productName: "보리단백",
  productFacts: "곡물의 고소함과 은은한 단맛",
  nutritionFacts: "단백질 12g",
  occasion: "오후가 길어질 때",
  objective: "제품 소개",
  mood: "ingredient",
  ratio: "4:5",
};

const moods: { id: Mood; title: string; description: string }[] = [
  { id: "product", title: "PRODUCT", description: "제품에 시선 집중" },
  { id: "ingredient", title: "INGREDIENT", description: "원물과 맛의 감각" },
  { id: "culture", title: "CULTURE", description: "사람과 일상의 장면" },
];

export function ImageCopyStudio() {
  const [brief, setBrief] = useState(initialBrief);
  const [errors, setErrors] = useState<FieldErrors<ImageBrief>>({});
  const [result, setResult] = useState<ImageCopyResult>(() => generateDemoImageCopy(initialBrief));
  const [selectedHeadline, setSelectedHeadline] = useState(0);
  const [productImage, setProductImage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (productImage?.startsWith("blob:")) URL.revokeObjectURL(productImage);
  }, [productImage]);

  const canSubmit = useMemo(
    () => Object.keys(validateImageBrief(brief)).length === 0,
    [brief],
  );

  function update<Key extends keyof ImageBrief>(key: Key, value: ImageBrief[Key]) {
    setBrief((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function handleFile(file?: File) {
    if (!file) return;
    if (!file.type.match(/^image\/(png|jpeg|webp)$/) || file.size > 10 * 1024 * 1024) {
      setErrors((current) => ({ ...current, productName: "PNG, JPG, WEBP 파일을 10MB 이하로 올려 주세요." }));
      return;
    }
    setProductImage(URL.createObjectURL(file));
  }

  async function generate() {
    const nextErrors = validateImageBrief(brief);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-image-copy", {
        body: JSON.stringify(brief),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("generation failed");
      setResult(await response.json());
      setSelectedHeadline(0);
    } catch {
      setResult(generateDemoImageCopy(brief));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="studio-grid" aria-label="인스타그램 무드 만들기">
      <aside className="brief-panel studio-panel">
        <div className="section-intro">
          <p className="eyebrow">01 / BRIEF</p>
          <h1>오늘의 한 끼를<br />한 장에 담아요.</h1>
          <p>제품의 사실은 지키고, 탄단단다운 리듬을 더해요.</p>
        </div>

        <div className="form-stack">
          <div className="field-group">
            <label htmlFor="product-name">제품명</label>
            <Input id="product-name" onChange={(event) => update("productName", event.target.value)} value={brief.productName} />
          </div>
          <div className="field-group">
            <label htmlFor="product-facts">제품 사실</label>
            <Textarea id="product-facts" onChange={(event) => update("productFacts", event.target.value)} rows={2} value={brief.productFacts} />
          </div>
          <div className="two-column-fields">
            <div className="field-group">
              <label htmlFor="nutrition-facts">영양 정보 <small>선택</small></label>
              <Input id="nutrition-facts" onChange={(event) => update("nutritionFacts", event.target.value)} value={brief.nutritionFacts} />
            </div>
            <div className="field-group">
              <label htmlFor="occasion">먹는 순간</label>
              <Input id="occasion" onChange={(event) => update("occasion", event.target.value)} value={brief.occasion} />
              {errors.occasion ? <small className="field-error">{errors.occasion}</small> : null}
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="objective">게시 목적</label>
            <NativeSelect id="objective" onChange={(event) => update("objective", event.target.value)} value={brief.objective}>
              <NativeSelectOption>제품 소개</NativeSelectOption>
              <NativeSelectOption>신제품 출시</NativeSelectOption>
              <NativeSelectOption>프로모션</NativeSelectOption>
              <NativeSelectOption>브랜드 무드</NativeSelectOption>
            </NativeSelect>
          </div>

          <fieldset className="field-group mood-fieldset">
            <legend>무드 선택</legend>
            <div className="mood-grid">
              {moods.map((mood) => (
                <button
                  aria-pressed={brief.mood === mood.id}
                  className="mood-card"
                  data-active={brief.mood === mood.id}
                  key={mood.id}
                  onClick={() => update("mood", mood.id)}
                  type="button"
                >
                  <span className={`mood-swatch mood-${mood.id}`} />
                  <strong>{mood.title}</strong>
                  <small>{mood.description}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="two-column-fields compact-fields">
            <div className="field-group">
              <label htmlFor="ratio">이미지 비율</label>
              <NativeSelect id="ratio" onChange={(event) => update("ratio", event.target.value as ImageBrief["ratio"])} value={brief.ratio}>
                <NativeSelectOption value="4:5">피드 4:5</NativeSelectOption>
                <NativeSelectOption value="9:16">스토리 9:16</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="field-group">
              <label>제품 이미지 <small>선택</small></label>
              <input
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => handleFile(event.target.files?.[0])}
                ref={fileInput}
                type="file"
              />
              <Button className="upload-button" onClick={() => fileInput.current?.click()} type="button" variant="outline">
                <ImagePlus /> {productImage ? "이미지 바꾸기" : "이미지 올리기"}
              </Button>
            </div>
          </div>

          <Button className="generate-button" disabled={!canSubmit || isLoading} onClick={generate} size="lg" type="button">
            {isLoading ? <LoaderCircle className="spin" /> : <WandSparkles />}
            무드 &amp; 카피 만들기
          </Button>
        </div>
      </aside>

      <div className="preview-panel studio-panel">
        <div className="preview-kicker">
          <p className="eyebrow">02 / CREATE</p>
          <span>마케터용 빠른 시안 · 실제 제품 사실만 사용</span>
        </div>
        <ResultBoard
          brief={brief}
          onSelectHeadline={setSelectedHeadline}
          productImage={productImage}
          result={result}
          selectedHeadline={selectedHeadline}
        />
      </div>
    </section>
  );
}
