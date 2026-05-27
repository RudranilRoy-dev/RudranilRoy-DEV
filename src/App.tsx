import { lazy, Suspense } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { Sidebar, ScrollProgress, BackToTop } from "@/components/Layout";
import { CommandPalette } from "@/components/CommandPalette";
import { AnimatedGrid, FloatingParticles } from "@/components/AnimatedBackground";

// Lazy load pages for code splitting
const Home = lazy(() => import("@/pages/Home"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30" />
        </div>
        <span className="font-mono text-[10px] text-gray-600">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <div className="relative min-h-screen bg-black text-white">
        {/* Background layers */}
        <AnimatedGrid />
        <FloatingParticles />

        {/* Scroll progress */}
        <ScrollProgress />

        {/* Command palette */}
        <CommandPalette />

        {/* Main layout with sidebar */}
        <Sidebar>
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </Sidebar>

        {/* Back to top button */}
        <BackToTop />

        {/* Vercel Web Analytics */}
        <Analytics />
      </div>
    </HashRouter>
  );
}
