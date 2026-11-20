declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: "cta_click" | "package_selected" | "form_submit", properties: Record<string, string> = {}) {
  if (process.env.NEXT_PUBLIC_GA_ID) window.gtag?.("event", event, properties);
  if (process.env.NEXT_PUBLIC_META_PIXEL_ID) {
    window.fbq?.(event === "form_submit" ? "track" : "trackCustom", event === "form_submit" ? "Lead" : event, properties);
  }
}
