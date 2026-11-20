"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/content/site";
import { Cta } from "./ui";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return <>
    <header className="site-header">
      <div className="container header-inner">
        <Link className="wordmark" href="/" aria-label={site.name} onClick={() => setOpen(false)}>
          <Image src="/wordmark.svg" alt="" width={132} height={39} unoptimized />
        </Link>
        <button type="button" className="menu-toggle mono" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>
          {open ? site.closeMenu : site.openMenu}<span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        <nav aria-label="Main navigation" id="primary-nav" className={open ? "navigation open" : "navigation"} onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            setOpen(false);
            document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
          }
        }}>
          {site.nav.map(([label, href]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}
            data-active={pathname.startsWith(`${href}/`) || pathname === href} onClick={() => setOpen(false)}>{label}</Link>)}
        </nav>
        <div className="header-cta"><Cta href="#contact" variant="button" source="header">{site.audit}</Cta></div>
      </div>
    </header>
    <div className="mobile-cta" onClick={() => setOpen(false)}><Cta href="#contact" variant="button" source="mobile_bar">{site.audit}</Cta></div>
  </>;
}
