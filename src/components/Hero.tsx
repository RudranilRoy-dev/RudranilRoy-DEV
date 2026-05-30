import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Terminal,
  ChevronDown,
  FolderKanban,
  Globe,
  GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { GitHubUser } from "@/types";

interface HeroProps {
  user: GitHubUser | null;
  projectCount: number;
}

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 125;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref} aria-live="polite">{count}</span>;
}

const roles = [
  "Full-Stack Developer",
  "System Programmer",
  "Open-Source Contributor",
  "Creative Engineer",
];

export function Hero({ user, projectCount }: HeroProps) {
  const navigate = useNavigate();
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(currentRole.slice(0, text.length + 1));
        if (text.length === currentRole.length) setTimeout(() => setIsDeleting(true), 2000);
      } else {
        setText(currentRole.slice(0, text.length - 1));
        if (text.length === 0) { setIsDeleting(false); setRoleIndex((prev) => (prev + 1) % roles.length); }
      }
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex]);

  const stats = [
    { label: "Projects", value: projectCount, icon: <FolderKanban size={16} /> },
    { label: "Deployments", value: projectCount, icon: <Globe size={16} /> },
    { label: "Repositories", value: user?.public_repos ?? 9, icon: <GitBranch size={16} /> },
  ];

  return (
    <section aria-label="Hero introduction" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 lg:min-h-[90vh] lg:py-0">
      {/* Glow orbs with gentle animation */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[100px] animate-float" aria-hidden="true" style={{ animationDelay: "0s" }} />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px] animate-float" aria-hidden="true" style={{ animationDelay: "2s" }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 blur-[60px] animate-float" aria-hidden="true" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400"
        >
          <Terminal size={14} className="text-indigo-400" aria-hidden="true" />
          <span className="font-mono text-xs">v1.0.0</span>
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
          <span className="text-xs">All systems operational</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="block text-white">Rudranil Roy</span>
        </motion.h1>

        {/* Typing role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 flex h-10 items-center justify-center text-lg text-gray-400 sm:text-xl md:text-2xl"
          role="status" aria-live="polite" aria-label={`Current role: ${text || roles[roleIndex]}`}
        >
          <span className="mr-2 text-indigo-400" aria-hidden="true">›</span>
          <span className="font-mono">
            {text}
            <span className="animate-pulse-cursor text-indigo-400" aria-hidden="true">|</span>
          </span>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          Welcome to my{" "}
          <span className="text-gradient font-semibold">Developer Operating System</span>
          {" "}&mdash; a centralized hub showcasing my projects, deployments,
          and development activity. Built with precision. Designed to inspire.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={() => navigate("/projects")}
            aria-label="Explore all projects"
            title="Explore all projects"
            className="magnetic-btn group flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-400"
          >
            Explore Projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <a
            href="https://github.com/RudranilRoy-dev"
            target="_blank" rel="noopener noreferrer"
            aria-label="View Rudranil Roy's GitHub profile (opens in new tab)"
            className="magnetic-btn flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/[0.06]"
          >
            <GitBranch size={16} aria-hidden="true" />
            View GitHub
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}
              className="glass rounded-xl p-4 sm:p-6"
            >
              <div className="mb-2 flex items-center justify-center text-indigo-400" aria-hidden="true">{stat.icon}</div>
              <div className="text-2xl font-bold text-white sm:text-3xl"><AnimatedCounter target={stat.value} /></div>
              <div className="mt-1 text-xs text-gray-400 sm:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2 text-gray-500" aria-hidden="true"
        >
          <span className="text-xs">Scroll to explore</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
