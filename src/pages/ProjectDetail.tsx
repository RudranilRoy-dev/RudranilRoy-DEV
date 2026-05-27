import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Clock,
  Code2,
  Globe,
  Layers,
  CheckCircle2,
  AlertCircle,
  Zap,
} from "lucide-react";
import { fetchGitHubRepos, enrichRepo, isRepoDeployed, deduplicateProjects } from "@/lib/github";
import { formatDate, getLanguageColor, getStatusColor, getStatusLabel } from "@/lib/utils";
import { ProjectCard, type EnrichedProject } from "@/components/ProjectCard";
import type { GitHubRepo } from "@/types";

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<EnrichedProject | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<EnrichedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const repos = await fetchGitHubRepos();
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

      // Step 3: Enrich and deduplicate by slug
      const enriched = deduplicateProjects(
        Array.from(uniqueById.values()).map((r: GitHubRepo) => enrichRepo(r))
      );

      const found = enriched.find((p) => p.slug === slug);
      if (found) {
        setProject(found);
        // Find related projects (same category or shared tech)
        const related = enriched
          .filter(
            (p) =>
              p.id !== found.id &&
              (p.category === found.category ||
                p.techStack.some((t) => found.techStack.includes(t)))
          )
          .slice(0, 3);
        setRelatedProjects(related);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-10 w-10"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500"
          />
        </motion.div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="text-6xl">🔍</div>
        <h2 className="text-xl font-bold text-white">Project not found</h2>
        <p className="text-sm text-gray-500">
          The project you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/projects")}
          className="magnetic-btn flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm text-gray-300"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>
      </div>
    );
  }

  const statusColor = getStatusColor(project.deploymentStatus);
  const statusLabel = getStatusLabel(project.deploymentStatus);

  return (
    <div className="relative min-h-screen">
      {/* Hero Banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${
            project.githubData?.language
              ? getLanguageColor(project.githubData.language) + "20"
              : "rgba(99, 102, 241, 0.1)"
          } 0%, rgba(0,0,0,1) 70%)`,
        }}
      >
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pt-16">
          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/projects")}
            className="mb-6 flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </motion.button>

          {/* Title area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {project.title}
              </h1>
              {project.featured && (
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-400">
                  ⭐ Featured
                </span>
              )}
            </div>

            <p className="mb-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {project.githubData?.html_url && (
                <a
                  href={project.githubData.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-btn flex items-center gap-2 rounded-xl bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/[0.1]"
                >
                  <GitBranch size={16} />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="magnetic-btn flex items-center gap-2 rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-indigo-400"
                >
                  <Globe size={16} />
                  Live Demo
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview Cards */}
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-xl p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                  <Code2 size={12} />
                  Language
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: getLanguageColor(
                        project.githubData?.language ?? ""
                      ),
                    }}
                  />
                  <span className="text-sm font-semibold text-white">
                    {project.githubData?.language ?? "N/A"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-xl p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                  <Zap size={12} />
                  Status
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: statusColor }}
                  >
                    {statusLabel}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-xl p-4"
              >
                <div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} />
                  Last Updated
                </div>
                <div className="text-sm font-semibold text-white">
                  {project.githubData?.updated_at
                    ? formatDate(project.githubData.updated_at)
                    : "N/A"}
                </div>
              </motion.div>
            </div>

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <CheckCircle2 size={18} className="text-green-400" />
                  Features
                </h2>
                <div className="glass rounded-xl p-5">
                  <ul className="space-y-3">
                    {project.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-3 text-sm text-gray-400"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <AlertCircle size={18} className="text-amber-400" />
                  Challenges & Learnings
                </h2>
                <div className="glass rounded-xl p-5">
                  <ul className="space-y-3">
                    {project.challenges.map((challenge, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-gray-400"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {challenge}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* Architecture */}
            {project.architecture && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-8"
              >
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                  <Layers size={18} className="text-violet-400" />
                  Architecture
                </h2>
                <div className="glass rounded-xl p-5">
                  <p className="text-sm leading-relaxed text-gray-400">
                    {project.architecture}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tech Stack */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass mb-6 rounded-xl p-5"
            >
              <h3 className="mb-4 text-sm font-semibold text-white">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-gray-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Tags */}
            {project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass mb-6 rounded-xl p-5"
              >
                <h3 className="mb-4 text-sm font-semibold text-white">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-xl p-5"
            >
              <h3 className="mb-4 text-sm font-semibold text-white">
                Project Info
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="text-gray-300 capitalize">
                    {project.category.replace("-", " ")}
                  </span>
                </div>
                {project.githubData?.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Created</span>
                    <span className="text-gray-300">
                      {formatDate(project.githubData.created_at)}
                    </span>
                  </div>
                )}
                {project.githubData?.updated_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Updated</span>
                    <span className="text-gray-300">
                      {formatDate(project.githubData.updated_at)}
                    </span>
                  </div>
                )}
                {project.githubData?.stargazers_count !== undefined && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Stars</span>
                    <span className="text-gray-300">
                      ⭐ {project.githubData.stargazers_count}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Status</span>
                  <span
                    className="flex items-center gap-1.5"
                    style={{ color: statusColor }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: statusColor }}
                    />
                    {statusLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="mb-6 text-lg font-semibold text-white">
              Related Projects
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
