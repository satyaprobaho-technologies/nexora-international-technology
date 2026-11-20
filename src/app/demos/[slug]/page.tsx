import { notFound } from "next/navigation";
import { DEMO_SITES } from "@/lib/demo-sites";
import DemoProtection from "@/components/DemoProtection";
import DemoWorkspace from "@/components/DemoWorkspace";
import MosqueDemo from "@/components/MosqueDemo";

const mosqueSlugs = ["shayla-akram-1", "shayla-akram-2", "shayla-akram-3", "shayla-akram-4"];

export function generateStaticParams() {
  return [...DEMO_SITES.map(({ slug }) => ({ slug })), ...mosqueSlugs.map((slug) => ({ slug }))];
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const match = slug.match(/^shayla-akram-([1-4])$/);
  if (match) {
    return <MosqueDemo variant={match[1] as "1" | "2" | "3" | "4"} />;
  }

  const demo = DEMO_SITES.find((site) => site.slug === slug);
  if (!demo) notFound();
  const number = DEMO_SITES.findIndex((site) => site.slug === slug) + 1;
  return <DemoProtection><DemoWorkspace slug={slug} name={demo.name} title={demo.title} tagline={demo.tagline} intro={demo.intro} number={number} accent={demo.accent} /></DemoProtection>;
}
