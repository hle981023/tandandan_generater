# Tandandan Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local, brand-faithful Tandandan Instagram image-and-copy generator plus a Tandandan language rewriter, with a complete demo mode and clean API seams for later model integration.

**Architecture:** Use the bundled Vinext/Next 16 React starter as a single-page working surface. Client components own the brief, upload preview, tabs, and selections; focused domain modules own brand checks and deterministic demo generation; two route handlers expose stable generation response contracts so a real provider can replace demo mode later without changing the UI.

**Tech Stack:** Next 16/Vinext, React 19, TypeScript, Tailwind CSS 4, bundled Shadcn primitives, Zod, Vitest, Testing Library, Canvas API.

**Spec:** `docs/superpowers/specs/2026-09-16-tandandan-generator-design.md`

## Global Constraints

- Keep this version local-only; do not register or deploy a Site.
- The primary user is a Tandandan marketer and the first viewport must expose the working generator.
- Use `#F15001`, `#E6FD93`, `#004A23`, black, and white as the core palette.
- Use Elza Narrow for English display text and Pretendard for Korean/body text, with explicit fallbacks.
- Use the official Tandandan public logo assets from `tandandan.com` as local files.
- Never invent nutrition values, efficacy claims, or product facts that the user did not provide.
- Support Product, Ingredient, and Culture image moods plus Instagram 4:5 and 9:16 ratios.
- Keep demo mode fully usable when no API key is configured.
- Do not add authentication, persistence, publishing, social posting, payments, or multi-provider administration.

---

### Task 1: Scaffold the branded working surface

**Files:**
- Create from bundled starter: `package.json`, `package-lock.json`, `app/*`, `components/ui/*`, framework configuration
- Modify: `package.json`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `components/generator/app-shell.tsx`
- Create: `public/tandandan-logo.png`
- Create: `public/tandandan-mark.png`
- Modify: `public/favicon.svg`
- Create: `vitest.config.ts`
- Create: `tests/app-shell.test.tsx`

**Interfaces:**
- Consumes: bundled Sites Vinext starter and official public logo URLs
- Produces: `AppShell(): JSX.Element`, theme tokens, test command, and the tab container used by Tasks 3 and 4

- [ ] **Step 1: Initialize the starter without replacing Git history**

Run the Sites profile and setup scripts separately from the repository root:

```bash
node /Users/leehyelm/.codex/plugins/cache/openai-curated-remote/sites/0.1.62/scripts/configure-execution-profile.mjs
node /Users/leehyelm/.codex/plugins/cache/openai-curated-remote/sites/0.1.62/scripts/project-setup.mjs
node /Users/leehyelm/.codex/plugins/cache/openai-curated-remote/sites/0.1.62/scripts/install-dependencies.mjs
```

Expected: starter files exist, dependencies install, and the existing `.git` directory is untouched.

- [ ] **Step 2: Add the test runner and scripts**

Add `vitest`, `jsdom`, `@testing-library/react`, and `@testing-library/jest-dom` as dev dependencies. Add these scripts:

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: { environment: "jsdom", setupFiles: ["./tests/setup.ts"] },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write the failing shell test**

Create `tests/app-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/generator/app-shell";

describe("AppShell", () => {
  it("opens directly on the two generator choices", () => {
    render(<AppShell />);
    expect(screen.getByRole("tab", { name: "이미지 & 글 생성기" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "언어 교정기" })).toBeVisible();
    expect(screen.getByText("DEMO MODE")).toBeVisible();
  });
});
```

- [ ] **Step 4: Run the focused test and confirm failure**

Run: `npm test -- tests/app-shell.test.tsx`

Expected: FAIL because `AppShell` does not exist.

- [ ] **Step 5: Implement the brand shell and theme**

Use `@/components/ui/tabs` for the two views. `app/page.tsx` renders only `<AppShell />`. The shell header contains the official white logo, `TANDANDAN CREATIVE LAB`, and a lime `DEMO MODE` badge. Define CSS variables for the five brand colors, Elza/Pretendard stacks, strong one-pixel black borders, rounded controls, and responsive content widths. Replace starter metadata with:

```ts
export const metadata = {
  title: "Tandandan Creative Lab",
  description: "탄단단 인스타그램 이미지와 언어를 만드는 로컬 크리에이티브 도구",
};
```

Download and store these verified homepage assets locally:

