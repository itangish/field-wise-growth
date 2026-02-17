import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Brain, Lightbulb, Bug, Droplets, TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const recommendations = [
  { id: 1, type: "Pest Alert", icon: <Bug className="h-5 w-5" />, priority: "High", title: "Fall Armyworm detected in Field A3", detail: "Image analysis confirms early-stage infestation in maize crops. Recommend applying Chlorantraniliprole within 48 hours.", confidence: "92%", crop: "Maize" },
  { id: 2, type: "Irrigation", icon: <Droplets className="h-5 w-5" />, priority: "Medium", title: "Reduce irrigation in Zone 7", detail: "Soil moisture sensors show 85% saturation. Reduce water by 30% for the next 3 days to prevent root rot.", confidence: "88%", crop: "Rice" },
  { id: 3, type: "Fertilizer", icon: <Sparkles className="h-5 w-5" />, priority: "Medium", title: "Apply Nitrogen boost — Field B2", detail: "Leaf color analysis suggests nitrogen deficiency. Apply 45kg/ha urea within the next week for optimal growth.", confidence: "85%", crop: "Wheat" },
  { id: 4, type: "Yield Forecast", icon: <TrendingUp className="h-5 w-5" />, priority: "Low", title: "Yield forecast upgraded for maize", detail: "Based on current growth patterns and favorable weather, expected yield increased from 4.2 to 4.8 t/ha.", confidence: "90%", crop: "Maize" },
  { id: 5, type: "Disease", icon: <ShieldCheck className="h-5 w-5" />, priority: "High", title: "Potato blight risk elevated", detail: "Humidity and temperature conditions favor late blight development in Musanze. Preventive fungicide application recommended.", confidence: "87%", crop: "Potatoes" },
];

const priorityColor = { High: "bg-destructive/10 text-destructive", Medium: "bg-warning/10 text-warning", Low: "bg-success/10 text-success" };

const Advisory = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">AI Smart Advisory</h1>
          <p className="text-muted-foreground">AI-powered recommendations for pest control, irrigation, and yield optimization</p>
        </div>
        <Button size="sm">
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
              5 active recommendations across your farms. 2 high-priority alerts require immediate attention:
              Fall Armyworm in Field A3 and Potato blight risk in Musanze. Overall crop health index: <span className="font-semibold text-success">82/100</span>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recommendations */}
      <div className="space-y-3">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-bold text-card-foreground">{rec.title}</h4>
                  <Badge variant="secondary" className="text-xs">{rec.type}</Badge>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${priorityColor[rec.priority as keyof typeof priorityColor]}`}>{rec.priority}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{rec.detail}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>🌾 {rec.crop}</span>
                  <span>🎯 Confidence: {rec.confidence}</span>
                  <span className="flex items-center gap-1"><Lightbulb className="h-3 w-3" /> AI Explainability available</span>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <Button size="sm" variant="outline">Dismiss</Button>
                <Button size="sm">Apply</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Advisory;
