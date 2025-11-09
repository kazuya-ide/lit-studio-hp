"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";

interface ScrollRevealProps {
  children: ReactNode;
  index?: number;
}

export default function ScrollReveal({ children, index = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: 60, scale: 0.95 });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              gsap.to(el, {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "power4.out",
                delay: index * 0.2,
              });
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15 }
      );

      observer.observe(el);
    });

    return () => ctx.revert();
  }, [index]);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}
