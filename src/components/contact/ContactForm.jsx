"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { getContactCaptcha, submitContactEnquiry } from "@/lib/api";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

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
    let active = true;
    getContactCaptcha()
      .then((challenge) => { if (active) setCaptcha(challenge); })
      .catch((captchaError) => { if (active) setError(captchaError.message); });
    return () => { active = false; };
  }, []);

  const updateField = (event) => {
    setSubmitted(false);
    setError("");
    const value = event.target.name === "phone" ? event.target.value.replace(/\D/g, "").slice(0, 10) : event.target.value;
    setForm((current) => ({ ...current, [event.target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!captcha) throw new Error("Captcha is still loading. Please try again.");
      const response = await submitContactEnquiry({
        ...form,
        captcha_token: captcha.token,
        captcha_answer: captchaAnswer,
      });
      setSuccessMessage(response.message || "Thank you. Your message has been received.");
      setSubmitted(true);
      setForm(initialForm);
      await refreshCaptcha();
    } catch (requestError) {
      setSubmitted(false);
      setError(requestError.message);
      await refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-5 sm:p-8 md:p-10 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Full Name <span aria-hidden="true">*</span>
          <input
            required
            minLength={2}
            maxLength={100}
            name="name"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Email Address <span aria-hidden="true">*</span>
          <input
            required
            type="email"
            maxLength={191}
            name="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Phone Number
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]{10}"
            minLength={10}
            maxLength={10}
            title="Enter a valid 10-digit phone number"
            name="phone"
            value={form.phone}
            onChange={updateField}
            autoComplete="tel"
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Subject
          <input
            name="subject"
            value={form.subject}
            onChange={updateField}
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
      </div>

      <label className="block text-xs uppercase tracking-wide text-ink-soft">
        Message <span aria-hidden="true">*</span>
        <textarea
          required
          minLength={10}
          maxLength={5000}
          name="message"
          value={form.message}
          onChange={updateField}
          rows={6}
          className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
        />
      </label>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Enter CAPTCHA code: <strong>{captcha?.question || "Loading…"}</strong> <span aria-hidden="true">*</span>
          <input
            required
            type="text"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength={4}
            value={captchaAnswer}
            onChange={(event) => { setCaptchaAnswer(event.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
            disabled={!captcha || submitting}
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon disabled:opacity-60"
          />
        </label>
        <button type="button" onClick={refreshCaptcha} disabled={submitting} className="button flex items-center justify-center gap-2 rounded-lg border border-maroon/25 px-4 py-3 text-xs uppercase tracking-wide text-maroon disabled:opacity-60">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <button
        type="submit"
        disabled={submitting || !captcha}
        className="w-full sm:w-auto rounded-full bg-maroon px-8 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#fff1c1] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>

      {submitted && (
        <p role="status" className="flex items-center gap-2 text-sm text-maroon">
          <CheckCircle2 size={18} className="text-primary" /> {successMessage}
        </p>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
