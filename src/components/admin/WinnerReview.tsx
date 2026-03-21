"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, CheckCircle, XCircle, ExternalLink, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";

export default function WinnerReview() {
  const [winners, setWinners] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("pending_verification");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchWinners();
  }, [filter]);

  async function fetchWinners() {
    setIsLoading(true);
    const res = await fetch(`/api/admin/winners?status=${filter}`);
    if (res.ok) {
      setWinners(await res.json());
    }
    setIsLoading(false);
  }

  async function handleAction(id: string, action: "verified" | "rejected" | "paid") {
    setIsProcessing(id);
    const res = await fetch(`/api/admin/winners/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: action }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setWinners(prev => prev.filter(w => w.id !== id));
    }
    setIsProcessing(null);
  }

  return (
    <Card variant="low" className="p-8">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-serif italic font-black">Winner Verification Console</h2>
        <div className="flex gap-2">
            {["pending_verification", "verified", "paid", "rejected"].map((s) => (
                <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === s ? "bg-primary text-white border-primary" : "bg-white text-primary/40 border-primary/10 hover:border-primary/20"}`}
                >
                    {s.replace("_", " ")}
                </button>
            ))}
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary/10" /></div>
        ) : winners.length === 0 ? (
            <div className="py-20 text-center opacity-30 uppercase tracking-[0.4em] text-sm">No entries found for this state.</div>
        ) : (
            winners.map((winner) => (
                <div key={winner.id} className="grid grid-cols-12 gap-8 p-8 bg-white rounded-lg items-center border-l-8 border-primary/5 hover:border-secondary transition-all group shadow-sm">
                    <div className="col-span-3">
                        <p className="text-xs font-bold uppercase tracking-tighter text-primary/40 mb-1">Subscriber</p>
                        <h4 className="text-xl font-serif italic mb-1">{winner.users.full_name}</h4>
                        <p className="text-[10px] uppercase font-bold text-secondary">ID: {winner.id.slice(0, 8)}</p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xs font-bold uppercase tracking-tighter text-primary/40 mb-1">Prize Tier</p>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-serif italic">{winner.tier}-Match</span>
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xs font-bold uppercase tracking-tighter text-primary/40 mb-1">Amount</p>
                        <p className="text-2xl font-serif italic font-black">₹{winner.prize_amount.toLocaleString()}</p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xs font-bold uppercase tracking-tighter text-primary/40 mb-1">Proof Submitted</p>
                        {winner.proof_url ? (
                            <a 
                                href={winner.proof_url} 
                                target="_blank" 
                                className="flex items-center gap-2 text-secondary font-bold text-xs uppercase hover:underline"
                            >
                                <ImageIcon className="h-4 w-4" /> View Screenshot <ExternalLink className="h-3 w-3" />
                            </a>
                        ) : (
                            <span className="text-red-500/50 text-xs font-bold uppercase italic">Awaiting Proof</span>
                        )}
                    </div>

                    <div className="col-span-3 flex justify-end gap-3">
                        {isProcessing === winner.id ? (
                            <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
                        ) : (
                            <>
                                {filter === "pending_verification" && (
                                    <>
                                        <Button 
                                            variant="ghost" 
                                            className="text-red-500 px-4 hover:border-red-500" 
                                            onClick={() => handleAction(winner.id, "rejected")}
                                        >
                                            <XCircle className="h-4 w-4 mr-2" /> Reject
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            onClick={() => handleAction(winner.id, "verified")}
                                            disabled={!winner.proof_url}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" /> Verify
                                        </Button>
                                    </>
                                )}
                                {filter === "verified" && (
                                    <Button size="sm" onClick={() => handleAction(winner.id, "paid")}>
                                        <CheckCircle className="h-4 w-4 mr-2" /> Mark as Paid
                                    </Button>
                                )}
                                {filter === "paid" && (
                                    <div className="text-[10px] font-bold uppercase text-secondary/40 border border-secondary/10 px-4 py-2 rounded-full">Disbursement Completed</div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )
        ))}
      </div>
    </Card>
  );
}
