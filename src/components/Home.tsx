"use client";
import { useEffect, useRef, useState } from "react";
import ScrollJourney from "./ScrollJourney";
import RevealText from "./RevealText";
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
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
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
      <div className="impact-topline">
        <RevealText>A legacy,<span className="serif-accent"> measured in impact.</span></RevealText>
        <span>THREE DECADES. ONE COMMITMENT.</span>
      </div>
      <div className="impact-facts">
        {company.metrics.map((m, index) => (
          <div className={`impact-fact ${index === 0 ? "impact-fact-primary" : ""}`} key={m.label}>
            <div className="impact-fact-value">
              {m.prefix && <span className="impact-currency">{m.prefix}</span>}
              <Count target={m.value} visible={visible} year={m.value === 1994} />
              <span className="impact-suffix">{m.suffix}</span>
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
  const number = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setOnScreen(entry.isIntersecting);
    }, { threshold: 0.4 });
    if (number.current) observer.observe(number.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (
      !visible || !onScreen ||
      year ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    setN(0);
    let frame = 0;
    const start = performance.now();
    function animate(now: number) {
      const t = Math.min((now - start) / 1400, 1);
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, onScreen, target, year]);
  return <span className="count-value" ref={number}>{year ? n : n.toLocaleString("en-IN")}</span>;
}
export default function Home() {
  return (
    <>
      <ScrollJourney />
      <div id="at-a-glance">
        <Stats />
      </div>
      <AboutSection />
      <ProjectShowcase />
      <CapabilitiesSection />
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
