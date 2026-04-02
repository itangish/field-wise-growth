import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Plus, Sparkles, Loader2, FolderOpen, MapPin, Sprout,
  ArrowUpRight, ArrowRight, ArrowDownRight, Trash2,
} from "lucide-react";

const priorityConfig = {
  High: { icon: ArrowUpRight, color: "text-destructive", bg: "bg-destructive/10" },
  Medium: { icon: ArrowRight, color: "text-secondary", bg: "bg-secondary/10" },
  Low: { icon: ArrowDownRight, color: "text-muted-foreground", bg: "bg-muted" },
};

const Projects = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", crop_type: "", location: "" });
  const [aiResult, setAiResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted");
    },
  });

  const analyzeWithAI = async () => {
    if (!form.name) return toast.error("Please enter a project name");
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-project", {
        body: form,
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setAiResult(data);
      toast.success("AI analysis complete!");
    } catch (e: any) {
      toast.error(e.message || "AI analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const saveProject = async () => {
    if (!form.name || !user) return toast.error("Please enter a project name");
    try {
      const { error } = await supabase.from("projects").insert({
        user_id: user.id,
        name: form.name,
        description: form.description || null,
        crop_type: form.crop_type || null,
        location: form.location || null,
        tags: aiResult?.tags || [],
        category: aiResult?.category || null,
        recommendations: aiResult?.recommendations || null,
        priority: aiResult?.priority || "Medium",
        summary: aiResult?.summary || null,
      });
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully!");
      setOpen(false);
      setForm({ name: "", description: "", crop_type: "", location: "" });
      setAiResult(null);
    } catch (e: any) {
      toast.error(e.message || "Failed to create project");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">Manage your agriculture projects with AI-powered insights</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setAiResult(null); setForm({ name: "", description: "", crop_type: "", location: "" }); } }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Project Name *</Label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Musanze Rice Expansion" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the project goals and scope..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Crop Type</Label>
                    <Input value={form.crop_type} onChange={(e) => setForm({ ...form, crop_type: e.target.value })} placeholder="e.g. Rice, Maize" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Musanze, Northern" />
                  </div>
                </div>

                <Button variant="outline" className="w-full gap-2" onClick={analyzeWithAI} disabled={analyzing}>
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {analyzing ? "Analyzing with AI..." : "Analyze with AI"}
                </Button>

                {aiResult && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 rounded-lg border border-border bg-accent/30 p-4">
                    <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-secondary" /> AI Analysis
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Category:</span>{" "}
                        <Badge variant="secondary">{aiResult.category}</Badge>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Priority:</span>{" "}
                        <Badge variant={aiResult.priority === "High" ? "destructive" : "outline"}>{aiResult.priority}</Badge>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Tags:</span>{" "}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {aiResult.tags?.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Recommendations:</span>
                        <p className="text-muted-foreground mt-1">{aiResult.recommendations}</p>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Summary:</span>
                        <p className="text-muted-foreground mt-1">{aiResult.summary}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button className="w-full" onClick={saveProject}>
                  Save Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
              <p className="text-muted-foreground text-sm mt-1">Create your first project to get started with AI-powered agriculture insights.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any, i: number) => {
              const prio = priorityConfig[project.priority as keyof typeof priorityConfig] || priorityConfig.Medium;
              const PrioIcon = prio.icon;
              return (
                <motion.div key={project.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 min-w-0">
                          <CardTitle className="text-base truncate">{project.name}</CardTitle>
                          {project.category && <Badge variant="secondary" className="text-xs">{project.category}</Badge>}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`flex items-center gap-1 text-xs font-medium ${prio.color} ${prio.bg} rounded-full px-2 py-0.5`}>
                            <PrioIcon className="h-3 w-3" /> {project.priority}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-3 text-sm">
                      {project.summary && <p className="text-muted-foreground">{project.summary}</p>}
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {project.crop_type && (
                          <span className="flex items-center gap-1"><Sprout className="h-3 w-3" />{project.crop_type}</span>
                        )}
                        {project.location && (
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.location}</span>
                        )}
                      </div>
                      {project.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                      {project.recommendations && (
                        <div className="rounded-md bg-accent/40 p-2 text-xs text-accent-foreground">
                          <span className="font-medium">💡 Recommendations:</span> {project.recommendations}
                        </div>
                      )}
                      <div className="pt-2">
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(project.id)}>
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Projects;
