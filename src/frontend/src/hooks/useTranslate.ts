const TRANSLATE_URL = "https://api.mymemory.translated.net/get";

export async function translateText(
  text: string,
  targetLang: string,
): Promise<string> {
  if (!text || !text.trim()) return text;
  try {
    const url = `${TRANSLATE_URL}?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const res = await fetch(url);
    if (!res.ok) return text;
    const json = await res.json();
    const translated = json?.responseData?.translatedText;
    if (translated && typeof translated === "string") return translated;
    return text;
  } catch {
    return text;
  }
}
