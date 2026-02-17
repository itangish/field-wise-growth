import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { motion } from "framer-motion";
import { Map, Plus, Search, Filter, Wheat, Droplets, TreePine, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const farms = [
  { id: 1, name: "Kigali Green Fields", location: "Kigali District", area: "45 ha", crops: ["Maize", "Beans"], status: "Active", yield: "4.8 t/ha" },
  { id: 2, name: "Musanze Highland Farm", location: "Musanze District", area: "120 ha", crops: ["Potatoes", "Wheat"], status: "Active", yield: "6.2 t/ha" },
  { id: 3, name: "Huye Rice Paddies", location: "Huye District", area: "78 ha", crops: ["Rice"], status: "Active", yield: "5.1 t/ha" },
  { id: 4, name: "Rubavu Lakeside Farm", location: "Rubavu District", area: "32 ha", crops: ["Cassava", "Sorghum"], status: "Dormant", yield: "3.4 t/ha" },
  { id: 5, name: "Nyagatare Cattle Ranch", location: "Nyagatare District", area: "200 ha", crops: ["Pasture", "Maize"], status: "Active", yield: "4.0 t/ha" },
  { id: 6, name: "Karongi Coffee Estate", location: "Karongi District", area: "55 ha", crops: ["Coffee", "Bananas"], status: "Active", yield: "2.8 t/ha" },
];

const Farms = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Farm Management</h1>
          <p className="text-muted-foreground">Register, monitor and manage all farm operations</p>
        </div>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Register Farm
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<Map className="h-5 w-5" />} label="Total Farms" value="12,847" change="+12%" changePositive delay={0} />
        <StatCard icon={<Wheat className="h-5 w-5" />} label="Total Area" value="530 ha" change="+8%" changePositive delay={0.1} />
        <StatCard icon={<Droplets className="h-5 w-5" />} label="Irrigated" value="68%" change="+5%" changePositive delay={0.2} />
        <StatCard icon={<TreePine className="h-5 w-5" />} label="Crop Varieties" value="24" change="+2" changePositive delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-border bg-card shadow-card">
        <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-display text-base font-bold text-card-foreground">Registered Farms</h3>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search farms..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farm Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Crops</TableHead>
              <TableHead>Yield</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium text-card-foreground">{farm.name}</TableCell>
                <TableCell className="text-muted-foreground">{farm.location}</TableCell>
                <TableCell>{farm.area}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {farm.crops.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{farm.yield}</TableCell>
                <TableCell>
                  <Badge variant={farm.status === "Active" ? "default" : "secondary"}>{farm.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default Farms;
