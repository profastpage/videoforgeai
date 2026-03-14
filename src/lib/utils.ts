import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(isoDate: string) {
  const diffInMs = Date.now() - new Date(isoDate).getTime();
  const diffInHours = Math.round(diffInMs / 1000 / 60 / 60);

  if (diffInHours <= 1) {
    return "Just now";
  }

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}
