"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import india from "@/data/india.json";
const IndiaMapScene = dynamic(() => import("./IndiaMapScene"), { ssr: false });
import {
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowDown,
  Plus,
  Minus,
  MapPin,
  Building2,
  Route,
  Waves,
  Recycle,
  X,
  Check,
  ShieldCheck,
  Construction,
  Users,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import CredentialsGallery from "./CredentialsGallery";
import RevealText from "./RevealText";
import {
  capabilities,
  projects,
  leadership,
  equipment,
  groupCompanies,
  registrations,
  type Project,
} from "@/data/company";
const sectorImages: Record<string, string> = {
  Buildings: "/images/project-silvassa.webp",
  "Water infrastructure": "/images/hero-bridge.webp",
  "Roads & transportation": "/images/road.webp",
  "Waste & renewables": "/images/waste.webp",
  "Electrical & technology": "/images/banner1.webp",
  "Renewable energy": "/images/buildings.webp",
};
export function SectionLabel({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <div className="section-label">
      <span className="gold-line" />
      {children}
      {number && <span className="section-number">{number}</span>}
    </div>
  );
}
export function AboutSection({ full = false }: { full?: boolean }) {
  return (
    <section className="about-section section-pad" id="about">
      <div className="container">
        <SectionLabel number="01 / A FOUNDATION OF TRUST">
          THE RATHORE STORY
        </SectionLabel>
        <div className="about-layout">
          <div className="about-copy">
            <RevealText as="h2">
              Three decades of
              <br />
              engineering
              <br />
              <span className="serif-accent">excellence.</span>
            </RevealText>
            <p className="lead-text">
              Built with purpose.
              <br />
              Defined by the things that last.
            </p>
            <p>
              Established in 1994 and headquartered in Mumbai, R & B Infra
              Project Limited delivers civil, mechanical and electrical
              engineering works across India.
            </p>
            <p>
              From the roads that connect us to the water systems that sustain
              us, our work is part of everyday life. We bring together
              experience, engineering and an unwavering commitment to execution.
            </p>
            {!full && (
              <Link href="/about/" className="underlined-link">
                Get to know Rathore Group <ArrowUpRight size={19} />
              </Link>
            )}
          </div>
          <div className="about-image">
            <img
              src="/images/projects/sirohi-medical-college.webp"
              alt="Medical College at Sirohi, photograph from the 2026 corporate profile"
              loading="lazy"
              width="900"
              height="1100"
            />
            <div className="image-caption">
              <span>MEDICAL COLLEGE</span>
              <span>
                SIROHI, RAJASTHAN <ArrowUpRight size={14} />
              </span>
            </div>
            <div className="legacy-tag">
              <span>
                30<span>+</span>
              </span>
              <p>
                YEARS OF
                <br />
                BUILDING TRUST
              </p>
            </div>
            <div className="image-corner" />
          </div>
        </div>
        <div className="vision-mission">
          <div>
            <span>01 / OUR VISION</span>
            <RevealText as="h3">
              A larger vision.
              <br />A lasting difference.
            </RevealText>
            <p>
              To become a preeminent Indian conglomerate across infrastructure,
              civil construction, solid waste management, storm water drainage
              and related sectors.
            </p>
          </div>
          <div>
            <span>02 / OUR MISSION</span>
            <RevealText as="h3">
              Quality in every detail.
              <br />
              Purpose in every project.
            </RevealText>
            <p>
              To deliver quality services, maintain efficiency and establish a
              strong presence across the globe.
            </p>
          </div>
        </div>
        {full && (
          <div className="history-line">
            <span className="eyebrow">OUR JOURNEY</span>
            {[
              { year: "1994", text: "The journey begins as a proprietorship." },
              {
                year: "2018",
                text: "Sewage treatment infrastructure at Mount Abu.",
              },
              {
                year: "2021",
                text: "Two-lane roads and bridges in Jammu & Kashmir.",
              },
              {
                year: "2024",
                text: "Mother and child specialty hospital construction.",
              },
              {
                year: "2026",
                text: "Diversification into waste-to-energy, biogas and biomining.",
              },
            ].map((m) => (
              <div key={m.year}>
                <strong>{m.year}</strong>
                <span>{m.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export function CapabilitiesSection({ full = false }: { full?: boolean }) {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  const c = capabilities[active];
  const icons = [Building2, Route, Waves, Recycle];
  return (
    <section
      className="capabilities-section section-pad"
      id="capabilities"
      ref={root}
    >
      <div className="container">
        <SectionLabel number="02 / THE EXPERTISE">WHAT WE BUILD</SectionLabel>
        <div className="section-heading-row">
          <RevealText as="h2">
            Essential infrastructure.
            <br />
            <span className="muted">Extraordinary possibilities.</span>
          </RevealText>
          <p>
            Four core capabilities.
            <br />
            One commitment to a better tomorrow.
          </p>
        </div>
        <div className="capability-stage">
        <div
          className="capability-tabs"
          role="tablist"
          aria-label="Infrastructure capabilities"
        >
          {capabilities.map((item, i) => (
            <button
              key={item.id}
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={active === i}
              aria-controls="capability-panel"
              onClick={() => setActive(i)}
            >
              <span>{item.number}</span>
              {item.title}
              <ArrowUpRight size={17} />
            </button>
          ))}
        </div>
        <div
          className="capability-content"
          role="tabpanel"
          id="capability-panel"
          aria-labelledby={`tab-${c.id}`}
        >
          <div className="capability-copy" key={c.id}>
            <span className="eyebrow">
              {c.number} / {c.title}
            </span>
            <RevealText as="h3">{c.subtitle}</RevealText>
            <p>{c.description}</p>
            <ul>
              {c.items.map((t) => (
                <li key={t}>
                  <span />
                  {t}
                </li>
              ))}
            </ul>
            <Link
              href={full ? "/contact/" : `/capabilities/#${c.id}`}
              className="underlined-link"
            >
              {full ? "Discuss a project" : "Explore this capability"}{" "}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="capability-visual" key={`image-${c.id}`}>
            <div className="technical-cross cross-tl" />
            <div className="technical-cross cross-br" />
            <img
              className="capability-project-photo"
              src={
                [
                  "/images/projects/kanjurmarg-hospital.webp",
                  "/images/projects/pangong-road.webp",
                  "/images/projects/parbhani-water-supply.webp",
                  "/images/projects/badlapur-waste-plant.webp",
                ][active]
              }
              alt={
                [
                  "Mother–Child Hospital, Kanjurmarg",
                  "Lukung–Chartse Road, Ladakh",
                  "Parbhani Water Supply Scheme",
                  "Badlapur Waste Plant",
                ][active]
              }
              loading="lazy"
              width="900"
              height="650"
            />
            <span className="model-label">
              {
                [
                  "MOTHER–CHILD HOSPITAL / KANJURMARG",
                  "LUKUNG–CHARTSE ROAD / LADAKH",
                  "WATER SUPPLY SCHEME / PARBHANI",
                  "WASTE PLANT / BADLAPUR",
                ][active]
              }
            </span>

            <div className="model-orbit" />
          </div>
        </div>
        </div>
        {full && (
          <div className="capability-all">
            {capabilities.map((c, i) => {
              const Icon = icons[i];
              return (
                <article id={c.id} key={c.id}>
                  <Icon size={27} />
                  <span>{c.number}</span>
                  <RevealText as="h3">{c.title}</RevealText>
                  <p>{c.description}</p>
                  <ul>
                    {c.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (project) dialog.current?.showModal();
    else dialog.current?.close();
  }, [project]);
  return (
    <dialog
      ref={dialog}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      {project && (
        <div className="project-dialog-inner">
          <button
            onClick={onClose}
            className="dialog-close"
            aria-label="Close project details"
          >
            <X />
          </button>
          <div className="project-dialog-image">
            <img
              src={
                project.image?.replace(".jpg", ".webp") ||
                sectorImages[project.category]
              }
              alt={
                project.image
                  ? "Project image from the 2026 corporate profile"
                  : `${project.category} sector illustration; not a photograph of this project`
              }
            />
            <span>
              {project.image
                ? project.imageNote?.startsWith("Architectural")
                  ? "PROFILE · ARCHITECTURAL VISUALIZATION"
                  : "2026 PROFILE · PROJECT IMAGE"
                : "SECTOR IMAGE · ILLUSTRATIVE"}
            </span>
          </div>
          <div className="project-dialog-copy">
            <span className="eyebrow">
              {project.status} / {project.category}
            </span>
            <RevealText as="h2" id="project-dialog-title">{project.title}</RevealText>
            <p>
              <MapPin size={15} />
              {project.location}
            </p>
            <p>{project.description}</p>
            {project.value && (
              <div className="project-value">
                <strong>
                  ₹{project.value}
                  <small> Cr</small>
                </strong>
                <span>DOCUMENTED PROJECT VALUE</span>
              </div>
            )}
            <Link
              href={`/projects/${project.slug}/`}
              className="button button-gold"
            >
              View project page <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </dialog>
  );
}
export function ProjectShowcase({ full = false }: { full?: boolean }) {
  const [status, setStatus] = useState<"Completed" | "Ongoing">("Completed");
  const [category, setCategory] = useState("All sectors");
  const [selected, setSelected] = useState<Project | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const filtered = projects.filter(
    (p) =>
      p.status === status &&
      (category === "All sectors" || p.category === category),
  );
  function changeStatus(s: "Completed" | "Ongoing") {
    setStatus(s);
    track.current?.scrollTo({ left: 0, behavior: "smooth" });
  }
  return (
    <section className="projects-section section-pad" id="projects">
      <div className="container">
        <SectionLabel number="03 / PROOF IN EVERY PROJECT">
          SELECTED WORK
        </SectionLabel>
        <div className="section-heading-row">
          <RevealText as="h2">
            Engineering
            <br />
            <span className="serif-accent">what matters.</span>
          </RevealText>
          <div>
            <p>
              From critical public infrastructure to urban development,
              <br />
              our work creates value that outlasts the build.
            </p>
            {!full && (
              <Link href="/projects/" className="underlined-link">
                View all projects <ArrowUpRight size={17} />
              </Link>
            )}
          </div>
        </div>
        <div className="project-controls">
          <div
            className="status-tabs"
            role="tablist"
            aria-label="Project status"
          >
            {(["Completed", "Ongoing"] as const).map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={status === s}
                onClick={() => changeStatus(s)}
              >
                {s} projects{" "}
                <span>
                  {projects
                    .filter((p) => p.status === s)
                    .length.toString()
                    .padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
          {full ? (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Filter projects by sector"
            >
              <option>All sectors</option>
              {[...new Set(projects.map((p) => p.category))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          ) : (
            <div className="project-arrows">
              <button
                aria-label="Previous projects"
                onClick={() =>
                  track.current?.scrollBy({ left: -460, behavior: "smooth" })
                }
              >
                <ArrowLeft size={20} />
              </button>
              <button
                aria-label="Next projects"
                onClick={() =>
                  track.current?.scrollBy({ left: 460, behavior: "smooth" })
                }
              >
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        className={full ? "project-grid container" : "project-track"}
        ref={track}
      >
        {filtered.map((p, i) => (
          <button
            className="project-card"
            key={p.slug}
            onClick={() => setSelected(p)}
          >
            <div className="project-image">
              <img
                src={
                  p.image?.replace(".jpg", ".webp") || sectorImages[p.category]
                }
                alt={
                  p.image
                    ? "Project image from the 2026 corporate profile"
                    : `${p.category} sector illustration`
                }
                loading="lazy"
                width="850"
                height="650"
              />
              <span className="project-status">
                <i />
                {p.status}
              </span>
              <span className="project-open">
                <ArrowUpRight size={23} />
              </span>
              <span className="project-image-note">
                {p.image
                  ? p.imageNote?.startsWith("Architectural")
                    ? "PROFILE · ARCHITECTURAL VISUALIZATION"
                    : "2026 PROFILE · PROJECT IMAGE"
                  : "SECTOR IMAGE · ILLUSTRATIVE"}
              </span>
            </div>
            <div className="project-meta">
              <span>{p.category}</span>
              <span>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <RevealText as="h3">{p.title}</RevealText>
            <div className="project-card-bottom">
              <span>
                <MapPin size={12} />
                {p.location}
              </span>
              {p.value && <strong>₹{p.value} Cr</strong>}
            </div>
          </button>
        ))}
      </div>
      {!full && (
        <div className="container project-track-footer">
          <span>EXPLORE THE WORK THAT SHAPES OUR WORLD</span>
          <span>
            SCROLL TO EXPLORE <ArrowRight size={14} />
          </span>
        </div>
      )}
      <ProjectDialog project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

const regions = [
  {
    name: "Maharashtra",
    x: 27,
    y: 51,
    caption: "Our home. A foundation for nationwide delivery.",
  },
  {
    name: "Rajasthan",
    x: 22,
    y: 30,
    caption: "Healthcare, sewerage and institutional infrastructure.",
  },
  {
    name: "Jammu & Kashmir",
    x: 26,
    y: 10,
    caption: "Road construction and highway connectivity.",
  },
  {
    name: "Ladakh",
    x: 37,
    y: 8,
    caption: "High-altitude roads connecting remote communities.",
  },
  {
    name: "Madhya Pradesh",
    x: 36,
    y: 40,
    caption: "Urban sanitation and sewage infrastructure.",
  },
  {
    name: "Uttar Pradesh",
    x: 43,
    y: 29,
    caption: "Renewable energy and public lighting systems.",
  },
  {
    name: "Odisha",
    x: 56,
    y: 48,
    caption: "Technology systems for public infrastructure.",
  },
  {
    name: "Arunachal Pradesh",
    x: 86,
    y: 25,
    caption: "Road infrastructure across challenging terrain.",
  },
  {
    name: "Himachal Pradesh",
    x: 31,
    y: 17,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Uttarakhand",
    x: 37,
    y: 20,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Haryana",
    x: 27,
    y: 23,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Bihar",
    x: 57,
    y: 35,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Assam",
    x: 81,
    y: 31,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Nagaland",
    x: 87,
    y: 31,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Gujarat",
    x: 12,
    y: 43,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Daman",
    x: 17,
    y: 48,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
  {
    name: "Karnataka",
    x: 26,
    y: 63,
    caption: "Regional presence documented in the 2026 corporate profile.",
  },
];
export function PresenceSection() {
  const [active, setActive] = useState(0);
  const region = regions[active];
  const list = projects.filter((p) => p.state === region.name);
  return (
    <section className="presence-section section-pad" id="presence">
      <div className="container">
        <SectionLabel number="04 / A NATIONAL FOOTPRINT">
          ROOTED IN MUMBAI. BUILDING ACROSS INDIA.
        </SectionLabel>
        <div className="presence-layout">
          <div className="presence-copy">
            <span className="presence-index" aria-label="17 documented regions">17<span>REGIONS. ONE SHARED AMBITION.</span></span>
            <RevealText as="h2">
              Many landscapes.
              <br />
              <span className="muted">One purpose.</span>
            </RevealText>
            <p>
              From growing cities to demanding terrain, we bring engineering
              expertise where it matters.
            </p>
            <div
              className="region-selector"
              aria-label="Explore project regions"
            >
              {regions.map((r, i) => (
                <button
                  key={r.name}
                  className={i === active ? "active" : ""}
                  onClick={() => setActive(i)}
                >
                  {r.name}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
            <div className="region-detail" aria-live="polite" key={region.name}>
              <span className="eyebrow">
                <MapPin size={13} />
                {region.name}
              </span>
              <RevealText as="h3">{region.caption}</RevealText>
              {list.length === 0 && (
                <p className="profile-presence-note">
                  The corporate profile records our presence in this region.
                  Contact our team for individual project details.
                </p>
              )}
              {list.map((p) => (
                <Link key={p.slug} href={`/projects/${p.slug}/`}>
                  <span>{p.title}</span>
                  <small>{p.status}</small>
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
          <div className="india-map">
            <div className="map-rings" />
            <IndiaOutline />
            <svg
              className="map-connections"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {regions.map((r, i) => (
                <path
                  key={`${r.name}-${active}`}
                  d={`M27 51 Q${(27 + r.x) / 2 - 8} ${(51 + r.y) / 2 - 10} ${r.x} ${r.y}`}
                  pathLength="1"
                  fill="none"
                  stroke={i === active ? "#c9a34a" : "#9a8759"}
                  strokeWidth={i === active ? 0.16 : 0.08}
                  opacity={i === active ? 0.65 : 0.2}
                />
              ))}
            </svg>
            <LazyIndiaMap />
            {regions.map((r, i) => (
              <button
                key={r.name}
                className={`map-marker ${active === i ? "active" : ""}`}
                style={{ left: `${r.x}%`, top: `${r.y}%` }}
                onClick={() => setActive(i)}
                aria-label={`Explore projects in ${r.name}`}
                aria-pressed={active === i}
              >
                <span />
                <i>{r.name}</i>
              </button>
            ))}
            <div className="map-legend">
              <span>
                <i />
                Documented regional presence
              </span>
              <small>
                Regional positions are indicative.
                <br />
                Presence does not imply an active project. Project status is
                identified individually.
              </small>
            </div>
            <span className="map-coordinates">
              20.5937° N &nbsp; 78.9629° E
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
function LazyIndiaMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 600px)")
        .matches
    )
      return;
    const canvas = document.createElement("canvas");
    if (!canvas.getContext("webgl2")) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="india-3d" ref={ref}>
      {ready && <IndiaMapScene />}
    </div>
  );
}
function IndiaOutline() {
  return (
    <svg
      className="india-outline"
      viewBox="0 0 100 110"
      fill="none"
      aria-label="Indicative geographic map of India"
      role="img"
    >
      <defs>
        <pattern
          id="mapgrid"
          width="1.7"
          height="1.7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx=".85" cy=".85" r=".15" fill="#b59b62" opacity=".35" />
        </pattern>
      </defs>
      {india.rings.map((r, i) => (
        <path
          key={i}
          d={r.map(([x, y], j) => `${j ? "L" : "M"}${x} ${y}`).join(" ") + "Z"}
          fill="#1b3040"
          stroke="#ad9460"
          strokeWidth=".3"
        />
      ))}
    </svg>
  );
}

const strengths = [
  {
    icon: ShieldCheck,
    title: "Proven execution excellence",
    text: "Multi-sector expertise backed by robust systems, streamlined processes and a commitment to quality.",
  },
  {
    icon: Construction,
    title: "An in-house equipment bank",
    text: "Owned construction machinery supporting operational efficiency and timely delivery.",
  },
  {
    icon: Users,
    title: "Experienced leadership",
    text: "A management team with experience in the delivery of complex infrastructure projects.",
  },
  {
    icon: TrendingUp,
    title: "Consistent financial growth",
    text: "Disciplined project execution with a long-term approach to sustainable business growth.",
  },
];
export function StrengthsSection() {
  return (
    <section className="strengths-section section-pad">
      <div className="container">
        <SectionLabel>THE WAY WE BUILD</SectionLabel>
        <div className="section-heading-row">
          <RevealText as="h2">
            The foundation of
            <br />
            <span className="muted">execution excellence.</span>
          </RevealText>
          <span className="eyebrow">BUILT INTO EVERYTHING WE DO</span>
        </div>
        <div className="strengths-grid">
          {strengths.map((s, i) => (
            <article key={s.title}>
              <span className="strength-number">0{i + 1}</span>
              <s.icon size={37} strokeWidth={1} />
              <RevealText as="h3">{s.title}</RevealText>
              <p>{s.text}</p>
              <span className="strength-line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function EquipmentSection() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);
  return (
    <section className="equipment-section" id="equipment" ref={root}>
      <div className="equipment-photo equipment-gallery-photo">
        <img
          src={equipment[active].image}
          alt={`${equipment[active].name}, equipment photograph from the 2026 corporate profile`}
          key={active}
          width="1200"
          height="1000"
          loading="lazy"
        />
        <span>EQUIPMENT BANK / {String(active + 1).padStart(2, "0")} — 12</span>
        <div className="equipment-photo-label">{equipment[active].name}</div>
      </div>
      <div className="equipment-copy">
        <SectionLabel>BUILT TO DELIVER</SectionLabel>
        <RevealText as="h2">
          Our strength.
          <br />
          <span className="serif-accent">On the ground.</span>
        </RevealText>
        <p>
          A capable in-house equipment bank. The right tools to turn engineering
          ambition into on-site progress.
        </p>
        <div className="equipment-current" aria-live="polite" key={active}>
          <span>{String(active + 1).padStart(2, "0")} / 12</span>
          <RevealText as="h3">{equipment[active].name}</RevealText>
          <p>{equipment[active].description}</p>
        </div>
        <div className="equipment-controls">
          <button
            aria-label="Previous equipment"
            onClick={() => setActive((active + 11) % 12)}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            {equipment.map((e, i) => (
              <button
                key={e.name}
                aria-label={`View ${e.name}`}
                aria-pressed={active === i}
                className={active === i ? "active" : ""}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
          <button
            aria-label="Next equipment"
            onClick={() => setActive((active + 1) % 12)}
          >
            <ArrowRight size={20} />
          </button>
        </div>
        <details className="equipment-list">
          <summary>
            Explore our complete equipment bank <Plus size={17} />
          </summary>
          <ul>
            {equipment.map((e, i) => (
              <li key={e.name}>
                <button onClick={() => setActive(i)}>
                  {e.name}
                  <ArrowUpRight size={13} />
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
export function LeadershipSection({ full = false }: { full?: boolean }) {
  return (
    <section className="leadership-section section-pad" id="leadership">
      <div className="container">
        <SectionLabel number="05 / THE PEOPLE BEHIND THE PURPOSE">
          OUR LEADERSHIP
        </SectionLabel>
        <div className="section-heading-row">
          <RevealText as="h2">
            Leadership that builds
            <br />
            <span className="serif-accent">the future.</span>
          </RevealText>
          {!full && (
            <Link href="/leadership/" className="underlined-link">
              Meet our leadership <ArrowUpRight size={17} />
            </Link>
          )}
        </div>
        <div className="leadership-portraits">
          {leadership.map((leader, i) => (
            <article key={leader.name}>
              <div className="leader-portrait">
                <img
                  src={leader.photo}
                  alt={leader.name}
                  loading="lazy"
                  width="500"
                  height="650"
                />
                <span>0{i + 1} / LEADERSHIP</span>
              </div>
              <RevealText as="h3">{leader.name}</RevealText>
              <span className="leader-role">{leader.role}</span>
              {full && <p>{leader.note}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function GroupSection() {
  return (
    <section className="group-section section-pad">
      <div className="container">
        <SectionLabel>THE RATHORE ECOSYSTEM</SectionLabel>
        <div className="group-layout">
          <RevealText as="h2">
            One vision.
            <br />
            <span className="muted">Many possibilities.</span>
          </RevealText>
          <p>
            A connected group of companies working across infrastructure,
            environmental services and energy.
          </p>
        </div>
        <div className="group-companies">
          {groupCompanies.map((name, i) => (
            <div key={name}>
              <span>0{i + 1}</span>
              <RevealText as="h3">{name}</RevealText>
              <div className="ecosystem-node" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function TrustSection() {
  const [open, setOpen] = useState(false);
  const clients = [
    ["/images/client-mcgm.webp", "Municipal Corporation of Greater Mumbai"],
    ["/images/client-thane.webp", "Thane Municipal Corporation"],
    ["/images/client-vvm.webp", "Vasai Virar City Municipal Corporation"],
    ["/images/client-jnn.webp", "Jodhpur Municipal Corporation"],
    ["/images/clients/indian-railways.webp", "Indian Railways"],
    ["/images/clients/mmrda.webp", "MMRDA"],
    ["/images/clients/bro.webp", "Border Roads Organisation"],
    ["/images/clients/nhai.webp", "National Highways Authority of India"],
  ];
  return (
    <section className="trust-section section-pad">
      <div className="container">
        <SectionLabel>INSTITUTIONAL TRUST</SectionLabel>
        <div className="section-heading-row">
          <RevealText as="h2">
            Trusted to build
            <br />
            public value.
          </RevealText>
          <p>
            Working with public institutions
            <br />
            to deliver essential infrastructure.
          </p>
        </div>
        <div className="client-logos">
          {clients.map(([src, name]) => (
            <div key={name}>
              <img
                src={src}
                alt={name}
                width="110"
                height="110"
                loading="lazy"
              />
              <span>{name}</span>
            </div>
          ))}
        </div>
        <div className="registration-block">
          <button onClick={() => setOpen(!open)} aria-expanded={open}>
            <span>Registrations & government affiliations</span>
            <span>{open ? <Minus size={20} /> : <Plus size={20} />}</span>
          </button>
          {open && (
            <>
              <div className="registration-grid">
                {registrations.map((r) => (
                  <div key={r}>
                    <ShieldCheck size={19} />
                    {r}
                  </div>
                ))}
              </div>
              <p className="registration-note">
                Registrations documented on page 15 of the 2026 corporate
                profile.
              </p>
            </>
          )}
        </div>
        <CredentialsGallery />
      </div>
    </section>
  );
}
export function ResponsibilitySection() {
  return (
    <section className="responsibility-section section-pad">
      <div className="container">
        <SectionLabel>RESPONSIBILITY, BY DESIGN</SectionLabel>
        <div className="responsibility-layout">
          <div>
            <RevealText as="h2">
              A stronger tomorrow.
              <br />
              <span className="serif-accent">Starts with care.</span>
            </RevealText>
            <p>
              Our responsibilities extend beyond the structures we build—to our
              people, our communities and the environment.
            </p>
            <Link className="underlined-link" href="/contact/">
              Start a conversation <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="responsibility-values">
            <div>
              <ShieldCheck size={25} strokeWidth={1.3} />
              <RevealText as="h3">Safety. At every step.</RevealText>
              <p>
                Risk assessment, a commitment to safe working, incident
                reporting and investigation, and ongoing safety training and
                awareness.
              </p>
            </div>
            <div>
              <Recycle size={25} strokeWidth={1.3} />
              <RevealText as="h3">Progress. With purpose.</RevealText>
              <p>
                Community development, environmental stewardship, employee
                well-being, ethical governance and sustainable growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta">
      <img
        src="/images/road.webp"
        alt=""
        loading="lazy"
        width="1920"
        height="600"
      />
      <div className="final-cta-shade" />
      <div className="container">
        <span className="eyebrow">YOUR VISION. OUR COMMITMENT.</span>
        <RevealText as="h2">
          Let’s build
          <br />
          <span className="serif-accent">what matters.</span>
        </RevealText>
        <div>
          <p>
            Have an infrastructure project or partnership in mind?
            <br />
            Let’s start a conversation.
          </p>
          <div className="cta-actions">
            <Link href="/contact/" className="button button-gold">
              Get in touch <ArrowUpRight size={19} />
            </Link>
            <Link href="/capabilities/" className="text-link">
              Our capabilities <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
