"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Check, Shield, Star, Award, Zap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Pricing() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const router = useRouter();

  const plans = [
    {
      title: "Monthly Heritage",
      id: "monthly",
      planEnvId: process.env.NEXT_PUBLIC_RAZORPAY_MONTHLY_PLAN_ID,
      priceBefore: "₹14.99",
      price: "₹9.99",
      period: "month",
      features: [
        "Verified Score Entry (up to 5)",
        "Monthly Jackpot Pool Entry",
        "Charity Impact Tracking",
        "Razorpay Customer Portal Access",
        "Community Choice Voting Rights",
      ],
      icon: Award,
    },
    {
      title: "Annual Legacy",
      id: "yearly",
      planEnvId: process.env.NEXT_PUBLIC_RAZORPAY_YEARLY_PLAN_ID,
      priceBefore: "₹179.88",
      price: "₹99.99",
      period: "year",
      features: [
        "All Monthly Heritage Features",
        "2 Months Complimentary Membership",
        "Priority Winner Verification",
        "Access to Quarterly Legacy Draws",
        "Exclusive Digital Hero Badge",
      ],
      icon: Star,
      popular: true,
    },
  ];

  async function handleSubscribe(planId: string, planTitle: string) {
    setLoadingPlan(planId);

    // 1. Check user is logged in by trying to create subscription
    const res = await fetch("/api/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });

    if (res.status === 401) {
      // Not logged in — redirect to signup with plan pre-selected
      router.push(`/signup?plan=${planId}`);
      setLoadingPlan(null);
      return;
    }

    if (!res.ok) {
      const text = await res.text();
      alert("Error: " + text);
      setLoadingPlan(null);
      return;
    }

    const { subscriptionId } = await res.json();

    // 2. Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay. Please check your connection.");
      setLoadingPlan(null);
      return;
    }

    // 3. Open Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id: subscriptionId,
      name: "Digital Heroes",
      description: `${planTitle} Membership`,
      image: "/favicon.ico",
      callback_url: `${window.location.origin}/dashboard?subscribed=true`,
      prefill: {},
      notes: {},
      theme: {
        color: "#012d1d",
      },
      handler: function () {
        router.push("/dashboard?subscribed=true");
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      alert("Payment failed: " + response.error.description);
    });
    rzp.open();
    setLoadingPlan(null);
  }

  return (
    <main className="min-h-screen bg-background text-primary selection:bg-secondary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 px-12 py-6 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-secondary">Premium Philanthropy</p>
        </Link>
        <div className="flex gap-4">
          <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-all mt-3 px-4">Login</Link>
          <Button size="sm" asChild>
            <Link href="/signup">Join the Fairway</Link>
          </Button>
        </div>
      </nav>

      {/* Pricing Header */}
      <section className="pt-60 pb-20 px-12 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none scale-150 rotate-12">
          <Zap className="h-96 w-96 text-primary" strokeWidth={1} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4 italic">Commitment Levels</p>
          <h1 className="text-7xl font-serif font-black italic tracking-tighter mb-8 text-primary">
            Precision Membership. <br /><span className="text-secondary">Measured Impact.</span>
          </h1>
          <p className="text-xl text-primary/60 font-sans max-w-2xl mx-auto mb-20 leading-relaxed">
            Choose the membership protocol that aligns with your competitive spirit and philanthropic goals. Each tier contributes directly to childhood sports and local communities.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="pb-40 px-12 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {plans.map((p, i) => (
            <Card
              key={i}
              variant="low"
              className={`p-16 flex flex-col relative border-t-8 transition-all hover:shadow-2xl hover:shadow-primary/5 group ${p.popular ? "border-secondary" : "border-primary"}`}
            >
              {p.popular && (
                <div className="absolute top-0 right-0 p-8">
                  <span className="bg-secondary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg shadow-secondary/20">The Legacy Choice</span>
                </div>
              )}

              <div className="mb-12">
                <p className="text-sm font-bold uppercase tracking-widest text-primary/40 mb-4">{p.title}</p>
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-8xl font-serif font-black italic tracking-tighter leading-none">{p.price}</span>
                  <span className="text-2xl font-serif italic text-primary/40">/ {p.period}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary/30 line-through">Value: {p.priceBefore}</p>
              </div>

              <div className="space-y-6 mb-16 flex-1">
                {p.features.map((f, j) => (
                  <div key={j} className="flex items-center gap-4 text-sm font-sans text-primary/60 group-hover:text-primary transition-all">
                    <Check className="h-4 w-4 text-secondary shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full py-8 text-lg"
                variant={p.popular ? "secondary" : "primary"}
                disabled={loadingPlan === p.id}
                onClick={() => handleSubscribe(p.planEnvId || p.id, p.title)}
              >
                {loadingPlan === p.id ? (
                  <><Loader2 className="h-5 w-5 mr-3 animate-spin" /> Processing...</>
                ) : (
                  <>Initiate {p.title} <ArrowRight className="h-5 w-5 ml-4" /></>
                )}
              </Button>

              <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-primary/30 flex items-center justify-center gap-2">
                <Shield className="h-3 w-3" /> Secure Razorpay Payment Gateway
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-40 bg-primary text-white text-center selection:bg-secondary/40">
        <div className="max-w-4xl mx-auto px-12">
          <p className="text-6xl font-serif italic tracking-tighter mb-12 leading-tight">
            "The transparency is what hooked me. I can see exactly how much Digital Heroes has sent to the charity every single month."
          </p>
          <div className="h-1 w-24 bg-secondary mx-auto mb-8" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">A Heritage Member Since Cycle 01</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-40 px-12 border-t border-primary/5 text-center">
        <div className="flex flex-col items-center gap-12">
          <Link href="/" className="group">
            <h1 className="text-4xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
          </Link>
          <div className="max-w-xl text-primary/40 text-sm font-sans leading-relaxed">
            By submitting your membership, you agree to the Digital Heroes platform protocols. Participation in the monthly draw requires 5 verified scorecard entries. Verified proofs must show username, score list, and date.
          </div>
        </div>
      </footer>
    </main>
  );
}
