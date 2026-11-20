"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function ProjectVideo({ src, poster, captions }: { src: string; poster: string; captions?: string }) {
  const [loaded, setLoaded] = useState(false);
  return loaded
    ? <video controls playsInline preload="none" poster={poster} src={src}>
        {captions && <track kind="captions" srcLang="en" label="English" src={captions} default />}
      </video>
    : <button type="button" className="cta cta-outline" onClick={() => setLoaded(true)}>{site.work.play}</button>;
}
