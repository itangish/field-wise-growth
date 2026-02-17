import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Search, Filter, DollarSign, Package, TrendingUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const products = [
  { id: 1, name: "Premium Maize", seller: "Kigali Green Fields", price: "450 RWF/kg", qty: "12,000 kg", rating: 4.8, status: "Available", category: "Grain" },
  { id: 2, name: "Arabica Coffee Beans", seller: "Karongi Coffee Estate", price: "3,200 RWF/kg", qty: "2,500 kg", rating: 4.9, status: "Available", category: "Cash Crop" },
  { id: 3, name: "Fresh Irish Potatoes", seller: "Musanze Highland Farm", price: "280 RWF/kg", qty: "8,000 kg", rating: 4.6, status: "Available", category: "Tuber" },
  { id: 4, name: "Organic Rice", seller: "Huye Rice Paddies", price: "1,100 RWF/kg", qty: "5,400 kg", rating: 4.7, status: "Low Stock", category: "Grain" },
  { id: 5, name: "Red Sorghum", seller: "Rubavu Lakeside Farm", price: "380 RWF/kg", qty: "3,200 kg", rating: 4.4, status: "Available", category: "Grain" },
  { id: 6, name: "Cooking Bananas", seller: "Karongi Coffee Estate", price: "200 RWF/kg", qty: "6,000 kg", rating: 4.5, status: "Available", category: "Fruit" },
];

const Marketplace = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell agricultural products</p>
        </div>
        <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />List Product</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<ShoppingCart className="h-5 w-5" />} label="Active Listings" value="1,247" change="+18%" changePositive delay={0} />
        <StatCard icon={<DollarSign className="h-5 w-5" />} label="Monthly Sales" value="48.2M RWF" change="+22%" changePositive delay={0.1} />
        <StatCard icon={<Package className="h-5 w-5" />} label="Orders Today" value="156" change="+12" changePositive delay={0.2} />
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Avg. Rating" value="4.6 ★" delay={0.3} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <Button variant="outline"><Filter className="mr-1.5 h-4 w-4" />Filter</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">{p.category}</Badge>
              <Badge variant={p.status === "Available" ? "default" : "secondary"} className="text-xs">{p.status}</Badge>
            </div>
            <h4 className="mt-3 text-base font-bold text-card-foreground">{p.name}</h4>
            <p className="text-xs text-muted-foreground">{p.seller}</p>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-lg font-bold text-primary">{p.price}</p>
                <p className="text-xs text-muted-foreground">{p.qty} available</p>
              </div>
              <div className="flex items-center gap-1 text-sm text-secondary">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold">{p.rating}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">Details</Button>
              <Button size="sm" className="flex-1">Order</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Marketplace;
