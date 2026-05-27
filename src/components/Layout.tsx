import { useState, useEffect, useCallback, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  FolderKanban,
  ExternalLink,
  Terminal,
  ChevronRight,
  Menu,
  X,
  Command,
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

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const current = window.scrollY;
      setProgress(totalHeight > 0 ? (current / totalHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX: progress / 100,
        background: "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
      }}
    />
  );
}

export function Sidebar({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const currentPath = location.pathname + location.hash;

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-white/[0.06] bg-black/80 backdrop-blur-xl transition-all duration-300 lg:flex",
          collapsed ? "w-16" : "w-56"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/[0.06] px-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 overflow-hidden"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Terminal size={16} />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-sm font-semibold"
                >
                  DevOS
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-3">
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
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                    "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
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
                key={item.label}
                onClick={() => navigate(item.href.replace("#", ""))}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
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
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-6 w-[2px] rounded-r bg-indigo-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center border-t border-white/[0.06] p-3 text-gray-500 transition-colors hover:text-white"
        >
          <ChevronRight
            size={16}
            className={cn("transition-transform", collapsed ? "" : "rotate-180")}
          />
        </button>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b border-white/[0.06] bg-black/80 px-4 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20">
            <Terminal size={14} className="text-indigo-400" />
          </div>
          <span className="text-sm font-semibold">DevOS</span>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const event = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              window.dispatchEvent(event);
            }}
            className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs text-gray-400"
          >
            <Command size={12} />
            <span>K</span>
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-14 bottom-0 w-64 border-l border-white/[0.06] bg-[#0a0a0a] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1">
                {navItems.map((item) => {
                  if (item.href.startsWith("http")) {
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    );
                  }
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.href.replace("#", ""));
                        setMobileOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-gray-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen flex-1 transition-all duration-300",
          collapsed ? "lg:ml-16" : "lg:ml-56",
          "pt-14 lg:pt-0"
        )}
      >
        {children}
      </main>

      {/* Mobile Bottom Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/[0.06] bg-black/90 px-2 py-2 backdrop-blur-xl lg:hidden">
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
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-gray-500 transition-colors"
              >
                {item.icon}
                <span className="text-[10px]">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.href.replace("#", ""))}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors",
                isActive ? "text-indigo-400" : "text-gray-500"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-indicator"
                  className="absolute -top-2 h-[2px] w-8 rounded-b bg-indigo-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 500);
    };
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
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/80 text-gray-400 backdrop-blur-xl transition-colors hover:text-white lg:bottom-6"
        >
          <ArrowUp size={16} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
