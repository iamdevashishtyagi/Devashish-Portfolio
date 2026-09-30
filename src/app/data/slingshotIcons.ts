export interface SlingshotTechItem {
  id: string;
  name: string;
  icon: string;
  category: "Frontend" | "Backend" | "AI & Data" | "DevOps & Cloud";
  color: string;
  glowColor: string;
  shape?: "circle" | "rounded-rect";
  width?: number;
  height?: number;
  radius?: number;
}

export const SLINGSHOT_TECH_STACK: SlingshotTechItem[] = [
  // Column 1 - Modern Frontend & Frameworks
  {
    id: "tech-nextjs",
    name: "Next.js",
    icon: "devicon:nextjs",
    category: "Frontend",
    color: "#000000",
    glowColor: "rgba(15, 23, 42, 0.25)",
  },
  {
    id: "tech-react",
    name: "React",
    icon: "devicon:react",
    category: "Frontend",
    color: "#61DAFB",
    glowColor: "rgba(97, 218, 251, 0.35)",
  },
  {
    id: "tech-typescript",
    name: "TypeScript",
    icon: "devicon:typescript",
    category: "Frontend",
    color: "#3178C6",
    glowColor: "rgba(49, 120, 198, 0.35)",
  },
  {
    id: "tech-vue",
    name: "Vue.js",
    icon: "devicon:vuejs",
    category: "Frontend",
    color: "#4FC08D",
    glowColor: "rgba(79, 192, 141, 0.35)",
  },
  {
    id: "tech-tailwind",
    name: "Tailwind",
    icon: "devicon:tailwindcss",
    category: "Frontend",
    color: "#06B6D4",
    glowColor: "rgba(6, 182, 212, 0.35)",
  },
  {
    id: "tech-vite",
    name: "Vite",
    icon: "logos:vitejs",
    category: "Frontend",
    color: "#646CFF",
    glowColor: "rgba(100, 108, 255, 0.35)",
  },
  {
    id: "tech-gsap",
    name: "GSAP",
    icon: "simple-icons:greensock",
    category: "Frontend",
    color: "#88CE02",
    glowColor: "rgba(136, 206, 2, 0.35)",
  },

  // Column 2 - Core Backend & APIs
  {
    id: "tech-nodejs",
    name: "Node.js",
    icon: "devicon:nodejs",
    category: "Backend",
    color: "#5FA04E",
    glowColor: "rgba(95, 160, 78, 0.35)",
  },
  {
    id: "tech-express",
    name: "Express",
    icon: "devicon:express",
    category: "Backend",
    color: "#334155",
    glowColor: "rgba(51, 65, 85, 0.3)",
  },
  {
    id: "tech-python",
    name: "Python",
    icon: "devicon:python",
    category: "AI & Data",
    color: "#3776AB",
    glowColor: "rgba(55, 118, 171, 0.35)",
  },
  {
    id: "tech-fastapi",
    name: "FastAPI",
    icon: "devicon:fastapi",
    category: "Backend",
    color: "#009688",
    glowColor: "rgba(0, 150, 136, 0.35)",
  },
  {
    id: "tech-graphql",
    name: "GraphQL",
    icon: "devicon:graphql",
    category: "Backend",
    color: "#E10098",
    glowColor: "rgba(225, 0, 152, 0.35)",
  },
  {
    id: "tech-bun",
    name: "Bun",
    icon: "logos:bun",
    category: "Backend",
    color: "#FBF0DF",
    glowColor: "rgba(240, 180, 80, 0.3)",
  },
  {
    id: "tech-prisma",
    name: "Prisma",
    icon: "logos:prisma",
    category: "Backend",
    color: "#2D3748",
    glowColor: "rgba(45, 55, 72, 0.35)",
  },

  // Column 3 - AI, Vector Databases & RAG
  {
    id: "tech-openai",
    name: "OpenAI",
    icon: "logos:openai-icon",
    category: "AI & Data",
    color: "#10A37F",
    glowColor: "rgba(16, 163, 127, 0.35)",
  },
  {
    id: "tech-gemini",
    name: "Gemini AI",
    icon: "logos:google-gemini",
    category: "AI & Data",
    color: "#1A73E8",
    glowColor: "rgba(26, 115, 232, 0.35)",
  },
  {
    id: "tech-rag",
    name: "RAG Engine",
    icon: "carbon:machine-learning-model",
    category: "AI & Data",
    color: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.35)",
  },
  {
    id: "tech-pinecone",
    name: "Pinecone",
    icon: "logos:pinecone-icon",
    category: "AI & Data",
    color: "#0F172A",
    glowColor: "rgba(15, 23, 42, 0.35)",
  },
  {
    id: "tech-langchain",
    name: "LangChain",
    icon: "simple-icons:langchain",
    category: "AI & Data",
    color: "#1C3C3C",
    glowColor: "rgba(28, 60, 60, 0.35)",
  },
  {
    id: "tech-mongodb",
    name: "MongoDB",
    icon: "devicon:mongodb",
    category: "Backend",
    color: "#47A248",
    glowColor: "rgba(71, 162, 72, 0.35)",
  },
  {
    id: "tech-postgresql",
    name: "PostgreSQL",
    icon: "devicon:postgresql",
    category: "Backend",
    color: "#4169E1",
    glowColor: "rgba(65, 105, 225, 0.35)",
  },

  // Column 4 - Cloud, DevOps & Infrastructure
  {
    id: "tech-redis",
    name: "Redis",
    icon: "devicon:redis",
    category: "Backend",
    color: "#DC382D",
    glowColor: "rgba(220, 56, 45, 0.35)",
  },
  {
    id: "tech-supabase",
    name: "Supabase",
    icon: "logos:supabase-icon",
    category: "Backend",
    color: "#3ECF8E",
    glowColor: "rgba(62, 207, 142, 0.35)",
  },
  {
    id: "tech-docker",
    name: "Docker",
    icon: "devicon:docker",
    category: "DevOps & Cloud",
    color: "#2496ED",
    glowColor: "rgba(36, 150, 237, 0.35)",
  },
  {
    id: "tech-git",
    name: "Git & GitHub",
    icon: "devicon:git",
    category: "DevOps & Cloud",
    color: "#F05032",
    glowColor: "rgba(240, 80, 50, 0.35)",
  },
  {
    id: "tech-aws",
    name: "AWS",
    icon: "logos:aws",
    category: "DevOps & Cloud",
    color: "#FF9900",
    glowColor: "rgba(255, 153, 0, 0.35)",
  },
  {
    id: "tech-vercel",
    name: "Vercel",
    icon: "logos:vercel-icon",
    category: "DevOps & Cloud",
    color: "#000000",
    glowColor: "rgba(0, 0, 0, 0.25)",
  },
  {
    id: "tech-render",
    name: "Render",
    icon: "simple-icons:render",
    category: "DevOps & Cloud",
    color: "#46E3B7",
    glowColor: "rgba(70, 227, 183, 0.35)",
  },
];
