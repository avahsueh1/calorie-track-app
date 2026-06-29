"use client";

import { useRouter } from "next/navigation";
import { routes } from "../../lib/routes";

export function useProgressJournalGalleryNav() {
  const router = useRouter();

  return (focusDate?: string) => {
    router.push(routes.progressJournalPhotos(focusDate));
  };
}
