"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2, RefreshCw } from "lucide-react";
import { getContactCaptcha, submitCallingRequest } from "@/lib/api";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function CallingRequestModal({ open, onClose, source = "product", items = [], onSuccess }) {
  const settings = useSiteSettings();
  const text = settings.calling_request_form || {};
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [captcha, setCaptcha] = useState(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [requestResult, setRequestResult] = useState(null);
  const dialogRef = useRef(null);
  const titleId = useId();

  const handleClose = useCallback(() => {
    onClose();
    // reset after the close animation finishes so it doesn't flash on reopen
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", phone: "", email: "" });
      setCaptchaAnswer("");
      setError("");
      setRequestResult(null);
    }, 300);
  }, [onClose]);

  const refreshCaptcha = useCallback(async () => {
    setCaptcha(null);
    setCaptchaAnswer("");
    try {
      setCaptcha(await getContactCaptcha());
    } catch (captchaError) {
      setError(captchaError.message);
    }
  }, []);

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

  useEffect(() => {
    if (!open) return undefined;
    let active = true;
    getContactCaptcha()
      .then((challenge) => { if (active) setCaptcha(challenge); })
      .catch((captchaError) => { if (active) setError(captchaError.message); });
    return () => { active = false; };
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!captcha) throw new Error("Captcha is still loading. Please try again.");
      const response = await submitCallingRequest({
        ...form,
        source,
        items: items.map((item) => ({
          ...item,
          href: item.href ? new URL(item.href, window.location.origin).href : window.location.href,
        })),
        page_url: window.location.href,
        captcha_token: captcha.token,
        captcha_answer: captchaAnswer,
      });
      setSuccessMessage(response.message || "Your calling request has been received.");
      setRequestResult({ id: response.id, status: response.status || "pending" });
      setSubmitted(true);
      onSuccess?.(response);
    } catch (requestError) {
      setError(requestError.message);
      await refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
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
                <p className="text-primary text-xs uppercase tracking-[3px] mb-2">{text.eyebrow || "Entice Jewels"}</p>
                <h2 id={titleId} className="font-heading text-maroon text-2xl md:text-3xl mb-2">
                  {text.title || "Calling Request"}
                </h2>
                <p className="text-ink-soft text-sm leading-relaxed mb-6">
                  {text.description || "Share your details and our team will call you back to assist with your purchase."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    aria-label="Your name"
                    autoComplete="name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    placeholder={text.name_placeholder || "Your Name"}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />
                  <input
                    aria-label="Phone number"
                    autoComplete="tel"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    minLength={10}
                    maxLength={10}
                    title="Enter a valid 10-digit phone number"
                    placeholder={text.phone_placeholder || "Phone Number"}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />
                  <input
                    aria-label="Email address"
                    autoComplete="email"
                    type="email"
                    required
                    maxLength={191}
                    placeholder={text.email_placeholder || "Email"}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-maroon transition-colors"
                  />

                  <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
                    <label className="text-xs uppercase tracking-wide text-ink-soft">
                      {text.captcha_label || "CAPTCHA"}: <strong>{captcha?.question || "Loading…"}</strong>
                      <input
                        aria-label="Four digit captcha"
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{4}"
                        maxLength={4}
                        value={captchaAnswer}
                        onChange={(e) => { setCaptchaAnswer(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                        disabled={!captcha || submitting}
                        className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm normal-case tracking-normal focus:outline-none focus:border-maroon transition-colors disabled:opacity-60"
                      />
                    </label>
                    <button type="button" onClick={refreshCaptcha} disabled={submitting} aria-label="Refresh captcha" className="border border-black/15 rounded-lg p-3 text-maroon disabled:opacity-60"><RefreshCw size={18} /></button>
                  </div>

                  {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting || !captcha || !items.length}
                    className="w-full py-3 rounded-lg text-xs uppercase tracking-[2px] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style={{ backgroundColor: "#553632", color: "#FFF1C1" }}
                  >
                    {submitting ? (text.submitting_label || "Submitting…") : (text.submit_label || "Submit Request")}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle2 size={44} className="text-primary mx-auto mb-4" />
                <h2 className="font-heading text-maroon text-2xl md:text-3xl mb-3">
                  {text.thank_you_title || "Thank You!"}
                </h2>
                <p className="text-ink-soft text-sm leading-relaxed mb-6">
                  {successMessage}
                </p>
                {requestResult && (
                  <p className="text-sm text-ink-soft mb-6">
                    Request #{requestResult.id} &middot; Status: <strong className="capitalize">{requestResult.status}</strong>
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 border border-maroon text-maroon text-xs uppercase tracking-[2px] px-7 py-3 rounded-full hover:bg-maroon hover:text-white transition-colors duration-300"
                >
                  {text.close_label || "Close"}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
