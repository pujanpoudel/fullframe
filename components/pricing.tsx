"use client";

import { useEffect, useState } from "react";
import { packages, type Billing, type Currency } from "@/content/packages";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Arrow, Cta } from "./ui";

const pricing = site.pricing;

export function Pricing() {
  const [currency, setCurrency] = useState<Currency>("NPR");
  const [billing, setBilling] = useState<Billing>("monthly");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("fullframe-currency");
      if (saved === "NPR" || saved === "USD") setCurrency(saved);
    } catch { /* Storage is optional. */ }
  }, []);

  function changeCurrency(value: Currency) {
    setCurrency(value);
    try { localStorage.setItem("fullframe-currency", value); } catch { /* Storage is optional. */ }
  }

  return <>
    <div className="pricing-controls">
      <div className="segmented" role="group" aria-label={pricing.billing}>
        <button type="button" onClick={() => setBilling("monthly")} aria-pressed={billing === "monthly"}>{pricing.monthly}</button>
        <button type="button" onClick={() => setBilling("project")} aria-pressed={billing === "project"}>{pricing.project}</button>
      </div>
      <div className="segmented mono" role="group" aria-label={pricing.currency}>
        {(["NPR", "USD"] as const).map((item) => <button type="button" key={item} onClick={() => changeCurrency(item)} aria-pressed={currency === item}>{item}</button>)}
      </div>
    </div>
    <div className="pricing-grid">
      {packages.map((tier) => {
        const scope = tier[billing];
        return <article className={`pricing-card ${tier.featured ? "featured" : ""}`} key={tier.id} id={`package-${tier.id}`}>
          <div className="pricing-title"><h3>{tier.name}</h3>{tier.featured && <span className="popular mono">{pricing.popular}</span>}</div>
          <p className="price mono">{scope.prices
            ? <>{pricing.from} <strong>{currency} {scope.prices[currency].toLocaleString("en-US")}</strong> {billing === "monthly" ? pricing.perMonth : pricing.perProject}</>
            : <strong>{pricing.custom}</strong>}</p>
          <p className="muted audience">{scope.audience}</p>
          <ul>{scope.includes.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul>
          <a className={`cta ${tier.featured ? "cta-button" : "cta-outline"}`}
            href={`?package=${tier.id}&billing=${billing}&currency=${currency}#contact`}
            onClick={(event) => {
              track("package_selected", { package: tier.id, billing, currency });
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              history.replaceState(null, "", event.currentTarget.href);
              window.dispatchEvent(new Event("fullframe:package"));
              document.getElementById("contact")?.scrollIntoView();
              document.getElementById("contact-title")?.focus({ preventScroll: true });
            }}>{pricing.select}<Arrow /></a>
        </article>;
      })}
    </div>
    <div className="section-action"><strong>{pricing.customTitle}</strong><Cta href="#contact" source="custom_package">{pricing.customCta}</Cta></div>
  </>;
}
