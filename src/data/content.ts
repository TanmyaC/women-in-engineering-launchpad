// All site content lives here. Add new session summaries to `sessions`.
export type Session = {
  slug: string;
  title: string;
  date: string;
  theme: "Job search" | "Interview prep" | "Mentorship" | "Career growth";
  speaker?: string;
  summary: string;
  takeaways: string[];
  body: { heading: string; text: string }[];
};

export const sessions: Session[] = [
  {
    slug: "example-session",
    title: "Example session summary",
    date: "2026-11-01",
    theme: "Career growth",
    speaker: "Placeholder speaker",
    summary: "This is a placeholder. Your real session summaries will replace it once the documents are added.",
    takeaways: ["Key takeaway one", "Key takeaway two", "Key takeaway three"],
    body: [{ heading: "Overview", text: "Session notes will appear here." }],
  },
];

export const jobTopics = [
  { title: "Where to look", items: ["Company career pages and internal referrals", "LinkedIn job alerts with focused filters", "Women-in-tech job boards and community Slack channels"] },
  { title: "CV & LinkedIn", items: ["Lead with impact: numbers, scope, outcomes", "Tailor the top third of your CV to each role", "Keep your LinkedIn headline specific to the role you want"] },
  { title: "Negotiation", items: ["Research salary bands before the first call", "Negotiate the full package, not just base", "It's normal to ask for time to decide"] },
];

export const interviewPrep = {
  generic: ["Prepare 6–8 STAR stories covering conflict, failure, leadership and impact", "Research the company's product, values and recent news", "Have 3 thoughtful questions ready for every interviewer", "Practice out loud — ideally with a peer from the group"],
  functions: [
    { name: "Software engineering", items: ["Data structures & algorithms practice", "System design fundamentals", "Code review & debugging rounds"] },
    { name: "Engineering management", items: ["People management scenarios", "Delivery & prioritisation stories", "Org design and hiring"] },
    { name: "Product / technical PM", items: ["Product sense cases", "Metrics and trade-off questions", "Working with engineering"] },
    { name: "Data & ML", items: ["SQL and statistics", "ML system design", "Experiment design"] },
  ],
};

export const resources = [
  { title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/", category: "Interview prep" },
  { title: "Levels.fyi — salary data", url: "https://www.levels.fyi/", category: "Job search" },
  { title: "AnitaB.org", url: "https://anitab.org/", category: "Community" },
  { title: "StaffEng — stories & guides", url: "https://staffeng.com/", category: "Career growth" },
];
