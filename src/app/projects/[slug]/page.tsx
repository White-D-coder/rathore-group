import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import { projects } from "@/data/company";
import { PageHeading } from "@/components/SiteChrome";
import { FinalCTA } from "@/components/Sections";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.title,
    description: p?.description,
    alternates: { canonical: `/projects/${slug}/` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  return (
    <>
      <PageHeading
        label={`${p.status} project`}
        title={p.title}
        description={p.location}
      />
      <section className="project-detail section-pad">
        <div className="container">
          <Link className="underlined-link" href="/projects/">
            <ArrowLeft size={17} />
            Back to all projects
          </Link>
          <div className="project-detail-grid">
            <div>
              <span className="eyebrow">PROJECT OVERVIEW</span>
              <h2>
                Infrastructure
                <br />
                with a purpose.
              </h2>
              <p>{p.description}</p>
              <Link href="/contact/" className="button button-gold">
                Discuss a similar project <ArrowUpRight size={17} />
              </Link>
            </div>
            <dl>
              <div>
                <dt>PROJECT STATUS</dt>
                <dd>
                  <span className="live-dot" />
                  {p.status}
                </dd>
              </div>
              <div>
                <dt>SECTOR</dt>
                <dd>{p.category}</dd>
              </div>
              <div>
                <dt>LOCATION</dt>
                <dd>
                  <MapPin size={16} />
                  {p.location}
                </dd>
              </div>
              {p.value && (
                <div>
                  <dt>PROJECT VALUE</dt>
                  <dd className="detail-value">
                    ₹{p.value}
                    <small> Crore</small>
                  </dd>
                </div>
              )}
            </dl>
          </div>
          {p.image && (
            <figure>
              <img
                src={p.image.replace(".jpg", ".webp")}
                alt={`${p.title} image from the 2026 corporate profile`}
                width="1200"
                height="700"
              />
              <figcaption>
                {p.imageNote ||
                  "Project image from the 2026 corporate profile."}
              </figcaption>
            </figure>
          )}
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
