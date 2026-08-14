"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

export default function CallingRequestModal({ open, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const dialogRef = useRef(null);
  const titleId = useId();

  const handleClose = useCallback(() => {
    onClose();
    // reset after the close animation finishes so it doesn't flash on reopen
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "" });
    }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    const onKeyDown = (event) => event.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center px-4"
          onClick={handleClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[calc(100svh-2rem)] overflow-y-auto p-6 sm:p-8 md:p-10"
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-ink-soft hover:text-maroon transition-colors"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <p className="text-primary text-xs uppercase tracking-[3px] mb-2">Entice Jewels</p>
                <h2 id={titleId} className="font-heading text-maroon text-2xl md:text-3xl mb-2">
                  Calling Request
                </h2>
                <p className="text-ink-soft text-sm leading-relaxed mb-6">
                  Share your details and our team will call you back to assist with
                  your purchase.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    aria-label="Your name"
                    autoComplete="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />
                  <input
                    aria-label="Phone number"
                    autoComplete="tel"
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />
                  <input
                    aria-label="Email address"
                    autoComplete="email"
                    type="email"
                    placeholder="Email (optional)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-xs uppercase tracking-[2px] font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
                  >
                    Submit Request
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={44} className="text-primary mx-auto mb-4" />
                <h2 className="font-heading text-maroon text-2xl md:text-3xl mb-3">
                  Thank You!
                </h2>
                <p className="text-ink-soft text-sm leading-relaxed mb-6">
                  Your calling request has been recorded. Our team will contact you
                  shortly.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 border border-maroon text-maroon text-xs uppercase tracking-[2px] px-7 py-3 rounded-full hover:bg-maroon hover:text-white transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
