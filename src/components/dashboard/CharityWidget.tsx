"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Heart, TrendingUp, Info } from "lucide-react";

export default function CharityWidget() {
  const [percentage, setPercentage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalContributed, setTotalContributed] = useState(0);
  const [charity, setCharity] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const res = await fetch("/api/user/profile");
    if (res.ok) {
        const data = await res.json();
        setPercentage(data.charity_percentage);
        setCharity(data.charity);
        setTotalContributed(data.total_donated || 0);
    }
  }

  async function updatePercentage(val: number) {
    setPercentage(val);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ charity_percentage: val }),
      headers: { "Content-Type": "application/json" },
    });
  }

  return (
    <Card variant="low" className="p-8 h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Heart className="h-64 w-64 text-primary" fill="currentColor" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
            <div className="h-16 w-16 bg-white rounded-lg flex items-center justify-center p-2 shadow-sm border border-black/5">
                {charity?.logo_url ? (
                    <img src={charity.logo_url} alt={charity.name} className="h-full w-full object-contain" />
                ) : (
                    <Heart className="h-8 w-8 text-secondary" />
                )}
            </div>
            <div>
                <h3 className="text-2xl font-serif italic mb-1">{charity?.name || "No Charity Selected"}</h3>
                <p className="text-xs uppercase tracking-widest font-bold text-primary/40">Active Philanthropy Partner</p>
            </div>
        </div>

        <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold uppercase tracking-widest text-primary/60">Subscription Share</span>
                <span className="text-4xl font-serif italic text-secondary">{percentage}%</span>
            </div>
            <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={percentage}
                onChange={(e) => updatePercentage(Number(e.target.value))}
                className="w-full h-1 bg-primary/10 rounded-full appearance-none cursor-pointer accent-secondary transition-all"
            />
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-primary/30 mt-2">
                <span>Min 10%</span>
                <span>Max 50%</span>
            </div>
        </div>

        <div className="p-4 bg-primary text-white rounded-lg text-xs space-y-2 mb-8 relative border-l-4 border-secondary">
            <p className="flex items-center font-bold">
                <Info className="h-3 w-3 mr-2" /> Note
            </p>
            <p className="opacity-80">Increasing your donation share directly supports the {charity?.name || "selected charity"} but reduces your portion of the monthly prize pool.</p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between pt-6 border-t border-primary/5">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Total Contributed to date</p>
                <p className="text-3xl font-serif font-black">₹{totalContributed.toFixed(2)}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1">Impact Level</p>
                <p className="text-sm font-bold uppercase">Heritage Member</p>
            </div>
        </div>
      </div>
    </Card>
  );
}
