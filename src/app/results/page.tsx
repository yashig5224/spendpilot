"use client";

import { Suspense } from "react";
import { ResultsClient } from "@/components/ResultsClient";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsClient />
    </Suspense>
  );
}