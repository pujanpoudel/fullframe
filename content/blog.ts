import { site, type services } from "./site";

export const topics = {
  strategy: "Strategy",
  seo: "Local SEO",
  "paid-media": "Paid media",
  creative: "Creative production",
  web: "Web & analytics",
} as const;

export const blogCopy = {
  label: "Fullframe journal",
  title: "Practical marketing notes.",
  description: "Playbooks and checklists for teams working on local SEO, paid media, content, video and conversion.",
  featured: "Start here",
  archive: "All articles",
  topic: "Browse by topic",
  search: "Search articles",
  searchPlaceholder: "Try SEO, video or landing pages",
  empty: "No articles matched. Try a different search.",
  read: "Read article",
  contents: "In this article",
  sources: "References",
  related: "Keep reading",
  service: "Explore the related service",
  back: "Back to all articles",
  feed: "RSS feed",
};

export type Topic = keyof typeof topics;
type Post = {
  slug: string;
  topic: Topic;
  title: string;
  description: string;
  published: string;
  author: string;
  service: (typeof services)[number]["slug"];
  cover?: { src: string; alt: string };
  sections: {
    title: string;
    paragraphs: string[];
    checklist?: string[];
  }[];
  sources?: { label: string; href: string }[];
};

export const posts: Post[] = [
  {
    slug: "digital-marketing-audit-checklist", topic: "strategy",
    title: "A digital marketing audit you can do in 60 minutes",
    description: "Find the gaps between discovery and enquiry. Leave with three changes your team can actually make this month.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "content-strategy",
    cover: { src: "/work/form.webp", alt: "Sunlight falling across a concrete staircase" },
    sections: [
      { title: "Minutes 0–15 · Walk the customer journey", paragraphs: [
        "Pick one offer and one realistic customer. On a phone, start where that customer might first hear about you: a map listing, an Instagram post or an ad. Follow the path to an enquiry or purchase. Write down where you hesitate and what information would help you proceed.",
        "Watch for mismatched names, offers that disappear after the click, and contact options that are buried. For a restaurant in Kathmandu, for example, check whether menus, opening hours and directions match across the listing, website and social profile.",
      ] },
      { title: "Minutes 15–35 · Check what the team can measure", paragraphs: [
        "Pick one outcome, then identify the record that proves it happened. An enquiry reaches your inbox, a booking appears in your scheduler, or an order appears in your store. Check whether your reporting can connect that outcome to the channel where it started.",
        "Run one test on your own site and mark it as a test internally. Compare what the browser did with what your inbox, scheduler or store captured. That gives you a clearer baseline than page views alone.",
      ] },
      { title: "Minutes 35–60 · Choose the next three changes", paragraphs: [
        "List one fix that removes friction, one that makes your offer clearer and one that improves measurement. Give each fix an owner, a date and a way to check it.",
        "For example, a tutoring business could put availability on its service page, make its enquiry button visible on mobile and add a source field to its lead tracker. Recheck those three changes in two weeks before adding more work.",
      ], checklist: ["One customer journey documented", "One real business outcome defined", "Three changes with owners and review dates"] },
    ],
    sources: [
      { label: "Google Search Central · SEO Starter Guide", href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
      { label: "Google Analytics · About key events", href: "https://support.google.com/analytics/answer/9267568?hl=en" },
    ],
  },
  {
    slug: "local-seo-kathmandu-businesses", topic: "seo",
    title: "Local SEO for Kathmandu businesses",
    description: "A checklist for keeping your local business information accurate and making your priority services easier to find.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "seo",
    sections: [
      { title: "Start with the information customers actually use", paragraphs: [
        "If your business is eligible for a Google Business Profile, check that the name, category, phone number, opening hours and website match how you operate. Confirm holiday hours and add clear photos of the entrance, signage or work you do.",
        "Ask someone who has never visited to find you using only your listing. In a dense Kathmandu neighbourhood, an accurate pin and a familiar landmark may answer a question your street address leaves open.",
      ] },
      { title: "Give each priority service a useful web page", paragraphs: [
        "Explain who the service is for, what’s included and how to enquire. Answer local questions where they’re relevant, such as where you deliver or whether visits are by appointment.",
        "Link to these pages from your main service directory and relevant articles. Create a separate location page when you have a distinct location or a meaningful service-area explanation that will help a customer decide.",
      ] },
      { title: "Review the enquiries as well as the visibility", paragraphs: [
        "Google describes local results in terms of relevance, distance and prominence. Use those factors to understand why two people can see different results for the same search.",
        "Record website enquiries, calls or bookings you can reasonably attribute to local discovery. Revisit the pages and listing details customers use before deciding whether to invest in more content.",
      ], checklist: ["Profile details and hours checked", "Priority service pages connected to navigation", "Enquiry sources recorded where available"] },
    ],
    sources: [
      { label: "Google Business Profile · Tips to improve your local ranking", href: "https://support.google.com/business/answer/7091" },
      { label: "Google Search Central · SEO Starter Guide", href: "https://developers.google.com/search/docs/fundamentals/seo-starter-guide" },
    ],
  },
  {
    slug: "meta-ads-creative-testing", topic: "paid-media",
    title: "How to plan a first Meta ads creative test",
    description: "Turn a small set of ads into a test you can interpret, from the brief to the review of actual leads.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "meta-ads",
    cover: { src: "/work/citrus.webp", alt: "A red drink can and citrus on a warm orange set" },
    sections: [
      { title: "Write down the decision you want to make", paragraphs: [
        "Start with one offer and a measurable business outcome. A home-services business might test which opening message produces enquiries from people in its service area. A beverage brand might test which product story encourages first orders.",
        "Agree on what qualifies as a good enquiry or purchase before the ads go live. This gives the person reviewing lead quality a consistent standard and keeps the campaign discussion grounded in a business outcome.",
      ] },
      { title: "Draft distinct creative ideas", paragraphs: [
        "Try a demonstration, an answer to a common objection and a clear offer. Each idea should have enough information to make sense on its own. For a controlled comparison, keep the parts unrelated to your question as consistent as your setup allows.",
        "Check the destination on a phone. If the ad promises a consultation or introductory offer, make the same wording and next step easy to find after the click.",
      ] },
      { title: "Use the review to decide what to do next", paragraphs: [
        "Read ad performance alongside website actions and actual lead quality. A video can attract attention without creating relevant enquiries, and a form can be easy to fill without screening for your service area.",
        "Write a short decision for each creative idea: keep it, revise it or gather more evidence. When the sample is small, treat the patterns as hypotheses you can investigate in the next round.",
      ] },
    ],
  },
  {
    slug: "one-shoot-content-plan", topic: "creative",
    title: "Plan a shoot that feeds a month of content",
    description: "Build a shot list around campaign deliverables, with time for vertical footage, stills and the details editors need.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "video-production",
    cover: { src: "/work/ridgeline.webp", alt: "A hiker wearing a rust jacket in the foothills" },
    sections: [
      { title: "List the deliverables before you list the shots", paragraphs: [
        "Write a distribution plan with the main film, short edits, stills and any paid placements. Note the intended crop, whether the clip needs captions or room for text, and which product or benefit each asset needs to show.",
        "For a café launch, one list could include a short location tour, three preparation clips, a coffee close-up and exterior stills that help a first-time visitor find the entrance.",
      ] },
      { title: "Shoot for the edit", paragraphs: [
        "Schedule the scenes that depend on light, location access or a person’s availability first. Capture clean starts and ends for each action and get wide, medium and detail coverage where you need editing options.",
        "Use dedicated vertical captures for shots where a crop would lose important information. Get clean room sound, confirm usage permissions and store releases with the source files.",
      ] },
      { title: "Turn the footage into a publishing queue", paragraphs: [
        "Sort finished assets by goal, channel and deadline. Your strongest campaign cut can open the launch, while details and common customer questions can fill in the following weeks.",
        "Name versions with the campaign, aspect ratio and revision so a teammate can locate the right file later. The handover should also identify the captioned, clean and still-image versions.",
      ], checklist: ["Formats and captions planned", "Shot list organized by constraints", "Publishing queue and handover naming agreed"] },
    ],
  },
  {
    slug: "landing-page-enquiry-checklist", topic: "web",
    title: "A landing-page checklist for better enquiries",
    description: "Review the promise, proof, action and tracking before sending more visitors to a campaign page.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "web-design-development",
    sections: [
      { title: "Match the page to the promise", paragraphs: [
        "Compare your campaign message with the first screen on the landing page. A visitor should quickly recognize the offer, see who it’s for and understand what they can do next.",
        "Replace generic claims with information that matters to a buyer: a starting scope, a real example, a location, an expected timeline or what happens after they click.",
      ] },
      { title: "Give the primary action enough context", paragraphs: [
        "Use a clear button for the main outcome and explain the follow-up nearby. If the goal is a consultation, tell visitors what to bring or what you’ll review together.",
        "Test the form on mobile and with a keyboard. Use visible labels, collect the details you need for the next conversation and make success and error states easy to identify.",
      ] },
      { title: "Verify the enquiry and its source", paragraphs: [
        "Submit a test enquiry and confirm that it reaches the person who handles leads. Check the confirmation screen and verify that measurement records a successful enquiry rather than an attempted click.",
        "Review the quality of enquiries alongside the total. If the form is attracting people outside your service area or budget, clarify the offer before adding more fields or increasing spend.",
      ] },
    ],
    sources: [
      { label: "Google Analytics · About key events", href: "https://support.google.com/analytics/answer/9267568?hl=en" },
      { label: "Google Search Central · Understanding page experience", href: "https://developers.google.com/search/docs/appearance/page-experience" },
    ],
  },
  {
    slug: "small-business-marketing-dashboard", topic: "web",
    title: "What belongs on a small-business marketing dashboard?",
    description: "Build a simple reporting view around the enquiries, sales and decisions your team can verify.",
    published: "2026-11-20T17:00:00+05:45", author: site.name, service: "analytics-conversion-optimization",
    sections: [
      { title: "Pick the few outcomes that matter to the business", paragraphs: [
        "A service business can start with total enquiries, qualified enquiries, booked calls and confirmed sales. An ecommerce store might start with orders, net revenue and acquisition cost using a consistent cost definition.",
        "Write the definition next to each metric. For example, a qualified enquiry could mean a person in the service area who has shared a need you can address and a timeline you can meet.",
      ] },
      { title: "Reconcile reporting with the sales record", paragraphs: [
        "Use the inbox, scheduler, CRM or store to verify that the action happened. Separate unknown sources so your dashboard shows gaps in attribution rather than assigning credit without evidence.",
        "Report results by a consistent date range and include notable changes such as a new offer, a broken form or time off at the business. That context makes comparisons easier to interpret.",
      ] },
      { title: "Make each review lead to a decision", paragraphs: [
        "End the review with a short list of actions for the next period. One might be improving a landing page, one might be changing a creative brief and one might be fixing missing tracking.",
        "Keep a brief note on who owns each change and when you’ll check it again. The notes become a record of why the team made decisions as the campaign evolves.",
      ] },
    ],
    sources: [{ label: "Google Analytics · About key events", href: "https://support.google.com/analytics/answer/9267568?hl=en" }],
  },
];

export function readingMinutes(post: Post) {
  const passages = [post.description, ...post.sections.flatMap(({ title, paragraphs, checklist }) => [title, ...paragraphs, ...(checklist ?? [])])];
  return Math.max(1, Math.ceil(passages.join(" ").split(/\s+/).length / 200));
}

export const formatDate = (date: string) => new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "Asia/Kathmandu" }).format(new Date(date));
