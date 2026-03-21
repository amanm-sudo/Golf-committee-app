import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 selection:bg-secondary/20">
      <Link href="/" className="mb-12 group transition-all text-center">
        <h1 className="text-5xl font-serif font-black italic tracking-tighter text-primary group-hover:scale-[1.05] transition-transform duration-700">Digital Heroes</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-secondary">Premium Philanthropy</p>
      </Link>

      <Card variant="low" className="w-full max-w-lg p-16 border-t-8 border-secondary relative overflow-hidden text-center">
        <div className="flex justify-center mb-8">
            <div className="h-24 w-24 bg-secondary/10 rounded-full flex items-center justify-center border-4 border-secondary/20">
                <CheckCircle2 className="h-12 w-12 text-secondary" strokeWidth={3} />
            </div>
        </div>

        <h2 className="text-4xl font-serif italic mb-4">Membership Confirmed</h2>
        <p className="text-primary/60 font-sans mb-12">
            Your Digital Heroes account has been securely created. You now have full access to the subscriber portal to manage your impact and scorecards.
        </p>

        <Button asChild className="w-full py-6 group">
            <Link href="/dashboard">
                Enter Dashboard <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
        </Button>
      </Card>
      
      <footer className="mt-20 opacity-30 text-[10px] font-bold uppercase tracking-[0.8em]">
        © 2026 Digital Heroes LP
      </footer>
    </div>
  );
}
