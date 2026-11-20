"use client";

import { useEffect, useState, type FormEvent } from "react";
import { packages } from "@/content/packages";
import { services, site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Arrow } from "./ui";

const copy = site.contact;
type Selection = { package: string; billing: string; currency: string };
const emptySelection = { package: "", billing: "", currency: "" };

function selectionFromUrl(): Selection {
  const params = new URLSearchParams(location.search);
  const tier = packages.find(({ id }) => id === params.get("package"));
  const billing = params.get("billing");
  const currency = params.get("currency");
  return tier && (billing === "monthly" || billing === "project") && (currency === "NPR" || currency === "USD")
    ? { package: tier.id, billing, currency } : emptySelection;
}

export function ContactForm({ enabled }: { enabled: boolean }) {
  const [selection, setSelection] = useState(emptySelection);
  const [interests, setInterests] = useState<string[]>([]);
  const [status, setStatus] = useState<keyof Pick<typeof copy, "success" | "invalid" | "rateLimited" | "unavailable" | "error">>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const sync = () => setSelection(selectionFromUrl());
    sync();
    const requested = new URLSearchParams(location.search).get("service");
    const service = services.find(({ slug }) => slug === requested);
    if (service) setInterests([service.name]);
    window.addEventListener("fullframe:package", sync);
    window.addEventListener("popstate", sync);
    return () => {
      window.removeEventListener("fullframe:package", sync);
      window.removeEventListener("popstate", sync);
    };
  }, []);

  function clear() {
    const url = new URL(location.href);
    for (const key of ["package", "billing", "currency"]) url.searchParams.delete(key);
    history.replaceState(null, "", url);
    setSelection(emptySelection);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending || !enabled) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setPending(true);
    setStatus(undefined);

    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), interests: data.getAll("interests") }),
      });
      if (response.ok) {
        track("form_submit", { source: "contact", package: selection.package });
        form.reset();
        setInterests([]);
        clear();
        setStatus("success");
      } else {
        setStatus(response.status === 400 ? "invalid" : response.status === 429 ? "rateLimited" : response.status === 503 ? "unavailable" : "error");
      }
    } catch {
      setStatus("error");
    } finally {
      setPending(false);
    }
  }

  const tier = packages.find(({ id }) => id === selection.package);
  return <form className="contact-form" onSubmit={submit} aria-busy={pending}>
    <div className="form-grid">
      <label>{copy.name} *<input name="name" autoComplete="name" maxLength={100} required /></label>
      <label>{copy.email} *<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
      <label>{copy.phone}<input name="phone" type="tel" autoComplete="tel" maxLength={50} /></label>
      <label>{copy.company}<input name="company" autoComplete="organization" maxLength={150} /></label>
    </div>
    <label>{copy.website}<input name="profile" autoComplete="url" maxLength={240} /></label>
    <fieldset><legend>{copy.interests}</legend><div className="chips">
      {services.map(({ name }) => <label className="chip" key={name}><input type="checkbox" name="interests" value={name} checked={interests.includes(name)}
        onChange={(event) => {
          const checked = event.target.checked;
          setInterests((current) => checked ? [...current, name] : current.filter((item) => item !== name));
        }} /><span>{name}</span></label>)}
    </div></fieldset>
    <label>{copy.budget}<select name="budget" defaultValue="">
      <option value="">{copy.budgetPlaceholder}</option>{copy.budgets.map((value) => <option key={value}>{value}</option>)}
    </select></label>
    <label>{copy.message} *<textarea name="message" rows={4} maxLength={3000} required /></label>
    {Object.entries(selection).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
    {tier && <div className="selected-package"><span>{copy.package} · {tier.name} / {selection.billing === "monthly" ? site.pricing.monthly : site.pricing.project} / {selection.currency}</span>
      <button type="button" onClick={clear}>{copy.clear}</button></div>}
    <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <div className="form-end"><button type="submit" className="cta cta-button" disabled={pending || !enabled}>{pending ? copy.pending : copy.submit}<Arrow /></button>
      <span className="muted">{copy.required}</span></div>
    <a className="form-privacy" href="/privacy">{copy.privacy}</a>
    <p className="form-status" role="status">{status ? copy[status] : !enabled ? copy.unavailable : ""}</p>
  </form>;
}
