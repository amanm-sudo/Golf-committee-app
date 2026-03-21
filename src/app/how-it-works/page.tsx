import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Shield, Trophy, Heart, Star, CheckCircle, Play } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    num: "01",
    title: "Choose Your Plan",
    subtitle: "Monthly or Annual",
    description: "Select the Heritage (monthly) or Legacy (annual) membership tier that suits you. Both tiers give full access to the platform, the monthly prize draw, and charity contribution tracking.",
    icon: Star,
    detail: "From ₹9.99/month",
  },
  {
    num: "02",
    title: "Select Your Charity",
    subtitle: "Your cause, your choice",
    description: "Pick from our curated list of verified charity partners. Your subscription automatically allocates up to 50% of net revenue to your selected charity every month.",
    icon: Heart,
    detail: "6 charity partners",
  },
  {
    num: "03",
    title: "Log Your Golf Scores",
    subtitle: "Up to 5 per cycle",
    description: "After each round, log your verified Stableford score (1–45) through your personal dashboard. Your 5 most recent scores form your draw entry — no score, no entry.",
    icon: Play,
    detail: "Stableford scoring",
  },
  {
    num: "04",
    title: "Enter the Monthly Draw",
    subtitle: "On the last day of each month",
    description: "At midnight on the last day of every month, our engine draws 5 winning numbers from the pool of all scores submitted. Members who match 3, 4, or all 5 numbers win prize money.",
    icon: Trophy,
    detail: "Monthly on last day",
  },
  {
    num: "05",
    title: "Claim Your Prize",
    subtitle: "Verified & paid securely",
    description: "Winners are contacted directly. You'll submit a scorecard proof for verification. Once verified, prizes are paid out securely. Unverified claims are forfeited within 14 days.",
    icon: CheckCircle,
    detail: "14-day claim window",
  },
];

