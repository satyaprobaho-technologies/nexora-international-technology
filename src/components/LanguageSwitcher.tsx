"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

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
  const [error, setError] = useState(false);
  const initialized = useRef(false);
  const poller = useRef<number | null>(null);

  useEffect(() => {
    const saved = document.cookie.match(/(?:^|;\\s*)googtrans=([^;]+)/);
    if (saved?.[1]) {
      const parts = decodeURIComponent(saved[1]).split("/");
      const savedLanguage = parts[parts.length - 1];
      if (LANGUAGES.some(([code]) => code === savedLanguage)) setLanguage(savedLanguage);
    }
    let attempts = 0;
    poller.current = window.setInterval(() => {
      attempts += 1;
      const TranslateElement = window.google?.translate?.TranslateElement;

      if (!initialized.current && TranslateElement) {
        initialized.current = true;
        try {
          new TranslateElement({
            pageLanguage: "en",
            includedLanguages: LANGUAGES.filter(([code]) => code !== "en").map(([code]) => code).join(","),
            autoDisplay: false,
            multilanguagePage: true,
          }, "nexora-google-translate");
        } catch {
          setError(true);
          if (poller.current !== null) window.clearInterval(poller.current);
          poller.current = null;
          return;
        }
      }

      const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
      if (combo) {
        setReady(true);
        setError(false);
        if (poller.current !== null) window.clearInterval(poller.current);
        poller.current = null;
      } else if (attempts >= 150) {
        setError(true);
        if (poller.current !== null) window.clearInterval(poller.current);
        poller.current = null;
      }
    }, 200);

    return () => {
      if (poller.current !== null) window.clearInterval(poller.current);
      poller.current = null;
    };
  }, []);

  function changeLanguage(nextLanguage: string) {
    setLanguage(nextLanguage);
    if (nextLanguage === "en") {
      document.cookie = "googtrans=;path=/;max-age=0;SameSite=Lax";
    } else {
      document.cookie = `googtrans=/en/${nextLanguage};path=/;max-age=31536000;SameSite=Lax`;
    }
    const combo = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (!combo) {
      setReady(false);
      return;
    }
    combo.value = nextLanguage === "en" ? "" : nextLanguage;
    combo.dispatchEvent(new Event("change", { bubbles: true }));
  }

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
        onError={() => setError(true)}
      />
      <span className="sr-only" aria-live="polite">
        {ready ? "Translation is ready" : error ? "Translation service is unavailable. Please try again later." : "Loading translation service"}
      </span>
    </div>
  );
}
