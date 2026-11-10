import type { Metadata } from "next";
import MarketingClient from "@/components/MarketingClient";

export const metadata: Metadata = { title: "Marketing Center" };

export default function MarketingPage() {
  return <MarketingClient />;
}
