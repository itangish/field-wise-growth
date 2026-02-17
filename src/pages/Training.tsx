import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { GraduationCap, Play, BookOpen, Award, Clock, CheckCircle2, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  { id: 1, title: "Modern Irrigation Techniques", category: "Water Management", duration: "2h 30m", lessons: 12, completed: 8, level: "Intermediate", status: "In Progress" },
  { id: 2, title: "Organic Pest Control", category: "Crop Protection", duration: "1h 45m", lessons: 8, completed: 8, level: "Beginner", status: "Completed" },
  { id: 3, title: "Soil Health & Fertility", category: "Soil Science", duration: "3h 15m", lessons: 15, completed: 3, level: "Advanced", status: "In Progress" },
  { id: 4, title: "Post-Harvest Storage", category: "Storage", duration: "1h 20m", lessons: 6, completed: 0, level: "Beginner", status: "Not Started" },
  { id: 5, title: "Market Pricing Strategy", category: "Business", duration: "2h", lessons: 10, completed: 0, level: "Intermediate", status: "Not Started" },
  { id: 6, title: "Climate-Smart Agriculture", category: "Climate", duration: "2h 45m", lessons: 14, completed: 14, level: "Advanced", status: "Completed" },
];

const statusIcon = {
  "Completed": <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <Play className="h-4 w-4 text-info" />,
  "Not Started": <Lock className="h-4 w-4 text-muted-foreground" />,
};

const Training = () => (
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

      {/* Progress summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-gradient-to-r from-accent to-card p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-lg font-bold text-card-foreground">Your Learning Journey</p>
              <p className="text-sm text-muted-foreground">2 courses completed · 2 in progress · 33 of 65 lessons done</p>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>51%</span>
            </div>
            <Progress value={51} className="mt-1 h-2" />
          </div>
        </div>
      </motion.div>

      {/* Courses */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <Badge variant="secondary" className="text-xs">{c.category}</Badge>
              <div className="flex items-center gap-1.5">
                {statusIcon[c.status as keyof typeof statusIcon]}
                <span className="text-xs text-muted-foreground">{c.status}</span>
              </div>
            </div>
            <h4 className="mt-3 text-sm font-bold text-card-foreground">{c.title}</h4>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration}</span>
              <span>{c.lessons} lessons</span>
              <Badge variant="outline" className="text-xs">{c.level}</Badge>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{c.completed}/{c.lessons} lessons</span>
                <span>{Math.round((c.completed / c.lessons) * 100)}%</span>
              </div>
              <Progress value={(c.completed / c.lessons) * 100} className="mt-1 h-1.5" />
            </div>
            <Button variant={c.status === "Completed" ? "outline" : "default"} size="sm" className="mt-4 w-full">
              {c.status === "Completed" ? "Review" : c.status === "In Progress" ? "Continue" : "Start"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default Training;
