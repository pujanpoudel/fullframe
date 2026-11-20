import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
    background: "#F6F4EF", color: "#0B0B0C", padding: 70, justifyContent: "space-between" }}>
    <div style={{ display: "flex", fontSize: 28, textTransform: "uppercase" }}>{site.hero.eyebrow}</div>
    <div style={{ display: "flex", flexDirection: "column", fontSize: 106, fontWeight: 800, lineHeight: 1.03 }}>
      {site.hero.lines.map((line) => <span key={line}>{line}</span>)}
    </div>
    <div style={{ display: "flex", fontSize: 32 }}>{site.name}</div>
  </div>, size);
}
