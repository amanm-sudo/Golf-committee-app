import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Heart, Users, Trophy, Star, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const charities = [
  {
    name: "The Fairway Foundation",
    category: "Youth Sports",
    description: "Providing access to golf programmes for underprivileged youth across the UK, breaking down financial barriers to sport.",
    raised: "₹42,800",
    members: 128,
    featured: true,
  },
  {
    name: "Royal Marsden Cancer Charity",
    category: "Health",
    description: "Supporting world-class cancer research and treatment at the Royal Marsden NHS Foundation Trust in London.",
    raised: "₹31,200",
    members: 94,
    featured: false,
  },
  {
    name: "Childhood Sports Education Trust",
    category: "Education",
    description: "Delivering physical education programmes to primary schools in deprived areas across England and Scotland.",
    raised: "₹18,500",
    members: 62,
    featured: false,
  },
  {
    name: "Community Links",
    category: "Community",
    description: "Building stronger communities through local grassroots initiatives, volunteering networks, and social enterprise.",
    raised: "₹12,700",
    members: 41,
    featured: false,
  },
  {
    name: "Green Fairways Environment Trust",
    category: "Environment",
    description: "Protecting and restoring natural habitats associated with golf courses and wider British countryside landscapes.",
    raised: "₹9,300",
    members: 29,
    featured: false,
  },
  {
    name: "Veterans Golf Alliance",
    category: "Community",
    description: "Using golf as a therapeutic and social tool for military veterans dealing with PTSD and reintegration challenges.",
    raised: "₹7,100",
    members: 22,
    featured: false,
  },
];

const categoryColors: Record<string, string> = {
  "Youth Sports": "bg-emerald-100 text-emerald-700",
  "Health": "bg-rose-100 text-rose-700",
  "Education": "bg-blue-100 text-blue-700",
  "Community": "bg-amber-100 text-amber-700",
  "Environment": "bg-teal-100 text-teal-700",
};

export default function CharitiesPage() {
  return (
    <main className="min-h-screen bg-background text-primary selection:bg-secondary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 px-12 py-6 flex justify-between items-center">
        <Link href="/" className="group">
          <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
          <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-secondary">Premium Philanthropy</p>
        </Link>
        <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-primary/60">
          <Link href="/charities" className="text-primary transition-all">Charities</Link>
          <Link href="/how-it-works" className="hover:text-primary transition-all">How it works</Link>
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
          <Heart className="h-96 w-96 text-primary" strokeWidth={1} />
        </div>
        <div className="max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Partner Charities</p>
          <h1 className="text-8xl font-serif font-black italic tracking-tighter mb-8 text-primary leading-[0.85]">
            Where Your Swing <br /><span className="text-secondary">Changes Lives.</span>
          </h1>
          <p className="text-xl text-primary/60 font-sans max-w-2xl leading-relaxed mb-12">
            Every subscription you hold funds a charity you believe in. Choose your cause, play your game, and track your real-world impact.
          </p>
          <div className="flex gap-8 text-sm font-bold uppercase tracking-widest">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span className="text-primary/60">6 Partner Charities</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span className="text-primary/60">₹121,600+ Total Raised</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-secondary" />
              <span className="text-primary/60">Monthly Disbursements</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Charity */}
      <section className="py-20 px-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 p-20 opacity-10">
          <Star className="h-80 w-80 text-secondary" strokeWidth={1} />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Featured Partner</p>
            <h2 className="text-6xl font-serif font-black italic tracking-tighter mb-6">The Fairway Foundation</h2>
            <p className="text-white/60 font-sans leading-relaxed mb-8 text-lg">
              Our flagship charity partner, providing access to golf programmes for underprivileged youth across the UK. Since our partnership began, members have contributed over ₹42,800 to fund coaching sessions, equipment grants, and tournament travel for over 200 young players.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-3xl font-serif italic text-secondary font-black">₹42,800</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Total Raised</p>
              </div>
              <div>
                <p className="text-3xl font-serif italic text-secondary font-black">200+</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Young Players Funded</p>
              </div>
              <div>
                <p className="text-3xl font-serif italic text-secondary font-black">128</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Active Supporters</p>
              </div>
            </div>
          </div>
          <Card className="flex-shrink-0 w-80 bg-white/10 border border-white/10 p-10 text-center">
            <Trophy className="h-16 w-16 text-secondary mx-auto mb-6" strokeWidth={1} />
            <p className="text-lg font-serif italic mb-6">Select this charity when you join to support youth golf across Britain.</p>
            <Button variant="secondary" asChild>
              <Link href="/signup?charity=fairway-foundation">Support This Cause <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* All Charities Grid */}
      <section className="py-40 px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">All Partners</p>
            <h2 className="text-5xl font-serif font-black italic tracking-tighter">Choose Your Cause</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity, i) => (
              <Card key={i} variant="lowest" className="p-10 flex flex-col border-t-4 border-primary/10 hover:border-secondary transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${categoryColors[charity.category] || "bg-stone-100 text-stone-600"}`}>
                    {charity.category}
                  </span>
                  {charity.featured && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-1">
                      <Star className="h-3 w-3 fill-secondary" /> Featured
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-serif italic mb-4 group-hover:text-secondary transition-all">{charity.name}</h3>
                <p className="text-primary/60 font-sans text-sm leading-relaxed flex-1 mb-8">{charity.description}</p>
                <div className="flex justify-between items-center pt-6 border-t border-primary/5">
                  <div>
                    <p className="text-xl font-serif italic font-black text-secondary">{charity.raised}</p>
                    <p className="text-[10px] uppercase tracking-widest text-primary/40 font-bold">Raised to date</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary/40">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-bold">{charity.members} supporters</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-12 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Ready to Make an Impact?</p>
          <h2 className="text-6xl font-serif font-black italic tracking-tighter mb-8">Your game. Their future.</h2>
          <p className="text-xl text-primary/60 font-sans mb-12 leading-relaxed">
            Join Digital Heroes today. Select your charity, submit your scores, and compete in the monthly draw — all while making a real difference.
          </p>
          <Button size="lg" className="px-16 py-8 text-lg" asChild>
            <Link href="/pricing">See Membership Plans <ArrowRight className="h-5 w-5 ml-4" /></Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-20 px-12 text-center">
        <Link href="/" className="group inline-block mb-6">
          <h1 className="text-3xl font-serif font-black italic tracking-tighter text-white">Digital Heroes</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
        </Link>
        <p className="text-white/30 text-xs font-sans">© 2026 Digital Heroes LP · All rights reserved</p>
      </footer>
    </main>
  );
}