```text
https://cdn.imweb.me/thumbnail/20260915/7c1ced61872d3.png -> public/tandandan-logo.png
https://cdn.imweb.me/thumbnail/20260417/0e75344a9911f.png -> public/tandandan-mark.png
```

Use `https://use.typekit.net/epx0hsc.css` for Elza Narrow and the official Pretendard CDN stylesheet, with `Arial Narrow` and system sans-serif fallbacks. Make the favicon an orange square carrying the white TD mark.

- [ ] **Step 6: Run tests and build**

Run: `npm test -- tests/app-shell.test.tsx`

Expected: PASS.

Run: `npm run build`

Expected: successful production build.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json app components public tests vitest.config.ts *.config.* scripts hooks lib db cloudflare-env.d.ts components.json .openai .gitignore .npmrc
git commit -m "feat: scaffold tandandan creative lab"
```

---

### Task 2: Implement the brand rules and deterministic demo engine

**Files:**
- Create: `lib/tandandan/types.ts`
- Create: `lib/tandandan/rules.ts`
- Create: `lib/tandandan/demo.ts`
- Create: `app/api/generate-image-copy/route.ts`
- Create: `app/api/rewrite-copy/route.ts`
- Create: `tests/brand-rules.test.ts`
- Create: `tests/demo-engine.test.ts`

**Interfaces:**
- Consumes: `ImageBrief`, `RewriteBrief`
- Produces: `checkBrandCopy(text): BrandCheck[]`, `findWarningWords(text): string[]`, `generateDemoImageCopy(brief): ImageCopyResult`, `rewriteDemoCopy(brief): RewriteResult`

- [ ] **Step 1: Define exact domain types**

Create `lib/tandandan/types.ts` with these public contracts:

```ts
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
```

- [ ] **Step 2: Write failing brand-rule tests**

```ts
import { describe, expect, it } from "vitest";
import { findWarningWords, checkBrandCopy } from "@/lib/tandandan/rules";

describe("Tandandan brand rules", () => {
  it("flags discouraged vocabulary", () => {
    expect(findWarningWords("완벽한 기준, 타협하지 않는 선택")).toEqual([
      "완벽한",
      "기준",
      "타협하지 않는",
    ]);
  });

  it("recognizes a concrete, rhythmic consumer moment", () => {
    const checks = checkBrandCopy("오후가 길어질 때, 고소하게 채우고 가볍게 이어가요.");
    expect(checks.every((check) => check.passed)).toBe(true);
  });
});
```

- [ ] **Step 3: Run brand-rule tests and confirm failure**

Run: `npm test -- tests/brand-rules.test.ts`

Expected: FAIL because the rule module does not exist.

- [ ] **Step 4: Implement positive vocabulary, warning vocabulary, and five checks**

Use exact warning phrases from the spec. Preserve text occurrence order, deduplicate matches, and implement five transparent heuristics: consumer moment, short/light phrasing, joy/routine vocabulary, concrete occasion/fact language, and punctuation/line rhythm.

- [ ] **Step 5: Write failing demo-engine tests**

```ts
import { describe, expect, it } from "vitest";
import { generateDemoImageCopy, rewriteDemoCopy } from "@/lib/tandandan/demo";

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

  it("returns three distinct rewrites", () => {
    const result = rewriteDemoCopy({
      original: "건강한 식사를 제공합니다",
      placement: "caption",
      productFacts: "고소한 곡물 맛",
      occasion: "오후의 허기",
    });
    expect(new Set(result.options.map((option) => option.text)).size).toBe(3);
  });
});
```

- [ ] **Step 6: Implement demo generation and route handlers**

Map each mood to `/demo/product.webp`, `/demo/ingredient.webp`, or `/demo/culture.webp`. Build copy from only the supplied name, facts, nutrition, occasion, and objective. Route handlers validate input with Zod and return status `400` with `{ error, fields }` for invalid input. They return demo mode when no provider key exists; do not include provider SDKs yet.

- [ ] **Step 7: Run all domain tests**

Run: `npm test -- tests/brand-rules.test.ts tests/demo-engine.test.ts`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add lib/tandandan app/api tests/brand-rules.test.ts tests/demo-engine.test.ts
git commit -m "feat: add tandandan brand generation engine"
```

---

### Task 3: Build the Instagram image-and-copy studio

