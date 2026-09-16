"use client";

import { useEffect, useState } from "react";
import { Copy, LoaderCircle, WandSparkles } from "lucide-react";

import { BrandCheckList } from "@/components/generator/brand-check-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { rewriteDemoCopy } from "@/lib/tandandan/demo";
import { validateRewriteBrief } from "@/lib/tandandan/rules";
import type { RewriteBrief, RewriteResult } from "@/lib/tandandan/types";

const initialBrief: RewriteBrief = {
  original: "완벽한 영양 설계로 당신의 기준을 완성하세요.",
  placement: "on-image",
  productFacts: "곡물의 고소함, 단백질 12g",
  occasion: "바쁜 오후의 한 끼",
};

const optionLabels = ["가볍고 선명하게", "일상의 장면으로", "리듬 있게"];

export function RewriteStudio() {
  const [brief, setBrief] = useState(initialBrief);
  const [result, setResult] = useState<RewriteResult>(() => rewriteDemoCopy(initialBrief));
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function receiveResult(event: Event) {
      const detail = (event as CustomEvent<{ brief: RewriteBrief; result: RewriteResult }>).detail;
      setBrief(detail.brief);
      setResult(detail.result);
    }
    window.addEventListener("tandandan:rewrite-result", receiveResult);
    return () => window.removeEventListener("tandandan:rewrite-result", receiveResult);
  }, []);

  function update<Key extends keyof RewriteBrief>(key: Key, value: RewriteBrief[Key]) {
    setBrief((current) => ({ ...current, [key]: value }));
    setError("");
  }

  async function rewrite() {
    const errors = validateRewriteBrief(brief);
    if (errors.original) {
      setError(errors.original);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/rewrite-copy", {
        body: JSON.stringify(brief),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      if (!response.ok) throw new Error("rewrite failed");
      setResult(await response.json());
    } catch {
      setResult(rewriteDemoCopy(brief));
    } finally {
      setIsLoading(false);
    }
  }

  async function copyOption(index: number, text: string) {
    await navigator.clipboard?.writeText(text);
    setCopied(index);
    window.setTimeout(() => setCopied(undefined), 1400);
  }

  return (
    <section className="rewrite-layout" aria-label="탄단단 언어로 바꾸기">
      <aside className="rewrite-input studio-panel">
        <div className="section-intro rewrite-intro">
          <p className="eyebrow">TONE &amp; MANNER</p>
          <h1>단단한 말보다<br />기분 좋은 리듬.</h1>
          <p>원래 뜻은 지키면서, 소비자의 하루에 자연스럽게 놓아드려요.</p>
        </div>

        <div className="form-stack">
          <div className="field-group">
            <label htmlFor="original-copy">바꾸고 싶은 문장</label>
            <Textarea
              id="original-copy"
              onChange={(event) => update("original", event.target.value)}
              rows={5}
              value={brief.original}
            />
            <div className="char-count"><span className="field-error">{error}</span><span>{brief.original.length}/300</span></div>
          </div>
          <div className="two-column-fields">
            <div className="field-group">
              <label htmlFor="placement">사용 위치</label>
              <NativeSelect id="placement" onChange={(event) => update("placement", event.target.value as RewriteBrief["placement"])} value={brief.placement}>
                <NativeSelectOption value="on-image">이미지 위 한 줄</NativeSelectOption>
                <NativeSelectOption value="caption">인스타그램 캡션</NativeSelectOption>
                <NativeSelectOption value="cta">CTA</NativeSelectOption>
              </NativeSelect>
            </div>
            <div className="field-group">
              <label htmlFor="rewrite-occasion">먹는 순간 <small>선택</small></label>
              <Input id="rewrite-occasion" onChange={(event) => update("occasion", event.target.value)} value={brief.occasion} />
            </div>
          </div>
          <div className="field-group">
            <label htmlFor="rewrite-facts">반드시 지킬 제품 사실 <small>선택</small></label>
            <Input id="rewrite-facts" onChange={(event) => update("productFacts", event.target.value)} value={brief.productFacts} />
          </div>
          <Button className="generate-button rewrite-button" disabled={isLoading} onClick={rewrite} size="lg" type="button">
            {isLoading ? <LoaderCircle className="spin" /> : <WandSparkles />}
            탄단단 언어로 바꾸기
          </Button>
        </div>

        <div className="tone-note">
          <strong>탄단단 언어는</strong>
          <p>자격·완벽·기준처럼 무거운 선언보다, 맛과 한 끼와 일상의 장면을 먼저 말해요.</p>
        </div>
      </aside>

      <div className="rewrite-results studio-panel">
        <div className="rewrite-results-head">
          <div><p className="eyebrow">3 OPTIONS</p><h2>같은 뜻, 다른 리듬</h2></div>
          <span>클릭해서 바로 복사</span>
        </div>

        <div className="rewrite-cards">
          {result.options.map((option, index) => (
            <article className={`rewrite-card rewrite-card-${index + 1}`} key={`${option.text}-${index}`}>
              <div className="rewrite-card-label">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{optionLabels[index]}</strong>
              </div>
              <blockquote>{option.text}</blockquote>
              <p className="rewrite-reason">{option.reason}</p>
              {option.warnings.length ? (
                <p className="warning-words">피한 표현: {option.warnings.join(", ")}</p>
              ) : null}
              <div className="rewrite-card-bottom">
                <BrandCheckList checks={option.checks} />
                <Button aria-label={`${index + 1}번 문장 복사`} className="copy-result" onClick={() => copyOption(index, option.text)} type="button" variant="outline">
                  <Copy /> {copied === index ? "복사됨" : "복사"}
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
