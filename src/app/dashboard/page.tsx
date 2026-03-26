"use client";

import { useState, useEffect } from "react";
import ScoreBoard from "@/components/dashboard/ScoreBoard";
import CharityWidget from "@/components/dashboard/CharityWidget";
import WinHistory from "@/components/dashboard/WinHistory";
import { LayoutDashboard, Trophy, Heart, Settings, History, LogOut, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  charity: { name: string; slug: string; logo_url?: string } | null;
}

interface Subscription {
  id: string;
  status: string;
  plan_type: string;
  current_period_end: string;
  razorpay_subscription_id: string;
  cancel_at_period_end?: boolean;
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.user);
        setSubscription(data.subscription);
      } else if (res.status === 401) {
        router.push("/login");
      }
      setIsLoading(false);
    }
    loadProfile();
  }, [router]);

  async function handleSignOut() {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  }

  const sidebarLinks = [
    { id: "overview", label: "My Hub", icon: LayoutDashboard },
    { id: "draws", label: "Draw Results", icon: Trophy },
    { id: "charity", label: "Charity Impact", icon: Heart },
    { id: "history", label: "Win History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const firstName = userProfile?.full_name?.split(" ")[0] || "Member";

  const subscriptionLabel = subscription
    ? subscription.plan_type === "yearly" ? "Annual Legacy" : "Monthly Heritage"
    : null;

  const periodEnd = subscription?.current_period_end
    ? format(new Date(subscription.current_period_end), "MMM d, yyyy")
    : null;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background overflow-hidden selection:bg-secondary/20 font-sans">
      {/* User Sidebar (Desktop) */}
      <aside className="hidden md:flex w-80 bg-surface-container-low flex-col justify-between py-12 px-8 border-r border-primary/5 relative z-20">
        <div>
          <div className="mb-20">
            <Link href="/">
              <h1 className="text-3xl font-serif font-black italic tracking-tighter text-primary">Digital Heroes</h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Premium Membership</p>
            </Link>
          </div>

          <nav className="space-y-4">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-4 py-4 px-6 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === link.id ? "bg-primary text-white shadow-2xl shadow-primary/20" : "text-primary/40 hover:text-primary hover:bg-white/5"}`}
              >
                <link.icon className={`h-5 w-5 ${activeTab === link.id ? "text-secondary" : "text-primary/20"}`} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-primary text-white rounded-lg shadow-xl shadow-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 transition-transform duration-700 group-hover:rotate-0">
              <Trophy className="h-16 w-16" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-secondary mb-2">Current Jackpot</p>
            <p className="text-3xl font-serif font-black italic mb-1">₹24,500</p>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Draw: End of this month</p>
          </div>

          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full flex items-center gap-4 py-4 px-6 rounded-lg text-sm font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all disabled:opacity-50"
          >
            {isSigningOut ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-surface-container-low border-b border-primary/5 px-6 py-4 flex justify-between items-center z-40 shadow-sm relative">
        <Link href="/">
          <h1 className="text-xl font-serif font-black italic tracking-tighter text-primary leading-none">Digital Heroes</h1>
        </Link>
        <div className="bg-primary text-secondary px-3 py-1.5 rounded-md text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
          <Trophy className="h-3 w-3" /> ₹24,500
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-low border-t border-primary/5 flex justify-around p-2 z-50 bg-white/95 backdrop-blur-md safe-area-pb">
        {sidebarLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => setActiveTab(link.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg min-w-[64px] ${activeTab === link.id ? "text-secondary font-bold" : "text-primary/40 hover:text-primary transition-colors"}`}
          >
            <link.icon className="h-5 w-5 mb-1" />
            <span className="text-[8px] uppercase tracking-wider">{link.label}</span>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-6 md:px-16 py-8 md:py-12 pb-28 md:pb-12 custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-secondary mx-auto mb-4" />
              <p className="text-primary/40 uppercase tracking-widest text-xs font-bold">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <>
            <header className="mb-8 md:mb-12 flex flex-col md:flex-row gap-6 md:justify-between md:items-end">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-black italic mb-2 tracking-tighter">
                  Welcome Back, {firstName}.
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">
                  Status: {subscription?.status === "active" ? "Active Subscriber" : "No Active Subscription"} 
                  {subscriptionLabel ? ` · Tier: ${subscriptionLabel}` : ""}
                  {userProfile?.email ? ` · ${userProfile.email}` : ""}
                </p>
              </div>
              <div className="flex gap-4">
                <button className="bg-white border border-primary/5 rounded-full px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:border-primary/20 transition-all shadow-sm w-full md:w-auto">
                  Help & Support
                </button>
              </div>
            </header>

            {/* No subscription banner */}
            {!subscription && (
              <Card variant="low" className="mb-8 p-6 md:p-8 border-l-4 border-secondary flex flex-col md:flex-row items-start md:items-center gap-6">
                <AlertCircle className="h-8 w-8 text-secondary flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-serif italic text-xl mb-1">No Active Subscription</h3>
                  <p className="text-primary/60 font-sans text-sm">Subscribe to a plan to become eligible for the monthly prize draw.</p>
                </div>
                <Button asChild className="w-full md:w-auto">
                  <Link href="/pricing">Choose a Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </Card>
            )}

            {activeTab === "overview" && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col gap-8 md:gap-12">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
                  <div className="col-span-1 xl:col-span-8">
                    <ScoreBoard />
                  </div>
                  <div className="col-span-1 xl:col-span-4 flex flex-col min-h-full">
                    <CharityWidget />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                  <Card variant="low" className="p-8 border-t-4 border-secondary">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Subscription Plan</p>
                    <h4 className="text-2xl font-serif italic mb-2">{subscriptionLabel || "No Plan"}</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center">
                      {periodEnd ? `Renews: ${periodEnd}` : "Not subscribed"}
                    </p>
                    <Button asChild variant="ghost" className="mt-8 text-xs">
                      <Link href="/pricing">
                        {subscription ? "Manage Billing" : "Subscribe Now"}
                      </Link>
                    </Button>
                  </Card>

                  <Card variant="low" className="p-8 border-t-4 border-primary">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Charity Partner</p>
                    <h4 className="text-2xl font-serif italic mb-2">
                      {userProfile?.charity?.name || "Not Selected"}
                    </h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center">
                      Monthly Contribution Active
                    </p>
                    <button className="mt-8 text-xs font-bold uppercase tracking-widest border-b-2 border-primary/10 hover:border-secondary transition-all">
                      Change Charity partner
                    </button>
                  </Card>

                  <Card variant="low" className="p-8 border-t-4 border-primary">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-4">Latest Draw Results</p>
                    <h4 className="text-2xl font-serif italic mb-2">February 2026</h4>
                    <p className="text-xs font-bold uppercase tracking-widest text-primary/40 flex items-center">
                      Matched: 0 Numbers
                    </p>
                    <button className="mt-8 text-xs font-bold uppercase tracking-widest border-b-2 border-primary/10 hover:border-secondary transition-all">
                      View all results
                    </button>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "draws" && (
              <div className="animate-in fade-in duration-500">
                <Card variant="low" className="p-8 md:p-16 text-center">
                  <Trophy className="h-12 w-12 md:h-16 md:w-16 text-secondary/30 mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-2xl md:text-3xl font-serif italic mb-4">Draw Results</h3>
                  <p className="text-primary/60 font-sans">Draw results for the current cycle will appear here after the monthly draw is published.</p>
                </Card>
              </div>
            )}

            {activeTab === "charity" && (
              <div className="animate-in fade-in duration-500">
                <CharityWidget />
              </div>
            )}

            {activeTab === "history" && (
              <div className="animate-in fade-in duration-500">
                <WinHistory />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in duration-500 max-w-2xl mx-auto md:mx-0">
                <Card variant="low" className="p-6 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-serif italic mb-6 md:mb-8">Account Settings</h3>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Full Name</p>
                      <p className="font-sans font-bold">{userProfile?.full_name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Email Address</p>
                      <p className="font-sans font-bold">{userProfile?.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Account Role</p>
                      <p className="font-sans font-bold capitalize">{userProfile?.role || "subscriber"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-2">Subscription Status</p>
                      <p className={`font-sans font-bold capitalize ${subscription?.status === "active" ? "text-emerald-600" : "text-red-500"}`}>
                        {subscription?.status || "None"}
                      </p>
                    </div>
                    <div className="pt-6 border-t border-primary/5">
                      <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="text-sm font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        {isSigningOut ? "Signing out..." : "Sign Out of Account"}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
