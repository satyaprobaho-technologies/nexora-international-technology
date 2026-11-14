import type { Metadata } from "next";
import MasterAdminClient from "@/components/MasterAdminClient";

export const metadata: Metadata = { title: "Central Master Admin" };

export default function MasterAdminPage() {
  return <MasterAdminClient />;
}
