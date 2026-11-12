"use client";
import { useEffect } from "react";

import { usePathname } from "next/navigation";
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observers = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observers.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.body.classList.add("motion-enabled");
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observers.observe(el));
    return () => {
      observers.disconnect();
      document.body.classList.remove("motion-enabled");
    };
  }, [pathname]);
  return null;
}
