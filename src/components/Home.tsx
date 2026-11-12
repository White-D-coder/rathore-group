"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight, MoveUpRight } from "lucide-react";
import Scene from "./Scene";
import { company } from "@/data/company";
import {
  AboutSection,
  CapabilitiesSection,
  ProjectShowcase,
  PresenceSection,
  StrengthsSection,
  EquipmentSection,
  LeadershipSection,
  GroupSection,
  TrustSection,
  ResponsibilitySection,
  FinalCTA,
} from "./Sections";

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <section
      className="stats-section"
      ref={ref}
      aria-label="Company at a glance"
    >
      <div className="stats-heading">
        <span className="eyebrow">A LEGACY, MEASURED IN IMPACT</span>
        <span>THREE DECADES. ONE COMMITMENT.</span>
      </div>
      <div className="stats-grid">
        {company.metrics.map((m) => (
          <div className="stat" key={m.label}>
            <div>
              <span>{m.prefix}</span>
              <Count
                target={m.value}
                visible={visible}
                year={m.value === 1994}
              />
              <span>{m.suffix}</span>
              {m.unit && <small>{m.unit}</small>}
            </div>
            <p>{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
function Count({
  target,
  visible,
  year,
}: {
  target: number;
  visible: boolean;
  year: boolean;
}) {
  const [n, setN] = useState(target);
  useEffect(() => {
    if (
      !visible ||
      year ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let frame = 0;
    const start = performance.now();
    function animate(now: number) {
      const t = Math.min((now - start) / 1400, 1);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, target, year]);
  return <>{year ? n : n.toLocaleString("en-IN")}</>;
}
function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (
      sessionStorage.getItem("rathore-intro") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setShow(true);
    sessionStorage.setItem("rathore-intro", "1");
    const t = setTimeout(() => setShow(false), 1300);
    return () => clearTimeout(t);
  }, []);
  return show ? (
    <div className="intro" aria-hidden="true">
      <span className="intro-crest">
        <img src="/images/logo-original.png" alt="" />
      </span>
      <span>RATHORE GROUP</span>
      <div className="intro-line" />
    </div>
  ) : null;
}
export default function Home() {
  return (
    <>
      <Intro />
      <section id="home" className="hero">
        <div className="hero-atmosphere" />
        <Scene />
        <div className="hero-shade" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div className="hero-kicker">
            <span className="gold-line" />
            ENGINEERING INDIA. SINCE 1994.
          </div>
          <h1>
            WHERE VISION
            <br />
            BECOMES
            <br />
            <span>LEGACY.</span>
          </h1>
          <p>
            Engineering infrastructure. Building communities.
            <br className="desktop-break" /> Creating a stronger future.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" href="#projects">
              Explore our projects <ArrowUpRight size={18} />
            </Link>
            <Link className="text-link" href="/about/">
              Discover Rathore Group <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-index">
          <span>01</span>
          <i />
          <span>06</span>
        </div>
        <div className="hero-bottom">
          <a href="#at-a-glance" className="scroll-prompt">
            <span className="scroll-icon">
              <ArrowDown size={17} />
            </span>
            SCROLL TO DISCOVER
          </a>
          <div className="hero-location">
            <span className="live-dot" />
            FOUNDATIONS FOR A BETTER TOMORROW
          </div>
          <span className="scene-credit">
            AN ARCHITECTURAL STUDY · INTERACTIVE 3D
          </span>
        </div>
        <div className="hero-side">
          BUILDING A LEGACY. ENGINEERING THE FUTURE.
        </div>
      </section>
      <div id="at-a-glance">
        <Stats />
      </div>
      <AboutSection />
      <CapabilitiesSection />
      <ProjectShowcase />
      <PresenceSection />
      <StrengthsSection />
      <EquipmentSection />
      <LeadershipSection />
      <GroupSection />
      <TrustSection />
      <ResponsibilitySection />
      <FinalCTA />
    </>
  );
}
