"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    let frame = 0;
    const registered = new WeakSet<Element>();
    const visibleSections = new Set<HTMLElement>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in-view", "revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleSections.add(entry.target as HTMLElement);
        else visibleSections.delete(entry.target as HTMLElement);
      }
      schedule();
    });
    function update() {
      frame = 0;
      for (const section of visibleSections) {
        const rect = section.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
        section.style.setProperty("--section-progress", String(progress));
      }
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function register() {
      document.querySelectorAll<HTMLElement>("main section:not(.scroll-journey), .footer").forEach(section => {
        if (!registered.has(section)) { registered.add(section); sectionObserver.observe(section); }
      });
      const selectors = [
        ".impact-topline", ".impact-primary", ".impact-fact", ".impact-caption", ".text-reveal", ".footer-top", ".footer-grid > div", ".footer-bottom", ".section-label", ".stats-heading", ".stat", ".page-heading > .container > p",
        "section:not(.scroll-journey) p", ".vision-mission > div", ".strengths-grid > article",
        ".group-companies > div", ".client-logos > div", ".certificate-card", ".responsibility-values > div",
        ".project-meta", ".project-card-bottom", ".leader-role", ".capability-tabs > button",
        ".about-image", ".project-image", ".capability-visual", ".leader-portrait", ".equipment-photo",
      ];
      document.querySelectorAll<HTMLElement>(selectors.join(",")).forEach((element) => {
        if (registered.has(element) || element.closest("dialog, .scroll-journey")) return;
        registered.add(element);
        if (!element.classList.contains("text-reveal")) {
          element.classList.add(element.matches(".about-image, .project-image, .capability-visual, .leader-portrait, .equipment-photo") ? "media-reveal" : "motion-block");
          const siblings = element.parentElement ? [...element.parentElement.children] : [];
          element.style.setProperty("--reveal-delay", `${Math.min(siblings.indexOf(element), 4) * 65}ms`);
        }
        observer.observe(element);
      });
    }
    register();
    document.body.classList.add("motion-enabled");
    const mutations = new MutationObserver(register);
    mutations.observe(document.querySelector("main")!, { childList: true, subtree: true });
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule, { passive: true });
    const reduce = () => { if (preference.matches) document.body.classList.remove("motion-enabled"); };
    preference.addEventListener("change", reduce);
    return () => {
      observer.disconnect(); sectionObserver.disconnect(); mutations.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule); removeEventListener("resize", schedule);
      preference.removeEventListener("change", reduce);
      document.body.classList.remove("motion-enabled");
    };
  }, [pathname]);
  return null;
}
