import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Map, Plus, Search, Filter, Wheat, Droplets, TreePine, MoreVertical, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const districts = ["Kigali", "Musanze", "Huye", "Rubavu", "Nyagatare", "Karongi", "Rwamagana", "Muhanga"];

const Farms = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", district: "", area_ha: "", crops: "", status: "Active" });

  const { data: farms = [], isLoading } = useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farms").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createFarm = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("farms").insert({
        user_id: user!.id,
        name: form.name,
        location: form.location,
        district: form.district,
        area_ha: form.area_ha ? parseFloat(form.area_ha) : null,
        crops: form.crops ? form.crops.split(",").map((c) => c.trim()) : [],
        status: form.status,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      setOpen(false);
      setForm({ name: "", location: "", district: "", area_ha: "", crops: "", status: "Active" });
      toast({ title: "Farm registered successfully" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const deleteFarm = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("farms").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast({ title: "Farm deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const filtered = farms.filter(
    (f) => !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.district?.toLowerCase().includes(search.toLowerCase())
  );

  const totalArea = farms.reduce((s, f) => s + (f.area_ha || 0), 0);
  const activeFarms = farms.filter((f) => f.status === "Active").length;
  const allCrops = new Set(farms.flatMap((f) => f.crops || []));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Farm Management</h1>
            <p className="text-muted-foreground">Register, monitor and manage all farm operations</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Register Farm</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Register New Farm</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2"><Label>Farm Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select value={form.district} onValueChange={(v) => setForm({ ...form, district: v })}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Area (ha)</Label><Input type="number" value={form.area_ha} onChange={(e) => setForm({ ...form, area_ha: e.target.value })} /></div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Dormant">Dormant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2"><Label>Crops (comma-separated)</Label><Input value={form.crops} onChange={(e) => setForm({ ...form, crops: e.target.value })} placeholder="Maize, Beans, Rice" /></div>
                <Button onClick={() => createFarm.mutate()} disabled={!form.name || createFarm.isPending}>
                  {createFarm.isPending ? "Saving…" : "Register Farm"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Map className="h-5 w-5" />} label="Total Farms" value={String(farms.length)} delay={0} />
          <StatCard icon={<Wheat className="h-5 w-5" />} label="Total Area" value={`${totalArea.toFixed(0)} ha`} delay={0.1} />
          <StatCard icon={<Droplets className="h-5 w-5" />} label="Active Farms" value={String(activeFarms)} delay={0.2} />
          <StatCard icon={<TreePine className="h-5 w-5" />} label="Crop Varieties" value={String(allCrops.size)} delay={0.3} />
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-display text-base font-bold text-card-foreground">Registered Farms</h3>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search farms..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Farm Name</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Crops</TableHead>
                  <TableHead>Yield</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No farms found. Register your first farm above.</TableCell></TableRow>
                ) : filtered.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell className="font-medium text-card-foreground">{farm.name}</TableCell>
                    <TableCell className="text-muted-foreground">{farm.district || "—"}</TableCell>
                    <TableCell>{farm.area_ha ? `${farm.area_ha} ha` : "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(farm.crops || []).map((c) => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{farm.yield_per_ha ? `${farm.yield_per_ha} t/ha` : "—"}</TableCell>
                    <TableCell><Badge variant={farm.status === "Active" ? "default" : "secondary"}>{farm.status}</Badge></TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteFarm.mutate(farm.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Farms;
