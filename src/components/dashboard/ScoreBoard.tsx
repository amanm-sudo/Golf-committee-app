"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar, Trash2, PlusCircle, CheckCircle } from "lucide-react";

interface Score {
  id: string;
  score: number;
  scored_at: string;
}

export default function ScoreBoard() {
  const [scores, setScores] = useState<Score[]>([]);
  const [newScore, setNewScore] = useState<number | "">("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchScores();
  }, []);

  async function fetchScores() {
    setIsLoading(true);
    const res = await fetch("/api/scores");
    if (res.ok) {
      const data = await res.json();
      setScores(data);
    }
    setIsLoading(false);
  }

  async function addScore() {
    if (!newScore || isSubmitting) return;
    setIsSubmitting(true);

    const res = await fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ score: Number(newScore), scored_at: date }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setNewScore("");
      fetchScores();
    }
    setIsSubmitting(false);
  }

  return (
    <Card variant="low" className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl mb-2">My Scorecard</h2>
          <p className="font-sans text-primary/60">Manage your latest 5 scores. Only your most recent 5 scores qualify for the monthly draw.</p>
        </div>
        <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold tracking-widest text-primary/50">Score (1-45)</label>
                <input
                type="number"
                min="1"
                max="45"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="0"
                className="input-fairway w-24 text-2xl font-bold"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs uppercase font-bold tracking-widest text-primary/50">Date</label>
                <input
                type="date"
                value={date}
                max={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setDate(e.target.value)}
                className="input-fairway text-sm"
                />
            </div>
            <Button onClick={addScore} disabled={isSubmitting} size="md">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Score
            </Button>
        </div>
      </div>

      <div className="flex gap-4 h-48 overflow-hidden relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {scores.map((s, index) => (
            <motion.div
              key={s.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex-1 min-w-[200px]"
            >
              <Card variant="lowest" className="h-full flex flex-col items-center justify-center p-6 border-b-4 border-secondary/20 hover:border-secondary shadow-sm">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">#{scores.length - index}</span>
                <span className="text-5xl font-serif font-black italic mb-2">{s.score}</span>
                <div className="flex items-center text-xs text-primary/40 font-bold">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(new Date(s.scored_at), "MMM do, yyyy")}
                </div>
              </Card>
            </motion.div>
          ))}
          {isLoading && [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 min-w-[200px] animate-pulse bg-white/50 rounded-lg" />
          ))}
          {!isLoading && scores.length === 0 && (
            <div className="w-full flex items-center justify-center text-primary/30 uppercase tracking-[0.2em] font-bold text-sm">
              Your scorecard is empty. Enter your first score.
            </div>
          )}
        </AnimatePresence>
      </div>
      
      {scores.length === 5 && (
        <p className="mt-6 text-xs text-secondary font-bold flex items-center justify-center">
          <CheckCircle className="h-3 w-3 mr-2" /> 
          Maximum scores reached. Adding a new score will replace the oldest ({format(new Date(scores[scores.length-1].scored_at), "MMM do")}).
        </p>
      )}
    </Card>
  );
}
