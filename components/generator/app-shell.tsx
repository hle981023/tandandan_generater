"use client";

import Image from "next/image";

import { ImageCopyStudio } from "@/components/generator/image-copy-studio";
import { RewriteStudio } from "@/components/generator/rewrite-studio";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <RewriteStudio />
        </TabsContent>
      </Tabs>
    </main>
  );
}
