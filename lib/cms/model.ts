export type Project = {
  slug: string; client: string; headline: string; image: string; alt: string;
  services: string[]; challenge: string; solution: string;
  results: { value: string; label: string }[];
  gallery?: { src: string; alt: string }[];
  video?: { src: string; captions?: string };
  published: boolean;
};
export type StudioContent = {
  headline: string; introduction: string; location: string; reel: string; reelPoster: string;
  projectsTitle: string; programsTitle: string; contactTitle: string;
  projects: Project[];
};
export function validateContent(value: unknown): value is StudioContent {
  if (!value || typeof value !== "object") return false;
  const c = value as StudioContent;
  const text = (v: unknown, max = 2000) => typeof v === "string" && v.length <= max;
  const media = (v: unknown) => typeof v === "string" && (v === "" || /^\/(?:work|media)\/[a-zA-Z0-9._-]+$/.test(v));
  if (![c.headline,c.introduction,c.location,c.projectsTitle,c.programsTitle,c.contactTitle].every(v => text(v)) || !media(c.reel) || !media(c.reelPoster) || !Array.isArray(c.projects) || c.projects.length > 100) return false;
  const slugs = new Set<string>();
  return c.projects.every(p => {
    if (!p || !text(p.slug,100) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || slugs.has(p.slug)) return false;
    slugs.add(p.slug);
    return [p.client,p.headline,p.alt,p.challenge,p.solution].every(v => text(v,10000)) && media(p.image) && typeof p.published === "boolean" && Array.isArray(p.services) && p.services.length <= 20 && p.services.every(v => text(v,100)) && Array.isArray(p.results) && p.results.length <= 20 && p.results.every(r => text(r.value,100) && text(r.label,200)) && (!p.video || (media(p.video.src) && (!p.video.captions || media(p.video.captions)))) && (!p.gallery || (Array.isArray(p.gallery) && p.gallery.length <= 50 && p.gallery.every(i => media(i.src) && text(i.alt,500))));
  });
}
