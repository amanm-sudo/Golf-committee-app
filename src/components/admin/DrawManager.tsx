"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, PlayCircle, Eye, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function DrawManager() {
  const [step, setStep] = useState(1);
  const [drawType, setDrawType] = useState<"random" | "algorithmic" | "">("");
  const [weighting, setWeighting] = useState<"most_frequent" | "least_frequent" | "">("");
  const [simulation, setSimulation] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  async function handleSimulate() {
    setIsSimulating(true);
    const res = await fetch("/api/admin/draws/simulate", {
      method: "POST",
      body: JSON.stringify({ draw_type: drawType, weighting_direction: weighting }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setSimulation(await res.json());
      setStep(2);
    }
    setIsSimulating(false);
  }

  async function handlePublish() {
    if (!confirm("Are you sure you want to publish these results? This action is irreversible and will notify all winners.")) return;

    setIsPublishing(true);
    const res = await fetch("/api/admin/draws", {
      method: "POST",
      body: JSON.stringify({ ...simulation, status: "published" }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
        setStep(3);
    }
    setIsPublishing(false);
  }

  return (
    <Card variant="low" className="p-12 mb-12 overflow-hidden relative border-t-8 border-secondary">
      <div className="flex justify-between items-center mb-12">
        <div>
            <h2 className="text-4xl mb-2 font-serif font-black italic">Draw Manager</h2>
            <p className="font-sans text-primary/60 uppercase tracking-widest text-xs font-bold font-sans">Monthly Cycle: {format(new Date(), "MMMM yyyy")}</p>
        </div>
        <div className="flex gap-4">
            <div className={`h-3 w-12 rounded-full transition-all ${step === 1 ? "bg-secondary" : "bg-primary/10"}`} />
            <div className={`h-3 w-12 rounded-full transition-all ${step === 2 ? "bg-secondary" : "bg-primary/10"}`} />
            <div className={`h-3 w-12 rounded-full transition-all ${step === 3 ? "bg-secondary" : "bg-primary/10"}`} />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-8">
            <div 
              onClick={() => setDrawType("random")}
              className={`p-8 rounded-lg cursor-pointer border-2 transition-all group ${drawType === "random" ? "bg-primary text-white border-primary" : "bg-white border-primary/5 hover:border-primary/20"}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <PlayCircle className={`h-8 w-8 ${drawType === "random" ? "text-secondary" : "text-primary/20 group-hover:text-primary"}`} />
                <h3 className="text-2xl font-serif italic">Random Draw</h3>
              </div>
              <p className={`text-sm ${drawType === "random" ? "opacity-70" : "text-primary/40"} font-sans`}>Select 5 unique winning integers between 1 and 45 entirely at random using cryptographically secure PRNG.</p>
            </div>
            
            <div 
              onClick={() => setDrawType("algorithmic")}
              className={`p-8 rounded-lg cursor-pointer border-2 transition-all group ${drawType === "algorithmic" ? "bg-primary text-white border-primary" : "bg-white border-primary/5 hover:border-primary/20"}`}
            >
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className={`h-8 w-8 ${drawType === "algorithmic" ? "text-secondary" : "text-primary/20 group-hover:text-primary"}`} />
                <h3 className="text-2xl font-serif italic">Algorithmic weighting</h3>
              </div>
              <p className={`text-sm ${drawType === "algorithmic" ? "opacity-70" : "text-primary/40"} font-sans`}>Base the draw on a frequency histogram of all active subscriber’s scores for this cycle.</p>
            </div>
          </div>

          {drawType === "algorithmic" && (
            <div className="flex gap-12 p-8 bg-white/50 rounded-lg animate-in slide-in-from-top-4">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="most"
                  name="weighting"
                  checked={weighting === "most_frequent"}
                  onChange={() => setWeighting("most_frequent")}
                  className="accent-secondary h-4 w-4"
                />
                <label htmlFor="most" className="text-sm font-bold uppercase tracking-widest cursor-pointer">Weighted toward most frequent</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="least"
                  name="weighting"
                  checked={weighting === "least_frequent"}
                  onChange={() => setWeighting("least_frequent")}
                  className="accent-secondary h-4 w-4"
                />
                <label htmlFor="least" className="text-sm font-bold uppercase tracking-widest cursor-pointer">Weighted toward least frequent</label>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-8 border-t border-primary/5">
            <Button 
                onClick={handleSimulate} 
                disabled={!drawType || (drawType === "algorithmic" && !weighting) || isSimulating}
            >
              {isSimulating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Eye className="h-4 w-4 mr-2" />} 
              Simulate Draw
            </Button>
          </div>
        </div>
      )}

      {step === 2 && simulation && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-12 mb-12">
            <div>
              <p className="text-xs uppercase font-bold tracking-[0.2em] text-primary/40 mb-4">Simulated Winning Numbers</p>
              <div className="flex gap-4">
                {simulation.winning_numbers.map((n: number) => (
                  <div key={n} className="h-20 w-20 rounded-full bg-primary text-white flex items-center justify-center text-4xl font-serif font-black italic border-4 border-secondary shadow-lg">
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4 border-l border-primary/10 pl-12 py-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-2">Jackpot (5 Matches)</p>
                    <p className="text-2xl font-serif italic text-secondary">{simulation.winners.tier5.length} Winners</p>
                    <p className="text-sm font-bold">₹{simulation.payoutPerWinner.tier5.toLocaleString()} each</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-2">Second Tier (4)</p>
                    <p className="text-2xl font-serif italic">{simulation.winners.tier4.length} Winners</p>
                    <p className="text-sm font-bold">₹{simulation.payoutPerWinner.tier4.toLocaleString()} each</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30 mb-2">Third Tier (3)</p>
                    <p className="text-2xl font-serif italic">{simulation.winners.tier3.length} Winners</p>
                    <p className="text-sm font-bold">₹{simulation.payoutPerWinner.tier3.toLocaleString()} each</p>
                </div>
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <div className="flex-1 p-6 bg-stone-100 rounded-lg border-l-4 border-primary">
                <p className="text-[10px] uppercase font-bold text-primary/40 mb-1">Estimated Total Pool</p>
                <p className="text-3xl font-serif font-black">₹{simulation.total_pool.toLocaleString()}</p>
            </div>
            <div className="flex-1 p-6 bg-stone-100 rounded-lg border-l-4 border-secondary">
                <p className="text-[10px] uppercase font-bold text-primary/40 mb-1">Jackpot Rollover Out</p>
                <p className="text-3xl font-serif font-black">₹{simulation.jackpot_rollover_out.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-between pt-12 border-t border-primary/5">
            <Button variant="outline" onClick={() => setStep(1)}>Back to Configure</Button>
            <div className="flex gap-4">
                <Button variant="ghost" className="text-red-500 hover:border-red-500" onClick={() => setStep(1)}>Discard Simulation</Button>
                <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />} 
                Publish Results
                </Button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-20 animate-in zoom-in-95 duration-700">
            <div className="inline-flex h-32 w-32 rounded-full bg-secondary text-white items-center justify-center mb-12 shadow-2xl shadow-secondary/30">
                <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 className="text-5xl font-serif font-black italic mb-4">Results Published Successfully</h2>
            <p className="text-primary/60 max-w-xl mx-auto mb-12 text-lg">All matches have been recorded, winner notifications have been dispatched via Resend, and the leaderboard is live for all active subscribers.</p>
            <Button size="lg" onClick={() => setStep(1)}>Manage Next Month's Cycle</Button>
        </div>
      )}
    </Card>
  );
}
