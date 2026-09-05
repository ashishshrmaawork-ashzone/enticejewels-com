"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Mail, ShoppingBag, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { forgotCustomerPassword } from "@/lib/api";

const inputClass = "w-full rounded-none border border-maroon/15 bg-white px-4 py-3.5 text-sm text-ink outline-none transition placeholder:text-ink-soft/60 focus:border-primary focus:ring-1 focus:ring-primary/20";

export default function AccountPage() {
  const { user, ready, login, register, logout } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const changeMode = (nextMode) => { setMode(nextMode); setMessage(""); };
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (mode === "forgot") { const data = await forgotCustomerPassword(form.email); setMessage(data.message); }
      else { await (mode === "register" ? register(form) : login(form)); router.push("/cart"); }
    } catch (error) { setMessage(error.message); }
    finally { setBusy(false); }
  };

  if (!ready) return <main className="min-h-[40vh]" aria-busy="true" />;

  if (user) return (
    <main className="pb-16 md:pb-24 min-h-[45vh]">
      <section className="container mx-auto max-w-3xl px-5 sm:px-6 md:px-8">
        <div className="border border-maroon/10 bg-cream p-6 sm:p-8 md:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-white text-primary"><UserRound size={28} strokeWidth={1.5} /></div>
            <div><p className="mb-1 text-[10px] uppercase tracking-[3px] text-primary">Welcome back</p><h2 className="font-heading text-2xl text-maroon sm:text-3xl">{user.name}</h2><p className="mt-1 flex items-center gap-2 text-sm text-ink-soft"><Mail size={14} />{user.email}</p></div>
          </div>
          <div className="my-8 h-px bg-maroon/10" />
          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => router.push("/cart")} className="flex items-center justify-center gap-2 bg-maroon px-5 py-3.5 text-xs uppercase tracking-[1.5px] text-white transition-colors hover:bg-maroon-light"><ShoppingBag size={16} /> My Cart</button>
            <button onClick={() => router.push("/wishlist")} className="flex items-center justify-center gap-2 border border-maroon/20 bg-white px-5 py-3.5 text-xs uppercase tracking-[1.5px] text-maroon transition-colors hover:border-primary hover:text-primary"><Heart size={16} /> My Wishlist</button>
          </div>
          <button onClick={logout} className="mx-auto mt-7 flex items-center gap-2 text-xs uppercase tracking-[1.5px] text-ink-soft transition-colors hover:text-maroon"><LogOut size={15} /> Sign out</button>
        </div>
      </section>
    </main>
  );

  const title = mode === "register" ? "Create Account" : mode === "forgot" ? "Reset Password" : "Customer Login";
  const intro = mode === "register" ? "Create an account to keep your favourites and cart close at hand." : mode === "forgot" ? "Enter your email and we’ll send you password reset instructions." : "Sign in to view your saved pieces and continue your journey.";

  return (
    <main className="pb-16 md:pb-24 min-h-[45vh]">
      <section className="container mx-auto max-w-lg px-5 sm:px-6 md:px-8">
        <div className="border border-maroon/10 bg-cream p-6 sm:p-8 md:p-10">
          <div className="text-center"><p className="text-[10px] uppercase tracking-[3px] text-primary">Entice Jewels</p><h2 className="mt-3 font-heading text-3xl text-maroon md:text-4xl">{title}</h2><p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">{intro}</p></div>
          <form onSubmit={submit} className="mt-8 space-y-4">
            {mode === "register" && <input required minLength={2} aria-label="Full name" placeholder="Full Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />}
            <input required type="email" aria-label="Email address" placeholder="Email Address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={inputClass} />
            {mode !== "forgot" && <input required minLength={8} type="password" aria-label="Password" placeholder="Password (minimum 8 characters)" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className={inputClass} />}
            <button disabled={busy} className="w-full bg-maroon py-3.5 text-xs uppercase tracking-[2px] text-white transition-colors hover:bg-maroon-light disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Please wait…" : mode === "register" ? "Create Account" : mode === "forgot" ? "Send Reset Email" : "Sign In"}</button>
            {message && <p role="status" className="border-l-2 border-primary bg-white px-4 py-3 text-sm text-ink-soft">{message}</p>}
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 text-xs">
            <button onClick={() => changeMode(mode === "login" ? "register" : "login")} className="text-maroon underline decoration-primary/50 underline-offset-4 hover:text-primary">{mode === "login" ? "Create an account" : "Back to sign in"}</button>
            {mode === "login" && <button onClick={() => changeMode("forgot")} className="text-maroon underline decoration-primary/50 underline-offset-4 hover:text-primary">Forgot password?</button>}
          </div>
        </div>
      </section>
    </main>
  );
}
