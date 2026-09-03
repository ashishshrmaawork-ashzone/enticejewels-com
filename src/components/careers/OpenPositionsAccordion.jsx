"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function OpenPositionsAccordion({ positions, onApply, labels }) {
  const [openId, setOpenId] = useState(positions[0]?.id ?? null);

  if (!positions.length) {
    return (
      <p className="text-ink-soft text-sm md:text-base leading-relaxed text-center">{labels.empty}</p>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-black/10">
      <div style={{ backgroundColor: "#553632" }} className="px-5 sm:px-6 py-3.5">
        <p className="text-[#fff1c1] text-xs uppercase tracking-[3px] font-semibold">{labels.table_title}</p>
      </div>

      <div className="divide-y divide-black/10 bg-white">
        {positions.map((role) => {
          const isOpen = openId === role.id;
          return (
            <div key={role.id}>
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : role.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-cream/60"
              >
                <span className="text-maroon text-base sm:text-lg font-semibold">{role.title}</span>
                <ChevronDown size={18} className={`flex-shrink-0 text-maroon transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-6 text-left">
                      <p className="text-sm text-ink mb-2">
                        <strong className="text-maroon">Experience:</strong> {role.experience}
                      </p>
                      <p className="text-sm text-ink-soft leading-relaxed mb-5">
                        <strong className="text-maroon">Description:</strong> {role.skills}
                      </p>
                      <button
                        type="button"
                        onClick={() => onApply(role.title)}
                        className="rounded-full bg-maroon px-6 py-2.5 text-xs font-semibold uppercase tracking-[2px] text-[#fff1c1] transition-opacity hover:opacity-90"
                      >
                        {labels.apply}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
