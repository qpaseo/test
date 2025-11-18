import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ko from "./locales/ko";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const resources = {
  en: { translation: en },
  ko: { translation: ko },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  supportedLngs: ["en", "ko"],
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  lng: "en",
  react: {
    useSuspense: true,
    bindI18n: "languageChanged loaded",
    bindI18nStore: "added removed",
  },
});

// Sync i18n language with Firebase users.{uid}.user_language
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    await i18n.changeLanguage("en");
    return;
  }

  const userRef = doc(db, "users", user.uid);

  try {
    const snap = await getDoc(userRef);
    const lang = (snap.exists() ? (snap.data() as any).user_language : null) as
      | "en"
      | "ko"
      | null;

    if (lang) {
      await i18n.changeLanguage(lang);
    }
  } catch (e) {
    console.error("언어 설정 로드 실패:", e);
  }

  // Subscribe to future updates to user_language
  onSnapshot(userRef, async (s) => {
    const l = (s.data() as any)?.user_language as "en" | "ko" | undefined;

    if (l) {
      await i18n.changeLanguage(l);
    }
  });
});

export default i18n;
