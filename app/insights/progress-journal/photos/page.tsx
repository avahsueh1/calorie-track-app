"use client";

import { Suspense } from "react";
import ProgressJournalPhotosPageContent from "./ProgressJournalPhotosPageContent";

export default function ProgressJournalPhotosPage() {
  return (
    <Suspense fallback={null}>
      <ProgressJournalPhotosPageContent />
    </Suspense>
  );
}
