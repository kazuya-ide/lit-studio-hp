"use client";

import { motion, Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * AnimatedText
 * 一文字ずつ浮かび上がるアニメーションコンポーネント
 * - Tailwind + Framer Motion
 * - 型安全（ease指定を修正済み）
 */
export default function AnimatedText({
  text,
  className = "",
  delay = 0,
}: AnimatedTextProps) {
  const letters = text.split("");

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: i * delay },
    }),
  };

  const child: Variants = {
    hidden: {
      opacity: 0,
      y: "0.25em",
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: "0em",
      filter: "blur(0px)",
      transition: {
        duration: 0.5,
        ease: "easeInOut", // ✅ 型安全な指定に変更
      },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-block leading-relaxed ${className}`}
    >
      {letters.map((char, i) => (
        <motion.span
          key={i}
          variants={child}
          style={{
            display: "inline-block",
            marginRight: char === " " ? "0.25em" : "0em",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
}
