"use client";

import { useEffect } from "react";

type ModelTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
};

type WebMcpDocument = Document & {
  modelContext?: {
    registerTool(tool: ModelTool, options?: { signal?: AbortSignal }): void | Promise<void>;
  };
};

async function postJson(path: string, body: unknown) {
  const response = await fetch(path, {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  if (!response.ok) throw new Error("입력 내용을 다시 확인해 주세요.");
  return response.json();
}

export function WebMcpTools() {
  useEffect(() => {
    const context = (document as WebMcpDocument).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();

    const register = (tool: ModelTool) => {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(console.error);
      } catch (error) {
        console.error(error);
      }
    };

    register({
      name: "generate_tandandan_instagram_draft",
      title: "탄단단 인스타그램 시안 만들기",
      description: "제품 사실과 먹는 순간을 바탕으로 탄단단 무드 이미지 시안과 카피를 만들고 화면에 표시합니다.",
      inputSchema: {
        type: "object",
        properties: {
          productName: { type: "string" },
          productFacts: { type: "string" },
          nutritionFacts: { type: "string" },
          occasion: { type: "string" },
          objective: { type: "string" },
          mood: { type: "string", enum: ["product", "ingredient", "culture"] },
          ratio: { type: "string", enum: ["4:5", "9:16"] },
        },
        required: ["productName", "productFacts", "occasion", "objective", "mood", "ratio"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const brief = { nutritionFacts: "", ...(input as Record<string, unknown>) };
        const result = await postJson("/api/generate-image-copy", brief);
        window.dispatchEvent(new CustomEvent("tandandan:image-result", { detail: { brief, result } }));
        return { status: "displayed", result };
      },
    });

    register({
      name: "rewrite_tandandan_copy",
      title: "탄단단 언어로 바꾸기",
      description: "원문을 탄단단 톤앤매너의 세 가지 문장으로 바꾸고 화면에 비교 표시합니다.",
      inputSchema: {
        type: "object",
        properties: {
          original: { type: "string" },
          placement: { type: "string", enum: ["on-image", "caption", "cta"] },
          productFacts: { type: "string" },
          occasion: { type: "string" },
        },
        required: ["original", "placement"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        const brief = { productFacts: "", occasion: "", ...(input as Record<string, unknown>) };
        const result = await postJson("/api/rewrite-copy", brief);
        window.dispatchEvent(new CustomEvent("tandandan:rewrite-result", { detail: { brief, result } }));
        return { status: "displayed", result };
      },
    });

    return () => lifecycle.abort();
  }, []);

  return null;
}
