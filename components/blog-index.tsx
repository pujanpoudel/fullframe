"use client";

import { useState } from "react";
import { Arrow } from "./ui";

type Entry = { slug: string; title: string; description: string; topic: string; date: string; published: string; minutes: number };

export function BlogIndex({ entries, copy }: {
  entries: Entry[];
  copy: { search: string; searchPlaceholder: string; empty: string; read: string };
}) {
  const [search, setSearch] = useState("");
  const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const results = entries.filter((entry) => {
    const text = `${entry.title} ${entry.description} ${entry.topic}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });

  return <>
    <label className="blog-search">
      <span>{copy.search}</span>
      <input type="search" placeholder={copy.searchPlaceholder} value={search} maxLength={120} onChange={(event) => setSearch(event.target.value)} />
    </label>
    <p className="sr-only" aria-live="polite">{results.length} {results.length === 1 ? "article" : "articles"}</p>
    {results.length ? <div className="blog-grid">
      {results.map(({ slug, title, description, topic, date, published, minutes }) => <article key={slug} className="blog-card">
        <span className="mono muted">{topic} · {minutes} min read</span>
        <h3><a href={`/blog/${slug}`}>{title}</a></h3>
        <p className="muted">{description}</p>
        <div className="blog-card-foot"><time dateTime={published}>{date}</time>
          <a className="cta cta-text" href={`/blog/${slug}`} aria-label={`${copy.read} · ${title}`}>{copy.read}<Arrow diagonal /></a>
        </div>
      </article>)}
    </div> : <p className="inner-callout">{copy.empty}</p>}
  </>;
}
