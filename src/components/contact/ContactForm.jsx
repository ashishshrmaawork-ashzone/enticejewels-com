"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (event) => {
    setSubmitted(false);
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setForm(initialForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-5 sm:p-8 md:p-10 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <label className="block text-xs uppercase tracking-wide text-ink-soft">
          Full Name <span aria-hidden="true">*</span>
          <input
            required
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
          name="message"
          value={form.message}
          onChange={updateField}
          rows={6}
          className="mt-2 w-full resize-y rounded-lg border border-black/15 bg-white px-4 py-3 text-sm normal-case tracking-normal text-ink outline-none transition-colors focus:border-maroon"
        />
      </label>

      <button
        type="submit"
        className="w-full sm:w-auto rounded-full bg-maroon px-8 py-3 text-xs font-semibold uppercase tracking-[2px] text-[#fff1c1] transition-opacity hover:opacity-90"
      >
        Send Message
      </button>

      {submitted && (
        <p role="status" className="flex items-center gap-2 text-sm text-maroon">
          <CheckCircle2 size={18} className="text-primary" /> Thank you. Your message has been recorded.
        </p>
      )}
    </form>
  );
}
