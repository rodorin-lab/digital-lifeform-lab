"use client";

// ─────────────────────────────────────────────────────────────────
// i18n.tsx — Global-First (EN default) Bilingual Context +
// Hardware Display Mode (COSMIC 3D / QUEST 3 VR / LITE) +
// Traveler Passport Stamp System for HOLOVERSE // LIVING PORTAL.
// ─────────────────────────────────────────────────────────────────

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bi, type Bi, type Lang } from "./bi";

export { bi };
export type { Bi, Lang };

export type DisplayMode = "cosmic" | "quest3" | "lite";

export type StampId =
  | "gateway"
  | "neuro"
  | "cinema"
  | "hangar"
  | "alliance";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (v: Bi) => string;
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;
  cycleMode: () => void;
  stamps: StampId[];
  unlockStamp: (s: StampId) => void;
  callsign: string;
  setCallsign: (c: string) => void;
};

const LangContext = createContext<Ctx | null>(null);

const STORAGE_LANG_KEY = "holoverse-lang";
const STORAGE_MODE_KEY = "holoverse-display-mode";
const STORAGE_STAMPS_KEY = "holoverse-stamps";
const STORAGE_CALLSIGN_KEY = "holoverse-callsign";

export function LangProvider({ children }: { children: ReactNode }) {
  // Strictly English ("en") by default for global outreach & international CEOs.
  const [lang, setLangState] = useState<Lang>("en");
  const [mode, setModeState] = useState<DisplayMode>("cosmic");
  const [stamps, setStamps] = useState<StampId[]>(["gateway"]);
  const [callsign, setCallsignState] = useState<string>("TRAVELER-01");

  useEffect(() => {
    try {
      // Only switch from EN if user explicitly saved a preference previously
      const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Lang | null;
      if (savedLang === "en" || savedLang === "ja") {
        setLangState(savedLang);
      }

      const savedMode = localStorage.getItem(STORAGE_MODE_KEY) as DisplayMode | null;
      if (savedMode === "cosmic" || savedMode === "quest3" || savedMode === "lite") {
        setModeState(savedMode);
      } else if (typeof navigator !== "undefined") {
        const ua = navigator.userAgent || "";
        if (/Quest|OculusBrowser|VR/i.test(ua)) {
          setModeState("quest3");
        } else if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setModeState("lite");
        }
      }

      const savedStamps = localStorage.getItem(STORAGE_STAMPS_KEY);
      if (savedStamps) {
        const parsed = JSON.parse(savedStamps) as StampId[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStamps(Array.from(new Set(["gateway", ...parsed])));
        }
      }

      const savedCallsign = localStorage.getItem(STORAGE_CALLSIGN_KEY);
      if (savedCallsign) {
        setCallsignState(savedCallsign);
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MODE_KEY, mode);
    } catch {
      /* ignore */
    }
    if (typeof document !== "undefined") {
      document.documentElement.dataset.displayMode = mode;
    }
  }, [mode]);

  const unlockStamp = useCallback((s: StampId) => {
    setStamps((prev) => {
      if (prev.includes(s)) return prev;
      const next = [...prev, s];
      try {
        localStorage.setItem(STORAGE_STAMPS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const setCallsign = useCallback((c: string) => {
    const clean = c.slice(0, 22).toUpperCase();
    setCallsignState(clean);
    try {
      localStorage.setItem(STORAGE_CALLSIGN_KEY, clean);
    } catch {
      /* ignore */
    }
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((prev) =>
      prev === "cosmic" ? "quest3" : prev === "quest3" ? "lite" : "cosmic"
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: setLangState,
      toggle: () => setLangState((p) => (p === "en" ? "ja" : "en")),
      t: (v: Bi) => (v ? v[lang] : ""),
      mode,
      setMode: setModeState,
      cycleMode,
      stamps,
      unlockStamp,
      callsign,
      setCallsign,
    }),
    [lang, mode, cycleMode, stamps, unlockStamp, callsign, setCallsign],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}
