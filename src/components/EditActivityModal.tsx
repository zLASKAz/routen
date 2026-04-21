"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Activity, DayOfWeek, ALL_DAYS, DAY_SHORT_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { X, Save, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EditActivityModalProps {
  activity: Activity | null;
  open: boolean;
  onClose: () => void;
  onSave: (activity: Activity) => void;
  onDelete: (id: string) => void;
}

export default function EditActivityModal({
  activity,
  open,
  onClose,
  onSave,
  onDelete,
}: EditActivityModalProps) {
  const [name, setName] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [category, setCategory] = useState<Activity["category"]>("routine");
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setStartTime(activity.startTime);
      setDurationHours(Math.floor(activity.duration / 60));
      setDurationMinutes(activity.duration % 60);
      setCategory(activity.category);
      setSelectedDays([...activity.days]);
      setNotes(activity.notes || "");
    }
  }, [activity]);

  const toggleDay = (day: DayOfWeek) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!activity || !name.trim() || selectedDays.length === 0) return;
    onSave({
      ...activity,
      name: name.trim(),
      startTime,
      duration: durationHours * 60 + durationMinutes,
      category,
      days: selectedDays,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!activity) return;
    onDelete(activity.id);
    onClose();
  };

  const categories: { value: Activity["category"]; label: string }[] = [
    { value: "routine", label: "Routine" },
    { value: "work", label: "Work" },
    { value: "coding", label: "Coding" },
    { value: "exercise", label: "Exercise" },
    { value: "chinese", label: "Chinese" },
    { value: "free", label: "Free" },
    { value: "football", label: "Football" },
  ];

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-purple-500/20 bg-[#0f0a1a] p-5 pb-8"
              >
                {/* Handle bar */}
                <div className="flex justify-center mb-4">
                  <div className="w-10 h-1 rounded-full bg-purple-500/30" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-bold text-white">
                    Edit Activity
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-purple-300/60 hover:text-white transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </Dialog.Close>
                </div>

                {/* Name */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/15 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500/40 transition-colors"
                    placeholder="Activity name"
                  />
                </div>

                {/* Start Time */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500/40 transition-colors [color-scheme:dark]"
                  />
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Duration
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="flex items-center bg-white/5 border border-purple-500/15 rounded-xl px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={23}
                          value={durationHours}
                          onChange={(e) =>
                            setDurationHours(
                              Math.max(0, parseInt(e.target.value) || 0)
                            )
                          }
                          className="w-full bg-transparent text-sm text-white focus:outline-none"
                        />
                        <span className="text-xs text-purple-300/40 ml-1">
                          hrs
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center bg-white/5 border border-purple-500/15 rounded-xl px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          max={59}
                          value={durationMinutes}
                          onChange={(e) =>
                            setDurationMinutes(
                              Math.max(
                                0,
                                Math.min(59, parseInt(e.target.value) || 0)
                              )
                            )
                          }
                          className="w-full bg-transparent text-sm text-white focus:outline-none"
                        />
                        <span className="text-xs text-purple-300/40 ml-1">
                          min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Quick Note <span className="text-purple-500/40">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Add a reminder or note..."
                    className="w-full bg-white/5 border border-purple-500/15 rounded-xl px-4 py-3 text-sm text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-500/40 transition-colors resize-none"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                          category === cat.value
                            ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                            : "bg-white/5 text-purple-300/40 border border-transparent hover:border-purple-500/20"
                        )}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Days */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-purple-300/50 mb-1.5 block">
                    Days
                  </label>
                  <div className="flex gap-1.5">
                    {ALL_DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                          selectedDays.includes(day)
                            ? "bg-purple-600/30 text-purple-200 border border-purple-500/40"
                            : "bg-white/5 text-purple-400/30 border border-transparent"
                        )}
                      >
                        {DAY_SHORT_LABELS[day]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!name.trim() || selectedDays.length === 0}
                    className="flex-1 h-12 rounded-xl bg-purple-600/40 border border-purple-500/30 flex items-center justify-center gap-2 text-sm font-semibold text-white hover:bg-purple-600/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
