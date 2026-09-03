"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { getContactCaptcha, submitCareerApplication } from "@/lib/api";

// The backend has no dedicated careers/résumé-upload endpoint, so applications
// route through the same captcha-protected contact-enquiry API as the Contact
// page (designation + résumé filename folded into the enquiry subject/message).
// A file can't actually be attached over that JSON API, so choosing one also
// surfaces a mailto link — one click opens the applicant's email client,
// pre-addressed, so they can attach the same file there.
const initialForm = { firstName: "", lastName: "", phone: "", email: "", position: "", message: "" };

export default function CareerApplicationForm({ positions = [], selectedPosition = "", content }) {
  const labels = content.labels;
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
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

  const updateFile = (event) => {
    const file = event.target.files?.[0] || null;
    const extension = file?.name.split(".").pop()?.toLowerCase();
    if (file && !["pdf", "doc", "docx"].includes(extension)) {
      setFileError("Please upload your resume in PDF, DOC or DOCX format only.");
      setResumeFile(null);
      event.target.value = "";
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      setFileError("Resume file size must not exceed 10 MB.");
      setResumeFile(null);
      event.target.value = "";
      return;
    }
    setFileError("");
    setResumeFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (!captcha) throw new Error("Captcha is still loading. Please try again.");
      if (!resumeFile) throw new Error("Please upload your resume in PDF, DOC or DOCX format.");
      const payload = new FormData();
      payload.append("name", `${form.firstName} ${form.lastName}`.trim()); payload.append("email", form.email); payload.append("phone", form.phone); payload.append("job_title", form.position || selectedPosition || "General Application"); payload.append("message", form.message); payload.append("captcha_token", captcha.token); payload.append("captcha_answer", captchaAnswer); payload.append("website", ""); payload.append("resume", resumeFile);
      const response = await submitCareerApplication(payload);
      setSuccessMessage(response.message || content.success);
      setSubmitted(true);
      setForm(initialForm);
      setResumeFile(null);
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
    <form onSubmit={handleSubmit} className="space-y-5 bg-cream/50 border border-black/5 rounded-2xl p-5 sm:p-7 md:p-8">
      <label className="block text-xs uppercase tracking-wide text-ink-soft">
        {labels.designation}
        <select
          name="position"
          value={form.position || selectedPosition}
          onChange={updateField}
          className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
        >
          <option value="">{labels.designation}</option>
          {positions.map((role) => (
            <option key={role.id} value={role.title}>{role.title}</option>
          ))}
          <option value="General Application">{labels.general}</option>
        </select>
      </label>

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          {labels.first_name} <span aria-hidden="true">*</span>
          <input
            required
            minLength={2}
            maxLength={60}
            name="firstName"
            value={form.firstName}
            onChange={updateField}
            autoComplete="given-name"
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          {labels.last_name} <span aria-hidden="true">*</span>
          <input
            required
            minLength={2}
            maxLength={60}
            name="lastName"
            value={form.lastName}
            onChange={updateField}
            autoComplete="family-name"
            className="mt-2 w-full rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
          />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          {labels.phone} <span aria-hidden="true">*</span>
          <input
            required
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
          {labels.email} <span aria-hidden="true">*</span>
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

      <label className="block text-xs uppercase tracking-wide text-ink-soft">
        {labels.message}
        <textarea
          name="message"
          maxLength={5000}
          value={form.message}
          onChange={updateField}
          rows={5}
          className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
        />
      </label>

      <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          {labels.captcha}: <strong>{captcha?.question || "Loading…"}</strong> <span aria-hidden="true">*</span>
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
          <RefreshCw size={15} /> {labels.refresh}
        </button>
      </div>

      <div>
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <label className="flex items-center gap-3 rounded-lg border border-black/15 bg-white px-4 py-3 text-sm text-ink-soft cursor-pointer">
            <span className="flex-shrink-0 rounded bg-cream px-3 py-1.5 text-xs uppercase tracking-wide text-maroon font-semibold">{labels.upload}</span>
            <span className="truncate">{resumeFile?.name || labels.no_file}</span>
            <input required type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={updateFile} className="hidden" />
          </label>
          <button
            type="submit"
            disabled={submitting || !captcha}
            className="rounded-lg bg-maroon px-8 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#fff1c1] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? labels.sending : labels.submit}
          </button>
        </div>
        <p className="mt-2 text-xs italic text-ink-soft">*{labels.resume_help}</p>
        {fileError && <p className="mt-1 text-xs text-red-700">{fileError}</p>}
      </div>

      {submitted && (
        <p role="status" className="flex items-center gap-2 text-sm text-maroon">
          <CheckCircle2 size={18} className="text-primary" /> {successMessage}
        </p>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form>
  );
}
