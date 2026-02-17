import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PiggyBank,
  Receipt,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const revenueData = [
  { month: "Jan", income: 4200, expenses: 2800 },
  { month: "Feb", income: 3800, expenses: 2600 },
  { month: "Mar", income: 5100, expenses: 3200 },
  { month: "Apr", income: 4700, expenses: 2900 },
  { month: "May", income: 5600, expenses: 3100 },
  { month: "Jun", income: 6200, expenses: 3400 },
  { month: "Jul", income: 7100, expenses: 3800 },
  { month: "Aug", income: 6800, expenses: 3600 },
  { month: "Sep", income: 7500, expenses: 4000 },
  { month: "Oct", income: 8200, expenses: 4200 },
  { month: "Nov", income: 7900, expenses: 4100 },
  { month: "Dec", income: 8600, expenses: 4400 },
];

const expenseBreakdown = [
  { category: "Seeds", amount: 12400 },
  { category: "Fertilizer", amount: 9800 },
  { category: "Labor", amount: 18200 },
  { category: "Equipment", amount: 7600 },
  { category: "Transport", amount: 5400 },
  { category: "Storage", amount: 3200 },
];

const transactions = [
  { id: 1, desc: "Maize sale — Buyer K. Mugabo", amount: "+2,400,000 RWF", type: "income", date: "Today", method: "Mobile Money" },
  { id: 2, desc: "Fertilizer purchase — AgriSupply Ltd", amount: "-580,000 RWF", type: "expense", date: "Yesterday", method: "Bank Transfer" },
  { id: 3, desc: "Rice harvest — Musanze District", amount: "+3,100,000 RWF", type: "income", date: "Feb 14", method: "Bank Transfer" },
  { id: 4, desc: "Seasonal labor wages — 12 workers", amount: "-1,200,000 RWF", type: "expense", date: "Feb 13", method: "Mobile Money" },
  { id: 5, desc: "Cassava sale — Export order", amount: "+5,800,000 RWF", type: "income", date: "Feb 12", method: "Bank Transfer" },
  { id: 6, desc: "Pesticide order — CropGuard Inc.", amount: "-340,000 RWF", type: "expense", date: "Feb 11", method: "Mobile Money" },
  { id: 7, desc: "Government subsidy — Season A", amount: "+1,500,000 RWF", type: "income", date: "Feb 10", method: "Bank Transfer" },
];

const taxSummary = [
  { label: "Gross Revenue", value: "86,400,000 RWF" },
  { label: "Deductible Expenses", value: "42,100,000 RWF" },
  { label: "Taxable Income", value: "44,300,000 RWF" },
  { label: "Estimated Tax (15%)", value: "6,645,000 RWF" },
];

const Finance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Finance & Tax</h1>
            <p className="text-muted-foreground">Income, expenses, profit analysis & tax overview</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Receipt className="mr-1.5 h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm">
              <DollarSign className="mr-1.5 h-4 w-4" />
              Record Transaction
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Revenue" value="86.4M RWF" change="+18%" changePositive delay={0} />
          <StatCard icon={<Wallet className="h-5 w-5" />} label="Total Expenses" value="42.1M RWF" change="+6%" changePositive={false} delay={0.1} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Net Profit" value="44.3M RWF" change="+27%" changePositive delay={0.2} />
          <StatCard icon={<PiggyBank className="h-5 w-5" />} label="Tax Liability" value="6.6M RWF" change="-2%" changePositive delay={0.3} />
        </div>

        {/* Revenue vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <h3 className="font-display text-base font-bold text-card-foreground">Revenue vs Expenses</h3>
          <p className="text-sm text-muted-foreground">Monthly comparison (thousands RWF)</p>
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
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                <Area type="monotone" dataKey="income" stroke="hsl(145, 45%, 22%)" strokeWidth={2} fill="url(#incomeGrad)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="hsl(42, 70%, 55%)" strokeWidth={2} fill="url(#expenseGrad)" name="Expenses" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Expense Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <h3 className="font-display text-base font-bold text-card-foreground">Expense Breakdown</h3>
            <p className="text-sm text-muted-foreground">By category (thousands RWF)</p>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" width={70} />
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)" }} />
                  <Bar dataKey="amount" fill="hsl(42, 70%, 55%)" radius={[0, 4, 4, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Tax Summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2"
          >
            <Tabs defaultValue="tax">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-card-foreground">Financial Summary</h3>
                <TabsList>
                  <TabsTrigger value="tax">Tax Overview</TabsTrigger>
                  <TabsTrigger value="payments">Payment Methods</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="tax" className="mt-4">
                <div className="space-y-3">
                  {taxSummary.map((item, i) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`text-sm font-semibold ${i === taxSummary.length - 1 ? "text-secondary" : "text-card-foreground"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-lg border border-border bg-accent/30 p-4">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Tax Tip:</strong> You can deduct equipment depreciation and certified organic inputs to reduce taxable income. Consult the national agriculture tax guide for eligible deductions.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="mt-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { method: "Mobile Money (MTN)", balance: "12,400,000 RWF", icon: <CreditCard className="h-5 w-5" />, status: "Connected" },
                    { method: "Bank of Kigali", balance: "28,600,000 RWF", icon: <Wallet className="h-5 w-5" />, status: "Connected" },
                    { method: "Airtel Money", balance: "3,200,000 RWF", icon: <CreditCard className="h-5 w-5" />, status: "Connected" },
                    { method: "I&M Bank", balance: "—", icon: <Wallet className="h-5 w-5" />, status: "Not linked" },
                  ].map((pm) => (
                    <div key={pm.method} className="flex items-center gap-3 rounded-lg bg-muted/50 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        {pm.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{pm.method}</p>
                        <p className="text-xs text-muted-foreground">{pm.balance}</p>
                      </div>
                      <Badge variant={pm.status === "Connected" ? "default" : "secondary"} className="text-xs">
                        {pm.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-card-foreground">Recent Transactions</h3>
              <p className="text-sm text-muted-foreground">Latest financial activity</p>
            </div>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="mt-4 space-y-2">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-muted/50">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${tx.type === "income" ? "bg-success/10" : "bg-destructive/10"}`}>
                  {tx.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{tx.desc}</p>
                  <p className="text-xs text-muted-foreground">{tx.method}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === "income" ? "text-success" : "text-destructive"}`}>
                    {tx.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
