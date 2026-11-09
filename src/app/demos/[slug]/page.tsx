import { notFound } from "next/navigation";
import { DEMO_SITES } from "@/lib/demo-sites";
import DemoProtection from "@/components/DemoProtection";
import DemoWorkspace from "@/components/DemoWorkspace";

export function generateStaticParams() {
  return DEMO_SITES.map(({ slug }) => ({ slug }));
}

export default async function DemoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demo = DEMO_SITES.find((site) => site.slug === slug);
  if (!demo) notFound();

  const number = DEMO_SITES.findIndex((site) => site.slug === slug) + 1;

  return (
    <DemoProtection>
      <DemoWorkspace
        slug={slug}
        name={demo.name}
        title={demo.title}
        tagline={demo.tagline}
        intro={demo.intro}
        number={number}
        accent={demo.accent}
      />
    </DemoProtection>
  );
}
