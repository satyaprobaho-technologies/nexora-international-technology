import type { Metadata } from "next";
import PortalClient from "@/components/PortalClient";
export const metadata: Metadata = { title: "Customer Portal" };
export default function PortalPage() { return <PortalClient />; }
