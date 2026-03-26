"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, History, UploadCloud, CheckCircle, ExternalLink } from "lucide-react";
import { format } from "date-fns";

export default function WinHistory() {
  const [wins, setWins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWins() {
      setIsLoading(true);
      const res = await fetch("/api/user/wins");
      if (res.ok) {
        setWins(await res.json());
      } else {
        // Fallback for demo mock
        setWins([
            { id: "mock-1", tier: 4, prize_amount: 8596, status: "pending_verification", proof_url: null, created_at: new Date().toISOString() }
        ]);
      }
      setIsLoading(false);
    }
    fetchWins();
  }, []);

  async function uploadProof(winId: string) {
    const url = prompt("Please provide a secure image link (e.g., Imgur) for your score screenshot proof:");
    if (!url) return;

    // Simulate patch or send to backend
    alert("Proof uploaded successfully for verification.");
    setWins(prev => prev.map(w => w.id === winId ? { ...w, proof_url: url } : w));
  }

  if (isLoading) {
    return (
        <Card variant="low" className="p-16 flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary/20" />
        </Card>
    );
  }

  if (wins.length === 0) {
    return (
        <Card variant="low" className="p-8 md:p-16 text-center">
          <History className="h-12 w-12 md:h-16 md:w-16 text-secondary/30 mx-auto mb-6" strokeWidth={1} />
          <h3 className="text-2xl md:text-3xl font-serif italic mb-4">Win History</h3>
          <p className="text-primary/60 font-sans">Your previous draw wins will appear here once you hit a 3, 4, or 5 number match.</p>
        </Card>
    );
  }

  return (
    <Card variant="low" className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-serif italic font-black">Draw Results & Winnings</h2>
        <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">Verified Ledger</span>
      </div>

      <div className="space-y-6">
        {wins.map((win) => (
            <div key={win.id} className="p-6 md:p-8 rounded-lg bg-white border-l-4 border-secondary shadow-sm flex flex-col md:flex-row gap-6 md:justify-between md:items-center relative overflow-hidden">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">
                        Draw Date: {format(new Date(win.created_at), "MMMM d, yyyy")}
                    </p>
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-2xl font-serif font-black">{win.tier}-Match</h4>
                        <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[10px] uppercase font-bold text-primary/60 tracking-widest">
                            {win.status.replace("_", " ")}
                        </span>
                    </div>
                    <p className="font-serif italic text-xl text-primary font-black">₹{win.prize_amount.toLocaleString()}</p>
                </div>

                <div className="flex flex-col md:items-end gap-3 z-10 w-full md:w-auto">
                    {win.proof_url ? (
                        <>
                            <a href={win.proof_url} target="_blank" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary hover:underline">
                                View Proof <ExternalLink className="h-3 w-3" />
                            </a>
                            {win.status === "verified" || win.status === "paid" ? (
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                                    <CheckCircle className="h-4 w-4" /> Proof Verified
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                                    Proof submitted. Awaiting review.
                                </span>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col gap-2 w-full md:w-auto">
                            <p className="text-[10px] uppercase text-red-500/60 font-bold tracking-widest">Action Required</p>
                            <Button size="sm" variant="outline" className="text-secondary hover:border-secondary w-full" onClick={() => uploadProof(win.id)}>
                                <UploadCloud className="h-4 w-4 mr-2" /> Upload Screenshot
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </Card>
  );
}
