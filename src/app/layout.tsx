import type { Metadata, Viewport } from "next";
import { Navbar, Footer } from "@/components/SiteChrome";
import Motion from "@/components/Motion";
import "./globals.css";
import "./redesign.css";
import "./experience.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://rathore-group-legacy.keyursatra.chatgpt.site"),
  title: {
    default: "Rathore Group — Where Vision Becomes Legacy",
    template: "%s | Rathore Group",
  },
  description:
    "Rathore Group / R & B Infra Project Limited. Engineering buildings, roads, water and environmental infrastructure across India since 1994.",
  openGraph: {
    title: "Rathore Group — Where Vision Becomes Legacy",
    description:
      "Building a legacy. Engineering the future. Infrastructure expertise since 1994.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/project-silvassa.webp",
        width: 1200,
        height: 630,
        alt: "Rathore Group infrastructure project",
      },
    ],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#0b192a",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Motion />
      </body>
    </html>
  );
}
