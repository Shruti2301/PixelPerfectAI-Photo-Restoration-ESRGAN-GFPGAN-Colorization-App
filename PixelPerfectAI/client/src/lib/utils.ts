// client/src/lib/cn.ts
// =============================================================
// Utility: cn
// -------------------------------------------------------------
// Combines multiple class names into a single string and merges
// Tailwind CSS classes intelligently, avoiding conflicts.
//
// Dependencies:
//   - clsx: handles conditional class names and arrays
//   - tailwind-merge: merges Tailwind utility classes, resolving conflicts
//
// Usage Example:
//   cn("p-4", isActive && "bg-blue-500", "text-white")
// =============================================================
// Author: Shruti Mandaokar
// Date: October 2025

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines and merges class names intelligently.
 * * It serves as a centralized utility for managing class names in React components, 
 * ensuring clean and conflict-free application of styles, particularly with Tailwind CSS.
 * * - Accepts multiple class values (strings, arrays, objects with conditionals) via `clsx`.
 * - Resolves conflicting Tailwind classes (e.g., `p-2 p-4` → `p-4`) using `tailwind-merge`.
 *
 * @param inputs - List of class names or conditional class objects that conform to `ClassValue` type.
 * @returns A single merged class string ready to use in the `className` prop of a React element.
 */
export function cn(...inputs: ClassValue[]) {
  // 1. `clsx(inputs)`: Processes the inputs (handling conditional logic, arrays, etc.) 
  //    to produce a clean, simple string of all active classes.
  // 2. `twMerge(...)`: Takes the resulting string from `clsx` and intelligently merges 
  //    Tailwind CSS classes, ensuring that utility classes are not duplicated and 
  //    conflicting properties (like padding or color) are correctly overridden by the last defined class.
  return twMerge(clsx(inputs))
}