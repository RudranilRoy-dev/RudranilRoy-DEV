import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  FolderKanban,
  ExternalLink,
  Terminal,
  ChevronRight,
  Menu,
  X,
  ArrowUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const navItems: NavItem[] = [
  { label: "Home", href: "#/", icon: <Home size={18} /> },
  { label: "Projects", href: "#/projects", icon: <FolderKanban size={18} /> },
  { label: "GitHub", href: "https://github.com/RudranilRoy-dev", icon: <ExternalLink size={18} /> },
];

/* Direct DOM scroll progress — zero React re-renders */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!barRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px]"
      style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)" }}
    >
      <div ref={barRef} className="h-full origin-left" style={{ transform: "scaleX(0)", background: "inherit" }} />
    </div>
  );
}

export function Sidebar({
  children,
  onCommandPalette,
}: {
  children: ReactNode;
  onCommandPalette?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname + location.hash;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-white/[0.06] bg-black/80 backdrop-blur-xl transition-[width] duration-300 lg:flex",
          collapsed ? "w-16" : "w-56"
        )}
      >
        <div className="flex h-16 items-center border-b border-white/[0.06] px-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to home page"
            title="Go to home page"
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400" aria-hidden="true">
              <Terminal size={16} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-semibold text-white"
                >
                  DevOS
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Primary">
          {navItems.map((item) => {
            const isActive =
              item.href === currentPath ||
              (item.href === "#/" && currentPath === "/") ||
              (item.href === "#/" && location.hash === "#/");

            if (item.href.startsWith("http")) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.label} (opens in new tab)`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="shrink-0" aria-hidden="true">{item.icon}</span>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </a>
              );
            }

            return (
              <button
                type="button"
                key={item.label}
                onClick={() => navigate(item.href.replace("#", ""))}
                aria-label={`Navigate to ${item.label}`}
                title={`Navigate to ${item.label}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive ? "bg-indigo-500/10 text-indigo-400" : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                {isActive && <motion.div layoutId="sidebar-indicator" className="absolute left-0 h-6 w-[2px] rounded-r bg-indigo-500" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
                <span className="shrink-0" aria-hidden="true">{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center justify-center border-t border-white/[0.06] p-3 text-gray-400 transition-colors hover:text-white"
        >
          <ChevronRight size={16} className={cn("transition-transform", collapsed ? "" : "rotate-180")} aria-hidden="true" />
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-black/80 backdrop-blur-xl px-4 lg:hidden">
        <button type="button" onClick={() => navigate("/")} aria-label="Go to home page" title="Go to home page" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20" aria-hidden="true">
            <Terminal size={14} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold text-white">DevOS</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCommandPalette}
            aria-label="Open command palette"
            title="Open command palette (Ctrl+K)"
            className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-gray-400"
          >
            <span aria-hidden="true">⌘</span><span>K</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            title={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            role="dialog" aria-label="Mobile navigation menu"
          >
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-14 bottom-0 w-64 border-l border-white/[0.06] bg-[#0a0a0a] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1" aria-label="Mobile navigation">
                {navItems.map((item) => {
                  if (item.href.startsWith("http")) {
                    return (
                      <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                        aria-label={`Visit ${item.label} (opens in new tab)`}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                        {item.icon}{item.label}
                      </a>
                    );
                  }
                  return (
                    <button type="button" key={item.label}
                      onClick={() => { navigate(item.href.replace("#", "")); setMobileOpen(false); }}
                      aria-label={`Navigate to ${item.label}`}
                      title={`Navigate to ${item.label}`}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white">
                      {item.icon}{item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main id="main-content" className={cn(
        "min-h-screen flex-1 transition-[margin] duration-300",
        collapsed ? "lg:ml-16" : "lg:ml-56",
        "pt-14 lg:pt-0"
      )}>
        {children}
      </main>

      {/* Mobile Bottom Dock */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/[0.06] bg-black/90 backdrop-blur-xl px-2 py-2 lg:hidden"
        aria-label="Mobile navigation dock">
        {navItems.map((item) => {
          const isActive = item.href === currentPath || (item.href === "#/" && currentPath === "/") || (item.href === "#/" && location.hash === "#/");
          if (item.href.startsWith("http")) {
            return (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                aria-label={`Visit ${item.label}`}
                className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 text-gray-400 transition-colors">
                <span aria-hidden="true">{item.icon}</span>
                <span className="text-[10px]">{item.label}</span>
              </a>
            );
          }
          return (
            <button type="button" key={item.label}
              onClick={() => navigate(item.href.replace("#", ""))}
              aria-label={`Navigate to ${item.label}`}
              title={`Navigate to ${item.label}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors",
                isActive ? "text-indigo-400" : "text-gray-400"
              )}>
              {isActive && <motion.div layoutId="dock-indicator" className="absolute -top-2 h-[2px] w-8 rounded-b bg-indigo-500" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              <span aria-hidden="true">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop} aria-label="Scroll back to top" title="Scroll to top"
          className="fixed bottom-20 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-lg text-gray-400 transition-colors hover:text-white lg:bottom-6"
        >
          <ArrowUp size={16} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
