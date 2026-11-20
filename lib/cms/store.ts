import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { cases } from "@/content/work";
import type { StudioContent } from "./model";
export const dataDirectory = path.resolve(process.env.CMS_DATA_DIR || path.join(process.cwd(), ".studio-data"));
export const initialContent: StudioContent = {
  headline: "Reframe your future.",
  introduction: "An independent creative and growth studio. Kathmandu, Nepal. Working everywhere.",
  location: "Kathmandu · Nepal", reel: "/work/concept-reel.mp4", reelPoster: "/work/ridgeline.webp",
  projectsTitle: "Ideas that move people. Work that moves brands.",
  programsTitle: "A clearer direction. A more compelling brand. A bigger possibility.",
  contactTitle: "What could we make possible?",
  projects: [...cases.map(p => ({ ...p, published: true })), {
    slug: "fullframe-motion-study", client: "Fullframe / In Motion", headline: "Three visual worlds. One moving frame.",
    image: "/work/citrus.webp", alt: "Citrus product artwork from the Fullframe concept reel", services: ["Motion Design", "Creative Direction"],
    challenge: "Explore how still artwork can become a short, cohesive motion study.",
    solution: "A nine-second silent reel connects outdoor, product and architectural concepts through gentle movement and considered pacing. This is animated concept artwork, not commissioned footage.",
    results: [{value:"9 seconds",label:"Silent concept reel"}], video:{src:"/work/concept-reel.mp4"}, published:true,
  }],
};
export async function readContent(kind: "draft" | "published" = "published"): Promise<StudioContent> {
  try { return JSON.parse(await readFile(path.join(dataDirectory, `${kind}.json`), "utf8")); }
  catch (e) { if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e; return kind === "draft" ? readContent("published") : initialContent; }
}
export async function writeContent(content: StudioContent, kind: "draft" | "published") {
  await mkdir(dataDirectory, { recursive: true });
  const temporary = path.join(dataDirectory, `${kind}-${randomUUID()}.tmp`);
  await writeFile(temporary, JSON.stringify(content, null, 2), { mode: 0o600 });
  await rename(temporary, path.join(dataDirectory, `${kind}.json`));
}
