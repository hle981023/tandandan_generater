import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tandandan Creative Lab",
  description: "탄단단 인스타그램 이미지와 언어를 만드는 로컬 크리에이티브 도구",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
