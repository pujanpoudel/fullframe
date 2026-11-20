import entries from "./cases.json";

type CaseStudy = (typeof entries)[number] & {
  gallery?: { src: string; alt: string }[];
  video?: { src: string; captions?: string };
};

export const cases: CaseStudy[] = entries;
