import type { Metadata } from "next";
import { ResultsClient } from "@/components/ResultsClient";

export const metadata: Metadata = {
  title: "Your Audit Results — SpendPilot",
};

export default function ResultsPage() {
  return <ResultsClient />;
}
