import { useQuery } from "@tanstack/react-query";
import { DEFAULT_SETTINGS, fetchSiteSettings, type SiteSettings } from "@/lib/site-settings";

export const SITE_SETTINGS_KEY = ["site-settings"] as const;

/**
 * Site-wide settings edited in the admin panel.
 *
 * Always returns a complete object — the built-in defaults stand in while the
 * request is in flight and if it fails, so no page has to guard every field or
 * flash empty contact details.
 */
export function useSiteSettings(): SiteSettings {
  const { data } = useQuery({
    queryKey: SITE_SETTINGS_KEY,
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_SETTINGS,
    retry: 1,
  });
  return data ?? DEFAULT_SETTINGS;
}
