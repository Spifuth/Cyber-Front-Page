import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility helper to merge conditional class names while preserving Tailwind precedence.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