**Files:**
- Create: `components/generator/image-copy-studio.tsx`
- Create: `components/generator/result-board.tsx`
- Create: `components/generator/mood-picker.tsx`
- Modify: `components/generator/app-shell.tsx`
- Create: `public/demo/product.webp`
- Create: `public/demo/ingredient.webp`
- Create: `public/demo/culture.webp`
- Create: `tests/image-brief.test.ts`

**Interfaces:**
- Consumes: `ImageBrief`, `/api/generate-image-copy`, `ImageCopyResult`
- Produces: `ImageCopyStudio(): JSX.Element`, selectable/copyable result board, and visible 4:5/9:16 preview states

- [ ] **Step 1: Write failing image-brief validation tests**

```ts
import { describe, expect, it } from "vitest";
import { validateImageBrief } from "@/lib/tandandan/rules";

describe("image brief validation", () => {
  it("requires product facts before generation", () => {
    expect(validateImageBrief({
      productName: "보리단백",
      productFacts: "",
      nutritionFacts: "",
      occasion: "바쁜 아침",
      objective: "제품 소개",
      mood: "ingredient",
      ratio: "4:5",
    })).toEqual({ productFacts: "제품 사실을 한 가지 이상 입력해 주세요." });
  });
});
```

- [ ] **Step 2: Run the validation test and confirm failure**

Run: `npm test -- tests/image-brief.test.ts`

Expected: FAIL because `validateImageBrief` is not defined.

- [ ] **Step 3: Implement validation and the complete form**

Build labeled controls for product name, facts, nutrition, occasion, objective, mood, and ratio. Use the bundled `Input`, `Textarea`, `Select`, `RadioGroup`, `Button`, `Badge`, `AspectRatio`, and `Skeleton` primitives. Add a drag-and-drop file input that accepts PNG, JPEG, and WebP up to 10 MB and previews with `URL.createObjectURL`, revoking old URLs on replacement/unmount.

- [ ] **Step 4: Generate three original demo mood assets**

Create one 4:5 asset for each mode with no text or logos:

```text
Product: bold orange studio table, high-key sunlight, hard shadow, empty central space for uploaded product.
Ingredient: vivid barley, grains, and citrus arranged as playful pop objects on lime and blue color fields.
Culture: joyful everyday outdoor movement with friends after light exercise, vivid blue sky, green court, orange accents.
```

Save as the exact paths listed above. Do not reproduce a third-party moodboard composition or recognizable brand packaging.

- [ ] **Step 5: Implement result loading, success, error, and empty states**

`ImageCopyStudio` posts JSON to `/api/generate-image-copy`. Keep the preview size stable while loading, preserve form contents on error, show a retry button, and display the returned image plus three sections for headline, caption, and CTA options. Clicking an option selects it and updates the text overlay preview.

- [ ] **Step 6: Run tests and build**

Run: `npm test -- tests/image-brief.test.ts tests/demo-engine.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: successful build with no missing demo assets.

- [ ] **Step 7: Commit**

```bash
git add components/generator lib/tandandan/rules.ts public/demo tests/image-brief.test.ts
git commit -m "feat: build instagram image and copy studio"
```

---

### Task 4: Build the Tandandan language rewriter

**Files:**
- Create: `components/generator/rewrite-studio.tsx`
- Create: `components/generator/brand-check-list.tsx`
- Modify: `components/generator/app-shell.tsx`
- Create: `tests/rewrite-brief.test.ts`

**Interfaces:**
- Consumes: `RewriteBrief`, `/api/rewrite-copy`, `RewriteResult`
- Produces: `RewriteStudio(): JSX.Element`, three rewrite cards, reasons, brand checks, and warning vocabulary chips

- [ ] **Step 1: Write the failing rewrite validation test**

```ts
import { describe, expect, it } from "vitest";
import { validateRewriteBrief } from "@/lib/tandandan/rules";

describe("rewrite brief validation", () => {
  it("requires an original sentence", () => {
    expect(validateRewriteBrief({
      original: "",
      placement: "caption",
      productFacts: "고소한 곡물 맛",
      occasion: "오후의 허기",
    })).toEqual({ original: "바꾸고 싶은 문장을 입력해 주세요." });
  });
});
```

- [ ] **Step 2: Run the focused test and confirm failure**

Run: `npm test -- tests/rewrite-brief.test.ts`

Expected: FAIL because `validateRewriteBrief` is missing.

- [ ] **Step 3: Implement validation and rewriting flow**

Add the original-copy textarea, placement selector, product-fact field, occasion field, and submit button. Post to `/api/rewrite-copy`. Render exactly three numbered options, each with text, one-sentence reason, five brand-check rows, and warning chips. Provide an accessible copy button for every option and use the existing tab state so switching views does not erase typed content.

- [ ] **Step 4: Run tests and build**

Run: `npm test -- tests/rewrite-brief.test.ts tests/brand-rules.test.ts tests/demo-engine.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: successful production build.

