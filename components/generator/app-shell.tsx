"use client";

import Image from "next/image";

import { ImageCopyStudio } from "@/components/generator/image-copy-studio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function StudioPlaceholder({ title }: { title: string }) {
  return (
    <section className="studio-grid" aria-label={title}>
      <div className="studio-panel">
        <p className="eyebrow">BRIEF</p>
        <h2>{title}</h2>
        <p className="studio-muted">입력 영역을 준비하고 있어요.</p>
      </div>
      <div className="studio-panel studio-preview">
        <p className="eyebrow">PREVIEW</p>
        <div className="preview-placeholder">탄단단 무드가 여기에 채워집니다.</div>
      </div>
    </section>
  );
}

export function AppShell() {
  return (
    <main className="min-h-screen bg-[var(--tdd-cream)] text-black">
      <header className="brand-header">
        <div className="brand-lockup">
          <Image
            alt="탄단단"
            className="brand-logo"
            height={76}
            priority
            src="/tandandan-logo.png"
            width={520}
          />
          <span>TANDANDAN CREATIVE LAB</span>
        </div>
        <Badge className="demo-badge">DEMO MODE</Badge>
      </header>

      <Tabs className="studio-shell" defaultValue="image-copy">
        <TabsList className="studio-tabs" variant="line">
          <TabsTrigger className="studio-tab" value="image-copy">
            이미지 &amp; 글 생성기
          </TabsTrigger>
          <TabsTrigger className="studio-tab" value="rewrite">
            언어 교정기
          </TabsTrigger>
        </TabsList>
        <TabsContent value="image-copy">
          <ImageCopyStudio />
        </TabsContent>
        <TabsContent value="rewrite">
          <StudioPlaceholder title="탄단단 언어로 바꾸기" />
        </TabsContent>
      </Tabs>
    </main>
  );
}
