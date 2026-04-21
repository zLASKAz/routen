export type DayOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface Activity {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  duration: number; // in minutes, 0 means point-in-time event
  category: "work" | "coding" | "exercise" | "chinese" | "routine" | "free" | "football";
  icon: string; // lucide icon name
  days: DayOfWeek[];
  done: boolean;
  notes?: string;
}

export interface DaySchedule {
  day: DayOfWeek;
  label: string;
  activities: Activity[];
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

export const ALL_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const CATEGORY_COLORS: Record<Activity["category"], string> = {
  work: "#F59E0B",
  coding: "#BB86FC",
  exercise: "#10B981",
  chinese: "#EF4444",
  routine: "#6B7280",
  free: "#3B82F6",
  football: "#22D3EE",
};
