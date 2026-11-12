"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      anchors: true,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
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
      lenis.destroy();
      gsap.ticker.remove(tick);
      observers.disconnect();
      document.body.classList.remove("motion-enabled");
    };
  }, [pathname]);
  return null;
}
