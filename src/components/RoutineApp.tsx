"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Activity, DayOfWeek, DAY_LABELS } from "@/lib/types";
import { DEFAULT_ACTIVITIES, getActivitiesForDay } from "@/lib/schedule";
import { getCurrentDay } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNotifications } from "@/hooks/useNotifications";
import DaySelector from "@/components/DaySelector";
import ActivityCard from "@/components/ActivityCard";
import EditActivityModal from "@/components/EditActivityModal";
import SundayRecharge from "@/components/SundayRecharge";
import TimeProgress from "@/components/TimeProgress";
import WeeklyStats, { getWeekKey } from "@/components/WeeklyStats";
import CategoryFilter from "@/components/CategoryFilter";
import MorningSummary from "@/components/MorningSummary";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Plus, BarChart2 } from "lucide-react";

function getTodayKey(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${date}`;
}

function getMorningDismissKey(): string {
  return `routn-morning-dismissed-${getTodayKey()}`;
}

export default function RoutineApp() {
  const currentDay = getCurrentDay();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(currentDay);
  const [activities, setActivities, activitiesLoaded] = useLocalStorage<
    Activity[]
  >("routn-activities", DEFAULT_ACTIVITIES);
  const [doneMap, setDoneMap, doneLoaded] = useLocalStorage<
    Record<string, boolean>
  >(`routn-done-${getTodayKey()}`, {});
  const [editActivity, setEditActivity] = useState<Activity | null>(null);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [showAddHint, setShowAddHint] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<Activity["category"] | "all">("all");
  const [morningSummaryDismissed, setMorningSummaryDismissed] = useState(
    () => typeof window !== "undefined" && !!sessionStorage.getItem(getMorningDismissKey())
  );

  const { requestPermission } = useNotifications(
    activities.map((a) => ({
      ...a,
      done: doneMap[a.id] || false,
    })),
    currentDay
  );

  useEffect(() => {
    if ("Notification" in window) {
      setNotifEnabled(Notification.permission === "granted");
    }
  }, []);

  // Morning summary: show between 06:00–10:00 when today is selected
  const showMorningSummary = useMemo(() => {
    const currentHour = new Date().getHours();
    return (
      currentHour >= 6 &&
      currentHour < 10 &&
      selectedDay === currentDay &&
      !morningSummaryDismissed
    );
  }, [selectedDay, currentDay, morningSummaryDismissed]);

  const handleToggleNotifications = async () => {
    if (notifEnabled) {
      setNotifEnabled(false);
      return;
    }
    const granted = await requestPermission();
    setNotifEnabled(granted);
  };

  // Reset category filter when day changes
  const handleSelectDay = useCallback(
    (day: DayOfWeek) => {
      setSelectedDay(day);
      setCategoryFilter("all");
    },
    []
  );

  const todayActivities = useMemo(
    () =>
      getActivitiesForDay(activities, selectedDay).map((a) => ({
        ...a,
        done: doneMap[a.id] || false,
      })),
    [activities, selectedDay, doneMap]
  );

  const filteredActivities = useMemo(
    () =>
      categoryFilter === "all"
        ? todayActivities
        : todayActivities.filter((a) => a.category === categoryFilter),
    [todayActivities, categoryFilter]
  );

  const availableCategories = useMemo(
    () => [...new Set(todayActivities.map((a) => a.category))],
    [todayActivities]
  );

  const completedCount = todayActivities.filter((a) => a.done).length;

  const handleToggleDone = useCallback(
    (id: string) => {
      setDoneMap((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    },
    [setDoneMap]
  );

  // Update weekly stats in localStorage when doneMap changes
  useEffect(() => {
    if (!doneLoaded) return;
    try {
      const weekKey = getWeekKey();
      const raw = localStorage.getItem(weekKey);
      const weekData: Partial<Record<DayOfWeek, { total: number; done: number }>> = raw
        ? JSON.parse(raw)
        : {};
      const dayLabel = selectedDay;
      const dayActivities = getActivitiesForDay(activities, selectedDay);
      weekData[dayLabel] = {
        total: dayActivities.length,
        done: dayActivities.filter((a) => doneMap[a.id]).length,
      };
      localStorage.setItem(weekKey, JSON.stringify(weekData));
    } catch {
      // ignore storage errors
    }
  }, [doneMap, doneLoaded, activities, selectedDay]);

  const handleSaveActivity = useCallback(
    (updated: Activity) => {
      setActivities((prev) =>
        prev.map((a) => (a.id === updated.id ? updated : a))
      );
    },
    [setActivities]
  );

  const handleDeleteActivity = useCallback(
    (id: string) => {
      setActivities((prev) => prev.filter((a) => a.id !== id));
    },
    [setActivities]
  );

  const handleAddActivity = useCallback(() => {
    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      name: "New Activity",
      startTime: "12:00",
      duration: 60,
      category: "routine",
      icon: "Circle",
      days: [selectedDay],
      done: false,
    };
    setActivities((prev) => [...prev, newActivity]);
    setEditActivity(newActivity);
  }, [selectedDay, setActivities]);

  const handleDismissMorningSummary = useCallback(() => {
    sessionStorage.setItem(getMorningDismissKey(), "1");
    setMorningSummaryDismissed(true);
  }, []);

  const isSunday = selectedDay === "sunday";

  if (!activitiesLoaded || !doneLoaded) {
    return (
      <div className="min-h-screen bg-[#090510] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090510] text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-600/[0.05] rounded-full blur-[100px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md mx-auto pb-24">
        {/* Header */}
        <header className="px-4 pt-12 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Routn
                <span className="text-violet-400">_</span>
              </h1>
              <p className="text-xs text-purple-300/40 mt-0.5">
                {DAY_LABELS[selectedDay]}
                {selectedDay === currentDay ? " · Today" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowStats((v) => !v)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-purple-500/10 flex items-center justify-center text-purple-300/50 hover:text-purple-200 transition-colors"
                title="Weekly stats"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleNotifications}
                className="w-10 h-10 rounded-xl bg-white/5 border border-purple-500/10 flex items-center justify-center text-purple-300/50 hover:text-purple-200 transition-colors"
                title={
                  notifEnabled ? "Notifications on" : "Enable notifications"
                }
              >
                {notifEnabled ? (
                  <Bell className="w-4.5 h-4.5" />
                ) : (
                  <BellOff className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Day selector */}
        <DaySelector
          currentDay={currentDay}
          selectedDay={selectedDay}
          onSelectDay={handleSelectDay}
        />

        {/* Weekly stats panel */}
        {!isSunday && <WeeklyStats show={showStats} />}

        {/* Progress bar */}
        {selectedDay === currentDay && !isSunday && <TimeProgress />}

        {/* Category filter */}
        {!isSunday && (
          <CategoryFilter
            activeFilter={categoryFilter}
            onFilter={setCategoryFilter}
            availableCategories={availableCategories}
          />
        )}

        {/* Stats */}
        {!isSunday && todayActivities.length > 0 && (
          <div className="px-4 py-2 flex items-center gap-2">
            <span className="text-xs text-purple-300/40">
              {completedCount}/{todayActivities.length} completed
            </span>
            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-violet-500/50 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (completedCount / todayActivities.length) * 100
                  }%`,
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        {/* Morning summary */}
        <AnimatePresence>
          {showMorningSummary && !isSunday && (
            <MorningSummary
              activities={todayActivities}
              onDismiss={handleDismissMorningSummary}
            />
          )}
        </AnimatePresence>

        {/* Timeline / Activities */}
        <div className="px-4 pt-2">
          <AnimatePresence mode="wait">
            {isSunday ? (
              <motion.div
                key="sunday"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SundayRecharge />
              </motion.div>
            ) : (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {todayActivities.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-purple-300/30 text-sm">
                      No activities for this day
                    </p>
                  </div>
                ) : filteredActivities.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-purple-300/30 text-sm">
                      No activities in this category
                    </p>
                  </div>
                ) : (
                  filteredActivities.map((activity, index) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      index={index}
                      onToggleDone={handleToggleDone}
                      onEdit={setEditActivity}
                      isSunday={isSunday}
                    />
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB - Add Activity */}
      {!isSunday && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          onClick={handleAddActivity}
          onMouseEnter={() => setShowAddHint(true)}
          onMouseLeave={() => setShowAddHint(false)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center justify-center text-white z-20 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Edit Modal */}
      <EditActivityModal
        activity={editActivity}
        open={editActivity !== null}
        onClose={() => setEditActivity(null)}
        onSave={handleSaveActivity}
        onDelete={handleDeleteActivity}
      />
    </div>
  );
}
