export const profile = {
  name: "Devashish Tyagi",
  role: "Full Stack Developer",
  taglineRoles: [
    "Full Stack Engineer",
    "Product Builder",
    "AI Enthusiast",
    "Problem Solver",
  ],
  location: "India",
  experienceYears: "1.5+",
  email: "iamdevashishtyagi@gmail.com",
  github: "https://github.com/iamdevashishtyagi", 
  linkedin: "https://www.linkedin.com/in/devashish-tyagi-34a38a268/",
  resumeUrl: "/resume.pdf",
};

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
  { label: "Wins", href: "#wins" },
  { label: "Skills", href: "#skills" },
  { label: "Systems", href: "#architecture" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export const aboutParagraphs = [
  `I started out fixing small bugs in a college ERP nobody else wanted to touch — the kind of codebase where every fix taught you something about the ten decisions that came before it. Eighteen months later, that instinct hasn't changed: I still learn fastest by shipping something real and living with the consequences.`,
  `My work sits at the intersection of execution and ownership. I've carried features from a whiteboard sketch to production traffic, reviewed code for developers who joined after me, and made the unglamorous calls — which library to trust, when to refactor, when to ship — that don't show up in a demo but decide whether a product survives its first year.`,
  `Lately, that curiosity has pulled me toward AI systems: retrieval, embeddings, the plumbing that makes a language model useful instead of just clever. I'm not interested in AI as a buzzword — I'm interested in it as an engineering discipline with its own failure modes, and I want to get good at that discipline the same way I got good at backend systems: by building, breaking, and rebuilding.`,
  `The long game is simple to state and hard to execute: become an engineer people trust with ambiguity, lead teams that ship with the same care I try to bring alone, and eventually build products that outlast the meetings about them.`,
];

export const experience = [
  {
    id: "erp",
    period: "2024 — Present",
    role: "Full Stack Developer",
    org: "College ERP Platform",
    summary:
      "Own frontend and backend workstreams on a production ERP used daily across multiple colleges — attendance, admissions, fee management, and academic records.",
    details: [
      "Led development of three major modules end-to-end, from schema design to UI, now used by staff and students without a single rollback.",
      "Refactored a slow-moving reporting module, cutting average query time and removing a recurring source of support tickets.",
      "Paired with and reviewed code from newer contributors, turning tribal knowledge into documented conventions the team still uses.",
      "Became the person pulled in when a module broke in production — the reliability work nobody assigns but everybody needs.",
    ],
    stack: ["Vue.js", "Node.js", "Express", "MongoDB", "REST APIs", "AWS"],
  },
  {
    id: "invoice",
    period: "2024",
    role: "Full Stack Developer",
    org: "Italian XML Invoice Converter",
    summary:
      "Built a compliance-critical conversion platform for an Italian client, turning raw invoice data into the country's mandated XML e-invoice format.",
    details: [
      "Designed the XML parsing and generation pipeline against Italy's SDI invoicing schema, handling edge cases the spec only half-documents.",
      "Wrote validation logic that catches malformed invoices before they reach the client's tax authority, not after.",
      "Automated a previously manual, error-prone conversion process into a workflow the client now trusts to run unattended.",
      "Worked directly with a non-technical client across a language and time-zone gap, translating tax rules into deterministic code.",
    ],
    stack: ["Vue.js", "Node.js", "Express", "XML/XSD", "Automation", "Validation"],
  },
  {
    id: "gym",
    period: "2023 — 2024",
    role: "Full Stack Developer",
    org: "Gym Management SaaS",
    summary:
      "Built a multi-tenant SaaS from the ground up for gyms to manage members, attendance, and subscriptions in one dashboard.",
    details: [
      "Designed the member and subscription data model to support recurring billing cycles and plan changes without data loss.",
      "Implemented role-based authentication separating gym owners, staff, and members with distinct permissions.",
      "Built the attendance system with check-in flows fast enough for a front-desk queue, not just a demo.",
      "Shipped the admin dashboard used daily by gym owners to track revenue and member retention at a glance.",
    ],
    stack: ["Vue.js", "Node.js", "Express", "MongoDB", "Auth", "TypeScript"],
  },
  {
    id: "college-start",
    period: "2023",
    role: "Frontend & Backend Contributor",
    org: "College ERP Platform (Early Days)",
    summary:
      "Joined as an early contributor, learning production engineering by working directly in a live, multi-year-old codebase.",
    details: [
      "Shipped first production fixes within the first two weeks — small, but real, and reviewed by senior engineers.",
      "Learned to read code before writing it: understanding legacy decisions before proposing new ones.",
      "Built the habit of writing for the next developer, not just for the feature to work.",
    ],
    stack: ["Vue.js", "Node.js", "Express", "MongoDB", "Git"],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  filter: "enterprise" | "ai" | "saas" | "compliance" | "marketing";
  mockup: "table" | "document" | "calendar" | "chat" | "landing";
  year: string;
  oneLiner: string;
  problem: string;
  solution: string;
  challenges: string[];
  results: string[];
  lessons: string;
  features: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  links: { demo?: string; github?: string; caseStudy?: string };
  accent: "blue" | "violet" | "amber";
};

export const projects: Project[] = [
  {
    id: "college-erp",
    title: "College ERP",
    category: "Enterprise Platform",
    filter: "enterprise",
    mockup: "table",
    year: "2023 — Present",
    oneLiner:
      "A production ERP that runs a college's daily academic operations — still growing, still in use.",
    problem:
      "Colleges were running admissions, attendance, fees, and academic records across spreadsheets and disconnected tools, with no single source of truth and no audit trail.",
    solution:
      "A unified platform covering the full academic lifecycle, built module by module and hardened against the messy realities of real institutional data.",
    challenges: [
      "Modeling academic data (semesters, retakes, credit transfers) that doesn't fit clean CRUD assumptions.",
      "Keeping the system fast under concurrent access during peak periods like admissions week and exam result day.",
      "Maintaining a multi-year-old codebase while shipping new modules without regressing existing ones.",
    ],
    results: [
      "In continuous daily use across multiple colleges with staff and students as end users.",
      "Reporting module refactor removed a recurring class of support tickets.",
      "Three major modules shipped and maintained with zero production rollbacks.",
    ],
    lessons:
      "Working on a live system taught me that engineering maturity is mostly about respecting what's already there — understanding the constraints behind old decisions before you touch them.",
    features: [
      "Admissions & enrollment tracking",
      "Attendance with real-time reporting",
      "Fee management & receipts",
      "Role-based access for staff, faculty, and students",
    ],
    stack: ["Vue.js", "Node.js", "Express", "MongoDB", "REST APIs", "AWS"],
    metrics: [
      { label: "Colleges live", value: "Multiple" },
      { label: "Modules", value: "30+" },
      { label: "Rollbacks", value: "0" },
    ],
    links: { demo: 'https://echelon.aperptech.com/dashboard', caseStudy: "#" },
    accent: "blue",
  },
  {
    id: "invoice-converter",
    title: "Italian Invoice Converter",
    category: "Compliance Automation",
    filter: "compliance",
    mockup: "document",
    year: "2024",
    oneLiner:
      "A conversion engine that turns raw invoice data into Italy's mandated e-invoice XML format — automatically, and correctly.",
    problem:
      "The client needed every invoice converted into Italy's SDI-compliant XML format, a process that was manual, slow, and one typo away from a rejected filing.",
    solution:
      "An automated pipeline that parses, validates, and generates schema-compliant XML, with validation that catches errors before submission rather than after.",
    challenges: [
      "Interpreting an invoicing schema where the official documentation leaves real edge cases ambiguous.",
      "Building validation strict enough to catch malformed data without being so rigid it rejects legitimate invoices.",
      "Coordinating requirements with a non-technical client across a language barrier and time-zone gap.",
    ],
    results: [
      "Converted the client's invoicing workflow from manual to fully automated.",
      "Eliminated a class of tax-filing errors caused by manual XML construction.",
      "Delivered a tool the client now runs unattended with confidence.",
    ],
    lessons:
      "Compliance software has zero tolerance for 'mostly correct.' It sharpened how I think about validation — as a first-class feature, not an afterthought.",
    features: [
      "XML generation against the SDI schema",
      "Pre-submission validation engine",
      "Batch conversion workflow",
      "Error reporting in plain language",
    ],
    stack: ["Vue.js", "Node.js", "Express", "XML/XSD", "Automation"],
    metrics: [
      { label: "Manual steps removed", value: "~90%" },
      { label: "Schema", value: "SDI XML" },
      { label: "Client region", value: "Italy" },
    ],
    links: { demo: 'https://www.xml-babel-converter.com', caseStudy: "#" },
    accent: "amber",
  },
  {
    id: "gym-saas",
    title: "Gym Management SaaS",
    category: "Multi-Tenant SaaS",
    filter: "saas",
    mockup: "calendar",
    year: "2023 — 2024",
    oneLiner:
      "Member management, attendance, and subscriptions in one dashboard — built for gym owners who don't have time for complicated software.",
    problem:
      "Independent gyms were managing members and payments manually, with no visibility into attendance trends or subscription health.",
    solution:
      "A focused SaaS dashboard: members, attendance, and subscriptions, designed to be understood in the first five minutes of use.",
    challenges: [
      "Designing a subscription model that handles plan upgrades, downgrades, and lapses without corrupting billing history.",
      "Building an attendance flow fast enough for a real front-desk check-in queue.",
      "Structuring role-based auth cleanly across owners, staff, and members from day one.",
    ],
    results: [
      "Fully functional multi-tenant dashboard covering the core gym-ops workflow.",
      "Attendance and subscription data structured to support analytics from day one.",
      "Clean auth boundaries that scale to additional gym locations without rework.",
    ],
    lessons:
      "Small-business software succeeds or fails on clarity, not feature count. I learned to cut scope aggressively in favor of a dashboard an owner can actually use.",
    features: [
      "Member management & profiles",
      "Attendance check-in system",
      "Subscription & billing cycles",
      "Owner analytics dashboard",
    ],
    stack: ["Vue.js", "Pinia", "Node.js", "Express", "MongoDB", "Auth", "TypeScript"],
    metrics: [
      { label: "Core modules", value: "4" },
      { label: "Tenant model", value: "Multi-gym" },
      { label: "Auth roles", value: "3" },
    ],
    links: { demo: 'https://gym-admin-management-dashboard.vercel.app/login', caseStudy: "#" },
    accent: "blue",
  },
  {
    id: "ai-chatbot",
    title: "AI Multi-Tenant Chatbot",
    category: "AI / RAG System",
    filter: "ai",
    mockup: "chat",
    year: "2024",
    oneLiner:
      "A retrieval-augmented chatbot that lets each tenant upload their own documents and get answers grounded in them — not the open internet.",
    problem:
      "Off-the-shelf chatbots hallucinate when asked about private, tenant-specific knowledge because they have no grounded retrieval layer or tenant isolation.",
    solution:
      "A RAG pipeline: documents are chunked and embedded, stored in a vector index per tenant, and retrieved context is injected into the LLM prompt so answers stay grounded in the tenant's own material.",
    challenges: [
      "Isolating vector data per tenant so no client's documents ever leak into another's retrieval results.",
      "Tuning chunking and embedding strategy so retrieval stays relevant as document libraries grow.",
      "Designing the upload-to-answer pipeline so it stays responsive as knowledge bases scale.",
    ],
    results: [
      "Working end-to-end RAG pipeline from document upload to grounded answer.",
      "Tenant isolation verified at the vector-store layer, not just the application layer.",
      "Retrieval tuned to reduce irrelevant context reaching the LLM.",
    ],
    lessons:
      "RAG systems are 20% prompting and 80% data engineering. The retrieval quality — not the model — decides whether the product feels smart or feels broken.",
    features: [
      "Document upload & chunking",
      "Per-tenant vector isolation",
      "Semantic search over embeddings",
      "OpenAI-powered grounded answers",
    ],
    stack: ["OpenAI API", "Vector Search", "Node.js", "Embeddings", "RAG"],
    metrics: [
      { label: "Architecture", value: "RAG" },
      { label: "Tenancy", value: "Isolated" },
      { label: "Retrieval", value: "Semantic" },
    ],
    links: { caseStudy: "#architecture" },
    accent: "violet",
  },
  {
    id: "business-site",
    title: "Business Website",
    category: "Marketing Site",
    filter: "marketing",
    mockup: "landing",
    year: "2023",
    oneLiner:
      "A fast, SEO-first marketing site built on Next.js and shipped to Vercel.",
    problem:
      "The client needed a marketing presence that loaded instantly, ranked well, and didn't require a CMS team to maintain.",
    solution:
      "A statically optimized Next.js site with disciplined SEO fundamentals — semantic markup, metadata, and performance budgets from the first commit.",
    challenges: [
      "Hitting strong Core Web Vitals on shared hosting-grade infrastructure.",
      "Structuring content and metadata for search visibility without a dedicated SEO tool.",
    ],
    results: [
      "Shipped and hosted on Vercel with strong Lighthouse scores across the board.",
      "Fully responsive across devices with no layout regressions reported.",
    ],
    lessons:
      "Performance and SEO aren't separate workstreams from design — they're constraints that should shape decisions from the first wireframe.",
    features: [
      "Responsive marketing pages",
      "Structured metadata & SEO",
      "Optimized images & fonts",
      "Vercel deployment pipeline",
    ],
    stack: ["Next.js", "TypeScript", "SEO", "Vercel", "Render"],
    metrics: [
      { label: "Lighthouse", value: "90+" },
      { label: "Hosting", value: "Vercel" },
      { label: "Devices", value: "All" },
    ],
    links: { demo: 'https://worldmediancr.com', caseStudy: "#" },
    accent: "blue",
  },
];

export const skillCategories = ["All", "Frontend", "Backend", "AI & Data", "Tooling"] as const;
export type SkillCategory = (typeof skillCategories)[number];

export const skillGroups: {
  name: string;
  detail: string;
  tags: string[];
  category: Exclude<SkillCategory, "All">;
  size: "sm" | "md" | "lg";
}[] = [
  {
    name: "Vue.js",
    detail: "Composition API, Pinia, SSR, performance optimization, reusable component architecture.",
    tags: ["Composition API", "Pinia", "SSR", "Reusable Components"],
    category: "Frontend",
    size: "lg",
  },
  {
    name: "React",
    detail: "Component architecture that stays sane as a product grows past its first version.",
    tags: ["Hooks", "State Management", "Component Design"],
    category: "Frontend",
    size: "md",
  },
  {
    name: "Next.js",
    detail: "App Router, SSR/SSG strategy, and performance-first React for real products.",
    tags: ["App Router", "SSR", "SEO", "Performance"],
    category: "Frontend",
    size: "lg",
  },
  {
    name: "TypeScript",
    detail: "Types as documentation — catching the bugs that only show up in production otherwise.",
    tags: ["Type Safety", "Generics", "DX"],
    category: "Frontend",
    size: "sm",
  },
  {
    name: "Tailwind CSS",
    detail: "Design tokens and utility-first styling that stay consistent across a whole product.",
    tags: ["Design Tokens", "Responsive", "Dark Mode"],
    category: "Frontend",
    size: "sm",
  },
  {
    name: "Node.js",
    detail: "Service architecture, background jobs, and REST APIs built to survive real traffic.",
    tags: ["REST APIs", "Middleware", "Auth", "Scaling"],
    category: "Backend",
    size: "lg",
  },
  {
    name: "Express",
    detail: "The backbone of every API I've shipped — lean, explicit, and easy to reason about.",
    tags: ["Routing", "Middleware", "Error Handling"],
    category: "Backend",
    size: "sm",
  },
  {
    name: "MongoDB",
    detail: "Schema design for messy real-world data — academic records, subscriptions, tenants.",
    tags: ["Schema Design", "Aggregation", "Indexing", "Multi-tenancy"],
    category: "Backend",
    size: "md",
  },
  {
    name: "Redis",
    detail: "Caching and session layers that keep hot paths fast under real concurrent load.",
    tags: ["Caching", "Sessions", "Rate Limiting"],
    category: "Backend",
    size: "sm",
  },
  {
    name: "REST & GraphQL APIs",
    detail: "Designing contracts that are easy to consume and hard to misuse.",
    tags: ["API Design", "Versioning", "Auth"],
    category: "Backend",
    size: "md",
  },
  {
    name: "AI / RAG",
    detail: "Embeddings, vector search, and the retrieval engineering that makes LLMs trustworthy.",
    tags: ["Embeddings", "Vector Search", "Chunking"],
    category: "AI & Data",
    size: "lg",
  },
  {
    name: "OpenAI API",
    detail: "Prompt design and structured outputs for production-grade LLM features.",
    tags: ["Prompting", "Function Calling", "Structured Output"],
    category: "AI & Data",
    size: "md",
  },
  {
    name: "Vector Databases",
    detail: "Tenant-isolated indexes over Pinecone-style stores for semantic search at scale.",
    tags: ["Pinecone", "Semantic Search", "Isolation"],
    category: "AI & Data",
    size: "sm",
  },
  {
    name: "Prompt Engineering",
    detail: "Treating prompts like code — versioned, tested, and reviewed.",
    tags: ["Evaluation", "Guardrails", "Iteration"],
    category: "AI & Data",
    size: "sm",
  },
  {
    name: "System Design",
    detail: "Thinking in trade-offs — data models, boundaries, and failure modes before code.",
    tags: ["Scalability", "Data Modeling", "Trade-offs"],
    category: "AI & Data",
    size: "md",
  },
  {
    name: "Git & GitHub",
    detail: "Clean history, meaningful commits, and code review as a teaching tool.",
    tags: ["Branching", "Code Review", "CI-friendly"],
    category: "Tooling",
    size: "sm",
  },
  {
    name: "Docker",
    detail: "Containerizing services so 'works on my machine' stops being a punchline.",
    tags: ["Containers", "Compose", "Reproducibility"],
    category: "Tooling",
    size: "sm",
  },
  {
    name: "CI / CD",
    detail: "Pipelines that catch problems before a client does.",
    tags: ["Automation", "Testing Gates", "Deploys"],
    category: "Tooling",
    size: "sm",
  },
  {
    name: "Vercel & AWS",
    detail: "Shipping and hosting production systems on infrastructure that scales without babysitting.",
    tags: ["Deployment", "Edge", "Monitoring"],
    category: "Tooling",
    size: "md",
  },
  {
    name: "Testing (Jest)",
    detail: "Enough tests to refactor with confidence, not so many that they slow the team down.",
    tags: ["Unit Tests", "Integration", "Confidence"],
    category: "Tooling",
    size: "sm",
  },
];

// Flat list powering the ambient marquee band — kept separate from the
// detailed grid above so the marquee can move fast and stay purely visual.
export const skillMarquee = [
  "Vue.js",
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "Express",
  "MongoDB",
  "Redis",
  "Tailwind CSS",
  "OpenAI API",
  "RAG",
  "Vector Search",
  "Docker",
  "Git",
  "REST APIs",
  "System Design",
  "Pinia",
  "AWS",
  "Vercel",
  "CI/CD",
];

// Short working principles — used as a texture band between sections,
// not as a claim of process maturity, just an honest set of habits.
export const principles = [
  "Ship it, then earn the right to redesign it",
  "Read before you refactor",
  "Validation is a feature",
  "Retrieval quality over model choice",
  "Own the bug after launch",
  "Boring code is a compliment",
  "Ask the dumb question early",
  "Optimize for the next developer",
];

export const leadership = [
  {
    title: "Leading Interns",
    description:
      "Onboarded and mentored interns joining the ERP project, turning unfamiliar codebases into confident first commits within days, not weeks.",
  },
  {
    title: "Feature Ownership",
    description:
      "Took features from requirement to production without a hand-off — writing the spec, building it, and owning the bugs that came after.",
  },
  {
    title: "Development Planning",
    description:
      "Broke ambiguous asks into sequenced, shippable milestones, so 'build an ERP module' became a plan a team could actually execute against.",
  },
  {
    title: "Code Reviews",
    description:
      "Reviewed peer code with an eye for maintainability, not just correctness — the habit that keeps a codebase readable a year later.",
  },
  {
    title: "Problem Solving Under Pressure",
    description:
      "The engineer pulled in when production breaks — comfortable diagnosing under time pressure without losing precision.",
  },
  {
    title: "Ownership",
    description:
      "Treats every shipped feature as still 'mine' after launch — the bugs, the edge cases, and the users who depend on it.",
  },
];

export const achievements = [
  { label: "Projects Delivered", value: 8, suffix: "+" },
  { label: "Production Systems", value: 4, suffix: "" },
  { label: "Happy Clients", value: 5, suffix: "+" },
  { label: "Technologies", value: 15, suffix: "+" },
  { label: "Years Experience", value: 1.5, suffix: "" },
  { label: "Lines of Code", value: 120, suffix: "K+" },
];

export type EngineeringWin = {
  id: string;
  tag: "Performance" | "Security" | "Integration" | "Business Logic" | "Leadership";
  title: string;
  problem: string;
  solution: string;
  impact: string;
};

// Real problems, real fixes — the "how I actually solve things" section,
// in place of testimonials I don't have on hand yet.
export const engineeringWins: EngineeringWin[] = [
  {
    id: "indexing",
    tag: "Performance",
    title: "Indexing a database that outgrew its own design",
    problem:
      "As more colleges and students came onto the ERP, attendance and academic-record queries that were fine at low volume started timing out under real concurrent load — admissions week, results day, exam season.",
    solution:
      "Audited actual query patterns before touching anything, then designed compound indexes and rewrote the worst aggregation pipelines around them instead of indexing blindly and hoping.",
    impact:
      "Eliminated the recurring class of timeout-driven support tickets and cut average reporting query time dramatically — with zero rollback.",
  },
  {
    id: "impersonation",
    tag: "Security",
    title: "A safe way to see what the user sees",
    problem:
      "Support and debugging often required reproducing an issue from inside a specific user's account — without ever handling or even seeing that user's password.",
    solution:
      "Designed a scoped admin 'login as user' flow: short-lived, signed impersonation tokens, explicit permission scope, and a full audit log of every session and who started it.",
    impact:
      "Support could resolve user-specific bugs fast, with zero password sharing and a complete, reviewable trail of who accessed what and when.",
  },
  {
    id: "aws",
    tag: "Integration",
    title: "Wiring up storage and email that don't fall over",
    problem:
      "File uploads and transactional email were handled ad hoc across projects, with no durable place to store user files or reliably deliver receipts and notifications.",
    solution:
      "Integrated AWS S3 for image/file uploads behind signed URLs, and AWS SES for transactional email — receipts, notifications, password resets — as a shared service other features could depend on.",
    impact:
      "Gave every feature after it a reliable file and email layer instead of reinventing one each time a project needed uploads or email.",
  },
  {
    id: "invoicing",
    tag: "Business Logic",
    title: "Turning tax law into deterministic code",
    problem:
      "Italy's SDI e-invoicing schema reads clean on paper but leaves real edge cases ambiguous — and a wrong interpretation means a rejected filing, not just a bug report.",
    solution:
      "Worked the ambiguous cases into explicit, testable validation rules instead of trusting the happy path, catching malformed invoices before they ever reached the tax authority.",
    impact:
      "The client now runs the conversion unattended, with an entire class of filing errors removed from the process.",
  },
  {
    id: "leadership",
    tag: "Leadership",
    title: "Owning the people problems, not just the code problems",
    problem:
      "Interns needed to become productive fast, and an international client needed someone who could turn vague, non-technical requests into a shippable engineering spec across a language and time-zone gap.",
    solution:
      "Mentored interns to their first real commit within days, and became the direct point of contact — gathering requirements, setting expectations, and translating client asks into sequenced work.",
    impact:
      "Features shipped without a hand-off gap, interns became contributors instead of spectators, and the client never had to manage engineering details themselves.",
  },
];

// Short, punchy phrases for the ambient marquee — same sliding-band UI that
// used to carry testimonials, now carrying what actually happened.
export const solvingPhrases = [
  "Indexed data for concurrent, multi-college load",
  "Cut reporting query time dramatically",
  "Designed secure admin impersonation flow",
  "Integrated AWS S3 for file uploads",
  "Wired up SES for transactional email",
  "Automated Italian e-invoice compliance",
  "Isolated multi-tenant vector search",
  "Zero rollbacks across three ERP modules",
  "Modeled subscription billing without data loss",
  "Translated tax rules into testable logic",
  "Mentored interns to first commit in days",
  "Owned client requirements end to end",
];

// Powers the scroll-triggered "journey" achievement toasts — a little
// gamified nudge to keep reading, tied to real section content.
export const journeyStops = [
  { id: "top", title: "Journey started", note: "Scroll on — this unlocks as you go." },
  { id: "about", title: "Origin story unlocked", note: "Now you know where the fix-everything habit started." },
  { id: "experience", title: "Timeline decoded", note: "Four engagements, zero production rollbacks." },
  { id: "projects", title: "Case files opened", note: "Five products, five different sets of constraints." },
  { id: "wins", title: "War stories loaded", note: "Real bugs, real fixes — indexing, security, integrations." },
  { id: "skills", title: "Stack mapped", note: "Hover any card — nothing here is padding." },
  { id: "architecture", title: "Pipeline traced", note: "Question in, grounded answer out." },
  { id: "achievements", title: "Scoreboard reached", note: "The numbers behind the timeline." },
  { id: "contact", title: "You made it to the end", note: "Rarer than you'd think. Say hi?" },
];

export const blogPosts = [
  {
    title: "What RAG Actually Gets Wrong (And How to Fix It)",
    excerpt:
      "Retrieval quality, not model choice, is the real bottleneck in most RAG systems. Notes from building a multi-tenant chatbot.",
    date: "2026-05-12",
    readTime: "7 min",
    tag: "AI Engineering",
  },
  {
    title: "Maintaining a Live ERP Without Breaking It",
    excerpt:
      "Lessons on shipping new modules into a multi-year-old, actively-used codebase without a single rollback.",
    date: "2026-03-02",
    readTime: "6 min",
    tag: "Engineering",
  },
  {
    title: "Validation Is a Feature, Not an Afterthought",
    excerpt:
      "What building compliance software for an Italian client taught me about designing for zero tolerance systems.",
    date: "2026-01-18",
    readTime: "5 min",
    tag: "Backend",
  },
];

export const architectureSteps = [
  { id: "question", label: "User Question", detail: "Raw natural‑language query enters the system – unmodified, ungrounded." },
  { id: "chunk", label: "Document Chunking", detail: "Tenant documents are split into semantic chunks – overlapping windows preserve context across boundaries." },
  { id: "embed", label: "Embedding", detail: "Each chunk is converted into a dense vector representation using a frozen embedding model." },
  { id: "search", label: "Vector Search", detail: "Query vector is matched against tenant‑isolated indexes – returns top‑K most relevant chunks." },
  { id: "context", label: "Retrieved Context", detail: "Selected chunks are assembled into a grounded context window – filtered, deduplicated, ranked." },
  { id: "llm", label: "LLM Reasoning", detail: "The model synthesizes an answer using only the retrieved context – no hallucinated outside knowledge." },
  { id: "answer", label: "Final Answer", detail: "A tenant‑specific, attributable response is returned – with citations to the source chunks." },
];