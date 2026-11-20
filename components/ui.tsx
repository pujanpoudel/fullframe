"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { track } from "@/lib/analytics";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    {diagonal ? <path d="M5 19 19 5M7 5h12v12" /> : <path d="M3 12h17m-7-7 7 7-7 7" />}
  </svg>;
}

export function Cta({ href, children, variant = "text", source }: {
  href: string; children: ReactNode; variant?: "text" | "button" | "outline"; source: string;
}) {
  return <Link className={`cta cta-${variant}`} href={href === "#contact" ? "/contact#contact" : href} onClick={() => track("cta_click", { source })}>
    {children}
  </Link>;
}

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={false}
    whileInView={reduce ? undefined : { opacity: [0.35, 1], y: [36, 0] }}
    viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.7, ease: "easeOut" }}>
    {children}
  </motion.div>;
}

export function Count({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 0.55, onUpdate: (next) => setShown(Math.round(next)) });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return <span ref={ref}><span aria-hidden="true">{String(shown).padStart(2, "0")}{suffix}</span>
    <span className="sr-only">{value}{suffix}</span></span>;
}
