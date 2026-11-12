"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import sequence from "@/data/sequence-manifest.json";

const chapters = [
  {
    label: "The vision",
    eyebrow: "ENGINEERING INDIA. SINCE 1994.",
    first: "WHERE VISION",
    second: "BECOMES LEGACY.",
    text: "We build the infrastructure that moves a nation forward.",
    position: "start",
  },
  {
    label: "The connection",
    eyebrow: "01 / ROADS, BRIDGES & CONNECTIONS",
    first: "DISTANCE.",
    second: "REDEFINED.",
    text: "Connecting communities. Opening possibilities.",
    position: "start",
  },
  {
    label: "The purpose",
    eyebrow: "02 / PLACES THAT SERVE PEOPLE",
    first: "BUILT WITH",
    second: "PURPOSE.",
    text: "Healthcare. Institutions. The foundations of everyday life.",
    position: "end",
  },
  {
    label: "The future",
    eyebrow: "03 / WATER, WASTE & RENEWABLES",
    first: "PROGRESS.",
    second: "WITH RESPONSIBILITY.",
    text: "Essential systems for a more resilient tomorrow.",
    position: "start",
  },
  {
    label: "The legacy",
    eyebrow: "FOUR CAPABILITIES. ONE COMMITMENT.",
    first: "BUILDING A LEGACY.",
    second: "ENGINEERING THE FUTURE.",
    text: "Rathore Group / R & B Infra Project Limited",
    position: "center",
  },
];
const stops = [0, 0.245, 0.485, 0.735, 0.955];
type Decoded = ImageBitmap | HTMLImageElement;

