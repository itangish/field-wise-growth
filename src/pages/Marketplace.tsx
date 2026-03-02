import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Search, Filter, DollarSign, Package, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const productCategories = ["Grain", "Tuber", "Cash Crop", "Fruit", "Vegetable", "Legume", "Other"];

const Marketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Grain", price: "", quantity: "", unit: "kg", description: "" });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").insert({
        seller_id: user!.id,
        name: form.name,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseFloat(form.quantity) || 0,
        unit: form.unit,
        description: form.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setOpen(false);
      setForm({ name: "", category: "Grain", price: "", quantity: "", unit: "kg", description: "" });
      toast({ title: "Product listed successfully" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const placeOrder = useMutation({
    mutationFn: async (product: typeof products[0]) => {
      const { error } = await supabase.from("orders").insert({
        buyer_id: user!.id,
        product_id: product.id,
        quantity: 1,
        total_price: product.price,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Order placed!" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const filtered = products.filter(
    (p) => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const available = products.filter((p) => p.status === "Available").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground">Buy and sell agricultural products</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="mr-1.5 h-4 w-4" />List Product</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>List a Product</DialogTitle></DialogHeader>
              <div className="grid gap-4">
                <div className="space-y-2"><Label>Product Name *</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{productCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>Unit</Label><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} /></div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Price (RWF) *</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <Button onClick={() => createProduct.mutate()} disabled={!form.name || !form.price || createProduct.isPending}>
                  {createProduct.isPending ? "Listing…" : "List Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<ShoppingCart className="h-5 w-5" />} label="Active Listings" value={String(available)} delay={0} />
          <StatCard icon={<DollarSign className="h-5 w-5" />} label="Total Products" value={String(products.length)} delay={0.1} />
          <StatCard icon={<Package className="h-5 w-5" />} label="Categories" value={String(new Set(products.map((p) => p.category)).size)} delay={0.2} />
          <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg. Rating" value={products.length ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) + " ★" : "—"} delay={0.3} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search products..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No products found. List your first product above.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start justify-between">
                  <Badge variant="secondary" className="text-xs">{p.category}</Badge>
                  <Badge variant={p.status === "Available" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
                </div>
                <h4 className="mt-3 text-base font-bold text-card-foreground">{p.name}</h4>
                {p.description && <p className="text-xs text-muted-foreground mt-1">{p.description}</p>}
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary">{p.price.toLocaleString()} {p.currency}/{p.unit}</p>
                    <p className="text-xs text-muted-foreground">{p.quantity.toLocaleString()} {p.unit} available</p>
                  </div>
                  {(p.rating ?? 0) > 0 && (
                    <div className="flex items-center gap-1 text-sm text-secondary">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-semibold">{p.rating}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  {p.seller_id !== user?.id && (
                    <Button size="sm" className="flex-1" onClick={() => placeOrder.mutate(p)} disabled={placeOrder.isPending}>Order</Button>
                  )}
                  {p.seller_id === user?.id && <Badge variant="outline">Your listing</Badge>}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
