import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { GraduationCap, Play, BookOpen, Award, Clock, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const statusIcon = {
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <Play className="h-4 w-4 text-info" />,
  "Not Started": <Lock className="h-4 w-4 text-muted-foreground" />,
};

const Training = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["course-progress"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from("course_progress").select("*").eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const startCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase.from("course_progress").insert({
        user_id: user!.id,
        course_id: courseId,
        status: "In Progress",
        completed_lessons: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({ title: "Course started!" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const getProgress = (courseId: string) => progress.find((p) => p.course_id === courseId);

  const completedCount = progress.filter((p) => p.status === "Completed").length;
  const inProgressCount = progress.filter((p) => p.status === "In Progress").length;
  const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
  const completedLessons = progress.reduce((s, p) => s + p.completed_lessons, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Training & Knowledge</h1>
            <p className="text-muted-foreground">Courses, certifications, and learning resources</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Award className="mr-1.5 h-4 w-4" />My Certificates</Button>
            <Button size="sm"><BookOpen className="mr-1.5 h-4 w-4" />Browse All</Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-gradient-to-r from-accent to-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-card-foreground">Your Learning Journey</p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} completed · {inProgressCount} in progress · {completedLessons} of {totalLessons} lessons done
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Overall Progress</span>
                <span>{overallPct}%</span>
              </div>
              <Progress value={overallPct} className="mt-1 h-2" />
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No courses available yet.</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => {
              const cp = getProgress(c.id);
              const status = cp?.status || "Not Started";
              const completed = cp?.completed_lessons || 0;
              const pct = c.lessons > 0 ? Math.round((completed / c.lessons) * 100) : 0;

              return (
                <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }} className="rounded-xl border border-border bg-card p-5 shadow-card">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">{c.category}</Badge>
                    <div className="flex items-center gap-1.5">
                      {statusIcon[status as keyof typeof statusIcon]}
                      <span className="text-xs text-muted-foreground">{status}</span>
                    </div>
                  </div>
                  <h4 className="mt-3 text-sm font-bold text-card-foreground">{c.title}</h4>
                  {c.description && <p className="text-xs text-muted-foreground mt-1">{c.description}</p>}
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {c.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>}
                    <span>{c.lessons} lessons</span>
                    <Badge variant="outline" className="text-xs">{c.level}</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{completed}/{c.lessons} lessons</span>
                      <span>{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-1 h-1.5" />
                  </div>
                  <Button
                    variant={status === "Completed" ? "outline" : "default"}
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => { if (status === "Not Started") startCourse.mutate(c.id); }}
                    disabled={startCourse.isPending}
                  >
                    {status === "Completed" ? "Review" : status === "In Progress" ? "Continue" : "Start"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Training;
