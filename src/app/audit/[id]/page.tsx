import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAuditBySlug } from "@/lib/supabase";
import {PublicAuditView} from "@/components/PublicAuditView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getAuditBySlug(id);
  if (!audit) return { title: "Audit not found — SpendPilot" };

  const title = `AI spend audit — $${audit.totalMonthlySavings}/mo savings found`;
  const description = `This team could save $${audit.totalYearlySavings}/year on AI tools. Audited by SpendPilot.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicAuditPage({ params }: Props) {
  const { id } = await params;
  const audit = await getAuditBySlug(id);
  if (!audit) notFound();

  // Strip email from public view
  const publicAudit = { ...audit, email: undefined };

  return <PublicAuditView audit={publicAudit} />;
}
