import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeading } from "@/components/SiteChrome";
import {
  AboutSection,
  CapabilitiesSection,
  ProjectShowcase,
  PresenceSection,
  LeadershipSection,
  FinalCTA,
  StrengthsSection,
  ResponsibilitySection,
} from "@/components/Sections";
import { Stats } from "@/components/Home";
import Contact from "@/components/Contact";
const pages: Record<
  string,
  { label: string; title: string; description: string }
> = {
  about: {
    label: "About Rathore Group",
    title: "Built on trust. Engineered to last.",
    description:
      "Three decades of purpose, expertise and the determination to make a lasting difference.",
  },
  capabilities: {
    label: "Our capabilities",
    title: "The expertise behind the impact.",
    description:
      "Civil, mechanical and electrical engineering across the infrastructure that matters most.",
  },
  projects: {
    label: "Our projects",
    title: "A legacy you can see.",
    description:
      "Explore our completed work and the projects shaping our next chapter.",
  },
  "our-presence": {
    label: "Our presence",
    title: "One purpose. Across India.",
    description:
      "Engineering expertise across cities, states and challenging landscapes.",
  },
  leadership: {
    label: "Our leadership",
    title: "Vision that moves us forward.",
    description:
      "Meet the people guiding Rathore Group and its commitment to lasting value.",
  },
  contact: {
    label: "Contact us",
    title: "Let’s build what matters.",
    description:
      "Your next project begins with a conversation. We would like to hear from you.",
  },
  privacy: {
    label: "Privacy policy",
    title: "Your information. Handled with care.",
    description: "How this website handles your information.",
  },
};
export function generateStaticParams() {
  return Object.keys(pages).map((section) => ({ section }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section } = await params;
  return {
    title: pages[section]?.label,
    description: pages[section]?.description,
    alternates: { canonical: `/${section}/` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const p = pages[section];
  if (!p) notFound();
  return (
    <>
      <PageHeading {...p} />
      {section === "about" ? (
        <>
          <AboutSection full />
          <Stats />
          <StrengthsSection />
          <ResponsibilitySection />
        </>
      ) : section === "capabilities" ? (
        <CapabilitiesSection full />
      ) : section === "projects" ? (
        <ProjectShowcase full />
      ) : section === "our-presence" ? (
        <PresenceSection />
      ) : section === "leadership" ? (
        <LeadershipSection full />
      ) : section === "contact" ? (
        <Contact />
      ) : (
        <div className="container privacy-content section-pad">
          <h2>Website enquiries</h2>
          <p>
            The enquiry form prepares an email draft in your browser. The
            website does not store form entries. Your email application
            processes and sends your enquiry when you choose to send it.
          </p>
          <h2>Local preferences</h2>
          <p>
            A session storage flag remembers whether the introductory animation
            has played during your visit. It expires when your browser session
            ends. No advertising or analytics scripts are included in this
            website.
          </p>
          <h2>External services</h2>
          <p>
            Links to email and map services open third-party applications. Their
            privacy policies apply when you use those services. The website host
            may process technical request information to deliver and secure the
            site.
          </p>
          <h2>Contact</h2>
          <p>
            For privacy enquiries, write to{" "}
            <a href="mailto:rmr@rathoregroup.co">rmr@rathoregroup.co</a>.
          </p>
        </div>
      )}
      {section !== "contact" && section !== "privacy" && <FinalCTA />}
    </>
  );
}
