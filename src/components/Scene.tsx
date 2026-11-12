"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
const InfrastructureScene = dynamic(() => import("./InfrastructureScene"), {
  ssr: false,
});
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function Scene({
  variant = "hero",
  kind = 0,
}: {
  variant?: "hero" | "capability";
  kind?: number;
}) {
  const [ready, setReady] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || window.matchMedia("(max-width: 600px)").matches)
      return;
    const c = document.createElement("canvas");
    if (!c.getContext("webgl2")) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={container} className={`scene scene-${variant}`}>
      <div
        className="scene-fallback"
        style={{
          backgroundImage: `url(${variant === "hero" ? "/images/hero-fallback.webp" : `/images/capability-${kind}.webp`})`,
        }}
      />
      {ready && (
        <SceneBoundary>
          <InfrastructureScene variant={variant} kind={kind} />
        </SceneBoundary>
      )}
    </div>
  );
}
