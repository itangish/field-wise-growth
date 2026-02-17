import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, TrendingUp, Wheat, DollarSign, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const productionData = [
  { province: "Kigali", value: 4200 },
  { province: "Northern", value: 6800 },
  { province: "Southern", value: 5400 },
  { province: "Eastern", value: 7200 },
  { province: "Western", value: 4800 },
];

const cropDistribution = [
  { name: "Maize", value: 35 },
  { name: "Rice", value: 20 },
  { name: "Potatoes", value: 18 },
  { name: "Coffee", value: 15 },
  { name: "Other", value: 12 },
];

const COLORS = ["hsl(145, 45%, 22%)", "hsl(42, 70%, 55%)", "hsl(210, 60%, 50%)", "hsl(35, 90%, 55%)", "hsl(150, 10%, 45%)"];

const recentReports = [
  { id: 1, title: "Q4 2025 Production Summary", type: "Production", date: "Feb 15, 2026", status: "Ready" },
  { id: 2, title: "Annual Profit & Loss Statement", type: "Financial", date: "Feb 10, 2026", status: "Ready" },
  { id: 3, title: "Climate Risk Assessment — Western", type: "Risk", date: "Feb 8, 2026", status: "Ready" },
  { id: 4, title: "Monthly Marketplace Analytics", type: "Market", date: "Feb 5, 2026", status: "Ready" },
  { id: 5, title: "Season A Yield Forecast", type: "Forecast", date: "Feb 1, 2026", status: "Processing" },
];

const typeIcon = {
  Production: <Wheat className="h-4 w-4" />,
  Financial: <DollarSign className="h-4 w-4" />,
  Risk: <AlertTriangle className="h-4 w-4" />,
  Market: <TrendingUp className="h-4 w-4" />,
  Forecast: <BarChart3 className="h-4 w-4" />,
};

const Reports = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Production, financial, and risk reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Calendar className="mr-1.5 h-4 w-4" />Schedule</Button>
          <Button size="sm"><FileText className="mr-1.5 h-4 w-4" />Generate Report</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Production by Province */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground">Production by Province</h3>
          <p className="text-sm text-muted-foreground">Tonnes produced this season</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 15%, 88%)" />
                <XAxis dataKey="province" tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(150, 10%, 45%)" />
                <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)" }} />
                <Bar dataKey="value" fill="hsl(145, 45%, 22%)" radius={[4, 4, 0, 0]} name="Production (t)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Crop Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-bold text-card-foreground">Crop Distribution</h3>
          <p className="text-sm text-muted-foreground">Percentage by crop type</p>
          <div className="mt-4 flex items-center gap-6">
            <div className="h-52 w-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={cropDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" stroke="none">
                    {cropDistribution.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(40, 15%, 88%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {cropDistribution.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-card-foreground">{c.name}</span>
                  <span className="text-muted-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="font-display text-base font-bold text-card-foreground">Recent Reports</h3>
        <div className="mt-4 space-y-2">
          {recentReports.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-muted/50">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                {typeIcon[r.type as keyof typeof typeIcon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-card-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.type} · {r.date}</p>
              </div>
              <Badge variant={r.status === "Ready" ? "default" : "secondary"} className="text-xs">{r.status}</Badge>
              <Button variant="ghost" size="icon" disabled={r.status !== "Ready"}><Download className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default Reports;
