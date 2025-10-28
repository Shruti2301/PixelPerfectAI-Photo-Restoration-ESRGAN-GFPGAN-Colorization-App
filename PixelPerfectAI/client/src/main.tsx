// main.tsx
// =============================================================
// Application Entry Point
// -------------------------------------------------------------
// Initializes the React application and mounts the root <App /> 
// component to the DOM.
// =============================================================
// Author: Shruti Mandaokar
// Date: October 2025

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// NOTE: We no longer need to import AuthProvider here, as all
// application providers are now centrally managed and correctly
// ordered within App.tsx (QueryClientProvider wraps AuthProvider).

/**
 * Ensures the root element exists before creating the React root.
 * The `!` is a non-null assertion operator, common in Vite/React templates.
 */
createRoot(document.getElementById("root")!).render(
  // The AuthProvider wrapper has been removed here.
  // The wrapping will now happen correctly inside App.tsx, 
  // nested within the QueryClientProvider, resolving potential 
  // context initialization issues with useAuth.
  <App />
);