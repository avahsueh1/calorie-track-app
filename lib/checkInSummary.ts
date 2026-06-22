import type { DailyCheckIn } from "../types";
import { CHECK_IN_SCALE_WORDS } from "../types/wellness";

const scaleWords = [...CHECK_IN_SCALE_WORDS];

export function buildCheckInSummarySentence(saved: DailyCheckIn): string {
  const energy = scaleWords[saved.energy - 1].toLowerCase();
  const mood = scaleWords[saved.mood - 1].toLowerCase();
  const stress = scaleWords[saved.stress - 1].toLowerCase();

  if (saved.cravings === "strong") {
    return `Strong cravings with ${energy} energy. Keep today steady and nourishing.`;
  }

  if (saved.stress >= 4) {
    return `${stress.charAt(0).toUpperCase() + stress.slice(1)} stress today. Prioritize rest and gentle nourishment.`;
  }

  if (saved.energy <= 2) {
    return `Energy feels ${energy} today. Choose steady meals and a calm pace.`;
  }

  if (saved.mood >= 4 && saved.cravings === "none") {
    return `Mood feels ${mood} with manageable hunger. A balanced day ahead.`;
  }

  if (saved.cravings === "mild") {
    return `Mild cravings with ${energy} energy. Keep today steady and nourishing.`;
  }

  return `Today's body signals look ${mood}. Stay aware and nourish at your own pace.`;
}
