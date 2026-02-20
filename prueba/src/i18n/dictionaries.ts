import type { AppLang } from "./languages";
import ca from "./ca.json";
import en from "./en.json";
import es from "./es.json";
import eu from "./eu.json";
import fr from "./fr.json";
import pt from "./pt.json";

export const DICTIONARY_BY_LANGUAGE = {
  es,
  en,
  pt,
  ca,
  fr,
  eu,
} as const;

export type SiteDictionary = (typeof DICTIONARY_BY_LANGUAGE)[AppLang];

export const getDictionary = (lang: AppLang): SiteDictionary => DICTIONARY_BY_LANGUAGE[lang];
