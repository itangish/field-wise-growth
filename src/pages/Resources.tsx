import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { Package, Beaker, Droplets, Tractor, Users, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const resources = [
  { name: "Hybrid Maize Seeds", category: "Seeds", stock: 2400, unit: "kg", capacity: 5000, status: "Good", lastUpdated: "2 days ago" },
  { name: "NPK Fertilizer", category: "Fertilizer", stock: 800, unit: "kg", capacity: 3000, status: "Low", lastUpdated: "1 day ago" },
  { name: "Urea", category: "Fertilizer", stock: 1200, unit: "kg", capacity: 2000, status: "Good", lastUpdated: "3 days ago" },
  { name: "Chlorantraniliprole", category: "Pesticide", stock: 45, unit: "L", capacity: 200, status: "Low", lastUpdated: "Today" },
  { name: "Irrigation Water", category: "Water", stock: 78, unit: "%", capacity: 100, status: "Good", lastUpdated: "Live" },
  { name: "Tractor (John Deere)", category: "Machinery", stock: 3, unit: "units", capacity: 5, status: "Good", lastUpdated: "5 days ago" },
  { name: "Seasonal Workers", category: "Labor", stock: 42, unit: "workers", capacity: 60, status: "Good", lastUpdated: "Today" },
  { name: "Fungicide Spray", category: "Pesticide", stock: 12, unit: "L", capacity: 100, status: "Critical", lastUpdated: "Today" },
];

const statusColor = { Good: "default" as const, Low: "secondary" as const, Critical: "destructive" as const };

const Resources = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground">Track seeds, fertilizers, water, machinery, and labor</p>
        </div>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Resource</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Package className="h-5 w-5" />} label="Total Resources" value="8 types" delay={0} />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Low Stock Alerts" value="3" change="+1" changePositive={false} delay={0.1} />
        <StatCard icon={<Tractor className="h-5 w-5" />} label="Machinery Available" value="3/5" delay={0.2} />
        <StatCard icon={<Users className="h-5 w-5" />} label="Active Workers" value="42" change="+5" changePositive delay={0.3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resources.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.04 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-card-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.category}</p>
              </div>
              <Badge variant={statusColor[r.status as keyof typeof statusColor]}>{r.status}</Badge>
            </div>
            <div className="mt-4">
              <div className="flex items-end justify-between text-sm">
                <span className="font-semibold text-card-foreground">{r.stock} {r.unit}</span>
                <span className="text-xs text-muted-foreground">/ {r.capacity} {r.unit}</span>
              </div>
              <Progress value={(r.stock / r.capacity) * 100} className="mt-2 h-2" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Updated {r.lastUpdated}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Resources;
