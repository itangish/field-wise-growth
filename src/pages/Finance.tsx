import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  DollarSign, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, PiggyBank, Receipt, Plus,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const txCategories = ["Sales", "Seeds", "Fertilizer", "Labor", "Equipment", "Transport", "Storage", "Subsidy", "Other"];

const Finance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: "income", category: "Sales", amount: "", description: "" });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createTx = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("transactions").insert({
        user_id: user!.id,
        type: form.type,
        category: form.category,
        amount: parseFloat(form.amount),
        description: form.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setOpen(false);
      setForm({ type: "income", category: "Sales", amount: "", description: "" });
      toast({ title: "Transaction recorded" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Group by category for chart
  const expenseByCategory = transactions.filter((t) => t.type === "expense").reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});
  const expenseChartData = Object.entries(expenseByCategory).map(([category, amount]) => ({ category, amount }));

  // Group by month for trend
  const monthlyData = transactions.reduce<Record<string, { income: number; expenses: number }>>((acc, t) => {
    const month = new Date(t.created_at).toLocaleString("default", { month: "short" });
    if (!acc[month]) acc[month] = { income: 0, expenses: 0 };
    if (t.type === "income") acc[month].income += t.amount;
    else acc[month].expenses += t.amount;
    return acc;
  }, {});
  const revenueData = Object.entries(monthlyData).map(([month, d]) => ({ month, ...d }));

  const fmt = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M RWF`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K RWF`;
    return `${n.toLocaleString()} RWF`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Finance & Tax</h1>
            <p className="text-muted-foreground">Income, expenses, profit analysis & tax overview</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Record Transaction</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Record Transaction</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{txCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Amount (RWF) *</Label><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <Button onClick={() => createTx.mutate()} disabled={!form.amount || createTx.isPending}>
                  {createTx.isPending ? "Saving…" : "Record Transaction"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value={fmt(totalIncome)} delay={0} />
          <StatCard icon={<Wallet className="h-5 w-5" />} label="Total Expenses" value={fmt(totalExpenses)} delay={0.1} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Net Profit" value={fmt(netProfit)} delay={0.2} />
          <StatCard icon={<PiggyBank className="h-5 w-5" />} label="Transactions" value={String(transactions.length)} delay={0.3} />
        </div>

        {revenueData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">Revenue vs Expenses</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(145, 45%, 22%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(145, 45%, 22%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42, 70%, 55%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(42, 70%, 55%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)" }} />
                  <Area type="monotone" dataKey="income" stroke="hsl(145, 45%, 22%)" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                  <Area type="monotone" dataKey="expenses" stroke="hsl(42, 70%, 55%)" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {expenseChartData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">Expense Breakdown</h3>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" width={70} />
                  <Tooltip contentStyle={{ borderRadius: "8px" }} />
                  <Bar dataKey="amount" fill="hsl(42, 70%, 55%)" radius={[0, 4, 4, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Recent Transactions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground">Recent Transactions</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : transactions.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No transactions yet. Record your first transaction above.</p>
          ) : (
            <div className="mt-4 space-y-2">
              {transactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                    {tx.type === "income" ? <ArrowUpRight className="h-4 w-4 text-success" /> : <ArrowDownRight className="h-4 w-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-card-foreground">{tx.description || tx.category}</p>
                    <p className="text-xs text-muted-foreground">{tx.category}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                      {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString()} {tx.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
