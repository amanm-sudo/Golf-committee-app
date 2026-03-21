"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 selection:bg-secondary/20">
      <Link href="/" className="mb-12 group transition-all text-center">
        <h1 className="text-5xl font-serif font-black italic tracking-tighter text-primary group-hover:scale-[1.05] transition-transform duration-700">Digital Heroes</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
      </Link>

      <Card variant="low" className="w-full max-w-md p-10 border-t-8 border-primary relative overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none scale-150 rotate-12">
            <ShieldCheck className="h-48 w-48 text-primary" strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="mb-10">
            <h2 className="text-3xl font-serif italic mb-2">Member Entrance</h2>
            <p className="text-xs uppercase font-bold tracking-widest text-primary/40">Secure access to your scorecard & impact profile</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-600 text-xs font-bold uppercase tracking-widest">
                {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="charity@digitalheroes.co.uk"
                className="input-fairway w-full text-lg font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40 flex items-center gap-2">
                <Lock className="h-3 w-3" /> Secure Password
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
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-3" /> : "Verify Identity"}
                {!isLoading && <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </div>
          </form>

          <div className="mt-12 flex flex-col gap-6 items-center border-t border-primary/5 pt-10">
            <Link href="/signup" className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-secondary transition-all">
                New to the fairway? <span className="text-primary border-b border-primary/10 hover:border-secondary">Apply for membership</span>
            </Link>
            <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-bold uppercase tracking-widest text-primary/20 hover:text-primary transition-all">
                Protocol: Forgot Passcode
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
