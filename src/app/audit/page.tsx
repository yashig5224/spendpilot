import type { Metadata } from "next";
import { AuditForm } from "@/components/AuditForm";

export const metadata: Metadata = {
  title: "Audit Your AI Spend — SpendPilot",
  description: "Add your AI tools and plans to find savings opportunities.",
};

export default function AuditPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      <div className="gradient-mesh" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-cyan-400/[0.03] blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-3xl">
        <AuditForm />
      </div>
    </div>
  );
}
