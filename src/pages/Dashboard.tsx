import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Wheat, Users, TrendingUp, AlertTriangle, CloudSun, Droplets, Wind, Thermometer,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();

  const { data: farms = [] } = useQuery({
    queryKey: ["dashboard-farms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farms").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: resources = [] } = useQuery({
    queryKey: ["dashboard-resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["dashboard-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    },
  });

  const totalArea = farms.reduce((s, f) => s + (f.area_ha || 0), 0);
  const avgYield = farms.length > 0
    ? (farms.reduce((s, f) => s + (f.yield_per_ha || 0), 0) / farms.filter(f => f.yield_per_ha).length).toFixed(2)
    : "—";
  const lowStockAlerts = resources.filter((r) => r.status === "Low" || r.status === "Critical").length;

  // Monthly income trend from transactions
  const monthlyData = transactions.reduce<Record<string, number>>((acc, t) => {
    if (t.type === "income") {
      const month = new Date(t.created_at).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + t.amount;
    }
    return acc;
  }, {});
  const yieldData = Object.entries(monthlyData).map(([month, amount]) => ({ month, yield: amount / 1000 }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Your agriculture overview</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Wheat className="h-5 w-5" />} label="Total Farms" value={String(farms.length)} delay={0} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Total Area" value={`${totalArea.toFixed(0)} ha`} delay={0.1} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg. Yield" value={avgYield !== "—" ? `${avgYield} t/ha` : "—"} delay={0.2} />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Low Stock Alerts" value={String(lowStockAlerts)} delay={0.3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {yieldData.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2">
              <h3 className="font-display text-base font-bold text-card-foreground">Income Trend</h3>
              <p className="text-sm text-muted-foreground">Monthly income (thousands RWF)</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={yieldData}>
                    <defs>
                      <linearGradient id="yieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(145, 45%, 22%)" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(145, 45%, 22%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(150, 10%, 45%)" />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)" }} />
                    <Area type="monotone" dataKey="yield" stroke="hsl(145, 45%, 22%)" strokeWidth={2} fill="url(#yieldGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">Quick Summary</h3>
            <p className="text-sm text-muted-foreground">Your data at a glance</p>
            <div className="mt-6 grid grid-cols-1 gap-3">
              {[
                { icon: <Wheat className="h-4 w-4" />, label: "Active Farms", value: String(farms.filter(f => f.status === "Active").length) },
                { icon: <Droplets className="h-4 w-4" />, label: "Resources", value: String(resources.length) },
                { icon: <Wind className="h-4 w-4" />, label: "Transactions", value: String(transactions.length) },
              ].map((w) => (
                <div key={w.label} className="rounded-lg bg-muted p-3 text-center">
                  <div className="flex justify-center text-muted-foreground">{w.icon}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{w.label}</p>
                  <p className="text-sm font-semibold text-card-foreground">{w.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
