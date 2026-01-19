import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "防災グッズ AI診断 | あなたの家庭に最適な防災セットを提案",
  description: "AIがあなたの家族構成・住居・地域に合わせて最適な防災グッズを診断します。地震・災害に備えて、本当に必要なものだけを効率的に揃えましょう。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
