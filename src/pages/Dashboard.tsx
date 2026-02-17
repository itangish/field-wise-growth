import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import {
  Wheat,
  Users,
  TrendingUp,
  AlertTriangle,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  CheckCircle2,
  Clock,
  Circle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const yieldData = [
  { month: "Jan", yield: 320 },
  { month: "Feb", yield: 380 },
  { month: "Mar", yield: 420 },
  { month: "Apr", yield: 390 },
  { month: "May", yield: 480 },
  { month: "Jun", yield: 520 },
  { month: "Jul", yield: 610 },
  { month: "Aug", yield: 580 },
  { month: "Sep", yield: 650 },
  { month: "Oct", yield: 720 },
  { month: "Nov", yield: 690 },
  { month: "Dec", yield: 740 },
];

const tasks = [
  { status: "done", label: "Apply fertilizer — Field A3", time: "2h ago" },
  { status: "progress", label: "Irrigation check — Zone 7", time: "In progress" },
  { status: "pending", label: "Pest inspection — Block B", time: "Scheduled" },
  { status: "pending", label: "Harvest prep — Field C1", time: "Tomorrow" },
];

const alerts = [
  { type: "warning", text: "Heavy rain expected in Western Province (72h)" },
  { type: "info", text: "AI recommends increasing irrigation in Zone 4" },
  { type: "success", text: "Yield forecast upgraded for maize crops" },
];

const statusIcon = {
  done: <CheckCircle2 className="h-4 w-4 text-success" />,
  progress: <Clock className="h-4 w-4 text-warning" />,
  pending: <Circle className="h-4 w-4 text-muted-foreground" />,
};

const alertColors = {
  warning: "border-l-warning bg-warning/5",
  info: "border-l-info bg-info/5",
  success: "border-l-success bg-success/5",
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">National agriculture overview</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Wheat className="h-5 w-5" />}
            label="Total Farms"
            value="12,847"
            change="+12%"
            changePositive
            delay={0}
          />
          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Active Farmers"
            value="34,291"
            change="+8%"
            changePositive
            delay={0.1}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Avg. Yield (t/ha)"
            value="4.82"
            change="+15%"
            changePositive
            delay={0.2}
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5" />}
            label="Active Alerts"
            value="7"
            change="+3"
            changePositive={false}
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Yield Chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card lg:col-span-2"
          >
            <h3 className="font-display text-base font-bold text-card-foreground">
              Yield Production Trend
            </h3>
            <p className="text-sm text-muted-foreground">Monthly production in tonnes</p>
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
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(40, 15%, 88%)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(145, 45%, 22%)"
                    strokeWidth={2}
                    fill="url(#yieldGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Weather */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <h3 className="font-display text-base font-bold text-card-foreground">
              Weather Today
            </h3>
            <p className="text-sm text-muted-foreground">Kigali District</p>

            <div className="mt-6 flex items-center gap-4">
              <CloudSun className="h-12 w-12 text-secondary" />
              <div>
                <p className="font-display text-3xl font-bold text-card-foreground">24°C</p>
                <p className="text-sm text-muted-foreground">Partly Cloudy</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: <Droplets className="h-4 w-4" />, label: "Humidity", value: "68%" },
                { icon: <Wind className="h-4 w-4" />, label: "Wind", value: "12 km/h" },
                { icon: <Thermometer className="h-4 w-4" />, label: "Feels like", value: "26°C" },
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

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <h3 className="font-display text-base font-bold text-card-foreground">Recent Tasks</h3>
            <div className="mt-4 space-y-3">
              {tasks.map((task) => (
                <div key={task.label} className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3">
                  {statusIcon[task.status as keyof typeof statusIcon]}
                  <span className="flex-1 text-sm text-card-foreground">{task.label}</span>
                  <span className="text-xs text-muted-foreground">{task.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <h3 className="font-display text-base font-bold text-card-foreground">Smart Alerts</h3>
            <div className="mt-4 space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.text}
                  className={`rounded-lg border-l-4 px-4 py-3 ${alertColors[alert.type as keyof typeof alertColors]}`}
                >
                  <p className="text-sm text-card-foreground">{alert.text}</p>
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
