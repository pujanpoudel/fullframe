"use client";

import Link from "next/link";
import { useRef } from "react";

type Program = { slug: string; name: string; description: string };

export function StudioProgramList({ programs }: { programs: Program[] }) {
  const list = useRef<HTMLUListElement>(null);

  function moveHighlight(link: HTMLAnchorElement) {
    const row = link.parentElement;
    if (!row || !list.current) return;
    list.current.style.setProperty("--program-highlight-top", `${row.offsetTop}px`);
    list.current.style.setProperty("--program-highlight-height", `${row.offsetHeight}px`);
  }

  return <ul className="studio-program-list" ref={list}>
    {programs.map(({ slug, name, description }) => <li className="studio-program-row" key={slug}>
      <Link href={`/services/${slug}`}
        onPointerEnter={event => moveHighlight(event.currentTarget)}
        onFocus={event => moveHighlight(event.currentTarget)}>
        <span className="studio-program-name">{name}</span>
        <span className="studio-program-description">{description}</span>
        <svg className="studio-program-arrow" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
          <path fill="currentColor" d="M9.7 6.6H0V5.4h9.7L5.14.84 6 0l6 6-6 6-.86-.84z" />
        </svg>
      </Link>
    </li>)}
  </ul>;
}
