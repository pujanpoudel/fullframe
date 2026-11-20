import { services } from "./site";

export const servicePageCopy = {
  title: "Digital marketing services",
  directoryHeading: "One team for your digital presence.",
  description: "Explore Fullframe Studio’s creative, marketing and web services in Kathmandu. Choose a focused project or build a scope across several channels.",
  scope: "What we can deliver",
  fitTitle: "Is this the right fit?",
  fit: "Who it’s for",
  measurement: "What we measure",
  questions: "Common questions",
  relevant: "Related reading",
  examples: "See a concept project",
  audit: "Discuss this service",
  back: "All services",
};

type ServiceDetail = {
  intro: string;
  audience: string;
  measure: string;
  faq: [question: string, answer: string];
};

const details = {
  "video-production": {
    intro: "Plan and produce campaign films, product videos and social cutdowns from a shared brief. We work through the message, shot list, locations and delivery formats before production starts.",
    audience: "Brands preparing a launch, building a social library or looking for campaign footage that can serve multiple channels.",
    measure: "Agree on the purpose of each cut. Look at retention for story-led work and qualified actions for campaign assets.",
    faq: ["Can one shoot cover several formats?", "Yes. We agree on the required aspect ratios, channels and cutdowns before the shoot so the crew can capture the right coverage."],
  },
  "social-media-management": {
    intro: "Build a manageable publishing rhythm with clear content themes, original creative and reporting that helps you decide what to repeat.",
    audience: "Small teams that need consistent execution or a partner to coordinate planning, design, production and publishing.",
    measure: "Review saves, meaningful comments, profile actions and qualified conversations alongside reach.",
    faq: ["Do I approve content before it goes live?", "We agree on a review schedule and approval workflow at the start of the engagement."],
  },
  "meta-ads": {
    intro: "Connect campaign creative, the landing experience and campaign reporting so each test answers a question about your audience or offer.",
    audience: "Local lead-generation teams and ecommerce brands with a defined offer, fulfilment capacity and an agreed media budget.",
    measure: "Review cost per qualified lead or purchase alongside sales feedback, and use creative-level reporting to plan the next test.",
    faq: ["Does the management fee include the ad budget?", "Media spend is paid directly through your ad account. We scope management and creative production separately."],
  },
  "web-design-development": {
    intro: "Design and build responsive websites, landing pages and ecommerce experiences around the action each visitor needs to take.",
    audience: "Businesses launching a website, replacing an outdated one or running campaigns that need dedicated landing pages.",
    measure: "Check usability on mobile and follow meaningful actions such as enquiries, bookings or checkout starts.",
    faq: ["Can you work with our existing site?", "We review the current platform and maintenance setup, then scope either targeted improvements or a rebuild."],
  },
  seo: {
    intro: "Improve how clearly your website explains what you do, where you work and why customers should choose you. We cover technical foundations, service content and local discovery where relevant.",
    audience: "Local service businesses and growth teams looking to earn more relevant organic traffic over time.",
    measure: "Track priority search topics, organic landing pages and enquiries that can be attributed to organic discovery.",
    faq: ["Can you guarantee a ranking?", "Search rankings vary. We agree on priorities and report on work completed, visibility and leads over time."],
  },
  "branding-creative": {
    intro: "Define what your brand stands for and turn that into a visual and verbal system your team can apply across campaigns, websites and social channels.",
    audience: "Startups launching a brand and established teams that need more consistency across their creative work.",
    measure: "Assess whether the system is consistent across touchpoints, easy for your team to apply and clear to the people you want to reach.",
    faq: ["Can you work with an existing logo?", "Yes. We can develop campaign direction and practical guidelines around an existing identity."],
  },
  "content-strategy": {
    intro: "Map audience questions to content your team can actually produce. We build an editorial plan, assign formats and define how each piece will reach people.",
    audience: "Teams publishing across a blog, social channels or sales materials with competing priorities and limited production time.",
    measure: "Review the topics that attract relevant visitors, help buyers decide and can be reused across channels.",
    faq: ["Can our team handle production internally?", "Yes. Strategy can be a standalone engagement with briefs, priorities and a handover plan."],
  },
  "email-whatsapp-marketing": {
    intro: "Plan practical follow-up for people who choose to hear from you, from welcome messages to enquiry follow-up and product reminders.",
    audience: "Businesses with opt-in audiences and a clear reason to send each message.",
    measure: "Review replies, clicks, qualified follow-ups and opt-outs to balance results with audience trust.",
    faq: ["Can you send campaigns to a purchased list?", "Our work is designed for audiences who have opted in and can unsubscribe or stop messages."],
  },
  "analytics-conversion-optimization": {
    intro: "Start with the business action you need to understand. Review tracking, reporting and landing pages, then prioritize fixes and experiments your team can evaluate.",
    audience: "Teams already marketing across channels that need a clearer view of attribution, lead quality or landing-page performance.",
    measure: "Define a baseline, instrument meaningful events and review changes alongside sales feedback and traffic quality.",
    faq: ["Can you audit our existing analytics account?", "Yes. We review the current measurement plan, event implementation and reporting with the access you choose to provide."],
  },
} satisfies Record<(typeof services)[number]["slug"], ServiceDetail>;

export const servicePages = services.map((service) => ({ ...service, ...details[service.slug] }));
