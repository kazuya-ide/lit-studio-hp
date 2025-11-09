"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 背景全体のフェードイン＋スケールダウン（ズームイン効果）
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 2.0, ease: "power3.out" }
      );

      // タイトル文字アニメーション
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.5, delay: 0.5, ease: "power3.out" }
      );

      // サブタイトル
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, delay: 1.3, ease: "power2.out" }
      );

      // スクロール矢印の点滅ループ
      gsap.to(arrowRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 1.2,
        delay: 2,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-black text-white"
    >
      {/* 背景画像 */}
      <img
        src="/images/hero-bg.jpg"
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90"></div>

      {/* メインテキスト */}
      <div className="relative z-10 text-center px-4">
        <h1
          ref={titleRef}
          className="text-5xl md:text-8xl font-extrabold tracking-widest mb-6"
        >
          LIT STUDIO
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl text-gray-300 tracking-wide"
        >
          Design × Technology × Motion
        </p>
      </div>

      {/* ↓ Scroll indicator */}
      <div
        ref={arrowRef}
        className="absolute bottom-10 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-gray-400 text-xs">Scroll</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-400 animate-pulse"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </section>
  );
}
