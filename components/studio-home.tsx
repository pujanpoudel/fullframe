"use client";

import Link from "next/link";
import { StudioCaseShelf } from "./studio-case-shelf";
import { StudioProgramList } from "./studio-program-list";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { services } from "@/content/site";
import type { Project, StudioContent } from "@/lib/cms/model";

const programCount = services.length;
const programs = [
  ["Brand & Creative", "Give your brand a world of its own.", "branding-creative"],
  ["Video & Photography", "Make every frame mean something.", "video-production"],
  ["Digital Experiences", "Turn first impressions into lasting connections.", "web-design-development"],
  ["Growth & Campaigns", "Reach the right people. Make the right impact.", "meta-ads"],
];

const stories = [
  { title: "Start with a clearer picture", slug: "digital-marketing-audit-checklist", image: "/work/form.webp" },
  { title: "Creative that earns a second look", slug: "meta-ads-creative-testing", image: "/work/citrus.webp" },
  { title: "Find your local audience", slug: "local-seo-kathmandu-businesses", image: "/work/ridgeline.webp" },
];

function SectionHead({title, description, href, action = "Explore"}: {
  title: string; description: string; href?: string; action?: string;
}) {
  return <div className="studio-section-head">
    <h2>{title}</h2><p>{description}</p>
    {href && <Link href={href} className="studio-pill">{action}</Link>}
  </div>;
}

export function StudioProjects({ projects }: { projects: Project[] }) {
  const [mode, setMode] = useState<"Shelf" | "Spines">("Shelf");
  const [query, setQuery] = useState("");
  const visible = projects.filter(project => project.published &&
    [project.client, project.headline, ...project.services].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="studio-index-controls">
      <div role="group" aria-label="Project view">
        {(["Shelf", "Spines"] as const).map(view =>
          <button key={view} aria-pressed={mode === view} onClick={() => setMode(view)}>{view}</button>
        )}
      </div>
      <input type="search" aria-label="Search case studies" placeholder="Search" value={query}
        onChange={event => setQuery(event.target.value)} />
    </div>
    <div className={mode === "Spines" ? "studio-project-grid studio-project-spines" : "studio-project-grid"}>
      {visible.map(project => <article className="studio-project" key={project.slug}>
        <Link href={`/work/${project.slug}`} className="studio-project-image" aria-label={project.client}>
          <img src={project.image} alt={project.alt} loading="lazy" />
          <span>{project.client}</span>
        </Link>
        <div className="studio-project-meta">
          <h3><Link href={`/work/${project.slug}`}>{project.client}</Link></h3>
          <p>{project.services.join(" / ")}</p>
        </div>
      </article>)}
    </div>
    {!visible.length && <p className="studio-empty" role="status">No projects found.</p>}
  </>;
}

function StudioReel({ src, poster }: { src: string; poster: string }) {
  const section = useRef<HTMLElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const player = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const inView = useInView(section, { amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "center center"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0% 10% 15% round 16px)", "inset(0% 0% 0% round 16px)"]);
  useEffect(() => {
    if (!inView || open || reduced) preview.current?.pause();
    else preview.current?.play().catch(() => {});
  }, [inView, open, reduced]);
  function close() {
    player.current?.pause();
    setOpen(false);
  }
  return <section className="studio-reel" ref={section} aria-label="Studio reel">
    <motion.button className="studio-reel-preview" style={{ clipPath: reduced ? undefined : clip }}
      aria-label="Play studio reel" disabled={!src}
      onClick={() => { dialog.current?.showModal(); setOpen(true); player.current?.play().catch(() => {}); }}>
      <video ref={preview} src={src || undefined} poster={poster} playsInline muted loop autoPlay={reduced === false} preload="metadata" aria-hidden="true" />
    </motion.button>
    <dialog ref={dialog} className="studio-reel-dialog" aria-label="Studio reel" onClose={close}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <button className="studio-circle" onClick={() => dialog.current?.close()} aria-label="Close reel">×</button>
      <video ref={player} src={src || undefined} poster={poster} controls playsInline preload="none" />
    </dialog>
  </section>;
}

export function StudioStories({ directory = false }: { directory?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduced = useReducedMotion();
  const playing = inView && !paused && reduced === false;
  function move(direction: number) {
    setIndex(current => (current + direction + stories.length) % stories.length);
  }
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % stories.length), 6500);
    return () => window.clearTimeout(timer);
  }, [index, playing]);
  return <section ref={ref} className="studio-stories" aria-label="Featured stories">
    <div className="studio-stories-copy">
      <SectionHead title={directory ? "Featured stories" : "Journal"} description="A different way of seeing."
        href={directory ? undefined : "/blog"} />
    </div>
    <div className="studio-story-media">
      {stories.map((story, i) => <img key={story.slug} src={story.image} alt="" loading="lazy"
        data-active={index === i} />)}
      <div className="studio-story-hit-areas">
        <button aria-label="Previous story" onClick={() => move(-1)} />
        <button aria-label="Next story" onClick={() => move(1)} />
      </div>
      <Link key={index} className="studio-pill studio-story-link" href={`/blog/${stories[index].slug}`}>
        {stories[index].title}
      </Link>
    </div>
    <div className="studio-story-nav" role="group" aria-label="Choose a story">
      {stories.map((story, i) => <button key={story.slug} aria-label={story.title} aria-pressed={index === i}
        onClick={() => setIndex(i)}><span className={index === i && playing ? "story-progress" : undefined} /></button>)}
      <button className="story-pause" onClick={() => setPaused(!paused)} aria-label={paused ? "Play slideshow" : "Pause slideshow"}>{paused ? "▶" : "Ⅱ"}</button>
    </div>
  </section>;
}

export function StudioHome({ content }: { content: StudioContent }) {
  return <main id="main" className="studio-home">
    <section className="studio-hero">
      <h1>{content.headline}</h1>
      <div className="studio-signature">
        <p>{content.introduction}</p>
        <div><span>{content.location}</span><span>Strategy · Design · Film</span></div>
      </div>
    </section>
    <StudioReel src={content.reel} poster={content.reelPoster} />
    <section className="studio-section studio-programs">
      <SectionHead title="Programs" description={content.programsTitle} href="/services" action="Explore Programs" />
      <StudioProgramList programs={programs.map(([name, description, slug]) => ({ name, description, slug }))} />
      <Link className="studio-underlink" href="/services">All Programs ({programCount}) <span aria-hidden="true">→</span></Link>
    </section>
    <StudioCaseShelf projects={content.projects} description={content.projectsTitle} />
    <StudioStories />
  </main>;
}
