export type ProjectCategory = "all" | "product" | "knowledge" | "workflow";

export type Project = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  description: string;
  detail: string;
  category: Exclude<ProjectCategory, "all">;
  tags: string[];
  color: "rose" | "lilac" | "peach" | "blue" | "berry";
  featured?: boolean;
  status: "live" | "source" | "private";
  href?: string;
  source?: string;
};

export const projectCategories: { id: ProjectCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "product", label: "Products" },
  { id: "knowledge", label: "Knowledge" },
  { id: "workflow", label: "Workflows" },
];

export const projects: Project[] = [
  {
    id: "lumareader",
    number: "01",
    title: "LumaReader",
    eyebrow: "MARKDOWN DESKTOP READER",
    description: "本機 Markdown 閱讀器（macOS / Windows）。",
    detail: "資料夾文件庫、Mermaid、KaTeX、媒體預覽、20 組主題、11 種介面語言。",
    category: "product",
    tags: ["Electron", "Reading UX", "Open source"],
    color: "rose",
    featured: true,
    status: "live",
    href: "https://lumareader.kainnne.com",
    source: "https://github.com/kainnne/Kainnne-LumaReader",
  },
  {
    id: "wikinb",
    number: "02",
    title: "WikiNB",
    eyebrow: "MARKDOWN KNOWLEDGE BASE",
    description: "Markdown 知識庫與 AI 複習助理。",
    detail: "登入、筆記同步、全文瀏覽、Codex 對話。",
    category: "knowledge",
    tags: ["Astro", "Knowledge system", "AI"],
    color: "lilac",
    featured: true,
    status: "live",
    href: "https://wikinb.kainnne.com",
    source: "https://github.com/kainnne/WikiNB",
  },
  {
    id: "scopecut",
    number: "03",
    title: "ScopeCut",
    eyebrow: "CODEX PROJECT SCOPING TOOL",
    description: "把想法轉換成 Codex Project Contract。",
    detail: "分步輸入、範圍收斂、本機 Bridge、輸出至 WikiNB。",
    category: "workflow",
    tags: ["Codex", "Workflow design", "Local bridge"],
    color: "peach",
    featured: true,
    status: "live",
    href: "https://scopecut.kainnne.com",
    source: "https://github.com/kainnne/ScopeCut",
  },
];
