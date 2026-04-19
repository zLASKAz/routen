import { Activity, DayOfWeek } from "./types";

let idCounter = 0;
function genId(): string {
  return `activity-${++idCounter}`;
}

const monThu: DayOfWeek[] = ["monday", "tuesday", "wednesday", "thursday"];

export const DEFAULT_ACTIVITIES: Activity[] = [
  // Mon-Thu schedule
  {
    id: genId(),
    name: "Wake Up",
    startTime: "08:30",
    duration: 30,
    category: "routine",
    icon: "Sunrise",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Work",
    startTime: "09:00",
    duration: 540, // 9h
    category: "work",
    icon: "Briefcase",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Travel Home",
    startTime: "18:00",
    duration: 60,
    category: "routine",
    icon: "Car",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Coding",
    startTime: "19:00",
    duration: 60,
    category: "coding",
    icon: "Code",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Exercise",
    startTime: "20:00",
    duration: 60,
    category: "exercise",
    icon: "Dumbbell",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Chinese Study",
    startTime: "21:00",
    duration: 60,
    category: "chinese",
    icon: "BookOpen",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Relax / Wind Down",
    startTime: "22:00",
    duration: 120,
    category: "free",
    icon: "Coffee",
    days: monThu,
    done: false,
  },
  {
    id: genId(),
    name: "Sleep",
    startTime: "00:00",
    duration: 0,
    category: "routine",
    icon: "Moon",
    days: monThu,
    done: false,
  },

  // Friday schedule
  {
    id: genId(),
    name: "Wake Up",
    startTime: "08:30",
    duration: 30,
    category: "routine",
    icon: "Sunrise",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Work",
    startTime: "09:00",
    duration: 480,
    category: "work",
    icon: "Briefcase",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Football Session",
    startTime: "17:00",
    duration: 120,
    category: "football",
    icon: "Trophy",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Home",
    startTime: "19:00",
    duration: 60,
    category: "routine",
    icon: "Home",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Coding",
    startTime: "20:00",
    duration: 60,
    category: "coding",
    icon: "Code",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Chinese Review",
    startTime: "21:00",
    duration: 60,
    category: "chinese",
    icon: "BookOpen",
    days: ["friday"],
    done: false,
  },
  {
    id: genId(),
    name: "Relax",
    startTime: "22:00",
    duration: 0,
    category: "free",
    icon: "Coffee",
    days: ["friday"],
    done: false,
  },

  // Saturday schedule
  {
    id: genId(),
    name: "Wake Up",
    startTime: "09:30",
    duration: 0,
    category: "routine",
    icon: "Sunrise",
    days: ["saturday"],
    done: false,
  },
  {
    id: genId(),
    name: "Chores / Laundry",
    startTime: "09:30",
    duration: 210, // until 13:00
    category: "routine",
    icon: "Shirt",
    days: ["saturday"],
    done: false,
  },
  {
    id: genId(),
    name: "Coding",
    startTime: "13:00",
    duration: 60,
    category: "coding",
    icon: "Code",
    days: ["saturday"],
    done: false,
  },
  {
    id: genId(),
    name: "Chinese Study",
    startTime: "14:00",
    duration: 60,
    category: "chinese",
    icon: "BookOpen",
    days: ["saturday"],
    done: false,
  },
  {
    id: genId(),
    name: "Exercise (Backup)",
    startTime: "15:00",
    duration: 60,
    category: "exercise",
    icon: "Dumbbell",
    days: ["saturday"],
    done: false,
  },
  {
    id: genId(),
    name: "Free Time",
    startTime: "17:00",
    duration: 0,
    category: "free",
    icon: "Sparkles",
    days: ["saturday"],
    done: false,
  },

  // Sunday - no mandatory tasks, just recharge
  {
    id: genId(),
    name: "Recharge Day 🌿",
    startTime: "09:00",
    duration: 0,
    category: "free",
    icon: "Battery",
    days: ["sunday"],
    done: false,
  },
];

export function getActivitiesForDay(
  activities: Activity[],
  day: DayOfWeek
): Activity[] {
  return activities
    .filter((a) => a.days.includes(day))
    .sort((a, b) => {
      const timeA = a.startTime === "00:00" ? "24:00" : a.startTime;
      const timeB = b.startTime === "00:00" ? "24:00" : b.startTime;
      return timeA.localeCompare(timeB);
    });
}
