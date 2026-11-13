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
      <div className="stats-intro"><RevealText>A legacy.<br /><span className="serif-accent">Measured in impact.</span></RevealText><p>Engineering progress since 1994.</p></div>
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
