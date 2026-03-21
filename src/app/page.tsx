import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Trophy, Heart, Shield, ArrowRight, Star, Quote } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-primary/5 px-12 py-6 flex justify-between items-center">
        <div className="flex items-center gap-12">
            <Link href="/" className="group">
                <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-secondary">Premium Philanthropy</p>
            </Link>
            <div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-primary/60">
                <Link href="/charities" className="hover:text-primary transition-all">Charities</Link>
                <Link href="/how-it-works" className="hover:text-primary transition-all">How it works</Link>
                <Link href="/pricing" className="hover:text-primary transition-all">Pricing</Link>
            </div>
        </div>
        <div className="flex items-center gap-6">
            <Link href="/login" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-secondary transition-all">Login</Link>
            <Button size="sm" asChild>
                <Link href="/signup">Join the Fairway</Link>
            </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-60 pb-40 px-12 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none scale-150 rotate-12">
            <Trophy className="h-96 w-96 text-primary" strokeWidth={1} />
        </div>
        
        <div className="relative z-10 max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-12 border border-secondary/20">
                <Star className="h-3 w-3 fill-secondary" /> Precision in Philanthropy
            </div>
            <h1 className="text-8xl md:text-9xl mb-12 font-serif font-black italic tracking-tighter leading-[0.8] text-primary">
                Play Golf. Win Prizes. <span className="text-secondary">Change Lives.</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary/60 font-sans max-w-3xl mx-auto leading-relaxed mb-16">
                Enter your scores, compete in a monthly prize draw, and watch your subscription fund the charity you care about — automatically.
            </p>
            <div className="flex gap-6 justify-center">
                <Button size="lg" className="px-12 py-8 text-lg" variant="primary" asChild>
                    <Link href="/signup">Commit your membership <ArrowRight className="h-5 w-5 ml-4" /></Link>
                </Button>
                <Button size="lg" className="px-12 py-8 text-lg" variant="outline" asChild>
                    <Link href="/how-it-works">View Protocols</Link>
                </Button>
            </div>
        </div>
      </section>

      {/* How it Works Module */}
      <section className="py-40 bg-surface-container-low px-12">
        <div className="max-w-7xl mx-auto">
            <div className="mb-24">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">The Logic</p>
                <h2 className="text-6xl font-serif font-black italic tracking-tighter">Three steps. Every month.</h2>
            </div>

            <div className="grid grid-cols-3 gap-12">
                {[
                    { num: "01", title: "Subscribe", text: "Select your monthly plan and your preferred charity. All funds are held securely.", icon: Shield },
                    { num: "02", title: "Submit Scores", text: "Play your rounds and log your verified scorecards through our high-end dashboard.", icon: Star },
                    { num: "03", title: "Win & Give", text: "Enter the monthly pool. Prizes are distributed, and up to 50% goes direct to your charity.", icon: Heart }
                ].map((step, i) => (
                    <Card key={i} variant="lowest" className="p-12 border-t-8 border-primary group hover:border-secondary transition-all">
                        <div className="text-5xl font-serif italic text-secondary/30 mb-8 group-hover:text-secondary group-hover:translate-x-2 transition-all">{step.num}</div>
                        <step.icon className="h-10 w-10 text-primary mb-6" />
                        <h3 className="text-3xl font-serif italic mb-6">{step.title}</h3>
                        <p className="text-primary/60 leading-relaxed font-sans">{step.text}</p>
                    </Card>
                ))}
            </div>
        </div>
      </section>

      {/* Prize Pool Spotlight */}
      <section className="py-40 px-12 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-40 opacity-5 pointer-events-none -translate-y-20 translate-x-20">
            <h1 className="text-[20rem] font-serif italic font-black text-white">₹</h1>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center relative z-10">
            <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary mb-4">Ongoing Jackpot</p>
                <h2 className="text-7xl font-serif font-black italic tracking-tighter mb-8 leading-none">This Month's <br/>Prize Pool</h2>
                <div className="h-1 w-24 bg-secondary mb-12" />
                <p className="text-xl opacity-60 font-sans leading-relaxed mb-12">
                    60% of net subscriptions feed the prize pool. The more members join, the bigger the legacy grows.
                </p>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Heritage Score</p>
                        <p className="text-2xl font-serif italic">Verified Payouts</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-2">Cycle End</p>
                        <p className="text-2xl font-serif italic">March 31, 2026</p>
                    </div>
                </div>
            </div>

            <Card className="flex-1 bg-white p-16 flex flex-col items-center justify-center border-l-8 border-secondary rounded-lg shadow-2xl shadow-black/80">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/30 mb-8">Live Pool Calculation</h3>
                <div className="text-9xl font-serif font-black italic text-primary tracking-tighter mb-4 animate-pulse">₹24,560</div>
                <div className="flex gap-4 mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-100 px-4 py-2 rounded-full text-primary/60">5-Match: ₹9,824</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-stone-100 px-4 py-2 rounded-full text-primary/60">4-Match: ₹8,596</span>
                </div>
                <Button size="lg" className="w-full">Secure Your Entry</Button>
            </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-40 px-12 bg-surface-container-highest">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-3 gap-16">
                {[
                    { text: "Knowing that my weekend round actually contributes to childhood sports education makes the bogeys a lot easier to handle.", author: "James W., Heritage Member" },
                    { text: "The transparency is what hooked me. I can see exactly how much GolfGives has sent to the Royal Marsden every single month.", author: "Sarah L., subscriber" },
                    { text: "The prize draws are exciting, but the philanthropic ledger is the real winner here. It's high-end tech for a great cause.", author: "Marcus D., Admin" }
                ].map((t, i) => (
                    <div key={i} className="flex flex-col">
                        <Quote className="h-10 w-10 text-secondary mb-8 opacity-20" />
                        <p className="text-2xl font-serif italic text-primary leading-tight mb-8">"{t.text}"</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mt-auto">{t.author}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-40 px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-20">
            <div className="col-span-5">
                <h1 className="text-4xl font-serif font-black italic tracking-tighter text-white mb-6">Digital Heroes</h1>
                <p className="text-white/40 font-sans leading-relaxed mb-12 max-w-md">The modern fairway where precision golf meets aggressive philanthropy. Built for the player who demands performance and impact.</p>
                <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-secondary">
                    <a href="#">X / Twitter</a>
                    <a href="#">Instagram</a>
                    <a href="#">LinkedIn</a>
                </div>
            </div>

            <div className="col-span-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-8">Platform</h4>
                <div className="flex flex-col gap-4 text-sm font-sans text-white/60">
                    <Link href="/how-it-works" className="hover:text-white transition-all">How It Works</Link>
                    <Link href="/charities" className="hover:text-white transition-all">Charity Partners</Link>
                    <Link href="/pricing" className="hover:text-white transition-all">Membership Pricing</Link>
                </div>
            </div>

            <div className="col-span-2">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-8">Legal</h4>
                <div className="flex flex-col gap-4 text-sm font-sans text-white/60">
                    <a href="#" className="hover:text-white transition-all">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-all">Terms of Service</a>
                    <a href="#" className="hover:text-white transition-all">Draw Rules</a>
                </div>
            </div>

            <div className="col-span-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-8">Membership</h4>
                <Card variant="lowest" className="bg-white/5 p-8 border border-white/10">
                    <p className="text-xs text-white/60 mb-6 font-sans">Apply for the waiting list for our next membership cycle.</p>
                    <input type="email" placeholder="Email protocols" className="bg-transparent border-b border-white/20 w-full mb-6 py-2 outline-none text-sm font-sans placeholder:text-white/20" />
                    <Button variant="secondary" className="w-full text-xs py-4">Apply</Button>
                </Card>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-40 flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">
            <p>© 2026 DIGITAL HEROES LP · LONDON & EDINBURGH</p>
            <p className="flex items-center gap-2"><Shield className="h-3 w-3" /> VERIFIED SECURE GATEWAY</p>
        </div>
      </footer>
    </main>
  );
}
