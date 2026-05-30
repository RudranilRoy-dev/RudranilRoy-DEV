import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, ArrowUpRight } from "lucide-react";
import { cn, getLanguageColor, getStatusColor, getStatusLabel, timeAgo } from "@/lib/utils";
import type { ProjectCategory, DeploymentStatus } from "@/types";

interface EnrichedProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  featured: boolean;
  techStack: string[];
  tags: string[];
  deploymentStatus: DeploymentStatus;
  liveUrl?: string;
  features?: string[];
  challenges?: string[];
  architecture?: string;
  githubData?: {
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    created_at: string;
    updated_at: string;
    pushed_at: string;
    size: number;
    homepage: string | null;
  };
}

interface ProjectCardProps {
  project: EnrichedProject;
  index: number;
  viewMode?: "grid" | "list";
}

function StatusDot({ status }: { status: DeploymentStatus }) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "deployed" && "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
          status === "building" && "bg-yellow-500 animate-pulse",
          status === "offline" && "bg-red-500",
          status === "local" && "bg-gray-500"
        )}
      />
      <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: getStatusColor(status) }}>
        {getStatusLabel(status)}
      </span>
    </div>
  );
}

export function ProjectCard({ project, index, viewMode = "grid" }: ProjectCardProps) {
  const navigate = useNavigate();

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={() => navigate(`/projects/${project.slug}`)}
        className="card-hover glass group flex cursor-pointer items-center gap-4 rounded-xl p-4 sm:gap-6"
      >
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-xl">
          {project.category === "education" ? "📚" : project.category === "tool" ? "🔧" : "🌐"}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">
              {project.title}
            </h3>
            {project.featured && (
              <span className="shrink-0 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-400">
                Featured
              </span>
            )}
          </div>
          <p className="truncate text-xs text-gray-500">{project.description}</p>
        </div>

        {/* Tech */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Status */}
        <div className="hidden sm:block">
          <StatusDot status={project.deploymentStatus} />
        </div>

        {/* Arrow */}
        <ArrowUpRight
          size={16}
          className="shrink-0 text-gray-600 transition-colors group-hover:text-indigo-400"
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      onClick={() => navigate(`/projects/${project.slug}`)}
      className="card-hover glass group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl"
    >
      {/* Header Gradient */}
      <div
        className="relative h-32 overflow-hidden sm:h-36"
        style={{
          background: `linear-gradient(135deg, ${
            project.githubData?.language
              ? getLanguageColor(project.githubData.language) + "30"
              : "rgba(99, 102, 241, 0.15)"
          }, rgba(17, 17, 17, 0.9))`,
        }}
      >
        {/* Pattern overlay */}
        <div className="bg-grid absolute inset-0 opacity-30" />

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-indigo-500/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-lg">
            Featured
          </div>
        )}

        {/* Category icon */}
        <div className="absolute bottom-3 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-black/50 text-lg backdrop-blur-sm">
          {project.category === "education"
            ? "📚"
            : project.category === "tool"
            ? "🔧"
            : "🌐"}
        </div>

        {/* Live link */}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-lg bg-black/50 text-gray-300 backdrop-blur-sm transition-colors hover:text-white"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Title & Status */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white sm:text-base">
            {project.title}
          </h3>
          <StatusDot status={project.deploymentStatus} />
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-3 text-[10px] text-gray-600">
            {project.githubData?.language && (
              <span className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: getLanguageColor(
                      project.githubData.language
                    ),
                  }}
                />
                {project.githubData.language}
              </span>
            )}
            {project.githubData?.updated_at && (
              <span>{timeAgo(project.githubData.updated_at)}</span>
            )}
          </div>

          {project.githubData?.html_url && (
            <a
              href={project.githubData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] text-gray-500 transition-colors hover:text-indigo-400"
            >
              <GitBranch size={10} />
              Repo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export type { EnrichedProject };
