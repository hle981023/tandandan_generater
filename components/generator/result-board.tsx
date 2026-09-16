"use client";

import Image from "next/image";
import { useState } from "react";
import { Check, Copy, Download, LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { downloadBlob, getExportFilename, renderInstagramAsset } from "@/lib/tandandan/export";
import type { ImageBrief, ImageCopyResult } from "@/lib/tandandan/types";

interface ResultBoardProps {
  brief: ImageBrief;
  productImage?: string;
  result: ImageCopyResult;
  selectedHeadline: number;
  onSelectHeadline: (index: number) => void;
}

async function copyText(text: string) {
  await navigator.clipboard?.writeText(text);
}

export function ResultBoard({
  brief,
  productImage,
  result,
  selectedHeadline,
  onSelectHeadline,
}: ResultBoardProps) {
  const headline = result.headlineOptions[selectedHeadline];
  const [isExporting, setIsExporting] = useState(false);

  async function exportImage() {
    setIsExporting(true);
    try {
      const blob = await renderInstagramAsset({
        backgroundSrc: result.image.src,
        headline,
        objective: brief.objective,
        productImage,
        productName: brief.productName,
        ratio: brief.ratio,
      });
      downloadBlob(blob, getExportFilename(brief.productName, brief.ratio));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <section className="result-board" aria-label="생성 결과">
      <div className={`asset-preview ratio-${brief.ratio.replace(":", "-")}`}>
        <Image
          alt={result.image.alt}
          className="asset-background"
          fill
          priority
          sizes="(max-width: 900px) 92vw, 42vw"
          src={result.image.src}
        />
        <div className="asset-wash" />
        <Image
          alt="탄단단"
          className="asset-mark"
          height={92}
          src="/tandandan-mark.png"
          width={92}
        />
        {productImage ? (
          // User-selected object URLs are rendered directly and never leave the browser.
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="업로드한 제품" className="product-cutout" src={productImage} />
        ) : (
          <div className="product-token" aria-hidden="true">
            <span>{brief.productName.slice(0, 5)}</span>
            <small>TANDANDAN</small>
          </div>
        )}
        <div className="asset-copy">
          <span>{brief.objective}</span>
          <strong>{headline}</strong>
        </div>
      </div>

      <div className="result-copy-stack">
        <div className="result-heading">
          <div>
            <p className="eyebrow">COPY OPTIONS</p>
            <h3>이미지에 얹을 한 줄</h3>
          </div>
          <span className="demo-chip"><Sparkles /> Demo result</span>
        </div>

        <div className="option-list">
          {result.headlineOptions.map((option, index) => (
            <button
              className="copy-option"
              data-selected={selectedHeadline === index}
              key={option}
              onClick={() => onSelectHeadline(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{option}</strong>
              {selectedHeadline === index ? <Check aria-hidden="true" /> : null}
            </button>
          ))}
        </div>

        <article className="caption-card">
          <div className="caption-card-head">
            <span>CAPTION</span>
            <Button
              aria-label="캡션 복사"
              onClick={() => copyText(result.captionOptions[0])}
              size="icon-sm"
              type="button"
              variant="ghost"
            >
              <Copy />
            </Button>
          </div>
          <p>{result.captionOptions[0]}</p>
          <button
            className="cta-pill"
            onClick={() => copyText(result.ctaOptions[0])}
            type="button"
          >
            {result.ctaOptions[0]} ↗
          </button>
        </article>
        <Button className="download-button" disabled={isExporting} onClick={exportImage} size="lg" type="button" variant="secondary">
          {isExporting ? <LoaderCircle className="spin" /> : <Download />}
          {brief.ratio === "4:5" ? "1080 × 1350" : "1080 × 1920"} PNG 저장
        </Button>
      </div>
    </section>
  );
}
