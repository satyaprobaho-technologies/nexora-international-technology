"use client";

import Script from "next/script";
import { useCallback, useState } from "react";

declare global {
  interface Window {
    google?: { translate?: { TranslateElement: new (options: Record<string, unknown>, id: string) => unknown; }; };
  }
}

export default function LanguageSwitcher() {
  const [ready, setReady] = useState(false);
  const initialise = useCallback(() => {
    if (window.google?.translate?.TranslateElement) {
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,bn,ar,hi,ur,es,fr,de,zh-CN,ja", autoDisplay: false },
        "nexora-google-translate"
      );
      setReady(true);
    }
  }, []);
  const changeLanguage = (language: string) => {
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!select) return;
    select.value = language;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  };
  return (
    <div className="language-switcher" aria-label="Website language">
      <span aria-hidden="true">◎</span>
      <select aria-label="Translate website" defaultValue="en" onChange={(event) => changeLanguage(event.target.value)}>
        <option value="en">English</option><option value="bn">বাংলা</option><option value="ar">العربية</option><option value="hi">हिन्दी</option><option value="ur">اردو</option><option value="es">Español</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="zh-CN">中文</option><option value="ja">日本語</option>
      </select>
      <span id="nexora-google-translate" className="google-translate-host" />
      <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" onLoad={initialise} />
      <span className="sr-only">{ready ? "Translation ready" : "Translation loads when selected"}</span>
    </div>
  );
}
