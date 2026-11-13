"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowUp, Menu, X } from "lucide-react";
import { company } from "@/data/company";
import { usePathname } from "next/navigation";
import RevealText from "./RevealText";

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link className={`brand ${small ? "brand-small" : ""}`} href="/">
      <span className="crest">
        <img src="/images/logo-original.png" alt="" width="205" height="50" />
      </span>
      <span className="brand-text">
        RATHORE GROUP<small>BUILDING A LEGACY SINCE 1994</small>
      </span>
    </Link>
  );
}
const links = [
  ["About", "/about/"],
  ["Capabilities", "/capabilities/"],
  ["Projects", "/projects/"],
  ["Our presence", "/our-presence/"],
  ["Leadership", "/leadership/"],
];
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [active, setActive] = useState(pathname);
  useEffect(() => {
    setActive(pathname);
    if (pathname !== "/") return;
    const sections: Record<string, string> = {
      about: "/about/",
      capabilities: "/capabilities/",
      projects: "/projects/",
      presence: "/our-presence/",
      leadership: "/leadership/",
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(sections[e.target.id]);
        });
      },
      { rootMargin: "-15% 0px -50% 0px" },
    );
    Object.keys(sections).forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 30);
    handle();
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="nav-inner">
          <Logo />
          <nav aria-label="Main navigation">
            {links.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  active.replace(/\/$/, "") === href.replace(/\/$/, "")
                    ? "page"
                    : undefined
                }
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/contact/" className="nav-cta">
            Enquire now <ArrowUpRight size={15} />
          </Link>
          <button
            className="menu-toggle"
            aria-label="Open navigation"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu />
          </button>
        </div>
      </header>
      <dialog aria-label="Navigation" className="mobile-menu" ref={dialog}>
        <div className="mobile-menu-top">
          <Logo small />
          <button
            aria-label="Close navigation"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          <Link href="/" onClick={() => dialog.current?.close()}>
            Home
          </Link>
          {[...links, ["Contact", "/contact/"]].map(([label, href], i) => (
            <Link
              key={href}
              href={href}
              onClick={() => dialog.current?.close()}
            >
              <span>0{i + 1}</span>
              {label}
              <ArrowUpRight size={22} />
            </Link>
          ))}
        </nav>
        <p>
          Engineering infrastructure.
          <br />
          Building a lasting legacy.
        </p>
      </dialog>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Logo />
          <p>
            Engineering infrastructure.
            <br />
            Building communities. Creating a stronger future.
          </p>
        </div>
        <a href="#main" className="back-top" aria-label="Back to top">
          <ArrowUp size={22} />
        </a>
      </div>
      <div className="footer-grid">
        <div>
          <span className="eyebrow">A LEGACY IN THE MAKING</span>
          <h3>
            Built on trust.
            <br />
            <span>Engineered to last.</span>
          </h3>
          <p>{company.legalName}</p>
        </div>
        <div>
          <h3 className="footer-nav-title">Explore</h3>
          {links.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h3 className="footer-nav-title">Capabilities</h3>
          <Link href="/capabilities/#buildings">Buildings</Link>
          <Link href="/capabilities/#roads">Roads & transportation</Link>
          <Link href="/capabilities/#water">Water infrastructure</Link>
          <Link href="/capabilities/#waste">Waste & renewables</Link>
        </div>
        <div>
          <h3 className="footer-nav-title">Get in touch</h3>
          <a href="tel:+912228957474">+91 22 2895 7474</a>
          <a href="tel:+912228958787">+91 22 2895 8787</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={`mailto:${company.tenderEmail}`}>{company.tenderEmail}</a>
          <p className="footer-address">{company.address}</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Rathore Group. All rights reserved.
        </span>
        <span>
          MUMBAI, INDIA <span className="live-dot" />
        </span>
        <Link href="/privacy/">
          Privacy policy <ArrowUpRight size={12} />
        </Link>
      </div>
    </footer>
  );
}
export function PageHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Home</Link>
          <span>/</span>
          <span>{label}</span>
        </div>
        <span className="eyebrow">
          <span className="gold-line" />
          {label}
        </span>
        <RevealText as="h1">{title}</RevealText>
        <p>{description}</p>
      </div>
      <div className="heading-grid" />
    </div>
  );
}
