import type { GitHubRepo, GitHubUser, ProjectMetadata } from "@/types";

const GITHUB_USERNAME = "RudranilRoy-dev";
const GITHUB_API = "https://api.github.com";

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
      {
        headers: { Accept: "application/vnd.github.v3+json" },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch repos");
    const repos: GitHubRepo[] = await res.json();
    return repos.filter((r) => !r.fork);
  } catch (err) {
    console.error("GitHub API error:", err);
    return [];
  }
}

export async function fetchGitHubUser(): Promise<GitHubUser | null> {
  try {
    const res = await fetch(`${GITHUB_API}/users/${GITHUB_USERNAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchRepoLanguages(
  repoName: string
): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`
    );
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

// ============================================================
// SCALABLE PROJECT METADATA
// ============================================================
// Add metadata for each repo here. Repos without metadata
// will still render using GitHub API data with smart defaults.
// To add a new project: just add an entry to this array.
// ============================================================

export const projectMetadata: ProjectMetadata[] = [
  {
    id: "oops-c",
    repoName: "OOPs-C-",
    title: "OOPs in C",
    slug: "oops-c",
    description:
      "An interactive TypeScript application exploring Object-Oriented Programming concepts implemented in C. Deployed on Vercel with a modern web interface.",
    category: "education",
    featured: true,
    techStack: ["TypeScript", "Vercel"],
    tags: ["OOP", "C", "Education", "Programming Concepts"],
    deploymentStatus: "deployed",
    liveUrl: "https://oo-ps-c.vercel.app",
    features: [
      "Interactive OOP concept demonstrations",
      "Modern web-based interface",
      "TypeScript-powered implementation",
      "Vercel deployment with CI/CD",
    ],
  },
  {
    id: "os-practical",
    repoName: "OS-Practical",
    title: "OS Practical",
    slug: "os-practical",
    description:
      "Operating Systems practical implementations with a modern web interface. Covers core OS concepts including process management, memory allocation, scheduling algorithms, and more — deployed on Vercel.",
    category: "education",
    featured: true,
    techStack: ["TypeScript", "Vercel"],
    tags: ["Operating Systems", "Systems Programming", "Education"],
    deploymentStatus: "deployed",
    liveUrl: "https://os-practical-beta.vercel.app",
    features: [
      "Interactive OS concept demonstrations",
      "Modern web-based interface",
      "Process scheduling simulations",
      "Memory management implementations",
      "File system operations",
      "Core OS algorithm implementations",
    ],
  },
  {
    id: "arc-xtudios",
    repoName: "arc-xtudios",
    title: "ARC Xtudios",
    slug: "arc-xtudios",
    description:
      "A creative production agency website showcasing high-end commercial content for brands, artists, and businesses. Features cinematic visual storytelling, portfolio galleries, and professional service offerings — built with CSS and deployed on Vercel.",
    category: "web-app",
    featured: true,
    techStack: ["CSS", "HTML", "JavaScript", "Vercel"],
    tags: ["Creative Agency", "Production", "Photography", "Branding", "Portfolio"],
    deploymentStatus: "deployed",
    liveUrl: "https://arc-xtudios.vercel.app",
    features: [
      "Creative agency showcase with cinematic design",
      "Commercial, fashion & real estate photography portfolio",
      "Brand content creation and strategy sections",
      "Client testimonials and project case studies",
      "Responsive design with premium visual experience",
      "Contact and booking workflow",
    ],
  },
];

export function getMetadataForRepo(
  repoName: string
): ProjectMetadata | undefined {
  return projectMetadata.find((p) => p.repoName === repoName);
}

const VERCEL_URL_PATTERN = /\.vercel\.app$/;

export function isRepoDeployed(repo: GitHubRepo): boolean {
  const meta = getMetadataForRepo(repo.name);
  // If metadata explicitly marks as deployed, it's deployed
  if (meta?.deploymentStatus === "deployed") return true;
  // If repo has a homepage that looks like a Vercel URL, it's deployed
  if (repo.homepage && VERCEL_URL_PATTERN.test(repo.homepage)) return true;
  return false;
}

export function deduplicateProjects<T extends { id: string; slug: string }>(
  projects: T[]
): T[] {
  const seen = new Set<string>();
  return projects.filter((p) => {
    const key = p.slug.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function enrichRepo(
  repo: GitHubRepo
): ProjectMetadata & { githubData: GitHubRepo } {
  const meta = getMetadataForRepo(repo.name);
  const deployed = isRepoDeployed(repo);
  return {
    id: meta?.id ?? String(repo.id),
    repoName: repo.name,
    title: meta?.title ?? repo.name.replace(/[-_]/g, " "),
    slug: meta?.slug ?? repo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description:
      meta?.description ??
      repo.description ??
      "A project by Rudranil Roy. Visit the repository for more details.",
    category: meta?.category ?? "other",
    featured: meta?.featured ?? false,
    techStack: meta?.techStack ?? (repo.language ? [repo.language] : []),
    tags: meta?.tags ?? repo.topics ?? [],
    deploymentStatus: deployed ? "deployed" : "local",
    liveUrl: meta?.liveUrl ?? (deployed ? repo.homepage ?? undefined : undefined),
    features: meta?.features ?? [],
    challenges: meta?.challenges,
    architecture: meta?.architecture,
    thumbnail: meta?.thumbnail,
    githubData: repo,
  };
}

export function generateVercelUrl(repoName: string): string {
  const slug = repoName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `https://${slug}.vercel.app`;
}

export function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    "web-app": "Web App",
    tool: "Tool",
    library: "Library",
    education: "Education",
    experiment: "Experiment",
    portfolio: "Portfolio",
    api: "API",
    other: "Project",
  };
  return labels[cat] ?? "Project";
}

export function getCategoryIcon(cat: string): string {
  const icons: Record<string, string> = {
    "web-app": "🌐",
    tool: "🔧",
    library: "📦",
    education: "📚",
    experiment: "🧪",
    portfolio: "🎨",
    api: "⚡",
    other: "📁",
  };
  return icons[cat] ?? "📁";
}
