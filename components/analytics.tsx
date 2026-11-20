"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { pages } from "@/content/pages";

const ga = process.env.NEXT_PUBLIC_GA_ID;
const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const validGa = ga && /^G-[A-Z0-9]+$/.test(ga) ? ga : "";
const validMeta = meta && /^\d+$/.test(meta) ? meta : "";
const analyticsEnabled = Boolean(validGa || validMeta);
const storageKey = "fullframe-analytics-v1";
const preferenceEvent = "fullframe:analytics-preferences";
const copy = pages.privacy.analytics;

type Preference = "allow" | "decline" | null;

export function AnalyticsPreferences() {
  if (!analyticsEnabled) return null;
  return <button type="button" className="analytics-preferences" id="analytics-preferences"
    onClick={() => window.dispatchEvent(new Event(preferenceEvent))}>{copy.preferences}</button>;
}

export function Analytics() {
  const [preference, setPreference] = useState<Preference>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!analyticsEnabled) return;
    let saved: Preference = null;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === "allow" || stored === "decline") saved = stored;
    } catch { /* Settings still work for this page. */ }
    setPreference(saved);
    setOpen(saved === null);
    const showPreferences = () => setOpen(true);
    window.addEventListener(preferenceEvent, showPreferences);
    return () => window.removeEventListener(preferenceEvent, showPreferences);
  }, []);

  function choose(next: Exclude<Preference, null>) {
    let saved = true;
    try { localStorage.setItem(storageKey, next); } catch { saved = false; }
    setPreference(next);
    setOpen(false);
    if (preference === "allow" && next === "decline") {
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      window.fbq?.("consent", "revoke");
      if (saved) window.location.reload();
    }
  }

  return <>
    {open && <section className="analytics-panel" aria-labelledby="analytics-title">
      <h2 id="analytics-title">{copy.title}</h2>
      <p>{copy.description} <a href="/privacy">{copy.more}</a></p>
      <div><button className="cta cta-outline" type="button" onClick={() => choose("decline")}>{copy.decline}</button>
        <button className="cta cta-button" type="button" onClick={() => choose("allow")}>{copy.allow}</button></div>
    </section>}
    {preference === "allow" && validGa && <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${validGa}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config',${JSON.stringify(validGa)});`}</Script>
    </>}
    {preference === "allow" && validMeta && <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init',${JSON.stringify(validMeta)});fbq('track','PageView');`}</Script>}
  </>;
}
