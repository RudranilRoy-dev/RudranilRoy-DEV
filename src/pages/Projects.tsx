import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Filter,
} from "lucide-react";
import { fetchGitHubRepos, enrichRepo, isRepoDeployed, deduplicateProjects } from "@/lib/github";
import { cn } from "@/lib/utils";
import { ProjectCard, type EnrichedProject } from "@/components/ProjectCard";
import type { GitHubRepo, ProjectCategory, DeploymentStatus, SortOption, ViewMode } from "@/types";

const categories: Array<{ value: ProjectCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "web-app", label: "Web Apps" },
  { value: "tool", label: "Tools" },
  { value: "education", label: "Education" },
  { value: "library", label: "Libraries" },
  { value: "experiment", label: "Experiments" },
];

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: "latest", label: "Latest" },
  { value: "updated", label: "Recently Updated" },
  { value: "name", label: "Name (A-Z)" },
  { value: "stars", label: "Stars" },
];

export default function Projects() {
  const [projects, setProjects] = useState<EnrichedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const [status, setStatus] = useState<DeploymentStatus | "all">("all");
  const [sort, setSort] = useState<SortOption>("latest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      const repos = await fetchGitHubRepos();

      // Step 1: Filter out forks and non-deployed repos
      const deployed = repos.filter(
        (r: GitHubRepo) => !r.fork && isRepoDeployed(r)
      );

      // Step 2: Deduplicate by GitHub repo ID (guaranteed unique)
      const uniqueById = new Map<number, GitHubRepo>();
      for (const r of deployed) {
        if (!uniqueById.has(r.id)) {
          uniqueById.set(r.id, r);
        }
      }

      // Step 3: Enrich and deduplicate by slug
      const enriched = deduplicateProjects(
        Array.from(uniqueById.values()).map((r: GitHubRepo) => enrichRepo(r))
      );

      setProjects(enriched);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let result = [...projects];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.techStack.some((t) => t.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Status
    if (status !== "all") {
      result = result.filter((p) => p.deploymentStatus === status);
    }

    // Sort
    switch (sort) {
      case "latest":
        result.sort(
          (a, b) =>
            new Date(b.githubData?.created_at ?? 0).getTime() -
            new Date(a.githubData?.created_at ?? 0).getTime()
        );
        break;
      case "updated":
        result.sort(
          (a, b) =>
            new Date(b.githubData?.updated_at ?? 0).getTime() -
            new Date(a.githubData?.updated_at ?? 0).getTime()
        );
        break;
      case "name":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "stars":
        result.sort(
          (a, b) =>
            (b.githubData?.stargazers_count ?? 0) -
            (a.githubData?.stargazers_count ?? 0)
        );
        break;
    }

    return result;
  }, [projects, search, category, status, sort]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative h-10 w-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500"
            />
          </div>
          <span className="font-mono text-xs text-gray-600">
            Loading projects...
          </span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
            Project Explorer
          </h1>
          <p className="text-sm text-gray-500">
            Browse and explore all projects. Filter by category, tech stack, or
            deployment status.
          </p>
        </motion.div>

        {/* Search & Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects, tech, tags..."
              className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-4 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-indigo-500/30 focus:bg-white/[0.05]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* View toggle & filter button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex h-10 items-center gap-2 rounded-xl border px-3 text-sm transition-colors",
                showFilters
                  ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-400"
                  : "border-white/[0.06] bg-white/[0.03] text-gray-400 hover:text-white"
              )}
            >
              <SlidersHorizontal size={14} />
              <span className="sm:hidden">Filter</span>
              <span className="hidden sm:inline">Filters</span>
            </button>

            <div className="flex overflow-hidden rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "flex h-10 w-10 items-center justify-center transition-colors",
                  viewMode === "grid"
                    ? "bg-white/[0.06] text-white"
                    : "text-gray-500 hover:text-white"
                )}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex h-10 w-10 items-center justify-center transition-colors",
                  viewMode === "list"
                    ? "bg-white/[0.06] text-white"
                    : "text-gray-500 hover:text-white"
                )}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="glass rounded-xl p-4">
                <div className="flex flex-wrap gap-4">
                  {/* Categories */}
                  <div>
                    <div className="mb-2 text-xs font-medium text-gray-500">
                      Category
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => setCategory(cat.value)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs transition-colors",
                            category === cat.value
                              ? "bg-indigo-500/20 text-indigo-400"
                              : "bg-white/[0.03] text-gray-500 hover:text-white"
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div className="mb-2 text-xs font-medium text-gray-500">
                      Status
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          { value: "all", label: "All" },
                          { value: "deployed", label: "🟢 Deployed" },
                          { value: "building", label: "🟡 Building" },
                          { value: "local", label: "⚫ Local" },
                        ] as const
                      ).map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setStatus(s.value)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs transition-colors",
                            status === s.value
                              ? "bg-indigo-500/20 text-indigo-400"
                              : "bg-white/[0.03] text-gray-500 hover:text-white"
                          )}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort */}
                  <div>
                    <div className="mb-2 text-xs font-medium text-gray-500">
                      Sort by
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSort(opt.value)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs transition-colors",
                            sort === opt.value
                              ? "bg-indigo-500/20 text-indigo-400"
                              : "bg-white/[0.03] text-gray-500 hover:text-white"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clear filters */}
                {(search || category !== "all" || status !== "all") && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setCategory("all");
                      setStatus("all");
                    }}
                    className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 transition-colors hover:text-white"
                  >
                    <X size={12} />
                    Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-600">
          <Filter size={12} />
          <span>
            Showing {filtered.length} of {projects.length} projects
          </span>
        </div>

        {/* Projects Grid/List */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[300px] flex-col items-center justify-center text-center"
          >
            <div className="mb-3 text-4xl">🔍</div>
            <div className="mb-1 text-sm font-medium text-gray-400">
              No projects found
            </div>
            <div className="text-xs text-gray-600">
              Try adjusting your search or filters
            </div>
          </motion.div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                viewMode="list"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
