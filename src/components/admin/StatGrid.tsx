"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Users, Coins, Heart, FileCheck, ArrowUpRight, TrendingUp } from "lucide-react";

export default function StatGrid() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      setStats(await res.json());
    }
    setIsLoading(false);
  }

  const statConfig = [
    { label: "Active Subscribers", value: stats?.active_subscribers || 0, icon: Users, color: "text-primary/10", trend: "+12%" },
    { label: "Current Prize Pool", value: `₹${(stats?.total_pool || 0).toLocaleString()}`, icon: Coins, color: "text-secondary/10", trend: "+5%" },
    { label: "Charity Contributions", value: `₹${(stats?.charity_impact || 0).toLocaleString()}`, icon: Heart, color: "text-red-500/5", trend: "+24%" },
    { label: "Pending Verifications", value: stats?.pending_count || 0, icon: FileCheck, color: "text-primary/10", trend: "-2%" },
  ];

  return (
    <div className="grid grid-cols-4 gap-8 mb-12">
      {statConfig.map((s, index) => (
        <Card key={index} variant="low" className="p-8 group hover:border-secondary transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-8 z-0 pointer-events-none ${s.color}`}>
                <s.icon className="h-24 w-24 group-hover:scale-[1.1] transition-transform duration-700" strokeWidth={1} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/40">{s.label}</p>
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${s.trend.startsWith('+') ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                        <ArrowUpRight className="h-3 w-3" /> {s.trend}
                    </div>
                </div>
                <div className="flex items-end gap-3">
                    <h3 className="text-4xl font-serif font-black italic">{isLoading ? "..." : s.value}</h3>
                    <TrendingUp className="h-4 w-4 text-emerald-500 mb-1 opacity-40" />
                </div>
            </div>
        </Card>
      ))}
    </div>
  );
}
