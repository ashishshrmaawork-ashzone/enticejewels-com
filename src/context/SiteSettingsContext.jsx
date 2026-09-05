"use client";
import { createContext, useContext } from "react";
import { getFreshGeneralSettings } from "@/lib/api";
import useLiveContent from "@/lib/useLiveContent";
const SiteSettingsContext = createContext({});
export function SiteSettingsProvider({ children, initialSettings = {} }) {
  const { data: settings } = useLiveContent(getFreshGeneralSettings, initialSettings);
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}
export function useSiteSettings() { return useContext(SiteSettingsContext); }
