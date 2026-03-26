"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";

export default function CharityManagement() {
  const [charities, setCharities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCharities() {
      setIsLoading(true);
      const res = await fetch("/api/charities");
      if (res.ok) {
        setCharities(await res.json());
      } else {
        // Fallback
        setCharities([
           { id: "1", name: "The Royal Marsden", slug: "royal-marsden", category: "Medical" },
        ]);
      }
      setIsLoading(false);
    }
    fetchCharities();
  }, []);

  return (
    <Card variant="low" className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-serif italic font-black mb-1">Philanthropy Roster</h2>
           <p className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">Active Partner Listings</p>
        </div>
        <Button size="sm"><PlusCircle className="h-4 w-4 mr-2" /> Add Partner</Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary/10" /></div>
        ) : charities.length === 0 ? (
            <div className="py-20 text-center opacity-30 uppercase tracking-[0.4em] text-sm">No charity partners added.</div>
        ) : (
            charities.map((charity) => (
                <div key={charity.id} className="grid grid-cols-12 gap-8 p-6 bg-white rounded-lg items-center border border-primary/5 hover:border-secondary transition-all shadow-sm">
                    <div className="col-span-1">
                        <div className="h-12 w-12 rounded bg-primary/5 flex items-center justify-center p-2 text-[8px] font-bold text-primary/20">LOGO</div>
                    </div>

                    <div className="col-span-5 flex flex-col">
                        <h4 className="font-serif italic text-xl mb-1">{charity.name}</h4>
                        <span className="text-[10px] font-sans text-primary/40 uppercase font-bold tracking-widest">/{charity.slug}</span>
                    </div>

                    <div className="col-span-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Sector</p>
                        <span className="px-3 py-1 bg-surface-container-highest rounded-full text-[9px] font-bold uppercase tracking-widest text-primary/60">
                            {charity.category || "General Fund"}
                        </span>
                    </div>

                    <div className="col-span-3 flex justify-end gap-3">
                        <button className="h-8 w-8 rounded-full border border-primary/10 flex items-center justify-center text-primary/40 hover:text-secondary hover:border-secondary/20 transition-all">
                            <Edit className="h-4 w-4" />
                        </button>
                        <button className="h-8 w-8 rounded-full border border-primary/10 flex items-center justify-center text-red-500/40 hover:text-red-500 hover:border-red-500/20 transition-all">
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))
        )}
      </div>
    </Card>
  );
}
