import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/Hero";
import {
  FeaturedProjects,
  AnalyticsDashboard,
  TechStackSection,
  ActivitySection,
  TerminalSection,
  Footer,
} from "@/components/Sections";
import { fetchGitHubRepos, fetchGitHubUser, enrichRepo, isRepoDeployed, deduplicateProjects } from "@/lib/github";
import type { GitHubRepo, GitHubUser } from "@/types";
import type { EnrichedProject } from "@/components/ProjectCard";

export default function Home() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [projects, setProjects] = useState<EnrichedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [repos, userData] = await Promise.all([
        fetchGitHubRepos(),
        fetchGitHubUser(),
      ]);
      setUser(userData);

      // Step 1: Filter out forks and non-deployed
      const deployed = repos.filter(
        (r: GitHubRepo) => !r.fork && isRepoDeployed(r)
      );

      // Step 2: Deduplicate by GitHub repo ID
      const uniqueById = new Map<number, GitHubRepo>();
      for (const r of deployed) {
        if (!uniqueById.has(r.id)) {
          uniqueById.set(r.id, r);
        }
      }

      // Step 3: Enrich and deduplicate by slug, then sort
      const enriched = deduplicateProjects(
        Array.from(uniqueById.values()).map((r: GitHubRepo) => enrichRepo(r))
      ).sort((a: EnrichedProject, b: EnrichedProject) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (
          new Date(b.githubData?.updated_at ?? 0).getTime() -
          new Date(a.githubData?.updated_at ?? 0).getTime()
        );
      });

      setProjects(enriched);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="relative">
      <Hero user={user} projectCount={projects.length} />
      <FeaturedProjects projects={projects} />
      <AnalyticsDashboard user={user} projectCount={projects.length} />
      <TechStackSection />
      <ActivitySection />
      <TerminalSection projectCount={projects.length} />
      <Footer />
    </div>
  );
}

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4"
      >
        {/* Loader */}
        <div className="relative h-12 w-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border-2 border-transparent border-b-violet-500 border-l-violet-500/30"
          />
        </div>

        <div className="text-center">
          <div className="text-sm font-medium text-white">Initializing DevOS</div>
          <div className="mt-1 font-mono text-xs text-gray-400">
            Loading projects...
          </div>
        </div>
      </motion.div>
    </div>
  );
}
