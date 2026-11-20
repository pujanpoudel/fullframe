"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import type { Project } from "@/lib/cms/model";

const portraitRatios = [2 / 3, 3 / 4, 4 / 5];

function ShelfCard({ project, index }: { project: Project; index: number }) {
  const card = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(card, { amount: 0.3 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const preview = video.current;
    if (!preview) return;
    if (inView && reduced === false) void preview.play().catch(() => {});
    else preview.pause();
  }, [inView, reduced]);

  return <article className="studio-shelf-card" ref={card}
    style={{
      "--shelf-ratio": portraitRatios[index % portraitRatios.length],
      "--shelf-delay": `${Math.min(index, 8) * 55}ms`,
    } as React.CSSProperties}>
    <div className="studio-shelf-cover">
      {project.video
        ? <video ref={video} src={project.video.src} poster={project.image} muted loop playsInline preload="none" aria-hidden="true" />
        : <img src={project.image} alt={project.alt} loading="lazy" decoding="async" draggable={false} />}
      <Link href={`/work/${project.slug}`} draggable={false}>
        <span className="sr-only">{project.client}</span>
      </Link>
    </div>
  </article>;
}

export function StudioCaseShelf({ projects, description }: { projects: Project[]; description: string }) {
  const shelf = useRef<HTMLDivElement>(null);
  const entered = useInView(shelf, { once: true, amount: 0.18 });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const visible = projects.filter(project => project.published);

  function move(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || event.pointerType !== "mouse") return;
    const delta = event.clientX - state.x;
    if (!state.moved && Math.abs(delta) < 5) return;
    state.moved = true;
    const element = event.currentTarget;
    if (!element.hasPointerCapture(event.pointerId)) element.setPointerCapture(event.pointerId);
    element.dataset.dragging = "true";
    element.scrollLeft = state.left - delta;
  }

  function release(event: PointerEvent<HTMLDivElement>) {
    const element = event.currentTarget;
    delete element.dataset.dragging;
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
  }

  return <section className="studio-case-shelf" aria-labelledby="studio-case-heading">
    <div className="studio-section-head">
      <hgroup><h2 id="studio-case-heading">Case Studies</h2><p>{description}</p></hgroup>
      <Link href="/work" className="studio-pill">Explore</Link>
    </div>
    {visible.length > 0 && <div className="studio-project-shelf" ref={shelf} data-entered={entered}
      onPointerDown={event => {
        if (event.pointerType === "mouse" && event.button === 0) {
          drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft, moved: false };
        }
      }}
      onPointerMove={move}
      onPointerUp={release}
      onPointerCancel={event => { release(event); drag.current = null; }}
      onPointerLeave={() => { if (!drag.current?.moved) drag.current = null; }}
      onClickCapture={event => {
        if (drag.current?.moved) { event.preventDefault(); event.stopPropagation(); }
        drag.current = null;
      }}>
      {visible.map((project, index) => <ShelfCard key={project.slug} project={project} index={index} />)}
    </div>}
  </section>;
}
