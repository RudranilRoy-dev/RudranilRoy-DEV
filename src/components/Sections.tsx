import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Layers,
  Zap,
  Monitor,
  Terminal,
  ArrowRight,
  GitCommit,
  Rocket,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectCard, type EnrichedProject } from "./ProjectCard";

// ============================================================
// SECTION: Featured Projects
// ============================================================
interface FeaturedProjectsProps {
  projects: EnrichedProject[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const navigate = useNavigate();
  const featured = projects.filter((p) => p.featured);
  const display = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Featured"
          title="Featured Projects"
          description="Handpicked projects that showcase engineering excellence."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {display.slice(0, 6).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {projects.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex justify-center"
          >
            <button
              onClick={() => navigate("/projects")}
              className="magnetic-btn group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-gray-300 transition-all hover:bg-white/[0.06]"
            >
              View All Projects
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Analytics Dashboard
// ============================================================
interface AnalyticsProps {
  user: { public_repos: number; followers: number; following: number } | null;
}

export function AnalyticsDashboard({ user }: AnalyticsProps) {
  const cards = [
    {
      label: "Total Repositories",
      value: user?.public_repos ?? 8,
      change: "Across all languages",
      icon: <Code2 size={18} />,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Active Deployments",
      value: 4,
      change: "All operational ✓",
      icon: <Rocket size={18} />,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      label: "GitHub Followers",
      value: user?.followers ?? 1,
      change: "Growing network",
      icon: <Activity size={18} />,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "Technologies Used",
      value: 10,
      change: "Diverse stack",
      icon: <Layers size={18} />,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Dashboard"
          title="Development Analytics"
          description="Real-time overview of development activity and metrics."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", card.bg, card.color)}>
                  {card.icon}
                </div>
              </div>
              <div className="mb-1 text-2xl font-bold text-white">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
              <div className="mt-2 text-[10px] text-gray-600">{card.change}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Tech Stack
// ============================================================
const techStack = [
  { name: "TypeScript", category: "language", icon: "TS", proficiency: 90 },
  { name: "Python", category: "language", icon: "PY", proficiency: 85 },
  { name: "C", category: "language", icon: "C", proficiency: 75 },
  { name: "JavaScript", category: "language", icon: "JS", proficiency: 90 },
  { name: "React", category: "framework", icon: "⚛", proficiency: 88 },
  { name: "Next.js", category: "framework", icon: "N", proficiency: 82 },
  { name: "Tailwind CSS", category: "tool", icon: "🎨", proficiency: 92 },
  { name: "Node.js", category: "platform", icon: "⬢", proficiency: 80 },
  { name: "Git", category: "tool", icon: "🔀", proficiency: 88 },
  { name: "Vercel", category: "platform", icon: "▲", proficiency: 85 },
  { name: "Shell", category: "language", icon: "$", proficiency: 70 },
  { name: "Framer Motion", category: "tool", icon: "✨", proficiency: 78 },
];

export function TechStackSection() {
  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Stack"
          title="Tech Arsenal"
          description="Technologies and tools I work with on a daily basis."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              className="glass card-hover flex items-center gap-3 rounded-xl p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 font-mono text-sm font-bold text-indigo-400">
                {tech.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">
                  {tech.name}
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tech.proficiency}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Activity / Contribution Heatmap
// ============================================================
export function ActivitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  // Generate fake contribution data
  const weeks = 52;
  const days = 7;
  const contributions: number[][] = [];

  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      if (rand > 0.7) week.push(Math.floor(Math.random() * 4) + 1);
      else if (rand > 0.4) week.push(1);
      else week.push(0);
    }
    contributions.push(week);
  }

  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-white/[0.03]";
      case 1:
        return "bg-indigo-500/30";
      case 2:
        return "bg-indigo-500/50";
      case 3:
        return "bg-indigo-500/70";
      default:
        return "bg-indigo-500/90";
    }
  };

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Activity"
          title="Development Activity"
          description="Contribution heatmap and recent development activity."
        />

        {/* Heatmap */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass overflow-hidden rounded-2xl p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <GitCommit size={14} />
              <span>Contribution Activity</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-600">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn("h-2.5 w-2.5 rounded-[2px]", getColor(level))}
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex gap-[3px]" style={{ minWidth: `${weeks * 11}px` }}>
              {contributions.map((week, w) => (
                <div key={w} className="flex flex-col gap-[3px]">
                  {week.map((day, d) => (
                    <motion.div
                      key={d}
                      initial={{ opacity: 0 }}
                      animate={inView ? { opacity: 1 } : {}}
                      transition={{ delay: w * 0.01 + d * 0.005 }}
                      className={cn(
                        "h-[9px] w-[9px] rounded-[2px] transition-colors",
                        getColor(day)
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 flex flex-wrap gap-6 border-t border-white/[0.06] pt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Last updated recently
            </span>
            <span className="flex items-center gap-1.5">
              <Zap size={12} className="text-amber-400" />
              Most active: Weekdays
            </span>
            <span className="flex items-center gap-1.5">
              <Monitor size={12} />
              Primary: Web Development
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Terminal / Recent Activity
// ============================================================
export function TerminalSection({ projectCount }: { projectCount: number }) {
  const lines = [
    { prompt: true, text: "whoami" },
    { prompt: false, text: "rudranil-roy" },
    { prompt: true, text: "cat skills.json | jq '.primary[]'" },
    { prompt: false, text: '["TypeScript", "Python", "C", "React"]' },
    { prompt: true, text: "gh repo list --limit 10 | wc -l" },
    { prompt: false, text: String(projectCount) },
    { prompt: true, text: "echo $CURRENT_FOCUS" },
    { prompt: false, text: '"Full-Stack Development & System Programming"' },
    { prompt: true, text: "vercel ls --scope rudranilroy-devs-projects 2>/dev/null | grep Ready" },
    { prompt: false, text: "4 deployments ready ✓" },
    { prompt: true, text: "uptime" },
    { prompt: false, text: "Coding since 2024 — still going strong 🚀" },
  ];

  return (
    <section className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader
          badge="Terminal"
          title="Developer Terminal"
          description="A quick look at my development profile."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d]"
        >
          {/* Terminal header */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-xs text-gray-600">
              rudranil@dev-os ~ %
            </span>
          </div>

          {/* Terminal body */}
          <div className="p-4 font-mono text-xs sm:text-sm">
            {lines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "mb-1",
                  line.prompt ? "text-indigo-400" : "text-gray-400"
                )}
              >
                {line.prompt && (
                  <span className="mr-2 text-green-400">❯</span>
                )}
                {line.text}
              </motion.div>
            ))}
            <div className="mt-2 flex items-center text-green-400">
              <span className="mr-2">❯</span>
              <span className="animate-pulse">▊</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Footer
// ============================================================
export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] px-4 pb-24 pt-12 sm:pb-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20">
              <Terminal size={14} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">DevOS</div>
              <div className="text-[10px] text-gray-600">
                by Rudranil Roy
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a
              href="https://github.com/RudranilRoy-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://vercel.com/rudranilroy-devs-projects"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              Vercel
            </a>
            <span className="text-gray-700">rudranilroy.dpdns.org</span>
          </div>

          {/* Copyright */}
          <div className="text-[10px] text-gray-700">
            © {new Date().getFullYear()} Rudranil Roy. All rights reserved.
          </div>
        </div>

        {/* Powered by */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[10px] text-gray-700">
          <span>Built with React + TypeScript + Tailwind CSS</span>
          <span>·</span>
          <span>Deployed on Vercel</span>
          <span>·</span>
          <span>Open Source</span>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// SHARED: Section Header
// ============================================================
function SectionHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 text-center"
    >
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
        <Zap size={10} />
        {badge}
      </div>
      <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <p className="mx-auto max-w-lg text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}
