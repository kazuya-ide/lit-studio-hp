"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const works = [
  {
    title: "AI SECURITY SYSTEM",
    desc: "警備業界のDXを実現するためのAI監視・リモート警備UI設計",
    image: "/images/works/project1.jpg",
  },
  {
    title: "GIFT SWEETS STORE",
    desc: "ブランドカラーを活かしたECサイト。Shopify + Headless構成",
    image: "/images/works/project2.jpg",
  },
  {
    title: "L-SECURITY PORTAL",
    desc: "Next.js + Prisma + GSAPで構築したセキュリティ企業の情報ポータル",
    image: "/images/works/project3.jpg",
  },
];

export default function WorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current;

      // === スクロールでカードがZ方向から出現 ===
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 100,
            z: -200,
            rotateY: -30,
            scale: 0.8,
          },
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotateY: 0,
            scale: 1,
            duration: 1.8,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });

      // === カード全体がマウスに追従して浮遊 ===
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        gsap.to(containerRef.current, {
          rotateY: x,
          rotateX: -y,
          transformPerspective: 1000,
          duration: 1.2,
          ease: "power2.out",
        });
      };
      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-40 bg-black text-white overflow-hidden perspective-1000"
    >
      <div className="max-w-7xl mx-auto px-6 text-center mb-24">
        <h2 className="text-6xl font-extrabold tracking-wider mb-6 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Works
        </h2>
        <p className="text-gray-400 text-lg">
          ブランドの印象を「動き」で表現する。  
          技術とデザインを融合した制作実績の一部をご紹介します。
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
        {works.map((work, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cardsRef.current[i] = el;
            }}
            className="relative group rounded-2xl overflow-hidden shadow-2xl transform-gpu bg-neutral-900 border border-white/10"
          >
            <img
              src={work.image}
              alt={work.title}
              className="w-full h-72 object-cover opacity-80 group-hover:opacity-100 transition duration-700"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-700"></div>

            <div className="absolute bottom-0 p-6 text-left">
              <h3 className="text-2xl font-bold mb-2 text-white">
                {work.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {work.desc}
              </p>
            </div>

            {/* カード反転時の光エフェクト */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-pink-500/30 to-indigo-500/30 blur-2xl transition-all duration-700"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
