import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { GraduationCap, Play, BookOpen, Award, Clock, CheckCircle2, Lock, Download, Search, Filter, FileText, HelpCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
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

const statusIcon = {
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <Play className="h-4 w-4 text-info" />,
  "Not Started": <Lock className="h-4 w-4 text-muted-foreground" />,
};

// Online reading materials
const readingMaterials = [
  { id: "1", title: "Complete Guide to Soil Health", category: "Soil Science", pages: 45, description: "Learn about soil composition, testing, and improvement techniques for better crop yields." },
  { id: "2", title: "Organic Pest Management Handbook", category: "Pest Control", pages: 38, description: "Natural and organic methods to protect your crops from common pests without harmful chemicals." },
  { id: "3", title: "Water-Smart Farming Techniques", category: "Irrigation", pages: 32, description: "Efficient irrigation methods including drip systems, rainwater harvesting, and moisture management." },
  { id: "4", title: "Post-Harvest Storage Best Practices", category: "Post-Harvest", pages: 28, description: "Reduce crop losses with proper storage, drying, and preservation techniques." },
  { id: "5", title: "Climate-Resilient Crop Varieties", category: "Crop Science", pages: 52, description: "Guide to selecting and growing crop varieties that withstand extreme weather conditions." },
  { id: "6", title: "Farm Business Planning Manual", category: "Business", pages: 40, description: "Financial planning, record-keeping, and market analysis for profitable farming." },
];

// Quiz questions per course category
const quizQuestions: Record<string, Array<{ question: string; options: string[]; correct: number }>> = {
  "Crop Management": [
    { question: "What is the optimal soil pH for most crops?", options: ["4.0 - 5.0", "5.5 - 7.0", "8.0 - 9.0", "3.0 - 4.0"], correct: 1 },
    { question: "Which nutrient is most important for leaf growth?", options: ["Phosphorus", "Potassium", "Nitrogen", "Calcium"], correct: 2 },
    { question: "What is crop rotation?", options: ["Rotating the field direction", "Growing different crops in sequence", "Rotating harvest times", "Moving crops between farms"], correct: 1 },
    { question: "When should you apply organic mulch?", options: ["Only in winter", "After soil is warm", "Before planting only", "Never"], correct: 1 },
    { question: "What is intercropping?", options: ["Growing crops indoors", "Growing two or more crops together", "Crop insurance", "Harvesting between seasons"], correct: 1 },
  ],
  "Pest Control": [
    { question: "What is Integrated Pest Management (IPM)?", options: ["Using only chemicals", "Combining multiple pest control methods", "Ignoring pests", "Using only organic methods"], correct: 1 },
    { question: "Which insect is a natural pest predator?", options: ["Aphids", "Whiteflies", "Ladybugs", "Locusts"], correct: 2 },
    { question: "What is the best time to apply pesticides?", options: ["Midday", "Early morning or late evening", "During rain", "At night only"], correct: 1 },
    { question: "How can you prevent soil-borne diseases?", options: ["Overwatering", "Crop rotation and soil sterilization", "Using more fertilizer", "Planting closer together"], correct: 1 },
    { question: "What attracts beneficial insects to farms?", options: ["Pesticides", "Flowering plants and diversity", "Monoculture", "Artificial lights"], correct: 1 },
  ],
  default: [
    { question: "What is sustainable agriculture?", options: ["Using maximum chemicals", "Farming that meets current needs without compromising future", "Only organic farming", "Industrial farming"], correct: 1 },
    { question: "Why is soil testing important?", options: ["It's not important", "To know nutrient levels and pH", "To measure field size", "For decoration"], correct: 1 },
    { question: "What is composting?", options: ["Burning waste", "Decomposing organic matter into fertilizer", "Buying fertilizer", "Mixing chemicals"], correct: 1 },
    { question: "How does mulching help crops?", options: ["It doesn't help", "Retains moisture and suppresses weeds", "Increases pests", "Removes nutrients"], correct: 1 },
    { question: "What is the purpose of irrigation scheduling?", options: ["To waste water", "To apply water at optimal times and amounts", "To flood fields", "To avoid watering"], correct: 1 },
  ],
};

const Training = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  // Reading material states
  const [readingOpen, setReadingOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof readingMaterials[0] | null>(null);
  const [readingListOpen, setReadingListOpen] = useState(false);

  // Quiz states
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizCourseId, setQuizCourseId] = useState<string | null>(null);
  const [quizCourseTitle, setQuizCourseTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

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

  const completeCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const course = courses.find((c) => c.id === courseId);
      const { error } = await supabase.from("course_progress").update({
        status: "Completed",
        completed_lessons: course?.lessons || 0,
        completed_at: new Date().toISOString(),
      }).eq("user_id", user!.id).eq("course_id", courseId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-progress"] });
      toast({ title: "🎓 Course Completed!", description: "You've earned a certificate!" });
    },
  });

  const getProgress = (courseId: string) => progress.find((p) => p.course_id === courseId);

  const completedCourses = courses.filter((c) => {
    const cp = getProgress(c.id);
    return cp?.status === "Completed";
  });

  const completedCount = progress.filter((p) => p.status === "Completed").length;
  const inProgressCount = progress.filter((p) => p.status === "In Progress").length;
  const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
  const completedLessons = progress.reduce((s, p) => s + p.completed_lessons, 0);
  const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const categories = [...new Set(courses.map((c) => c.category))];
  const levels = [...new Set(courses.map((c) => c.level))];

  const filteredCourses = courses.filter((c) => {
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || (c.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === "all" || c.category === filterCategory;
    const matchLevel = filterLevel === "all" || c.level === filterLevel;
    return matchSearch && matchCategory && matchLevel;
  });

  const startQuiz = (courseId: string, courseTitle: string, category: string) => {
    setQuizCourseId(courseId);
    setQuizCourseTitle(courseTitle);
    setQuizCategory(category);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setQuizOpen(true);
  };

  const getQuizQuestions = () => {
    return quizQuestions[quizCategory] || quizQuestions.default;
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    const questions = getQuizQuestions();
    if (currentQuestion + 1 >= questions.length) {
      // Quiz done - calculate score
      const correct = newAnswers.reduce((count, ans, i) => count + (ans === questions[i].correct ? 1 : 0), 0);
      const pct = Math.round((correct / questions.length) * 100);
      setScore(pct);
      setQuizCompleted(true);

      if (pct >= 70 && quizCourseId) {
        completeCourse.mutate(quizCourseId);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Training & Knowledge</h1>
            <p className="text-muted-foreground">Courses, certifications, and learning resources</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setReadingListOpen(true)}>
              <FileText className="mr-1.5 h-4 w-4" />Online Reading
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCertDialogOpen(true)}>
              <Award className="mr-1.5 h-4 w-4" />My Certificates
            </Button>
            <Button size="sm" onClick={() => { setSearchQuery(""); setFilterCategory("all"); setFilterLevel("all"); }}>
              <BookOpen className="mr-1.5 h-4 w-4" />Browse All
            </Button>
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

        {/* Search & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          {categories.length > 0 && (
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40"><Filter className="mr-1.5 h-4 w-4" /><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {levels.length > 0 && (
            <Select value={filterLevel} onValueChange={setFilterLevel}>
              <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map((lvl) => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {courses.length === 0 ? "No courses available yet." : "No courses match your search."}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((c, i) => {
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
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.duration || "15 days"}</span>
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
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant={status === "Completed" ? "outline" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => { if (status === "Not Started") startCourse.mutate(c.id); }}
                      disabled={startCourse.isPending}
                    >
                      {status === "Completed" ? "Review" : status === "In Progress" ? "Continue" : "Start"}
                    </Button>
                    {status === "In Progress" && (
                      <Button variant="secondary" size="sm" onClick={() => startQuiz(c.id, c.title, c.category)}>
                        <HelpCircle className="mr-1 h-3.5 w-3.5" />Quiz
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Online Reading Dialog */}
      <Dialog open={readingListOpen} onOpenChange={setReadingListOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Online Reading Library</DialogTitle>
            <DialogDescription>Browse books and learning materials available online</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {readingMaterials.map((book) => (
              <div key={book.id} className="flex items-start gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{book.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{book.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className="text-xs">{book.category}</Badge>
                    <span className="text-xs text-muted-foreground">{book.pages} pages</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setSelectedBook(book); setReadingListOpen(false); setReadingOpen(true); }}>
                  Read
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Reader Dialog */}
      <Dialog open={readingOpen} onOpenChange={setReadingOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> {selectedBook?.title}</DialogTitle>
            <DialogDescription>{selectedBook?.category} · {selectedBook?.pages} pages</DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-h-96 overflow-y-auto rounded-lg bg-muted/30 p-6 text-sm text-card-foreground leading-relaxed">
            <h3 className="text-base font-bold">Chapter 1: Introduction</h3>
            <p>{selectedBook?.description}</p>
            <p>This comprehensive guide covers all aspects of {selectedBook?.category?.toLowerCase()}. Whether you're a beginner farmer or experienced agricultural professional, this material will help you improve your practices and increase productivity.</p>
            <h3 className="text-base font-bold mt-4">Key Topics Covered</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Fundamentals and best practices</li>
              <li>Common challenges and solutions</li>
              <li>Modern techniques and innovations</li>
              <li>Case studies from Rwandan farms</li>
              <li>Practical exercises and assessments</li>
            </ul>
            <h3 className="text-base font-bold mt-4">Chapter 2: Getting Started</h3>
            <p>Before implementing any new techniques, it's important to assess your current situation. Start by evaluating your soil conditions, available resources, and market opportunities. This will help you prioritize which improvements will have the greatest impact on your farm's productivity.</p>
            <p>Successful farming requires continuous learning and adaptation. Stay updated with the latest research and connect with other farmers in your community to share knowledge and experiences.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReadingOpen(false); setReadingListOpen(true); }}>Back to Library</Button>
            <Button onClick={() => toast({ title: "📖 Bookmark saved", description: "You can continue reading later." })}>Bookmark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quiz Dialog */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Course Quiz
            </DialogTitle>
            <DialogDescription>{quizCourseTitle} — {quizCompleted ? "Results" : `Question ${currentQuestion + 1} of ${getQuizQuestions().length}`}</DialogDescription>
          </DialogHeader>

          {quizCompleted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${score >= 70 ? "bg-success/10" : "bg-destructive/10"}`}>
                {score >= 70 ? <Award className="h-10 w-10 text-success" /> : <X className="h-10 w-10 text-destructive" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{score}% Score</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {score >= 70 ? "🎉 Congratulations! You passed and earned a certificate!" : "You need 70% to pass. Review the material and try again."}
                </p>
              </div>
              {score >= 70 && (
                <div className="rounded-lg border-2 border-success/30 bg-success/5 p-4">
                  <Award className="mx-auto h-8 w-8 text-success mb-2" />
                  <p className="font-semibold text-success">Certificate Earned!</p>
                  <p className="text-xs text-muted-foreground mt-1">{quizCourseTitle}</p>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                {score < 70 && (
                  <Button variant="outline" onClick={() => { setCurrentQuestion(0); setAnswers([]); setSelectedAnswer(null); setQuizCompleted(false); }}>
                    Retry Quiz
                  </Button>
                )}
                <Button onClick={() => setQuizOpen(false)}>Close</Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Progress value={((currentQuestion + 1) / getQuizQuestions().length) * 100} className="h-2" />
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="font-medium text-sm text-card-foreground">{getQuizQuestions()[currentQuestion]?.question}</p>
              </div>
              <div className="space-y-2">
                {getQuizQuestions()[currentQuestion]?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${
                      selectedAnswer === idx
                        ? "border-primary bg-primary/5 text-card-foreground"
                        : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleNextQuestion} disabled={selectedAnswer === null}>
                  {currentQuestion + 1 >= getQuizQuestions().length ? "Finish Quiz" : "Next Question"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certificates Dialog */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> My Certificates</DialogTitle>
            <DialogDescription>Certificates earned from completed courses</DialogDescription>
          </DialogHeader>
          {completedCourses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">No certificates yet</p>
              <p className="text-sm mt-1">Complete a course quiz (70%+) to earn your first certificate!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {completedCourses.map((c) => {
                const cp = getProgress(c.id);
                return (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Award className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.category} · {c.level} · Completed {cp?.completed_at ? new Date(cp.completed_at).toLocaleDateString() : "N/A"}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toast({ title: "📜 Certificate Downloaded", description: `${c.title} certificate saved.` })}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Training;
