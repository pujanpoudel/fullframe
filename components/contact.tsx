import { site } from "@/content/site";
import { contactEmail, contactReady, whatsappUrl } from "@/lib/contact-config";
import { ContactForm } from "./contact-form";
import { Cta } from "./ui";
import { AnalyticsPreferences } from "./analytics";

export function Contact() {
  const copy = site.contact;
  const email = contactEmail();
  const whatsapp = whatsappUrl();
  return <footer className="contact-section" id="contact">
    <div className="container">
      <p className="mono section-label">{copy.label}</p>
      <h2 id="contact-title" tabIndex={-1}>{copy.title}</h2>
      <div className="contact-grid">
        <div className="contact-intro">
          <p>{copy.copy}</p>
          <address>{site.location}{email && <a href={`mailto:${email}`}>{email}</a>}</address>
          {whatsapp && <Cta href={whatsapp} variant="outline" source="whatsapp">{copy.whatsapp}</Cta>}
        </div>
        <ContactForm enabled={contactReady()} />
      </div>
      <div className="footer-base">
        <div><a href="/" className="footer-brand">{site.name}</a><p className="mono">{copy.footer}</p></div>
        <nav aria-label="Footer navigation">{site.nav.map(([name, href]) => <a key={href} href={href}>{name}</a>)}
          <a href="/contact">{site.links.contact}</a>
          <a href="/#faq">FAQ</a>
          <a href="/privacy">{site.links.privacy}</a>
          <AnalyticsPreferences />
          {copy.socials.map(({ label, url }) => <a href={url} key={url}>{label}</a>)}</nav>
        <small>© {new Date().getFullYear()} {site.name}</small>
      </div>
    </div>
  </footer>;
}