/** A frame is a pure function of native scroll position. No time-based playback. */
export default function ScrollJourney() {
  const section = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const jump = useRef<(progress: number) => void>(() => {});
  const [chapter, setChapter] = useState(0);
  const activeChapter = useRef(0);

  useEffect(() => {
    const root = section.current;
    const element = canvas.current;
    if (!root || !element) return;
    const context = element.getContext("2d", { alpha: false });
    if (!context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(max-width: 700px)").matches;
    const count = mobile ? sequence.mobile.count : sequence.desktop.count;
    const variant = mobile ? "mobile" : "desktop";
    const limit = mobile ? 8 : 12;
    const cache = new Map<number, Decoded>();
    const pending = new Map<number, AbortController>();
    let queue: number[] = [];
    let wanted = 0;
    let lastDrawn = -1;
    let frameRequest = 0;
    let destroyed = false;
    let boxWidth = 0,
      boxHeight = 0;
    root.dataset.sequenceVariant = variant;
    root.dataset.frameCount = String(count);

    function release(image: Decoded) {
      if ("close" in image) image.close();
    }
    function draw(index: number) {
      if (!context || !element) return;
      const image = cache.get(index);
      if (!image) return;
      const width =
        image instanceof HTMLImageElement ? image.naturalWidth : image.width;
      const height =
        image instanceof HTMLImageElement ? image.naturalHeight : image.height;
      const scale = Math.max(element.width / width, element.height / height);
      context.drawImage(
        image,
        (element.width - width * scale) / 2,
        (element.height - height * scale) / 2,
        width * scale,
        height * scale,
      );
      lastDrawn = index;
      const p = index / (count - 1);
      const next =
        p < 0.21 ? 0 : p < 0.445 ? 1 : p < 0.685 ? 2 : p < 0.925 ? 3 : 4;
      if (next !== activeChapter.current) {
        activeChapter.current = next;
        setChapter(next);
      }
      element.dataset.frame = String(index);
      element.style.opacity = "1";
      // LRU: decoded frame memory stays bounded on both phones and desktops.
      cache.delete(index);
      cache.set(index, image);
    }
    async function decode(blob: Blob): Promise<Decoded> {
      if (typeof createImageBitmap === "function")
        return createImageBitmap(blob);
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(Error("Frame decode failed"));
        };
        image.src = url;
      });
    }
    function pump() {
      if (destroyed) return;
      while (pending.size < 4 && queue.length) {
        const index = queue.shift()!;
        if (cache.has(index) || pending.has(index)) continue;
        const controller = new AbortController();
        pending.set(index, controller);
        fetch(`/sequence/${variant}/${String(index).padStart(3, "0")}.webp?v=${sequence.version}`, {
          signal: controller.signal,
          cache: "force-cache",
        })
          .then((response) => {
            if (!response.ok) throw Error(`Frame ${index} unavailable`);
            return response.blob();
          })
          .then(decode)
          .then((image) => {
            if (destroyed) {
              release(image);
              return;
            }
            cache.set(index, image);
            if (index === wanted) draw(index);
            while (cache.size > limit) {
              const oldest = [...cache.keys()].find(
                (key) => key !== wanted && key !== lastDrawn,
              );
              if (oldest === undefined) break;
              release(cache.get(oldest)!);
              cache.delete(oldest);
            }
          })
          .catch(() => {
            /* The visible poster/last good frame remains on network failure. */
          })
          .finally(() => {
            if (pending.get(index) === controller) pending.delete(index);
            pump();
          });
      }
    }
    function request(index: number) {
      wanted = index;
      root!.dataset.requestedFrame = String(index);
      if (index !== lastDrawn && cache.has(index)) draw(index);
      queue = [
        index,
        index + 1,
        index - 1,
        index + 2,
        index - 2,
        index + 3,
      ].filter((n) => n >= 0 && n < count && !cache.has(n) && !pending.has(n));
      for (const [n, controller] of pending)
        if (Math.abs(n - index) > 8) {
          controller.abort();
          pending.delete(n);
        }
      pump();
    }
    function update() {
      frameRequest = 0;
      if (destroyed || !root) return;
      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - innerHeight);
      const progress = reduced
        ? 0
        : Math.max(0, Math.min(1, -rect.top / distance));
      root.style.setProperty("--journey-progress", String(progress));
      // Native scrolling skips directly to the matching frame, in either direction.
      if (rect.bottom > 0 && rect.top < innerHeight)
        request(Math.round(progress * (count - 1)));
    }
    function scroll() {
      if (!frameRequest) frameRequest = requestAnimationFrame(update);
    }
    function resize() {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.width === boxWidth && rect.height === boxHeight) return;
      boxWidth = rect.width;
      boxHeight = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      element.width = Math.round(rect.width * dpr);
      element.height = Math.round(rect.height * dpr);
      if (lastDrawn >= 0) draw(lastDrawn);
      scroll();
    }
    jump.current = (progress) => {
      if (reduced) {
        const next = stops.indexOf(progress);
        setChapter(Math.max(0, next));
        request(Math.round(progress * (count - 1)));
        return;
      }
      const top = root.getBoundingClientRect().top + scrollY;
      window.scrollTo({
        top: top + (root.offsetHeight - innerHeight) * progress,
        behavior: "smooth",
      });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", resize, { passive: true });
    resize();
    update();
    return () => {
      destroyed = true;
      cancelAnimationFrame(frameRequest);
      observer.disconnect();
      removeEventListener("scroll", scroll);
      removeEventListener("resize", resize);
      for (const controller of pending.values()) controller.abort();
      for (const image of cache.values()) release(image);
      cache.clear();
    };
  }, []);

  const current = chapters[chapter];
  return (
    <section
      id="home"
      className="scroll-journey"
      ref={section}
      aria-label="Rathore Group infrastructure journey"
    >
      <div className="journey-sticky">
        <picture className="journey-poster">
          <source
            media="(max-width: 700px)"
            srcSet={`/sequence/mobile/000.webp?v=${sequence.version}`}
          />
          <img
            src={`/sequence/desktop/000.webp?v=${sequence.version}`}
            alt="Conceptual architectural view of a cable-stayed bridge and infrastructure district"
            width="1440"
            height="900"
            fetchPriority="high"
          />
        </picture>
        <canvas ref={canvas} className="journey-canvas" aria-hidden="true" />
        <div className="journey-shade" />
        <div className="journey-topline">
          <span>R & B INFRA PROJECT LIMITED</span>
          <span>
            MUMBAI, INDIA <i />
          </span>
        </div>
        <div className={`journey-copy journey-copy-${current.position}`}>
          <span className="journey-eyebrow">
            <i />
            {current.eyebrow}
          </span>
          <h1>
            <span>{current.first}</span>
            <span>{current.second}</span>
          </h1>
          <div className="journey-description">
            <p>{current.text}</p>
            {chapter === 0 ? (
              <Link href="#projects" className="journey-link">
                Explore our work <ArrowUpRight size={20} />
              </Link>
            ) : chapter === 4 ? (
              <Link href="#at-a-glance" className="journey-link">
                Discover Rathore Group <ArrowRight size={20} />
              </Link>
            ) : (
              <span className="journey-chapter-count">0{chapter} / 04</span>
            )}
          </div>
        </div>
        <nav className="journey-chapters" aria-label="Journey chapters">
          {chapters.map((c, i) => (
            <button
              key={c.label}
              className={chapter === i ? "active" : ""}
              aria-label={`${String(i + 1).padStart(2, "0")} — Go to ${c.label}`}
              aria-current={chapter === i ? "step" : undefined}
              onClick={() => jump.current(stops[i])}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <i />
              <span className="journey-chapter-name">{c.label}</span>
            </button>
          ))}
        </nav>
        <div className="journey-bottom">
          <button
            className="journey-scroll"
            onClick={() => jump.current(stops[Math.min(chapter + 1, 4)])}
          >
            <span>
              <ArrowDown size={17} />
            </span>
            {chapter === 4 ? "THE JOURNEY CONTINUES" : "SCROLL TO EXPLORE"}
          </button>
          <span className="journey-current">{current.label}</span>
          <span className="journey-visual-note">
            CONCEPTUAL ARCHITECTURAL SEQUENCE
          </span>
        </div>
        <div className="journey-progress">
          <span />
        </div>
      </div>
    </section>
  );
}
