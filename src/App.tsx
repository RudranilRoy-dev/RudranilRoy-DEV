import { lazy, Suspense, useState, useCallback, useEffect } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Sidebar, ScrollProgress, BackToTop } from "@/components/Layout";
import { CommandPalette } from "@/components/CommandPalette";
import { AnimatedGrid, FloatingParticles } from "@/components/AnimatedBackground";

const Home = lazy(() => import("@/pages/Home"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500/30" />
        </div>
        <span className="font-mono text-[11px] text-gray-400">Loading...</span>
      </div>
    </div>
  );
}

/**
 * Ensure meta description exists in the document head.
 * viteSingleFile or minification may strip it from index.html at build time,
 * so we inject it at runtime to guarantee Lighthouse always finds it.
 */
function useMetaDescription() {
  useEffect(() => {
    const DESC = "Rudranil Roy's Developer Operating System — A premium project hub showcasing deployed web applications, open-source contributions, and full-stack development work using React, TypeScript, Python, and modern web technologies.";
    let el = document.querySelector('meta[name="description"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute("name", "description");
      el.setAttribute("content", DESC);
      document.head.appendChild(el);
    } else if (!el.getAttribute("content")) {
      el.setAttribute("content", DESC);
    }
  }, []);
}

/**
 * Vercel's preview toolbar and Cloudflare's challenge platform
 * inject iframes without titles. This observer auto-fixes them
 * so Lighthouse doesn't flag "iframe elements do not have a title".
 */
function useIframeTitleFix() {
  useEffect(() => {
    const TITLE = "External content frame";

    const fixExisting = () => {
      document.querySelectorAll("iframe:not([title])").forEach((iframe) => {
        iframe.setAttribute("title", TITLE);
      });
    };

    // Fix any already-present iframes
    fixExisting();

    // Watch for dynamically injected iframes
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLIFrameElement && !node.getAttribute("title")) {
            node.setAttribute("title", TITLE);
          }
          if (node instanceof HTMLElement) {
            node.querySelectorAll("iframe:not([title])").forEach((iframe) => {
              iframe.setAttribute("title", TITLE);
            });
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  // Ensure meta description and iframe titles are always present
  useMetaDescription();
  useIframeTitleFix();

  // Listen for Ctrl+K from Layout's command button
  useEffect(() => {
    const handler = () => setPaletteOpen(true);
    window.addEventListener("open-command-palette", handler);
    return () => window.removeEventListener("open-command-palette", handler);
  }, []);

  return (
    <HashRouter>
      <div className="relative min-h-screen bg-black text-white">
        <AnimatedGrid />
        <FloatingParticles />
        <ScrollProgress />
        <CommandPalette open={paletteOpen} onClose={closePalette} />
        <Sidebar onCommandPalette={openPalette}>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
            </Routes>
          </Suspense>
        </Sidebar>
        <BackToTop />
      </div>
    </HashRouter>
  );
}
