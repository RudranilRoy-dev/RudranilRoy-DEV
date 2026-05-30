export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  archived: boolean;
  fork: boolean;
  visibility: string;
  deployments_url: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  blog: string;
  location: string | null;
}

export interface ProjectMetadata {
  id: string;
  repoName: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  featured: boolean;
  thumbnail?: string;
  techStack: string[];
  tags: string[];
  deploymentStatus: DeploymentStatus;
  liveUrl?: string;
  features?: string[];
  challenges?: string[];
  architecture?: string;
}

export type ProjectCategory =
  | "web-app"
  | "tool"
  | "library"
  | "education"
  | "experiment"
  | "portfolio"
  | "api"
  | "other";

export type DeploymentStatus = "deployed" | "building" | "offline" | "local";

export type ViewMode = "grid" | "list";

export type SortOption = "latest" | "updated" | "name" | "stars";

export interface ProjectFilter {
  search: string;
  category: ProjectCategory | "all";
  techStack: string | "all";
  deploymentStatus: DeploymentStatus | "all";
  sort: SortOption;
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export interface TechItem {
  name: string;
  category: "language" | "framework" | "tool" | "database" | "platform";
  proficiency: number;
}
