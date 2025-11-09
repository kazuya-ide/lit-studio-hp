import "./styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LIT STUDIO | 井手和弥ポートフォリオ",
  description: "合同会社LITと連携し、Web制作・デザイン・アニメーションを行うLIT STUDIOのポートフォリオサイト。",
  openGraph: {
    title: "LIT STUDIO",
    description: "Web制作・デザイン・アニメーションポートフォリオ",
    url: "https://lit-studio.jp",
    siteName: "LIT STUDIO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
