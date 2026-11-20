"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/cms/model";

export function StudioCaseGallery({ project }: { project: Project }) {
  const frames = [{ src: project.image, alt: project.alt }, ...(project.gallery ?? [])];
  const count = frames.length + Number(Boolean(project.video));
  const [current, setCurrent] = useState(0);
  const viewer = useRef<HTMLDialogElement>(null);
  const frame = frames[current];
  function move(direction: number) {
    setCurrent(index => (index + direction + count) % count);
  }

  return <>
    <div className="studio-case-cover">
      <img src={project.image} alt={project.alt} fetchPriority="high" />
      <button className="studio-pill" onClick={() => { setCurrent(0); viewer.current?.showModal(); }}>
        Explore the gallery
      </button>
    </div>
    <dialog ref={viewer} className="studio-case-viewer" aria-label={`${project.client} gallery`}
      onKeyDown={event => {
        if (event.target instanceof HTMLVideoElement) return;
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}
      onClose={() => viewer.current?.querySelector("video")?.pause()}>
      <header>
        <span>{project.client}</span>
        <button className="studio-circle" onClick={() => viewer.current?.close()} aria-label="Close gallery">×</button>
      </header>
      <div className="studio-case-frame" key={current}>
        {frame ? <img src={frame.src} alt={frame.alt} /> : project.video &&
          <video src={project.video.src} controls playsInline poster={project.image}>
            {project.video.captions && <track kind="captions" src={project.video.captions} srcLang="en" label="English" />}
          </video>}
      </div>
      <div className="studio-case-controls">
        <button className="studio-circle" disabled={count < 2} onClick={() => move(-1)} aria-label="Previous item">‹</button>
        <span aria-live="polite">{current + 1} / {count}</span>
        <button className="studio-circle" disabled={count < 2} onClick={() => move(1)} aria-label="Next item">›</button>
      </div>
    </dialog>
  </>;
}
