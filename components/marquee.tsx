"use client";

import { useState } from "react";
import { site } from "@/content/site";

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const items = site.hero.strip;
  return <div className="marquee">
    <span className="sr-only">{items.join(", ")}</span>
    <div className="marquee-window">
      <div className="marquee-track" data-paused={paused} aria-hidden="true">
        {[0, 1].map((repeat) => <div className="marquee-group" key={repeat}>
          {[...items, ...items].map((item, i) => <span key={i}>{item}<b>✳</b></span>)}
        </div>)}
      </div>
    </div>
    <button className="marquee-pause" type="button" aria-label={paused ? site.hero.playStrip : site.hero.pauseStrip}
      onClick={() => setPaused(!paused)}>
      <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
    </button>
  </div>;
}
