import { motion, useInView } from "framer-motion";
import { useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Layers,
  Zap,
  Terminal,
  ArrowRight,
  GitCommit,
  Rocket,
  Clock,
  Activity,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectCard, type EnrichedProject } from "./ProjectCard";

// ============================================================
// SECTION: Featured Projects
// ============================================================
export function FeaturedProjects({ projects }: { projects: EnrichedProject[] }) {
  const navigate = useNavigate();
  const featured = projects.filter((p) => p.featured);
  const display = featured.length > 0 ? featured : projects.slice(0, 3);

  return (
    <section aria-labelledby="featured-heading" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="featured-heading" badge="Featured" title="Featured Projects" description="Handpicked projects that showcase engineering excellence." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {display.slice(0, 6).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
        {projects.length > 6 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 flex justify-center">
            <button type="button" onClick={() => navigate("/projects")} aria-label="View all projects" title="View all projects"
              className="magnetic-btn group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-gray-300 transition-colors hover:bg-white/[0.06]">
              View All Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
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
export function AnalyticsDashboard({ user, projectCount }: { user: { public_repos: number; followers: number; following: number } | null; projectCount: number }) {
  const cards = [
    { label: "Total Repositories", value: user?.public_repos ?? 9, change: "Across all languages", icon: <Code2 size={18} />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { label: "Active Deployments", value: projectCount, change: "All operational", icon: <Rocket size={18} />, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "GitHub Followers", value: user?.followers ?? 1, change: "Growing network", icon: <Activity size={18} />, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Technologies Used", value: 10, change: "Diverse stack", icon: <Layers size={18} />, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <section aria-labelledby="analytics-heading" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="analytics-heading" badge="Dashboard" title="Development Analytics" description="Real-time overview of development activity and metrics." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {cards.map((card, i) => (
            <motion.div key={card.label}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", card.bg, card.color)} aria-hidden="true">{card.icon}</div>
              </div>
              <div className="mb-1 text-2xl font-bold text-white">{card.value}</div>
              <div className="text-xs text-gray-400">{card.label}</div>
              <div className="mt-2 text-[11px] text-gray-400">{card.change}</div>
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
  { name: "TypeScript", icon: "TS", proficiency: 90 },
  { name: "Python", icon: "PY", proficiency: 85 },
  { name: "C", icon: "C", proficiency: 75 },
  { name: "JavaScript", icon: "JS", proficiency: 90 },
  { name: "React", icon: "⚛", proficiency: 88 },
  { name: "Next.js", icon: "N", proficiency: 82 },
  { name: "Tailwind CSS", icon: "🎨", proficiency: 92 },
  { name: "Node.js", icon: "⬢", proficiency: 80 },
  { name: "Git", icon: "🔀", proficiency: 88 },
  { name: "Vercel", icon: "▲", proficiency: 85 },
  { name: "Shell", icon: "$", proficiency: 70 },
  { name: "Framer Motion", icon: "✨", proficiency: 78 },
];

export function TechStackSection() {
  return (
    <section aria-labelledby="stack-heading" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="stack-heading" badge="Stack" title="Tech Arsenal" description="Technologies and tools I work with on a daily basis." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 sm:gap-4">
          {techStack.map((tech, i) => (
            <motion.div key={tech.name}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.03 }}
              className="glass card-hover flex items-center gap-3 rounded-xl p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 font-mono text-sm font-bold text-indigo-400" aria-hidden="true">{tech.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">{tech.name}</div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"
                  role="progressbar" aria-label={`${tech.name} proficiency: ${tech.proficiency}%`} aria-valuenow={tech.proficiency} aria-valuemin={0} aria-valuemax={100}>
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${tech.proficiency}%` }} viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.05 }}
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
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
// SECTION: Activity Heatmap — plain DOM cells for perf, animated container
// ============================================================
export function ActivitySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const contributions = useMemo(() => {
    const data: number[][] = [];
    for (let w = 0; w < 52; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const rand = Math.random();
        week.push(rand > 0.7 ? Math.floor(Math.random() * 4) + 1 : rand > 0.4 ? 1 : 0);
      }
      data.push(week);
    }
    return data;
  }, []);

  const getColor = (level: number) => {
    switch (level) {
      case 0: return "bg-white/[0.03]";
      case 1: return "bg-indigo-500/30";
      case 2: return "bg-indigo-500/50";
      case 3: return "bg-indigo-500/70";
      default: return "bg-indigo-500/90";
    }
  };

  return (
    <section aria-labelledby="activity-heading" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader id="activity-heading" badge="Activity" title="Development Activity" description="Contribution heatmap and recent development activity." />
        <motion.div ref={ref}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass overflow-hidden rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-400"><GitCommit size={14} aria-hidden="true" /><span>Contribution Activity</span></div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400" aria-label="Contribution level: less to more">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((level) => (<div key={level} className={cn("h-2.5 w-2.5 rounded-[2px]", getColor(level))} />))}
              <span>More</span>
            </div>
          </div>
          <div className="overflow-x-auto" role="img" aria-label="GitHub-style contribution heatmap">
            {inView && (
              <div className="flex gap-[3px]" style={{ minWidth: "572px" }}>
                {contributions.map((week, w) => (
                  <div key={w} className="flex flex-col gap-[3px]">
                    {week.map((day, d) => (<div key={d} className={cn("h-[9px] w-[9px] rounded-[2px]", getColor(day))} />))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 border-t border-white/[0.06] pt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Clock size={12} aria-hidden="true" />Last updated recently</span>
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-amber-400" aria-hidden="true" />Most active: Weekdays</span>
            <span className="flex items-center gap-1.5"><Monitor size={12} aria-hidden="true" />Primary: Web Development</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================
// SECTION: Terminal — line-by-line reveal
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
    { prompt: false, text: `${projectCount} deployments ready ✓` },
    { prompt: true, text: "uptime" },
    { prompt: false, text: "Coding since 2024 — still going strong 🚀" },
  ];

  return (
    <section aria-labelledby="terminal-heading" className="relative px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <SectionHeader id="terminal-heading" badge="Terminal" title="Developer Terminal" description="A quick look at my development profile." />
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d0d0d]">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3" aria-hidden="true">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-xs text-gray-400">rudranil@dev-os ~ %</span>
          </div>
          <div className="p-4 font-mono text-xs sm:text-sm" role="presentation">
            {lines.map((line, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn("mb-1", line.prompt ? "text-indigo-400" : "text-gray-400")}>
                {line.prompt && <span className="mr-2 text-green-400" aria-hidden="true">❯</span>}
                {line.text}
              </motion.div>
            ))}
            <div className="mt-2 flex items-center text-green-400">
              <span className="mr-2" aria-hidden="true">❯</span>
              <span className="animate-pulse-cursor" aria-hidden="true">▊</span>
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
    <footer aria-label="Site footer" className="relative border-t border-white/[0.06] px-4 pb-24 pt-12 sm:pb-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20" aria-hidden="true">
              <Terminal size={14} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">DevOS</div>
              <div className="text-[11px] text-gray-400">by Rudranil Roy</div>
            </div>
          </div>
          <nav aria-label="Footer links" className="flex items-center gap-6 text-xs text-gray-400">
            <a href="https://github.com/RudranilRoy-dev" target="_blank" rel="noopener noreferrer"
              aria-label="Visit GitHub profile (opens in new tab)" className="transition-colors hover:text-white">GitHub</a>
            <a href="https://vercel.com/rudranilroy-devs-projects" target="_blank" rel="noopener noreferrer"
              aria-label="Visit Vercel deployments (opens in new tab)" className="transition-colors hover:text-white">Vercel</a>
            <span className="text-gray-400">rudranilroy.dpdns.org</span>
          </nav>
          <div className="text-[11px] text-gray-400">© {new Date().getFullYear()} Rudranil Roy. All rights reserved.</div>
        </div>
        <div className="mt-8 flex items-center justify-center gap-4 text-[11px] text-gray-400">
          <span>Built with React + TypeScript + Tailwind CSS</span>
          <span aria-hidden="true">·</span>
          <span>Deployed on Vercel</span>
          <span aria-hidden="true">·</span>
          <span>Open Source</span>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// SHARED: Section Header with scroll-triggered reveal
// ============================================================
function SectionHeader({ id, badge, title, description }: { id?: string; badge: string; title: string; description: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10 text-center">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
        <Zap size={10} aria-hidden="true" />{badge}
      </div>
      <h2 id={id} className="mb-2 text-2xl font-bold text-white sm:text-3xl">{title}</h2>
      <p className="mx-auto max-w-lg text-sm text-gray-400">{description}</p>
    </motion.div>
  );
}
