import projectData from "./projects.json";

export type ProjectCategory = "all" | "product" | "knowledge" | "workflow";
export type SiteLanguage = "en" | "zh";
export type LocalizedText = Record<SiteLanguage, string>;

export type Project = {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  description: LocalizedText;
  features: LocalizedText[];
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

export const projects = projectData as Project[];
