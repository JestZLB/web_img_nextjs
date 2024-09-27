import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "生成长图文章",
  description: "生成长图的文章网页",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-cn">
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
