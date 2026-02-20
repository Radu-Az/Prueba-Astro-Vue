export const SUPPORTED_LANGUAGES = ["es", "en", "pt", "ca", "fr", "eu"] as const;

export type AppLang = (typeof SUPPORTED_LANGUAGES)[number];

export const DEFAULT_LANGUAGE: AppLang = "es";

export const PREFIXED_LANGUAGES = SUPPORTED_LANGUAGES.filter((langCode) => langCode !== DEFAULT_LANGUAGE);

export const normalizePathname = (path: string) => (path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path);

export const getLocalizedStaticPaths = () => PREFIXED_LANGUAGES.map((langCode) => ({ params: { lang: langCode } }));

export const stripLanguagePrefix = (path: string) => {
  const normalizedPath = normalizePathname(path);
  const matchedLanguagePrefix = PREFIXED_LANGUAGES.find(
    (langCode) => normalizedPath === `/${langCode}` || normalizedPath.startsWith(`/${langCode}/`),
  );

  if (!matchedLanguagePrefix) return normalizedPath;

  const strippedPath = normalizedPath.replace(new RegExp(`^/${matchedLanguagePrefix}`), "");
  return strippedPath === "" ? "/" : strippedPath;
};

export const toLocalizedPath = (path: string, lang: AppLang) => {
  const basePath = normalizePathname(path);
  if (lang === DEFAULT_LANGUAGE) return basePath;
  return basePath === "/" ? `/${lang}` : `/${lang}${basePath}`;
};

export const getLanguageSwitchLinks = (currentPathname: string) => {
  const basePath = stripLanguagePrefix(currentPathname);
  return SUPPORTED_LANGUAGES.map((langCode) => ({
    code: langCode,
    href: toLocalizedPath(basePath, langCode),
  }));
};
