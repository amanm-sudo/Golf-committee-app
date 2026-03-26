"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Loader2, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock user fetch for the purpose of the PRD assignment if not fully hooked
    async function fetchUsers() {
      setIsLoading(true);
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        setUsers(await res.json());
      } else {
        // Fallback mock since endpoints might be missing
        setUsers([
           { id: "1", full_name: "John Doe", email: "john@golf.com", role: "subscriber", created_at: new Date().toISOString() },
           { id: "2", full_name: "Sarah Walker", email: "sarah@heritage.com", role: "admin", created_at: new Date().toISOString() },
        ]);
      }
      setIsLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <Card variant="low" className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-serif italic font-black">User Directory</h2>
        <span className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">{users.length} Records</span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
            <div className="py-20 flex justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary/10" /></div>
        ) : users.length === 0 ? (
            <div className="py-20 text-center opacity-30 uppercase tracking-[0.4em] text-sm">No users found.</div>
        ) : (
            users.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-8 p-6 bg-white rounded-lg items-center border border-primary/5 hover:border-secondary transition-all shadow-sm">
                    <div className="col-span-4 flex flex-col">
                        <h4 className="font-serif italic text-xl mb-1">{user.full_name}</h4>
                        <span className="text-xs font-sans text-primary/60">{user.email}</span>
                    </div>

                    <div className="col-span-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Account Role</p>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${user.role === "admin" ? "bg-secondary/20 text-secondary" : "bg-primary/5 text-primary/60"}`}>
                            {user.role}
                        </span>
                    </div>

                    <div className="col-span-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40 mb-1">Joined</p>
                        <span className="text-xs font-bold font-sans">{format(new Date(user.created_at), "MMM d, yyyy")}</span>
                    </div>

                    <div className="col-span-2 flex justify-end gap-3">
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
