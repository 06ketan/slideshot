"use client";

import { useInView } from "@/hooks/useInView";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  animation = "animate-fade-in-up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: string;
}) {
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`${className} ${inView ? animation : "opacity-0"}`}
      style={inView ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
