import type { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "Your Audit Results — SpendPilot",
};

const ResultsClient = dynamic(
  () => import("@/components/ResultsClient").then((mod) => mod.ResultsClient),
  { ssr: false }
);

export default function ResultsPage() {
  return <ResultsClient />;
}