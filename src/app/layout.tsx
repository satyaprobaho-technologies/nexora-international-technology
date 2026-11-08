import type { Metadata } from "next";
import "./globals.css";
import HelpChat from "@/components/HelpChat";

const siteUrl = "https://nexora-international-technology.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "NEXORA INTERNATIONAL TECHNOLOGY | Your Digital World Starts Here", template: "%s | NEXORA" },
  description: "NEXORA provides website design and development, domain and hosting guidance, business email, website maintenance and digital support.",
  applicationName: "NEXORA INTERNATIONAL TECHNOLOGY",
  openGraph: { type: "website", url: siteUrl, title: "NEXORA INTERNATIONAL TECHNOLOGY", description: "Your Digital World Starts Here." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<HelpChat /></body></html>;
}
