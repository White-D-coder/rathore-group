import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found container">
      <span className="eyebrow">404 / A DIFFERENT PATH</span>
      <h1>
        This road
        <br />
        ends here.
      </h1>
      <p>Let’s get you back to the infrastructure that matters.</p>
      <Link href="/" className="button button-gold">
        Return home ↗
      </Link>
    </section>
  );
}
