"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setIsLoading(false);
    } else {
      // Send welcome email quietly in the background
      await fetch("/api/auth/welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: fullName }),
      }).catch(err => console.error("Failed to trigger welcome email:", err));

      // Signup successful -> redirect to success screen
      router.push("/signup/success");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 selection:bg-secondary/20">
      <Link href="/" className="mb-12 group transition-all text-center">
        <h1 className="text-5xl font-serif font-black italic tracking-tighter text-primary group-hover:scale-[1.05] transition-transform duration-700">Digital Heroes</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
      </Link>

      <Card variant="low" className="w-full max-w-lg p-10 border-t-8 border-secondary relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-secondary/10">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none scale-150 rotate-12">
            <User className="h-64 w-64 text-secondary" strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-serif italic mb-2">Member Application</h2>
            <p className="text-xs uppercase font-bold tracking-widest text-primary/40">Secure enrollment for the Digital Heroes community</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-600 text-xs font-bold uppercase tracking-widest">
                {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                <User className="h-3 w-3" /> Nominee Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Michael Jordan"
                className="input-fairway w-full text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                <Mail className="h-3 w-3" /> Secure Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@digitalheroes.co.uk"
                className="input-fairway w-full text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                <Lock className="h-3 w-3" /> Security Passcode
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-fairway w-full text-lg font-bold"
              />
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full group py-6">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : "Initiate Membership"}
                {!isLoading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>

          <div className="mt-12 flex flex-col gap-6 items-center border-t border-primary/5 pt-10">
            <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-secondary transition-all">
                Already registered? <span className="text-primary border-b border-primary/10 hover:border-secondary">Enter the fairway</span>
            </Link>
            <Link href="/pricing" title="View Membership Tiers" className="text-[10px] font-bold uppercase tracking-widest text-primary/20 hover:text-primary transition-all">
                Protocol: Review Membership Plans
            </Link>
          </div>
        </div>
      </Card>

      <footer className="mt-20 opacity-30 text-[10px] font-bold uppercase tracking-[0.8em]">
        © 2026 Digital Heroes LP
      </footer>
    </div>
  );
}
