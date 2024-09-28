import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Channel } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFormattedTime(timestamp: Date) {
  const hours = timestamp.getUTCHours().toString().padStart(2, "0");
  const minutes = timestamp.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function updatedAtComparator(channelA: Channel, channelB: Channel) {
  if (channelA.updatedAt < channelB.updatedAt) return 1;
  if (channelA.updatedAt > channelB.updatedAt) return -1;
  return 0;
}
