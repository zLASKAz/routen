"use client";

import { motion } from "framer-motion";
import { Battery, Cloud, Headphones } from "lucide-react";

export default function SundayRecharge() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      {/* Floating icons */}
      <div className="relative w-32 h-32 mb-8">
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-violet-500/10 border border-purple-500/15 flex items-center justify-center">
            <Battery className="w-9 h-9 text-violet-400/80" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-0 left-0"
        >
          <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/10 flex items-center justify-center">
            <Cloud className="w-5 h-5 text-purple-400/50" />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-2 right-0"
        >
          <div className="w-12 h-12 rounded-full bg-purple-600/10 border border-purple-500/10 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-purple-400/50" />
          </div>
        </motion.div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Recharge Mode</h2>
      <p className="text-purple-300/50 text-sm max-w-[260px] leading-relaxed">
        No tasks today. Rest, recover, and prepare for the week ahead.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 px-6 py-4 rounded-2xl bg-white/[0.03] border border-purple-500/10"
      >
        <p className="text-xs text-purple-400/40 uppercase tracking-wider mb-1">
          Today&apos;s motto
        </p>
        <p className="text-sm text-purple-200/60 italic">
          &quot;Rest is not idleness. It&apos;s preparation for greatness.&quot;
        </p>
      </motion.div>
    </motion.div>
  );
}
