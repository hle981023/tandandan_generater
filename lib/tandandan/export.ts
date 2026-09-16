import type { Ratio } from "@/lib/tandandan/types";

export function getExportSize(ratio: Ratio) {
  return ratio === "4:5"
    ? { width: 1080, height: 1350 }
    : { width: 1080, height: 1920 };
}

export function getExportFilename(productName: string, ratio: Ratio) {
  const slug = productName
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "") || "creative";
  return `tandandan-${slug}-${ratio.replace(":", "x")}.png`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * scale;
  const drawHeight = image.naturalHeight * scale;
  context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
}

function wrapLines(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export interface RenderAssetOptions {
  backgroundSrc: string;
  headline: string;
  objective: string;
  productImage?: string;
  productName: string;
  ratio: Ratio;
}

export async function renderInstagramAsset(options: RenderAssetOptions): Promise<Blob> {
  const { width, height } = getExportSize(options.ratio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이 브라우저에서는 이미지 저장을 지원하지 않아요.");

  await document.fonts?.ready;
  const background = await loadImage(options.backgroundSrc);
  drawCover(context, background, width, height);

  const gradient = context.createLinearGradient(0, height * 0.36, 0, height);
  gradient.addColorStop(0, "rgba(0, 45, 22, 0)");
  gradient.addColorStop(1, "rgba(0, 45, 22, 0.9)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  if (options.productImage) {
    const product = await loadImage(options.productImage);
    const maxWidth = width * 0.62;
    const maxHeight = height * 0.5;
    const scale = Math.min(maxWidth / product.naturalWidth, maxHeight / product.naturalHeight);
    const productWidth = product.naturalWidth * scale;
    const productHeight = product.naturalHeight * scale;
    context.drawImage(product, (width - productWidth) / 2, height * 0.18, productWidth, productHeight);
  } else {
    const tokenWidth = width * 0.34;
    const tokenHeight = height * 0.38;
    const tokenX = (width - tokenWidth) / 2;
    const tokenY = height * 0.18;
    context.fillStyle = "#FFF8DF";
    context.strokeStyle = "#0B0B0B";
    context.lineWidth = 6;
    context.beginPath();
    context.roundRect(tokenX, tokenY, tokenWidth, tokenHeight, 36);
    context.fill();
    context.stroke();
    context.fillStyle = "#004A23";
    context.font = `900 ${Math.round(width * 0.07)}px "Pretendard Variable", sans-serif`;
    context.textAlign = "center";
    context.fillText(options.productName.slice(0, 7), width / 2, tokenY + tokenHeight / 2);
  }

  context.textAlign = "left";
  context.fillStyle = "#FFFFFF";
  context.font = `800 ${Math.round(width * 0.025)}px "Pretendard Variable", sans-serif`;
  context.fillText(options.objective, width * 0.065, height * 0.79);
  context.font = `850 ${Math.round(width * 0.075)}px "Pretendard Variable", sans-serif`;
  const lines = wrapLines(context, options.headline, width * 0.84);
  lines.forEach((line, index) => context.fillText(line, width * 0.065, height * 0.84 + index * width * 0.085));

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("이미지를 저장하지 못했어요.")), "image/png");
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(href);
}