- [ ] **Step 5: Commit**

```bash
git add components/generator lib/tandandan/rules.ts tests/rewrite-brief.test.ts
git commit -m "feat: add tandandan language rewriter"
```

---

### Task 5: Add export behavior, accessibility, WebMCP, and final responsive polish

**Files:**
- Create: `lib/tandandan/export.ts`
- Modify: `components/generator/result-board.tsx`
- Modify: `components/generator/image-copy-studio.tsx`
- Modify: `components/generator/rewrite-studio.tsx`
- Modify: `app/globals.css`
- Create: `app/webmcp.ts`
- Modify: `app/layout.tsx`
- Create: `tests/export.test.ts`
- Modify: `README.md`

**Interfaces:**
- Consumes: selected preview image, selected headline, ratio, image brief
- Produces: `renderInstagramAsset(input, canvas): Promise<Blob>`, PNG download, Clipboard API actions, and structured agent tools for the two generator flows

- [ ] **Step 1: Write the failing canvas export test**

```ts
import { describe, expect, it } from "vitest";
import { getExportSize } from "@/lib/tandandan/export";

describe("Instagram export", () => {
  it("maps supported ratios to Instagram pixel sizes", () => {
    expect(getExportSize("4:5")).toEqual({ width: 1080, height: 1350 });
    expect(getExportSize("9:16")).toEqual({ width: 1080, height: 1920 });
  });
});
```

- [ ] **Step 2: Run the export test and confirm failure**

Run: `npm test -- tests/export.test.ts`

Expected: FAIL because the export module does not exist.

- [ ] **Step 3: Implement 1080px canvas export and clipboard feedback**

Draw the selected background image with `cover` behavior, optional uploaded product image centered with transparent padding, and the selected headline in white or black based on the chosen mood contrast token. Add the logo in a safe corner, export with `canvas.toBlob(..., "image/png")`, and download as `tandandan-<product>-<ratio>.png`. Clipboard actions show a short Korean success toast using bundled `Sonner`.

- [ ] **Step 4: Register the two meaningful WebMCP tools**

Expose `prepare_tandandan_image_brief` and `prepare_tandandan_rewrite` as page tools that populate the corresponding tab and fields but do not trigger generation without the user pressing the visible button. Input schemas reuse the domain types and keep all content local.

- [ ] **Step 5: Complete responsive and accessibility checks**

At desktop widths use the two-column editor/result layout. Below 900 px stack input and result; below 640 px make tabs full-width and keep controls at least 44 px high. Confirm visible focus styles, associated labels, `aria-live` for generation status, keyboard-operable tabs, readable Korean at 200% zoom, and no horizontal overflow.

- [ ] **Step 6: Document local operation**

Replace `README.md` with exact commands and limitations:

````md
# Tandandan Creative Lab

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by the dev server. Without an API key the app runs in Demo Mode. This version stores no briefs or generated results.

## Verify

```bash
npm test
npm run build
```
````

- [ ] **Step 7: Run full verification**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: successful production build.

Run the local preview and verify both generator flows at 1440×1000 and 390×844, including upload, ratio switch, result selection, copy, and download.

- [ ] **Step 8: Commit**

```bash
git add app components lib tests README.md
git commit -m "feat: finish local tandandan generator mvp"
```

---

### Task 6: Final repository review and push

**Files:**
- Review: all changed files

**Interfaces:**
- Consumes: all five completed tasks
- Produces: clean `main` branch with tested commits pushed to `origin/main`

- [ ] **Step 1: Confirm repository scope**

Run: `git status --short`

Expected: only intentional project files are tracked or modified; no `.env`, generated build output, or temporary screenshots are staged.

- [ ] **Step 2: Re-run completion evidence**

Run: `npm test`

Expected: all tests PASS.

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 3: Review commit history**

Run: `git log --oneline --decorate -8`

Expected: design, plan, scaffold, domain engine, two studios, and final polish appear as focused commits.

- [ ] **Step 4: Push the completed branch**

```bash
git push origin main
```

Expected: `origin/main` advances to the final verified commit.
