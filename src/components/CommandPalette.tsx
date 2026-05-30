import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FolderKanban,
  Home,
  ExternalLink,
  ArrowRight,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description: string;
  icon: ReactNode;
  action: () => void;
  category: string;
}

import type { ReactNode } from "react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: "home",
      label: "Go to Home",
      description: "Navigate to the dashboard",
      icon: <Home size={16} />,
      action: () => { navigate("/"); setOpen(false); },
      category: "Navigation",
    },
    {
      id: "projects",
      label: "Browse Projects",
      description: "View all projects",
      icon: <FolderKanban size={16} />,
      action: () => { navigate("/projects"); setOpen(false); },
      category: "Navigation",
    },
    {
      id: "github",
      label: "Open GitHub",
      description: "Visit GitHub profile",
      icon: <ExternalLink size={16} />,
      action: () => { window.open("https://github.com/RudranilRoy-dev", "_blank"); setOpen(false); },
      category: "External",
    },
    {
      id: "vercel",
      label: "Open Vercel",
      description: "Visit Vercel deployments",
      icon: <ExternalLink size={16} />,
      action: () => { window.open("https://vercel.com/rudranilroy-devs-projects", "_blank"); setOpen(false); },
      category: "External",
    },
  ];

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        setQuery("");
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleItemKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[selectedIndex]?.action();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-[20%] z-[201] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4">
              <Search size={16} className="shrink-0 text-gray-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleItemKeyDown}
                placeholder="Type a command or search..."
                className="h-12 w-full bg-transparent text-sm text-white placeholder-gray-500 outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:block">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  No results found
                </div>
              ) : (
                filtered.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      i === selectedIndex
                        ? "bg-indigo-500/10 text-white"
                        : "text-gray-400 hover:bg-white/[0.03]"
                    }`}
                  >
                    <span
                      className={`shrink-0 ${
                        i === selectedIndex ? "text-indigo-400" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-medium">{item.label}</div>
                      <div className="truncate text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                    {i === selectedIndex && (
                      <ArrowRight size={14} className="shrink-0 text-indigo-400" />
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2 text-[10px] text-gray-600">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1 py-0.5 font-mono">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1 py-0.5 font-mono">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 bg-white/[0.03] px-1 py-0.5 font-mono">esc</kbd>
                close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
