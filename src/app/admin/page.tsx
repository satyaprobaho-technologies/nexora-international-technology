import type { Metadata } from "next";
import AdminClient from "@/components/AdminClient";
export const metadata: Metadata = { title: "Staff Access" };
export default function AdminPage() { return <AdminClient />; }
