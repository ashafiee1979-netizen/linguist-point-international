export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  isPopular?: boolean;
}

export const POPULAR_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: 'us', isPopular: true },
  { code: 'zh', name: 'Chinese', flag: 'cn', isPopular: true },
  { code: 'es', name: 'Spanish', flag: 'es', isPopular: true },
  { code: 'hi', name: 'Hindi', flag: 'in', isPopular: true },
  { code: 'ar', name: 'Arabic', flag: 'sa', isPopular: true },
  { code: 'fr', name: 'French', flag: 'fr', isPopular: true },
  { code: 'ru', name: 'Russian', flag: 'ru', isPopular: true },
  { code: 'ur', name: 'Urdu', flag: 'pk', isPopular: true },
  { code: 'de', name: 'German', flag: 'de', isPopular: true },
  { code: 'fa', name: 'Persian (Farsi)', flag: 'ir', isPopular: true },
  { code: 'ps', name: 'Pashto', flag: 'af', isPopular: true },
  { code: 'prs', name: 'Dari', flag: 'af', isPopular: true },
  { code: 'uk', name: 'Ukrainian', flag: 'ua', isPopular: true },
];

// Languages outside the popular shortlist, alphabetical. Kept separate so the
// dropdowns can show a "Popular" optgroup without repeating the same entries
// again under "All Languages".
export const OTHER_LANGUAGES: LanguageOption[] = [
  { code: 'af', name: 'Afrikaans', flag: 'za' },
  { code: 'sq', name: 'Albanian', flag: 'al' },
  { code: 'am', name: 'Amharic', flag: 'et' },
  { code: 'hy', name: 'Armenian', flag: 'am' },
  { code: 'az', name: 'Azerbaijani', flag: 'az' },
  { code: 'bn', name: 'Bengali', flag: 'bd' },
  { code: 'bs', name: 'Bosnian', flag: 'ba' },
  { code: 'bg', name: 'Bulgarian', flag: 'bg' },
  { code: 'my', name: 'Burmese', flag: 'mm' },
  { code: 'ca', name: 'Catalan', flag: 'es' },
  { code: 'hr', name: 'Croatian', flag: 'hr' },
  { code: 'cs', name: 'Czech', flag: 'cz' },
  { code: 'da', name: 'Danish', flag: 'dk' },
  { code: 'nl', name: 'Dutch', flag: 'nl' },
  { code: 'et', name: 'Estonian', flag: 'ee' },
  { code: 'fil', name: 'Filipino', flag: 'ph' },
  { code: 'fi', name: 'Finnish', flag: 'fi' },
  { code: 'ka', name: 'Georgian', flag: 'ge' },
  { code: 'el', name: 'Greek', flag: 'gr' },
  { code: 'gu', name: 'Gujarati', flag: 'in' },
  { code: 'ht', name: 'Haitian Creole', flag: 'ht' },
  { code: 'he', name: 'Hebrew', flag: 'il' },
  { code: 'hu', name: 'Hungarian', flag: 'hu' },
  { code: 'is', name: 'Icelandic', flag: 'is' },
  { code: 'id', name: 'Indonesian', flag: 'id' },
  { code: 'it', name: 'Italian', flag: 'it' },
  { code: 'ja', name: 'Japanese', flag: 'jp' },
  { code: 'kn', name: 'Kannada', flag: 'in' },
  { code: 'kk', name: 'Kazakh', flag: 'kz' },
  { code: 'km', name: 'Khmer', flag: 'kh' },
  { code: 'ko', name: 'Korean', flag: 'kr' },
  { code: 'ku', name: 'Kurdish', flag: 'iq' },
  { code: 'ky', name: 'Kyrgyz', flag: 'kg' },
  { code: 'lo', name: 'Lao', flag: 'la' },
  { code: 'lv', name: 'Latvian', flag: 'lv' },
  { code: 'lt', name: 'Lithuanian', flag: 'lt' },
  { code: 'mk', name: 'Macedonian', flag: 'mk' },
  { code: 'ms', name: 'Malay', flag: 'my' },
  { code: 'ml', name: 'Malayalam', flag: 'in' },
  { code: 'mn', name: 'Mongolian', flag: 'mn' },
  { code: 'ne', name: 'Nepali', flag: 'np' },
  { code: 'no', name: 'Norwegian', flag: 'no' },
  { code: 'pl', name: 'Polish', flag: 'pl' },
  { code: 'pt', name: 'Portuguese', flag: 'pt' },
  { code: 'pa', name: 'Punjabi', flag: 'in' },
  { code: 'ro', name: 'Romanian', flag: 'ro' },
  { code: 'sr', name: 'Serbian', flag: 'rs' },
  { code: 'sk', name: 'Slovak', flag: 'sk' },
  { code: 'sl', name: 'Slovenian', flag: 'si' },
  { code: 'so', name: 'Somali', flag: 'so' },
  { code: 'sw', name: 'Swahili', flag: 'ke' },
  { code: 'sv', name: 'Swedish', flag: 'se' },
  { code: 'ta', name: 'Tamil', flag: 'in' },
  { code: 'te', name: 'Telugu', flag: 'in' },
  { code: 'th', name: 'Thai', flag: 'th' },
  { code: 'tr', name: 'Turkish', flag: 'tr' },
  { code: 'uz', name: 'Uzbek', flag: 'uz' },
  { code: 'vi', name: 'Vietnamese', flag: 'vn' },
  { code: 'cy', name: 'Welsh', flag: 'gb' },
  { code: 'yi', name: 'Yiddish', flag: 'il' },
];

export const ALL_LANGUAGES: LanguageOption[] = [
  ...POPULAR_LANGUAGES,
  ...OTHER_LANGUAGES,
];
