"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cases } from "@/content/work";

type Media = { title: string; image: string; alt: string; kind: "Photos" | "Videos"; slug?: string; src?: string };
const media: Media[] = [
  { title: "A little of our world", image: "/work/ridgeline.webp", alt: "Outdoor, product and architecture concept artwork", kind: "Videos", src: "/work/concept-reel.mp4" },
  ...cases.map((entry) => ({ title: entry.client, image: entry.image, alt: entry.alt, kind: "Photos" as const, slug: entry.slug })),
];

export function ProjectGallery({ hero = false }: { hero?: boolean }) {
  const [filter, setFilter] = useState("All projects");
  const [selected, setSelected] = useState<Media | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [selected]);
  const visible = media.filter((item) => filter === "All projects" || item.kind === filter);
  return <>
    {hero ? <button className="hero-visual" onClick={() => setSelected(media[0])} aria-label="Watch our nine-second concept reel">
      <Image src="/work/ridgeline.webp" alt="" fill sizes="(max-width: 700px) 90vw, 42vw" preload />
      <span className="visual-top mono">Fullframe / In motion</span>
      <span className="visual-bottom"><span className="play-disc" aria-hidden="true">▶</span><span>Watch the concept reel<small>9 seconds · silent motion study</small></span></span>
      <span className="visual-corner" aria-hidden="true" />
    </button> : <div className="project-showcase">
      <div className="project-toolbar"><div className="project-filters" role="group" aria-label="Filter projects">{["All projects", "Photos", "Videos"].map((label) => <button key={label} aria-pressed={filter === label} onClick={() => setFilter(label)}>{label}<span>{label === "Photos" ? 3 : label === "Videos" ? 1 : 4}</span></button>)}</div><p className="muted" role="status">{visible.length} {visible.length === 1 ? "project" : "projects"} · Concept portfolio</p></div>
      <div className="project-grid">{visible.map((item, index) => <motion.article className={`project-card ${item.kind === "Videos" ? "project-film" : ""}`} key={`${filter}-${item.title}`} initial={false} whileInView={reduce ? undefined : { opacity: [0.4, 1], y: [40, 0] }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, delay: index * 0.07 }}>
        <button className="project-preview" onClick={() => setSelected(item)} aria-label={`${item.kind === "Videos" ? "Play" : "Enlarge"} ${item.title}`}>
          <Image src={item.image} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 45vw" />
          <span className="media-type">{item.kind === "Videos" ? "Film / 00:09" : "Photography"}</span>
          <span className="preview-action">{item.kind === "Videos" ? "▶ Play reel" : "+ View photo"}</span>
        </button>
        <div className="project-caption"><div><p className="mono muted">{item.kind === "Videos" ? "Motion study · Concept artwork" : "Creative direction · Concept"}</p><h3>{item.title}</h3></div>{item.slug && <Link href={`/work/${item.slug}`} className="project-story">View project</Link>}</div>
      </motion.article>)}</div>
    </div>}
    <dialog ref={dialog} className="media-dialog" aria-label={selected?.title ?? "Project viewer"} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected && <div className="media-dialog-body"><div className="media-dialog-heading"><div><h2>{selected.title}</h2><p>Concept portfolio{selected.src ? " · Silent animation of concept artwork" : " · Photography"}</p></div><button autoFocus className="viewer-close" onClick={() => dialog.current?.close()} aria-label="Close project viewer">Close ×</button></div>
        {selected.src ? <video key={selected.src} src={selected.src} poster={selected.image} controls playsInline autoPlay preload="metadata" aria-label="Concept reel: outdoor, product and architecture artwork" /> : <img src={selected.image} alt={selected.alt} />}
      </div>}
    </dialog>
  </>;
}
