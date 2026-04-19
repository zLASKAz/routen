"use client";

import { useEffect, useRef, useCallback } from "react";
import { Activity, DayOfWeek } from "@/lib/types";
import { getActivitiesForDay } from "@/lib/schedule";
import { timeToMinutes, getCurrentTimeMinutes } from "@/lib/utils";

export function useNotifications(
  activities: Activity[],
  currentDay: DayOfWeek
) {
  const notifiedRef = useRef<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    const result = await Notification.requestPermission();
    return result === "granted";
  }, []);

  const sendNotification = useCallback(
    (title: string, body: string, tag: string) => {
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      // Try service worker notification first for PWA
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "SHOW_NOTIFICATION",
          title,
          body,
          tag,
        });
      } else {
        new Notification(title, {
          body,
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-192x192.png",
          tag,
        });
      }
    },
    []
  );

  useEffect(() => {
    if (currentDay === "sunday") return; // No notifications on Sunday

    const checkNotifications = () => {
      const now = getCurrentTimeMinutes();
      const todayActivities = getActivitiesForDay(activities, currentDay);

      todayActivities.forEach((activity) => {
        if (activity.done) return;

        const start = timeToMinutes(activity.startTime);
        const warningTime = start - 5;

        const warningKey = `warning-${activity.id}-${currentDay}`;
        const startKey = `start-${activity.id}-${currentDay}`;

        // 5 minutes before warning
        if (
          now >= warningTime &&
          now < start &&
          !notifiedRef.current.has(warningKey)
        ) {
          notifiedRef.current.add(warningKey);
          sendNotification(
            "⚡ Coming Up!",
            `${activity.name} starts in 5 minutes`,
            warningKey
          );
        }

        // At start time
        if (
          now >= start &&
          now < start + 1 &&
          !notifiedRef.current.has(startKey)
        ) {
          notifiedRef.current.add(startKey);
          sendNotification(
            "🚀 Time to Go!",
            `${activity.name} is starting now`,
            startKey
          );
        }
      });
    };

    checkNotifications();
    intervalRef.current = setInterval(checkNotifications, 30000); // Check every 30s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activities, currentDay, sendNotification]);

  // Reset notifications at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        notifiedRef.current.clear();
      }
    };

    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  return { requestPermission };
}
