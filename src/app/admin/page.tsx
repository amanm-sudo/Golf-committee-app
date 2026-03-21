"use client";

import { useState } from "react";
import StatGrid from "@/components/admin/StatGrid";
import DrawManager from "@/components/admin/DrawManager";
import WinnerReview from "@/components/admin/WinnerReview";
import { Users, LayoutDashboard, Trophy, Settings, BarChart, ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const sidebarLinks = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "draws", label: "Draw Manager", icon: Trophy },
    { id: "winners", label: "Winner Reviews", icon: ShieldAlert },
    { id: "users", label: "User Management", icon: Users },
    { id: "reports", label: "Analytics & Reports", icon: BarChart },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-secondary/20 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-80 bg-primary text-white flex flex-col justify-between py-12 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ShieldAlert className="h-96 w-96 text-white scale-150 rotate-12" strokeWidth={1} />
        </div>

        <div className="relative z-10">
          <div className="mb-20">
            <h1 className="text-4xl font-serif font-black italic tracking-tighter text-white">Digital Heroes</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-secondary">Control Interface</p>
          </div>

          <nav className="space-y-4">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`w-full flex items-center gap-4 py-4 px-6 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${activeTab === link.id ? "bg-white text-primary shadow-2xl shadow-black/20" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <link.icon className={`h-5 w-5 ${activeTab === link.id ? "text-secondary" : "text-white/20"}`} />
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/10 flex items-center gap-4 group">
            <div className="h-12 w-12 rounded-full border-2 border-secondary/40 p-1 group-hover:border-secondary transition-all">
                <img src="/admin-avatar.png" className="h-full w-full rounded-full object-cover" />
            </div>
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white">Admin System</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-secondary group-hover:text-white transition-all">Digital Heroes LP</p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface-container-low/30 px-16 py-12 custom-scrollbar">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <h2 className="text-5xl font-serif font-black italic mb-2 tracking-tighter">
                   {activeTab === "overview" && "Executive Summary"}
                   {activeTab === "draws" && "Draw Operations"}
                   {activeTab === "winners" && "Integrity Check"}
                   {activeTab === "users" && "User Directory"}
                   {activeTab === "reports" && "Financial Intelligence"}
                </h2>
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary/40">Secure Session · Region: EMEA-1 · Status: Active</p>
            </div>
            <div className="flex gap-4">
                <button className="bg-white border border-primary/5 rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:border-primary/20 transition-all">Export Cycle Logs</button>
                <button className="bg-secondary text-white rounded-full px-6 py-3 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-secondary/20 hover:scale-[1.05] transition-all">Secure Lockdown</button>
            </div>
        </header>

        {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <StatGrid />
                <div className="grid grid-cols-12 gap-12">
                   <div className="col-span-8">
                        <DrawManager />
                   </div>
                   <div className="col-span-4">
                        <WinnerReview />
                   </div>
                </div>
            </div>
        )}

        {/* Other Tab Views can be implemented here */}
        {activeTab === "draws" && <div className="max-w-4xl"><DrawManager /></div>}
        {activeTab === "winners" && <WinnerReview />}
        {(activeTab === "users" || activeTab === "reports") && (
            <div className="py-40 text-center opacity-20 uppercase tracking-[1em] text-sm animate-pulse">
                Access Restricted · Module Offline
            </div>
        )}
      </main>
    </div>
  );
}
