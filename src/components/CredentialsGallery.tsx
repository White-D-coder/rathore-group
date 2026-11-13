"use client";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, X, Plus, Minus, Download } from "lucide-react";
import RevealText from "./RevealText";
const certificates = [
  {
    file: "cmmi-level3",
    name: "CMMI — Maturity Level 3",
    detail: "Process improvement · Profile page 25",
  },
  {
    file: "quality-management",
    name: "Quality Management System",
    detail: "Quality compliance · Profile page 25",
  },
  {
    file: "sa8000",
    name: "SA8000:2014",
    detail: "Social accountability · Profile page 25",
  },
  {
    file: "iso14001",
    name: "ISO 14001:2015",
    detail: "Environmental management · Profile page 27",
  },
  {
    file: "iso45001",
    name: "ISO 45001:2018",
    detail: "Health & safety management · Profile page 27",
  },
  {
    file: "rmc-capability",
    name: "RMC Capability Certification",
    detail: "TÜV India · Profile page 27",
  },
];
export default function CredentialsGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (selected !== null) {
      setZoom(1);
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [selected]);
  const c = selected !== null ? certificates[selected] : null;
  return (
    <div className="credentials">
      <div className="credentials-heading">
        <span className="eyebrow">STANDARDS BEHIND OUR WORK</span>
        <RevealText as="h3">Credentials, in detail.</RevealText>
        <p>
          Original documents from our 2026 corporate profile. Select a
          certificate to inspect the source scan.
        </p>
      </div>
      <div className="certificate-grid">
        {certificates.map((cert, i) => (
          <button
            key={cert.file}
            className="certificate-card"
            onClick={() => setSelected(i)}
          >
            <div>
              <img
                src={`/images/certificates/${cert.file}.webp`}
                alt={`${cert.name} certificate preview`}
                width="180"
                height="230"
                loading="lazy"
              />
            </div>
            <h4>{cert.name}</h4>
            <span>{cert.detail}</span>
            <ArrowUpRight size={17} />
          </button>
        ))}
      </div>
      <dialog
        className="certificate-dialog"
        aria-labelledby="certificate-title"
        ref={dialog}
        onClose={() => setSelected(null)}
        onClick={(e) => {
          if (e.target === dialog.current) setSelected(null);
        }}
      >
        {c && (
          <>
            <div className="certificate-toolbar">
              <div>
                <h2 id="certificate-title">{c.name}</h2>
                <p>Original scan · 2026 corporate profile</p>
              </div>
              <div>
                <button
                  aria-label="Zoom out certificate"
                  onClick={() => setZoom(Math.max(1, zoom - 0.25))}
                >
                  <Minus size={18} />
                </button>
                <button
                  aria-label="Zoom in certificate"
                  onClick={() => setZoom(Math.min(3, zoom + 0.25))}
                >
                  <Plus size={18} />
                </button>
                <a
                  href={`/images/certificates/${c.file}.png`}
                  download
                  aria-label="Download original certificate"
                >
                  <Download size={18} />
                </a>
                <button
                  aria-label="Close certificate"
                  onClick={() => setSelected(null)}
                >
                  <X size={21} />
                </button>
              </div>
            </div>
            <div className="certificate-viewer">
              <img
                style={{ width: `${zoom * 100}%`, maxWidth: "none" }}
                src={`/images/certificates/${c.file}.png`}
                alt={`${c.name}, original certificate scan from the company profile`}
              />
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
