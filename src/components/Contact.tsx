"use client";
import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  Check,
  ArrowRight,
} from "lucide-react";
import { company } from "@/data/company";
export default function Contact() {
  const [draft, setDraft] = useState<string | null>(null);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const subject = `${d.get("topic")} enquiry — ${d.get("organization") || d.get("name")}`;
    const body = `Name: ${d.get("name")}\nEmail: ${d.get("email")}\nOrganization: ${d.get("organization") || "Not provided"}\n\n${d.get("message")}`;
    setDraft(
      `mailto:${d.get("topic") === "Tender opportunity" ? company.tenderEmail : company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  }
  return (
    <section className="contact-section section-pad">
      <div className="container contact-layout">
        <div className="contact-details">
          <span className="eyebrow">LET’S START A CONVERSATION</span>
          <h2>
            Great things begin
            <br />
            with a connection.
          </h2>
          <p>
            For project enquiries, tenders and partnership opportunities,
            connect with our team.
          </p>
          <div>
            <Phone size={21} />
            <span>
              <small>CALL US</small>
              <a href="tel:+912228957474">+91 22 2895 7474</a>
              <a href="tel:+912228958787">+91 22 2895 8787</a>
            </span>
          </div>
          <div>
            <Mail size={21} />
            <span>
              <small>WRITE TO US</small>
              <a href={`mailto:${company.email}`}>{company.email}</a>
              <a href={`mailto:${company.tenderEmail}`}>
                {company.tenderEmail}
              </a>
            </span>
          </div>
          <div>
            <MapPin size={21} />
            <span>
              <small>REGISTERED OFFICE</small>
              <p>{company.address}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Neela+Apartments+SVP+Road+Borivali+West+Mumbai+400092"
                target="_blank"
                rel="noreferrer"
                className="map-link"
              >
                View on Google Maps <ArrowUpRight size={14} />
              </a>
            </span>
          </div>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <span className="eyebrow">TELL US WHAT YOU HAVE IN MIND</span>
          <div className="form-row">
            <label>
              Full name <span>*</span>
              <input
                name="name"
                autoComplete="name"
                placeholder="Your name"
                required
                maxLength={120}
              />
            </label>
            <label>
              Email address <span>*</span>
              <input
                name="email"
                autoComplete="email"
                type="email"
                placeholder="you@company.com"
                required
                maxLength={160}
              />
            </label>
          </div>
          <label>
            Organization
            <input
              name="organization"
              autoComplete="organization"
              placeholder="Your company or institution"
              maxLength={160}
            />
          </label>
          <label>
            Enquiry type
            <select name="topic">
              <option>Project partnership</option>
              <option>Tender opportunity</option>
              <option>General enquiry</option>
            </select>
          </label>
          <label>
            Your message <span>*</span>
            <textarea
              name="message"
              placeholder="Tell us about your project, location and requirements…"
              required
              minLength={15}
              maxLength={5000}
              rows={5}
            />
          </label>
          <p className="form-note">
            Your enquiry is prepared locally and sent through your email app. No
            information is submitted until you send the email.
          </p>
          <button type="submit" className="button button-gold">
            Prepare enquiry <ArrowRight size={18} />
          </button>
          {draft && (
            <div className="form-success" role="status">
              <Check size={21} />
              <div>
                <strong>Your email draft is ready.</strong>
                <p>Open your email app to review and send it to our team.</p>
                <a href={draft}>
                  Open email app <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
