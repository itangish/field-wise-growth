import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { BarChart3, Download, FileText, TrendingUp, Wheat, DollarSign, AlertTriangle, Calendar, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const typeIcon: Record<string, React.ReactNode> = {
  Production: <Wheat className="h-4 w-4" />,
  Financial: <DollarSign className="h-4 w-4" />,
  Risk: <AlertTriangle className="h-4 w-4" />,
  Market: <TrendingUp className="h-4 w-4" />,
  Forecast: <BarChart3 className="h-4 w-4" />,
};

interface Report {
  id: number;
  title: string;
  type: string;
  date: string;
  status: "Ready" | "Processing";
}

const initialReports: Report[] = [
  { id: 1, title: "Q4 2025 Production Summary", type: "Production", date: "Feb 15, 2026", status: "Ready" },
  { id: 2, title: "Annual Profit & Loss Statement", type: "Financial", date: "Feb 10, 2026", status: "Ready" },
  { id: 3, title: "Climate Risk Assessment — Western", type: "Risk", date: "Feb 8, 2026", status: "Ready" },
  { id: 4, title: "Monthly Marketplace Analytics", type: "Market", date: "Feb 5, 2026", status: "Ready" },
  { id: 5, title: "Season A Yield Forecast", type: "Forecast", date: "Feb 1, 2026", status: "Processing" },
];

const Reports = () => {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genForm, setGenForm] = useState({ title: "", type: "Production" });
  const [schedForm, setSchedForm] = useState({ type: "Production", frequency: "Weekly", email: "" });

  const handleGenerate = async () => {
    if (!genForm.title.trim()) {
      toast({ title: "Title required", description: "Please enter a report title.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    // Simulate processing
    const newId = Date.now();
    const newReport: Report = {
      id: newId,
      title: genForm.title,
      type: genForm.type,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Processing",
    };
    setReports((prev) => [newReport, ...prev]);
    setGenerateOpen(false);
    setGenForm({ title: "", type: "Production" });
    setGenerating(false);
    toast({ title: "Report Generating", description: "Your report is being processed. It will be ready shortly." });

    // Simulate completion after delay
    setTimeout(() => {
      setReports((prev) => prev.map((r) => r.id === newId ? { ...r, status: "Ready" as const } : r));
      toast({ title: "Report Ready", description: `"${newReport.title}" is now ready for download.` });
    }, 5000);
  };

  const handleSchedule = () => {
    setScheduleOpen(false);
    toast({
      title: "Schedule Created ✓",
      description: `${schedForm.type} report will be generated ${schedForm.frequency.toLowerCase()}.${schedForm.email ? ` Sent to ${schedForm.email}.` : ""}`,
    });
    setSchedForm({ type: "Production", frequency: "Weekly", email: "" });
  };

  const handleDownload = (report: Report) => {
    toast({ title: "Downloading...", description: `"${report.title}" is being prepared for download.` });
    // Simulate download
    setTimeout(() => {
      toast({ title: "Downloaded ✓", description: `${report.title} saved successfully.` });
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Production, financial, and risk reports</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setScheduleOpen(true)}>
              <Calendar className="mr-1.5 h-4 w-4" />Schedule
            </Button>
            <Button size="sm" onClick={() => setGenerateOpen(true)}>
              <FileText className="mr-1.5 h-4 w-4" />Generate Report
            </Button>
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
            {reports.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-muted/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  {typeIcon[r.type] || <FileText className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.date}</p>
                </div>
                <Badge variant={r.status === "Ready" ? "default" : "secondary"} className="text-xs flex items-center gap-1">
                  {r.status === "Processing" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {r.status === "Ready" && <CheckCircle2 className="h-3 w-3" />}
                  {r.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={r.status !== "Ready"}
                  onClick={() => handleDownload(r)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Generate Report</DialogTitle>
            <DialogDescription>Create a new report based on your farm data.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Title</Label>
              <Input placeholder="e.g. March 2026 Production Summary" value={genForm.title} onChange={(e) => setGenForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div>
              <Label>Report Type</Label>
              <Select value={genForm.type} onValueChange={(v) => setGenForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Risk">Risk Assessment</SelectItem>
                  <SelectItem value="Market">Market Analytics</SelectItem>
                  <SelectItem value="Forecast">Yield Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateOpen(false)}>Cancel</Button>
            <Button onClick={handleGenerate} disabled={generating}>
              {generating ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Generating...</> : <><FileText className="mr-1.5 h-4 w-4" /> Generate</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Schedule Reports</DialogTitle>
            <DialogDescription>Set up automatic report generation on a recurring schedule.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Report Type</Label>
              <Select value={schedForm.type} onValueChange={(v) => setSchedForm((f) => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Financial">Financial</SelectItem>
                  <SelectItem value="Risk">Risk Assessment</SelectItem>
                  <SelectItem value="Market">Market Analytics</SelectItem>
                  <SelectItem value="Forecast">Yield Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Frequency</Label>
              <Select value={schedForm.frequency} onValueChange={(v) => setSchedForm((f) => ({ ...f, frequency: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Email (optional)</Label>
              <Input placeholder="Send report to email..." value={schedForm.email} onChange={(e) => setSchedForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleSchedule}><Calendar className="mr-1.5 h-4 w-4" /> Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Reports;
