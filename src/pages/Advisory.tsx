import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Lightbulb, Bug, Droplets, TrendingUp, ShieldCheck, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialRecommendations = [
  { id: 1, type: "Pest Alert", icon: "bug", priority: "High", title: "Fall Armyworm detected in Field A3", detail: "Image analysis confirms early-stage infestation in maize crops. Recommend applying Chlorantraniliprole within 48 hours.", confidence: "92%", crop: "Maize" },
  { id: 2, type: "Irrigation", icon: "droplets", priority: "Medium", title: "Reduce irrigation in Zone 7", detail: "Soil moisture sensors show 85% saturation. Reduce water by 30% for the next 3 days to prevent root rot.", confidence: "88%", crop: "Rice" },
  { id: 3, type: "Fertilizer", icon: "sparkles", priority: "Medium", title: "Apply Nitrogen boost — Field B2", detail: "Leaf color analysis suggests nitrogen deficiency. Apply 45kg/ha urea within the next week for optimal growth.", confidence: "85%", crop: "Wheat" },
  { id: 4, type: "Yield Forecast", icon: "trending", priority: "Low", title: "Yield forecast upgraded for maize", detail: "Based on current growth patterns and favorable weather, expected yield increased from 4.2 to 4.8 t/ha.", confidence: "90%", crop: "Maize" },
  { id: 5, type: "Disease", icon: "shield", priority: "High", title: "Potato blight risk elevated", detail: "Humidity and temperature conditions favor late blight development in Musanze. Preventive fungicide application recommended.", confidence: "87%", crop: "Potatoes" },
];

const iconMap: Record<string, React.ReactNode> = {
  bug: <Bug className="h-5 w-5" />,
  droplets: <Droplets className="h-5 w-5" />,
  sparkles: <Sparkles className="h-5 w-5" />,
  trending: <TrendingUp className="h-5 w-5" />,
  shield: <ShieldCheck className="h-5 w-5" />,
};

const priorityColor = { High: "bg-destructive/10 text-destructive", Medium: "bg-warning/10 text-warning", Low: "bg-success/10 text-success" };

const Advisory = () => {
  const [recommendations, setRecommendations] = useState(initialRecommendations);
  const [appliedIds, setAppliedIds] = useState<number[]>([]);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisForm, setAnalysisForm] = useState({ crop: "", location: "", issue: "" });

  const handleDismiss = (id: number) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Dismissed", description: "Recommendation removed from your list." });
  };

  const handleApply = (id: number) => {
    setAppliedIds((prev) => [...prev, id]);
    toast({ title: "Applied ✓", description: "Recommendation marked as applied. Action logged to your farm journal." });
  };

  const handleRequestAnalysis = async () => {
    if (!analysisForm.crop && !analysisForm.issue) {
      toast({ title: "Please provide details", description: "Enter at least a crop or issue description.", variant: "destructive" });
      return;
    }
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise((r) => setTimeout(r, 2500));

    const newId = Date.now();
    const newRec = {
      id: newId,
      type: "AI Analysis",
      icon: "sparkles",
      priority: "Medium" as const,
      title: `Analysis: ${analysisForm.crop || "General"} — ${analysisForm.location || "Your Farm"}`,
      detail: `Based on your description "${analysisForm.issue || "general health check"}", AI recommends monitoring soil pH levels and applying organic compost at 2t/ha. Continue regular scouting for early pest detection.`,
      confidence: "84%",
      crop: analysisForm.crop || "General",
    };

    setRecommendations((prev) => [newRec, ...prev]);
    setAnalyzing(false);
    setAnalysisOpen(false);
    setAnalysisForm({ crop: "", location: "", issue: "" });
    toast({ title: "Analysis Complete", description: "New AI recommendation added to your list." });
  };

  const activeCount = recommendations.length;
  const highPriority = recommendations.filter((r) => r.priority === "High").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">AI Smart Advisory</h1>
            <p className="text-muted-foreground">AI-powered recommendations for pest control, irrigation, and yield optimization</p>
          </div>
          <Button size="sm" onClick={() => setAnalysisOpen(true)}>
            <Brain className="mr-1.5 h-4 w-4" />
            Request Analysis
          </Button>
        </div>

        {/* AI Summary */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-gradient-to-r from-accent to-card p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-card-foreground">AI Overview — Today</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeCount} active recommendations across your farms. {highPriority} high-priority alert{highPriority !== 1 ? "s" : ""} require{highPriority === 1 ? "s" : ""} immediate attention.
                {appliedIds.length > 0 && <> {appliedIds.length} recommendation{appliedIds.length !== 1 ? "s" : ""} applied today.</>}
                {" "}Overall crop health index: <span className="font-semibold text-success">82/100</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Recommendations */}
        <div className="space-y-3">
          <AnimatePresence>
            {recommendations.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-muted-foreground">
                All recommendations handled! Click "Request Analysis" to get new insights.
              </motion.div>
            )}
            {recommendations.map((rec, i) => {
              const isApplied = appliedIds.includes(rec.id);
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0, padding: 0 }}
                  transition={{ delay: 0.05 + i * 0.03 }}
                  className={`rounded-xl border border-border bg-card p-5 shadow-card ${isApplied ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      {iconMap[rec.icon] || <Sparkles className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-card-foreground">{rec.title}</h4>
                        <Badge variant="secondary" className="text-xs">{rec.type}</Badge>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColor[rec.priority as keyof typeof priorityColor]}`}>{rec.priority}</span>
                        {isApplied && (
                          <span className="flex items-center gap-1 text-xs text-success font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Applied
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{rec.detail}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>🌾 {rec.crop}</span>
                        <span>🎯 Confidence: {rec.confidence}</span>
                        <span className="flex items-center gap-1"><Lightbulb className="h-3 w-3" /> AI Explainability available</span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:flex-col">
                      <Button size="sm" variant="outline" onClick={() => handleDismiss(rec.id)}>Dismiss</Button>
                      <Button size="sm" onClick={() => handleApply(rec.id)} disabled={isApplied}>
                        {isApplied ? "Applied" : "Apply"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Request Analysis Dialog */}
      <Dialog open={analysisOpen} onOpenChange={setAnalysisOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" /> Request AI Analysis
            </DialogTitle>
            <DialogDescription>Describe what you'd like analyzed and get AI-powered recommendations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Crop Type</Label>
              <Input placeholder="e.g. Maize, Rice, Potatoes" value={analysisForm.crop} onChange={(e) => setAnalysisForm((f) => ({ ...f, crop: e.target.value }))} />
            </div>
            <div>
              <Label>Location / Field</Label>
              <Input placeholder="e.g. Field A3, Musanze" value={analysisForm.location} onChange={(e) => setAnalysisForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <Label>Issue / Question</Label>
              <Textarea placeholder="Describe the issue or what you want analyzed..." value={analysisForm.issue} onChange={(e) => setAnalysisForm((f) => ({ ...f, issue: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnalysisOpen(false)}>Cancel</Button>
            <Button onClick={handleRequestAnalysis} disabled={analyzing}>
              {analyzing ? <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Analyzing...</> : <><Brain className="mr-1.5 h-4 w-4" /> Analyze</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Advisory;
