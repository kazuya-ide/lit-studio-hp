"use client";

import { usePathname } from "next/navigation";
import Hero3D_StoryScroll from "./components/Hero3D_StoryScroll";
import AnimatedText from "./components/AnimatedText";
import ScrollReveal from "./components/ScrollReveal";

export default function HomePage() {
  const pathname = usePathname();

  return (
    <main className="bg-black text-white font-sans overflow-x-hidden scroll-smooth">
      {/* === Hero Section === */}
      <Hero3D_StoryScroll key={pathname} />

      {/* === About === */}
      <section
        id="about"
        className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-center px-6"
      >
        <ScrollReveal index={1}>
          <h2 className="text-6xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 to-indigo-400 bg-clip-text text-transparent">
            About
          </h2>
          <AnimatedText
            text="LIT STUDIO は “動きで伝えるデザイン” をテーマに、テクノロジーと表現の融合を追求するデジタルクリエイティブ集団です。"
            className="text-gray-300 text-lg max-w-3xl mx-auto"
            delay={0.2}
          />
        </ScrollReveal>
      </section>

      {/* === Works === */}
      <section
        id="works"
        className="min-h-screen flex flex-col items-center justify-center bg-black text-center px-6"
      >
        <ScrollReveal index={2}>
          <h2 className="text-6xl font-extrabold mb-8 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Works
          </h2>
          <AnimatedText
            text="GSAP・Three.js・Reactを駆使したモーションサイト、EC・CMS連携、3Dインタラクションなど、幅広いWeb体験を構築。"
            className="text-gray-400 text-lg max-w-3xl mx-auto"
            delay={0.3}
          />
        </ScrollReveal>
      </section>

      {/* === Vision === */}
      <section className="relative py-48 px-6 text-center text-white">
        <ScrollReveal index={3}>
          <h2 className="text-5xl font-extrabold mb-8 bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text text-transparent">
            Vision
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
            テクノロジーとアートの境界をなくし、<br />
            “感じるWeb” を創り出す。<br />
            私たちは表現者として、常に新しい体験を追い求めています。
          </p>
        </ScrollReveal>
      </section>
    </main>
  );
}
