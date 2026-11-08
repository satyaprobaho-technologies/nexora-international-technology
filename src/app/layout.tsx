import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title:"NEXORA INTERNATIONAL TECHNOLOGY",description:"Your Digital World Starts Here. Website development, domain and hosting services."};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
