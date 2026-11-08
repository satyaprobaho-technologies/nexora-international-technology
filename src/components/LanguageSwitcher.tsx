"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, id: string) => unknown;
      };
    };
  }
}

const LANGUAGES = [
  ["en", "English"], ["bn", "বাংলা"], ["ar", "العربية"], ["hi", "हिन्दी"],
  ["ur", "اردو"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"],
  ["zh-CN", "中文"], ["ja", "日本語"],
];

export default function LanguageSwitcher() {
  const [ready, setReady] = useState(false);
  const [language, setLanguage] = useState("en");
  const initialized = useRef(false);
  const poller = useRef<number | null>(null);

  const initialise = useCallback(() => {
    if (initialized.current || !window.google?.translate?.TranslateElement) return;
    initialized.current = true;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: LANGUAGES.map(([code]) => code).join(","),
        autoDisplay: false,
        multilanguagePage: true,
      },
      "nexora-google-translate"
    );

    let attempts = 0;
    poller.current = window.setInterval(() => {
      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (combo) {
        setReady(true);
        if (poller.current !== null) window.clearInterval(poller.current);
        poller.current = null;
      } else if (++attempts >= 100) {
        if (poller.current !== null) window.clearInterval(poller.current);
        poller.current = null;
      }
    }, 100);
  }, []);

  useEffect(() => () => {
    if (poller.current !== null) window.clearInterval(poller.current);
  }, []);

  const changeLanguage = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!combo) {
      setReady(false);
      return;
    }
    combo.value = nextLanguage;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  };

  return (
    <div className="language-switcher" aria-label="Website language selector">
      <span aria-hidden="true">◎</span>
      <label className="language-label" htmlFor="nexora-language-select">Language</label>
      <select
        id="nexora-language-select"
        aria-label="Translate website"
        value={language}
        disabled={!ready}
        onChange={(event) => changeLanguage(event.target.value)}
      >
        {LANGUAGES.map(([code, label]) => <option value={code} key={code}>{label}</option>)}
      </select>
      <span id="nexora-google-translate" className="google-translate-host" aria-hidden="true" />
      <Script
        src="https://translate.google.com/translate_a/element.js"
        strategy="afterInteractive"
        onLoad={initialise}
      />
      <span className="sr-only" aria-live="polite">
        {ready ? "Translation is ready" : "Loading translation service"}
      </span>
    </div>
  );
}
