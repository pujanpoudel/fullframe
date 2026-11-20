export type Currency = "NPR" | "USD";
export type Billing = "monthly" | "project";
type Prices = Record<Currency, number> | null;
type Scope = { prices: Prices; audience: string; includes: string[] };
type Tier = { id: string; name: string; featured?: boolean } & Record<Billing, Scope>;

export const packages: Tier[] = [
  {
    id: "launch", name: "Launch",
    monthly: {
      prices: { NPR: 35000, USD: 275 }, audience: "For small teams building a consistent presence.",
      includes: ["Channel audit", "Monthly content plan", "Social profile upkeep", "Short-form video edits", "Branded social templates", "Monthly performance recap"],
    },
    project: {
      prices: { NPR: 65000, USD: 500 }, audience: "For new businesses preparing to go live.",
      includes: ["Discovery session", "Channel setup", "Creative direction", "Starter photo or video shoot", "Social launch assets", "Handover guide"],
    },
  },
  {
    id: "growth", name: "Growth", featured: true,
    monthly: {
      prices: { NPR: 75000, USD: 575 }, audience: "For brands ready to attract and convert more customers.",
      includes: ["Content strategy and calendar", "Recurring short-form production", "Social channel management", "Meta campaign management", "Landing-page improvements", "SEO and performance reporting"],
    },
    project: {
      prices: { NPR: 140000, USD: 1075 }, audience: "For teams launching a campaign or refreshing a website.",
      includes: ["Campaign strategy", "Creative concept and production", "Campaign landing page", "Meta ad assets", "On-page SEO", "Conversion tracking setup"],
    },
  },
  {
    id: "full-frame", name: "Full Frame",
    monthly: {
      prices: null, audience: "For teams looking for an ongoing partner across channels.",
      includes: ["Quarterly strategy", "Full-service video production", "Multi-channel social management", "Meta campaign management", "Website development and iteration", "SEO and content", "Integrated analytics"],
    },
    project: {
      prices: null, audience: "For teams planning a coordinated brand or digital launch.",
      includes: ["Brand and channel strategy", "Visual identity system", "Campaign photo and video", "Website design and development", "Search and analytics setup", "Launch rollout plan"],
    },
  },
];
