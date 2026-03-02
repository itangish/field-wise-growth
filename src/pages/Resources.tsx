import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Package, Tractor, Users, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const statusColor = { Good: "default" as const, Low: "secondary" as const, Critical: "destructive" as const };
const categories = ["Seeds", "Fertilizer", "Pesticide", "Water", "Machinery", "Labor"];

const Resources = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Seeds", stock: "", capacity: "", unit: "kg", status: "Good" });

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("resources").select("*").order("last_updated", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createResource = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("resources").insert({
        user_id: user!.id,
        name: form.name,
        category: form.category,
        stock: parseFloat(form.stock) || 0,
        capacity: parseFloat(form.capacity) || 0,
        unit: form.unit,
        status: form.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      setOpen(false);
      setForm({ name: "", category: "Seeds", stock: "", capacity: "", unit: "kg", status: "Good" });
      toast({ title: "Resource added" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const lowStock = resources.filter((r) => r.status === "Low" || r.status === "Critical").length;
  const machinery = resources.filter((r) => r.category === "Machinery");
  const workers = resources.filter((r) => r.category === "Labor");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Resource Management</h1>
            <p className="text-muted-foreground">Track seeds, fertilizers, water, machinery, and labor</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Resource</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Unit</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Current Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} /></div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => createResource.mutate()} disabled={!form.name || createResource.isPending}>
                  {createResource.isPending ? "Saving…" : "Add Resource"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Package className="h-5 w-5" />} label="Total Resources" value={`${resources.length} items`} delay={0} />
          <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Low Stock Alerts" value={String(lowStock)} delay={0.1} />
          <StatCard icon={<Tractor className="h-5 w-5" />} label="Machinery" value={`${machinery.reduce((s, m) => s + m.stock, 0)} units`} delay={0.2} />
          <StatCard icon={<Users className="h-5 w-5" />} label="Active Workers" value={String(workers.reduce((s, w) => s + w.stock, 0))} delay={0.3} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : resources.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No resources yet. Add your first resource above.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-card-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                  </div>
                  <Badge variant={statusColor[r.status as keyof typeof statusColor] || "default"}>{r.status}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex items-end justify-between text-sm">
                    <span className="font-semibold text-card-foreground">{r.stock} {r.unit}</span>
                    <span className="text-xs text-muted-foreground">/ {r.capacity} {r.unit}</span>
                  </div>
                  <Progress value={r.capacity > 0 ? (r.stock / r.capacity) * 100 : 0} className="mt-2 h-2" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">Updated {new Date(r.last_updated).toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Resources;
