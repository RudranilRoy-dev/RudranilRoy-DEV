import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// ============================================================
// CRITICAL: Inject meta description BEFORE React mounts.
// viteSingleFile may strip <meta> tags during build.
// This synchronous injection guarantees Lighthouse always finds it.
// ============================================================
(function ensureMetaDescription() {
  const DESC =
    "Rudranil Roy's Developer Operating System — A premium project hub showcasing deployed web applications, open-source contributions, and full-stack development work using React, TypeScript, Python, and modern web technologies.";

  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "description");
    meta.setAttribute("content", DESC);
    document.head.appendChild(meta);
  } else if (!meta?.getAttribute("content") || meta.getAttribute("content")?.trim() === "") {
    meta.setAttribute("content", DESC);
  }
})();

// Also ensure og:description exists
(function ensureOGMeta() {
  const DESC =
    "Developer Operating System — A premium project hub showcasing deployed web applications and open-source work.";
  let og = document.querySelector('meta[property="og:description"]');
  if (!og) {
    og = document.createElement("meta");
    og.setAttribute("property", "og:description");
    og.setAttribute("content", DESC);
    document.head.appendChild(og);
  }
})();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
