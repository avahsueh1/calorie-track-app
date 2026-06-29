"use client";

import { useCallback, useEffect, useState } from "react";
import type { AppProfile } from "../../types/profile";

const SAVE_FEEDBACK_MS = 1800;

interface UseProfileDraftOptions {
  profile: AppProfile;
  onSave: (updates: Partial<AppProfile>) => void;
}

export function useProfileDraft({ profile, onSave }: UseProfileDraftOptions) {
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!savedMessage) {
      return;
    }
    const timer = window.setTimeout(() => setSavedMessage(""), SAVE_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [savedMessage]);

  const patchDraft = useCallback(
    (updates: Partial<AppProfile>) => {
      onSave(updates);
      setSavedMessage("Saved");
    },
    [onSave],
  );

  return {
    draftProfile: profile,
    patchDraft,
    savedMessage,
  };
}
