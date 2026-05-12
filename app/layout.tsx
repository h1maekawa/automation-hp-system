import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "店舗HP生成OS",
  description: "テンプレート選択からAI生成・プレビュー・公開までを一括で進める店舗ホームページ生成ツール"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
