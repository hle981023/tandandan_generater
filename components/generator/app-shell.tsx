"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { ImageCopyStudio } from "@/components/generator/image-copy-studio";
import { RewriteStudio } from "@/components/generator/rewrite-studio";
import { WebMcpTools } from "@/components/generator/webmcp-tools";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AppShell() {
  const [activeTab, setActiveTab] = useState("image-copy");

  useEffect(() => {
    const showImage = () => setActiveTab("image-copy");
    const showRewrite = () => setActiveTab("rewrite");
    window.addEventListener("tandandan:image-result", showImage);
    window.addEventListener("tandandan:rewrite-result", showRewrite);
    return () => {
      window.removeEventListener("tandandan:image-result", showImage);
      window.removeEventListener("tandandan:rewrite-result", showRewrite);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[var(--tdd-cream)] text-black">
      <WebMcpTools />
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

      <Tabs className="studio-shell" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="studio-tabs" variant="line">
          <TabsTrigger className="studio-tab" value="image-copy">
            이미지 &amp; 글 생성기
          </TabsTrigger>
          <TabsTrigger className="studio-tab" value="rewrite">
            언어 교정기
          </TabsTrigger>
        </TabsList>
        <TabsContent className="data-[state=inactive]:hidden" forceMount value="image-copy">
          <ImageCopyStudio />
        </TabsContent>
        <TabsContent className="data-[state=inactive]:hidden" forceMount value="rewrite">
          <RewriteStudio />
        </TabsContent>
      </Tabs>
    </main>
  );
}
