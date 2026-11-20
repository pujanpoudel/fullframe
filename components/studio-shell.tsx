"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnalyticsPreferences } from "./analytics";

const sections = [["Case Studies", "/work"], ["Programs", "/services"], ["Journal", "/blog"]];

export function StudioShell({ children, contactTitle }: {
  children: React.ReactNode; contactTitle: string;
}) {
  const pathname = usePathname();
  const menu = useRef<HTMLDialogElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  useEffect(() => {
    let previous = window.scrollY;
    function update() {
      const top = Math.max(0, window.scrollY);
      setScrolled(top > 12);
      setHidden(top > 100 && top > previous);
      previous = top;
    }
    if (isAdmin) return;
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isAdmin, pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  if (isAdmin) return <>{children}</>;
  function close() { menu.current?.close(); setMenuOpen(false); }
  return <>
    <div className="studio-header-shell" data-scrolled={scrolled} data-hidden={hidden}>
      <header className="studio-header">
        <Link className="studio-wordmark" href="/">FULLFRAME</Link>
        <button aria-label="Open navigation" aria-expanded={menuOpen} aria-controls="studio-navigation"
          onClick={() => { menu.current?.showModal(); setMenuOpen(true); }}>
          <span className="menu-lines" aria-hidden="true" />
        </button>
      </header>
    </div>
    <dialog className="studio-menu" id="studio-navigation" ref={menu} onClose={close} aria-label="Navigation">
      <div className="studio-header">
        <Link className="studio-wordmark" href="/" onClick={close}>FULLFRAME</Link>
        <button onClick={close} aria-label="Close navigation">×</button>
      </div>
      <nav aria-label="Main navigation">{sections.map(([label, href]) =>
        <Link href={href} key={href} onClick={close} aria-current={pathname === href ? "page" : undefined}>{label}</Link>
      )}</nav>
      <div className="studio-menu-secondary">
        <Link href="/contact" onClick={close}>Work with us</Link>
        <Link href="/about" onClick={close}>Studio</Link>
      </div>
    </dialog>
    <div className="studio-route" key={pathname}>{children}</div>
    <footer className="studio-footer" id="studio-contact">
      <nav aria-label="Footer navigation">{sections.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>
      <Link className="studio-pill" href="/contact">Work with us</Link>
      <div className="studio-footer-base">
        <div><p>{contactTitle}</p><Link href="/contact">Start a conversation</Link></div>
        <div><Link href="/about">Studio</Link><Link href="/privacy">Privacy</Link><AnalyticsPreferences /></div>
      </div>
    </footer>
  </>;
}