const prizeStructure = [
  { tier: "5-Score Match", prize: "60% of pool", odds: "Jackpot", color: "border-secondary bg-secondary/5" },
  { tier: "4-Score Match", prize: "25% of pool", odds: "1 in ~12", color: "border-primary bg-primary/5" },
  { tier: "3-Score Match", prize: "15% of pool", odds: "1 in ~4", color: "border-primary/40 bg-primary/5" },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background text-primary selection:bg-secondary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 px-12 py-6 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-secondary">Premium Philanthropy</p>
        </Link>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-primary/60">
          <Link href="/charities" className="hover:text-primary transition-all">Charities</Link>
          <Link href="/how-it-works" className="text-primary transition-all">How it works</Link>
          <Link href="/pricing" className="hover:text-primary transition-all">Pricing</Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-all">Login</Link>
          <Button size="sm" asChild>
            <Link href="/signup">Join the Fairway</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-60 pb-20 px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none scale-150 rotate-12">
          <Shield className="h-96 w-96 text-primary" strokeWidth={1} />
        </div>
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Platform Protocol</p>
          <h1 className="text-8xl font-serif font-black italic tracking-tighter mb-8 text-primary leading-[0.85]">
            How Digital <br /><span className="text-secondary">Heroes Works.</span>
          </h1>
          <p className="text-xl text-primary/60 font-sans max-w-2xl leading-relaxed mb-12">
            A transparent, five-step system that turns your golf game into a monthly prize competition and a sustained charitable contribution.
          </p>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            {["Complete Transparency", "Verified Payouts", "Monthly Cycle"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-primary/60">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5-Step Process */}
      <section className="py-40 px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">The Process</p>
            <h2 className="text-5xl font-serif font-black italic tracking-tighter">Five steps. Every month.</h2>
          </div>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <Card key={i} variant="lowest" className={`p-12 flex gap-12 items-start border-l-8 transition-all hover:shadow-xl hover:shadow-primary/5 group ${i % 2 === 0 ? "border-primary" : "border-secondary"}`}>
                <div className="flex-shrink-0 w-24 text-center">
                  <div className="text-6xl font-serif italic font-black text-primary/10 group-hover:text-secondary/30 transition-all">{step.num}</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-secondary/10 transition-all">
                    <step.icon className="h-8 w-8 text-primary group-hover:text-secondary transition-all" strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">{step.subtitle}</p>
                  <h3 className="text-3xl font-serif italic mb-4">{step.title}</h3>
                  <p className="text-primary/60 font-sans leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary/5 px-4 py-2 rounded-full">{step.detail}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prize Structure */}
      <section className="py-40 px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Prize Architecture</p>
            <h2 className="text-5xl font-serif font-black italic tracking-tighter">How the pool is distributed</h2>
            <p className="mt-6 text-primary/60 font-sans max-w-xl mx-auto">60% of net monthly subscriptions feed the prize pool. The remaining 40% goes directly to member-selected charities and platform operating costs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {prizeStructure.map((tier, i) => (
              <Card key={i} variant="lowest" className={`p-12 text-center border-t-8 ${tier.color}`}>
                <div className="text-5xl font-serif italic font-black mb-4">{tier.prize}</div>
                <h3 className="text-xl font-bold uppercase tracking-widest mb-2">{tier.tier}</h3>
                <p className="text-primary/40 font-sans text-sm">Est. odds: {tier.odds}</p>
              </Card>
            ))}
          </div>
          <Card variant="low" className="mt-12 p-10 bg-primary text-white text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Important Note</p>
            <p className="text-white/80 font-sans max-w-3xl mx-auto leading-relaxed">
              To be eligible for the draw, members must have submitted at least 5 verified golf scores during the current monthly cycle. Scores must be between 1 and 45 (Stableford points). Admin verification of submitted proof is required before prizes are paid.
            </p>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-40 px-12 bg-surface-container-highest">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Common Questions</p>
            <h2 className="text-5xl font-serif font-black italic tracking-tighter">Protocol Q&A</h2>
          </div>
          {[
            { q: "Can I cancel my membership at any time?", a: "Yes. You can cancel at any time through your dashboard. Your access and draw eligibility continue until the end of your paid period." },
            { q: "What if I miss submitting 5 scores in a month?", a: "If you have fewer than 5 scores submitted by the draw date, you are not eligible for that month's draw. Your subscription continues and charity contributions are still made." },
            { q: "How do I verify a winning claim?", a: "Winners receive an email from us. You submit a photo of your official scorecard showing your name, score, date, and signing official within 14 days." },
            { q: "Can I change my charity partner?", a: "Yes. You can update your charity selection from your dashboard at any time. The change takes effect from the next billing cycle." },
          ].map((faq, i) => (
            <div key={i} className="py-10 border-b border-primary/5">
              <h3 className="text-xl font-serif italic mb-4">{faq.q}</h3>
              <p className="text-primary/60 font-sans leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-12 bg-primary text-white text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Ready to Commit?</p>
          <h2 className="text-6xl font-serif font-black italic tracking-tighter mb-8">Play Golf. Win Prizes. Change Lives.</h2>
          <p className="text-white/60 font-sans mb-12 text-lg leading-relaxed">
            Everything you need to turn your weekend rounds into meaningful impact.
          </p>
          <div className="flex gap-6 justify-center">
            <Button size="lg" variant="secondary" className="px-12 py-8 text-lg" asChild>
              <Link href="/pricing">View Membership Plans <ArrowRight className="h-5 w-5 ml-4" /></Link>
            </Button>
            <Button size="lg" className="px-12 py-8 text-lg bg-white text-primary hover:bg-white/90" asChild>
              <Link href="/charities">See Charity Partners</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-background py-20 px-12 text-center border-t border-primary/5">
        <Link href="/" className="group inline-block mb-6">
          <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
        </Link>
        <p className="text-primary/30 text-xs font-sans">© 2026 Digital Heroes LP · All rights reserved</p>
      </footer>
    </main>
  );
}
