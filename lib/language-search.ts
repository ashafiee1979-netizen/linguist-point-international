import { ALL_LANGUAGES } from "@/lib/languages";
import type { LanguageOption } from "@/lib/languages";

/**
 * Lowercase, strip accents and punctuation, collapse whitespace. Lets "Espanol",
 * "español" and "ESPAÑOL" all reach the same comparison form.
 */
export const normalize = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * What people actually type versus what the catalogue calls the language:
 * endonyms, historical names, dialects that share a written standard, and the
 * misspellings that show up most in immigration paperwork.
 */
const ALIASES: Record<string, string> = {
  farsi: "Persian (Farsi)",
  persian: "Persian (Farsi)",
  parsi: "Persian (Farsi)",
  persianfarsi: "Persian (Farsi)",
  urdo: "Urdu",
  urdu: "Urdu",
  hindi: "Hindi",
  dari: "Dari",
  farsidari: "Dari",
  afghan: "Dari",
  pashto: "Pashto",
  pashtu: "Pashto",
  pushto: "Pashto",
  pukhto: "Pashto",
  mandarin: "Chinese",
  cantonese: "Chinese",
  putonghua: "Chinese",
  taiwanese: "Chinese",
  castilian: "Spanish",
  espanol: "Spanish",
  castellano: "Spanish",
  francais: "French",
  deutsch: "German",
  nederlands: "Dutch",
  flemish: "Dutch",
  tagalog: "Filipino",
  pilipino: "Filipino",
  bahasa: "Indonesian",
  brazilian: "Portuguese",
  portugues: "Portuguese",
  ukranian: "Ukrainian",
  ukrainan: "Ukrainian",
  russion: "Russian",
  hebru: "Hebrew",
  ivrit: "Hebrew",
  panjabi: "Punjabi",
  bangla: "Bengali",
  burmese: "Burmese",
  myanmar: "Burmese",
  kurdish: "Kurdish",
  sorani: "Kurdish",
  kurmanji: "Kurdish",
  serbo: "Serbian",
  croat: "Croatian",
  japanes: "Japanese",
  vietnamse: "Vietnamese",
  simplified: "Chinese",
  traditional: "Chinese",
};

export interface LanguageMatch {
  language: LanguageOption;
  /** The alias the user typed, when the hit came via one. */
  via?: string;
}

// Precomputed so each keystroke does not re-normalize the whole catalogue.
const INDEX = ALL_LANGUAGES.map((language) => ({
  language,
  normalized: normalize(language.name),
}));

/**
 * Ranked language search. Ordering: exact name, then prefix, then any
 * word-start inside the name, then a plain substring, then alias hits —
 * alphabetical within each tier so results do not jump around as you type.
 */
export function searchLanguages(rawQuery: string, limit = 7): LanguageMatch[] {
  // "spanish to english" and "spanish -> english" both mean "spanish".
  const query = normalize(rawQuery)
    .replace(/\s*(?:to|into|->|>)\s*english\s*$/, "")
    .trim();

  if (!query) return [];

  const aliasTarget = ALIASES[query.replace(/\s/g, "")];

  const scored: { match: LanguageMatch; tier: number }[] = [];

  for (const entry of INDEX) {
    const name = entry.normalized;
    let tier = -1;

    if (name === query) tier = 0;
    else if (name.startsWith(query)) tier = 1;
    else if (name.split(" ").some((word) => word.startsWith(query))) tier = 2;
    else if (name.includes(query)) tier = 3;
    else if (aliasTarget && entry.language.name === aliasTarget) tier = 4;

    if (tier >= 0) {
      scored.push({
        match: { language: entry.language, via: tier === 4 ? rawQuery.trim() : undefined },
        tier,
      });
    }
  }

  // Alias hits for languages that did not already match by name.
  if (aliasTarget && !scored.some((s) => s.match.language.name === aliasTarget)) {
    const target = INDEX.find((e) => e.language.name === aliasTarget);
    if (target) {
      scored.push({ match: { language: target.language, via: rawQuery.trim() }, tier: 4 });
    }
  }

  scored.sort(
    (a, b) => a.tier - b.tier || a.match.language.name.localeCompare(b.match.language.name)
  );

  return scored.slice(0, limit).map((s) => s.match);
}

/** True when the query names a language exactly, or exactly via an alias. */
export function resolveExact(rawQuery: string): LanguageOption | null {
  const query = normalize(rawQuery)
    .replace(/\s*(?:to|into|->|>)\s*english\s*$/, "")
    .trim();
  if (!query) return null;

  const direct = INDEX.find((e) => e.normalized === query);
  if (direct) return direct.language;

  const aliasTarget = ALIASES[query.replace(/\s/g, "")];
  return aliasTarget ? (INDEX.find((e) => e.language.name === aliasTarget)?.language ?? null) : null;
}
