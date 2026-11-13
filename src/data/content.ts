// All site content lives here. Add new session summaries to `sessions`.
import engineeringPdf from "@/assets/sessions/engineering-interview-preparation-playbook.pdf.asset.json";
import behavioralPdf from "@/assets/sessions/navigating-behavioral-and-hiring-manager-interviews.pdf.asset.json";
import laborPdf from "@/assets/sessions/navigating-restructuring-and-dutch-labor-laws.pdf.asset.json";
import hiringPdf from "@/assets/sessions/navigating-modern-tech-hiring.pdf.asset.json";

export type Session = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  theme: "Job search" | "Interview prep" | "Mentorship" | "Career growth" | "Workplace rights";
  speaker?: string;
  summary: string;
  takeaways: string[];
  body: { heading: string; text: string }[];
  pdf: { url: string; filename: string };
};

const file = (a: { url: string; original_filename: string }) => ({ url: a.url, filename: a.original_filename });

export const sessions: Session[] = [
  {
    slug: "engineering-interview-preparation-playbook",
    title: "Engineering Interview Preparation Playbook",
    subtitle: "Job market selection, resume optimization, technical rounds and system design",
    date: "2026-11-06",
    theme: "Interview prep",
    summary: "The engineering job market is now employer-favoured and selective about exact stack and domain matches. This playbook covers how to pick target companies, get past ATS and HR screens, and prepare for code review and system design rounds.",
    takeaways: [
      "Group target companies into Big Tech, mid-size regional and startups — mid-size European companies offer the best balance of transparency, visa stability and candidate experience",
      "Focus on 7–10 tailored applications at a time; recruiters scan CVs in 3–5 seconds",
      "Keep a bank of 8–10 STAR stories, each in a short recruiter version and a detailed technical version",
      "In system design, start simple, finish the end-to-end flow, then add scale and production-readiness",
    ],
    body: [
      { heading: "1. Job market landscape", text: "Bucket 1 — Big Tech (Booking, Uber, Databricks, eBay): lengthy 6–8 step processes with multiple LeetCode rounds, top compensation, high stability, full visa sponsorship and 30% ruling.\nBucket 2 — Mid-size regional (Mollie, Adyen, Picnic, Bolt): 3–5 steps where code review and system design replace LeetCode, 10–30% lower pay than Big Tech but good promotions, reliable visa sponsorship and constructive debriefs.\nBucket 3 — Startups & AI labs: unpredictable 1–5 steps, high cash potential but equity risk, rarely offer direct visas.\n\nNote: using third-party payroll companies (e.g. Remote.com or Flex) as sponsors costs around €7,000/year and carries legal and insurance ambiguity in UWV proceedings." },
      { heading: "2. Application strategy & HR screening", text: "• Target 7–10 roles at a time and tailor your CV to the job description keywords. Direct applications perform about as well as referrals (30–50% initial rejection).\n• Put your most relevant experience at the top — recruiters scan in 3–5 seconds.\n• Rejection cool-downs usually apply only to the identical role; applying to a different position at the same company is viable.\n• For 30-minute HR screens, research products, customer touchpoints and values. Frame leaving your last role around growth.\n• Keep 8–10 STAR stories with a high-level and a technical version of each." },
      { heading: "3. Technical round 1: Code review interviews", text: "• Data correctness & transactions: check transaction boundaries, data integrity, security and exception handling. Watch for race conditions and missing rollbacks.\n• System performance: spot blocking external API calls inside DB transactions that exhaust the connection pool — don't get distracted by styling.\n• Test coverage & layering: look for happy-path and edge-case tests and clean Controller / Service / Repository separation.\n• Constructive communication: partner with the author, explain why, and suggest alternatives without overwhelming them with non-blocking nits." },
      { heading: "4. Technical round 2: System design & AI-native roles", text: "• Master core primitives: gRPC vs REST, Kafka delivery guarantees, Redis caching, Elasticsearch, PostgreSQL vs DynamoDB.\n• Start with the simplest viable solution and complete the data flow before adding caching and queues.\n• Cover production readiness: logging, metrics, tracing, alerting, failure recovery.\n• Platform/SRE tracks: Kubernetes, Linux networking, AWS, Infrastructure as Code, GitOps.\n• AI-native roles: multi-agent systems, LLM orchestration, micro-VM sandboxing.\n\nPractice with custom AI interview bots, real-world requirement prompts and Excalidraw or a whiteboard." },
      { heading: "5. Action plan", text: "• Share code review checklists, e.g. Google's guide: https://google.github.io/eng-practices/review/reviewer/looking-for.html\n• Open at least one recurring weekly peer mock interview slot.\n• Maintain a central board of AI coding questions, system design prompts and ATS guides.\n• Build a small tool to evaluate 10–20 job descriptions for stack and culture fit." },
    ],
    pdf: file(engineeringPdf),
  },
  {
    slug: "navigating-behavioral-and-hiring-manager-interviews",
    title: "Navigating Behavioral & Hiring Manager Interviews",
    subtitle: "Engineering & product leadership insights",
    date: "2026-11-03",
    theme: "Interview prep",
    speaker: "Arianna Savant, Alexandra, Janina Ireland & Sarit Sternheim",
    summary: "Leaders from Miro's product and engineering teams shared how hiring managers evaluate candidates at different levels, how AI is changing interviews, and how to tell stories about failure, weakness and conflict authentically.",
    takeaways: [
      "Junior roles are judged on potential and learning agility; senior roles on business impact and leadership",
      "Structured, concise communication is the #1 evaluation metric — take a beat before answering",
      "Build a Story Bank Matrix mapping your projects to common behavioural themes",
      "Never claim you've had no conflict — frame disagreements around trade-offs and business outcomes",
      "Interviews are two-way: watch how interviewers react to non-linear careers and breaks",
    ],
    body: [
      { heading: "1. Level-based expectations", text: "Junior positions: hiring managers look for potential, proactivity and learning agility — how fast you pick things up, take initiative and collaborate.\nSenior & staff: technical skill is assumed from earlier rounds. Focus shifts to how your decisions serve business goals, trade-off evaluation, mentorship and modelling healthy team norms." },
      { heading: "2. The role of AI in interviews", text: "• AI hasn't changed core values like problem-solving and clear communication, but it has raised the bar for critical thinking — defining requirements, reviewing AI-generated code and judging trade-offs.\n• In product case studies, a working AI-built prototype beats a static slide deck.\n• Bolting a generic chatbot onto a feature invites scrutiny — tie AI ideas to real metrics and user pain points.\n• Keep one or two stories about how you used AI to speed up delivery or improve designs." },
      { heading: "3. Communication & the Story Bank", text: "\"Structured, concise communication is the primary evaluation metric across both product and engineering interviews.\" — Arianna Savant\n\nMap your experiences against themes like cross-functional work, technical disagreement, failure/outage and operational weakness — with a primary and alternative story for each.\n\nIn the room: embrace silence and take a beat, give the high-level summary first, then invite follow-up: \"Would you like me to go deeper on the architecture or the stakeholder alignment?\"" },
      { heading: "4. Challenging scenarios", text: "• Unfamiliar stack: be honest, bridge to transferable experience and show learning agility.\n• Failures: own it without blaming others, explain the post-mortem, communication and safeguards you put in place.\n• Weaknesses: skip \"I'm a perfectionist\" — discuss real challenges like context-switching and how you mitigate them. Keep boundaries on overly personal follow-ups.\n• Crisis: Alexandra shared a Friday-afternoon production incident at Miro — stay calm, communicate transparently, roll back and coordinate." },
      { heading: "5. Conflict & stakeholder alignment", text: "• Understand peer incentives (velocity, stability, retention) and frame proposals in their terms.\n• Drive 80% core alignment — focus on shared goals rather than winning every argument.\n• Pragmatic disengagement — know when to step back to protect well-being and relationships." },
      { heading: "6. Culture, careers & red flags", text: "Non-linear careers, career breaks and parental leave bring valuable perspective — use the interviewer's reaction as a data point.\n\nRed flags for engineers: can't explain the business 'why'. Green flags: connecting tasks to product outcomes.\nRed flags for product: superficial AI features without metrics. Green flags: functional prototypes tied to user and business metrics.\n\nTrusted referrals are a powerful way to validate mutual fit." },
      { heading: "7. Preparation roadmap", text: "1. Build a Story Bank Matrix of 5–7 core projects.\n2. Prepare at least one AI execution story backed by metrics.\n3. Draft 2-minute summaries for each story.\n4. Outline authentic failure and weakness frames.\n5. Frame conflict stories around trade-offs and empathy.\n6. Prepare questions to evaluate the company's culture.\n\nThe PDF includes a printable Behavioral Interview Preparation Grid (inspired by Cracking the Coding Interview)." },
    ],
    pdf: file(behavioralPdf),
  },
  {
    slug: "navigating-restructuring-and-dutch-labor-laws",
    title: "Navigating Restructuring & Dutch Labor Laws",
    subtitle: "A guide for tech workers and engineers",
    date: "2026-10-26",
    theme: "Workplace rights",
    speaker: "Martijn Beijk, Dutch Works Council",
    summary: "An informational session with the Works Council on Dutch employment law, restructuring procedures and individual rights — organised by Tanmya Chandra. This is collective guidance, not formal legal advice; consult a certified labor law specialist for your situation.",
    takeaways: [
      "Separation follows either a mutual agreement (VSO) or the statutory UWV route",
      "You have a 14-day right to revoke a signed VSO (21 days if it isn't stated in writing)",
      "Visa holders, people on sick or parental leave and fixed-term contracts have specific protections",
      "Check your lawyer is registered with the Dutch Bar Association — Social Plans often fund €500–€1,500 of legal review",
    ],
    body: [
      { heading: "1. Termination routes", text: "Voluntary Separation Agreement (VSO): a mutual contract with negotiable severance, garden leave and exit dates. Statutory notice: 1 month under 5 years of service, 2 months over 5. Get it legally reviewed to protect unemployment rights.\n\nStatutory UWV route: the employer applies to the state agency to prove redundancy. Transition payment is 1/3 of monthly salary per year of service. Objective oversight, but slow and capped at the statutory baseline.\n\nSocial Plans negotiated by the Works Council set baseline terms and include a Hardship Clause reviewed by a tripartite committee. You can still negotiate individually." },
      { heading: "2. Restructuring timeline", text: "• Immersion phase: new management analyses the business (typically 1–2 weeks).\n• Request for Advice: management must justify redundancies to the Works Council and describe impact on leavers and stayers.\n• Due diligence: the Works Council has asked 90+ questions in past tech restructures.\n• Negative advice triggers a mandatory 30-day waiting period; positive advice often comes with binding conditions." },
      { heading: "3. Protected groups & garden leave", text: "• Visa / Highly Skilled Migrant holders: termination dates affect residence status — employers should act as a 'goed werkgever' (good employer).\n• Sick or parental leave: dismissal is prohibited during protected windows.\n• Fixed-term contracts: no obligation to extend, but without an early-termination clause the employer may owe the full remaining term.\n• Graduate programmes: mismatches between programme length and contract length get reviewed.\n\nGarden leave: you stay on full pay and benefits until the end date, access may be restricted, and you must remain available for reasonable tasks." },
      { heading: "4. Legal advice & signing bonuses", text: "• Verify your lawyer is a labor law specialist registered with the Nederlandse Orde van Advocaten.\n• Social Plans typically budget €500–€1,500 for independent review of your VSO.\n• 'Speedy' signing bonuses don't remove your 14-day bedenktijd (Article 7:670b BW) — 21 days if the VSO doesn't mention it.\n• Company FAQ documents can be shared with your lawyer; they're bound by confidentiality." },
      { heading: "5. Trends & resources", text: "Employers must explore internal redeployment before declaring redundancies. UWV is still assessing AI-efficiency redundancy arguments, which may slow proceedings.\n\nSupport: New Council (Works Council consultancy for international companies), TechWerkers (worker-led tech network), Juridisch Loket (free government legal helpdesk)." },
    ],
    pdf: file(laborPdf),
  },
  {
    slug: "navigating-modern-tech-hiring",
    title: "Navigating Modern Tech Hiring",
    subtitle: "Recruiting trends, resume strategy and AI insights",
    date: "2026-10-19",
    theme: "Job search",
    speaker: "Julia Rutkowska, Recruiter",
    summary: "AI tools have pushed applicant pools for a single engineering role from about 250 to 2,000+ in days. Recruiter Julia Rutkowska shared how to stand out in the screen, adapt to new technical formats, optimise your resume and negotiate salary.",
    takeaways: [
      "Use real stories, not 'typically I would…' — and say 'I', not just 'we'",
      "Apply to one level per company and discuss other levels with the recruiter",
      "Referrals get faster review (≈2 days vs 4 for standard applications)",
      "Ask about salary bands early and don't undersell yourself",
      "Feed past performance reviews into Claude to surface forgotten achievements",
    ],
    body: [
      { heading: "1. Master the recruiter screen", text: "• Targeted preparation beats mass applying — show why you want this specific role.\n• Use real past situations; save hypotheticals for things you haven't faced.\n• Use STAR as a storytelling structure, not a script: context, your role, the measurable result.\n• Say 'I' — women in particular over-rely on 'we'. Make your personal decisions clear.\n• Signal seniority by linking technical work to business impact." },
      { heading: "2. Shifting technical formats", text: "Due to AI cheating concerns and the cost of platforms like LeetCode and HackerRank, companies are returning to system design and whiteboarding to assess architectural thinking and real-time problem solving." },
      { heading: "3. Seniority levels & screening", text: "• Titles vary across companies — apply for one level and discuss alternatives on the call; multiple levels signals indecision.\n• Employee referral: ~2-day SLA, direct recruiter review, bypasses ATS queues.\n• Standard ATS application: ~4-day SLA, AI/keyword filter.\n• Direct recruiter sourcing: 1–3 days, based on your LinkedIn profile." },
      { heading: "4. Salary negotiation", text: "• Ask about salary bands in the first interview.\n• State your ideal range confidently — women often quote lower, and that creates long-term equity issues even for the company.\n• EU pay transparency rules will soon require salary disclosure." },
      { heading: "5. Resume & AI tools", text: "• Recruiters spend 3–5 seconds on a resume: keep bullets concise and your tech stack visible.\n• Verify your LinkedIn profile to stand out from fake profiles.\n• ATS tools like Ashby and Greenhouse rank profiles with AI, but under GDPR a human must make the final decision.\n\nPro tip prompt: \"List my top 5 technical accomplishments, key cross-functional projects, and any quantified business outcomes from this feedback\" — after uploading your reviews and peer feedback to Claude." },
    ],
    pdf: file(hiringPdf),
  },
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

export const aiJobJourney = {
  title: "Finding a job with AI",
  tagline: "Let AI do the legwork; you own the judgment.",
  stages: [
    { name: "Know yourself", icon: "🪞", steps: ["Mine past work for skills & wins", "Map transferable skills to new job titles", "Draft a one-line pitch + target role list", "Skill-gap analysis → AI study plan"] },
    { name: "Discover roles", icon: "🔭", steps: ["Smart alerts: LinkedIn, Indeed, Google Jobs", "Paste a posting: \"How well do I fit?\"", "Find hidden roles via company news & growth", "Track applications in an AI-updated sheet"] },
    { name: "Tailor materials", icon: "✂️", steps: ["Tailor résumé bullets to each posting", "ATS check: résumé vs. job keywords", "Cover letter draft, then add your voice", "Refresh LinkedIn headline & About"], highlight: 0 },
    { name: "Network", icon: "🤝", steps: ["Personal outreach notes to hiring managers", "Research people before coffee chats", "Referral request templates", "Follow-ups & thank-you drafts"] },
    { name: "Interview prep", icon: "🎤", steps: ["Predict questions from the job post", "Voice mock interviews with feedback", "Turn wins into STAR stories", "Company dossier: product, news, culture"] },
    { name: "Negotiate", icon: "💸", steps: ["Research pay bands (Levels.fyi, Glassdoor)", "Role-play the salary talk", "Compare offers on total comp", "Draft a counteroffer email"] },
  ] as { name: string; icon: string; steps: string[]; highlight?: number }[],
  guardrails: ["Fact-check: never claim skills you lack", "Edit every draft so it sounds like you", "Keep personal data out of unknown tools", "Watch for fake, AI-made job scams"],
};
