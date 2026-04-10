import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  GraduationCap, Play, BookOpen, Award, Clock, CheckCircle2, Lock, Download, Search, Filter,
  FileText, HelpCircle, X, Share2, Mail, Github, MessageCircle, Facebook, Instagram, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const statusIcon = {
  Completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  "In Progress": <Play className="h-4 w-4 text-info" />,
  "Not Started": <Lock className="h-4 w-4 text-muted-foreground" />,
};

// Generate 9 content units per book with assessment questions
const generateBookContents = (title: string, category: string) => {
  const topics: Record<string, string[]> = {
    "Soil Science": [
      "Introduction to Soil Types", "Soil pH and Testing", "Soil Nutrients & NPK", "Organic Matter & Composting",
      "Soil Erosion Prevention", "Soil Moisture Management", "Soil Microorganisms", "Soil Amendment Techniques", "Soil Health Assessment"
    ],
    "Pest Control": [
      "Introduction to Pest Management", "Identifying Common Pests", "Biological Control Methods", "Organic Pesticides",
      "Integrated Pest Management (IPM)", "Disease Prevention in Crops", "Beneficial Insects", "Chemical Safety", "Monitoring & Record Keeping"
    ],
    "Irrigation": [
      "Water Sources & Quality", "Drip Irrigation Systems", "Sprinkler Systems", "Rainwater Harvesting",
      "Scheduling Irrigation", "Water Conservation Techniques", "Soil Moisture Sensors", "Gravity-Fed Irrigation", "System Maintenance"
    ],
    "Post-Harvest": [
      "Harvesting Best Practices", "Drying Techniques", "Storage Structures", "Pest Control in Storage",
      "Quality Grading", "Packaging for Market", "Cold Chain Management", "Processing Basics", "Loss Reduction Strategies"
    ],
    "Crop Science": [
      "Crop Varieties Overview", "Seed Selection & Quality", "Climate Adaptation", "Drought-Resistant Crops",
      "Planting Techniques", "Growth Stages & Care", "Fertilization Schedules", "Hybrid vs Heritage Crops", "Yield Optimization"
    ],
    "Business": [
      "Farm Business Planning", "Record Keeping & Budgeting", "Market Research", "Pricing Strategies",
      "Cooperative Farming", "Access to Finance", "Value Chain Analysis", "Risk Management", "Digital Tools for Farmers"
    ],
  };

  const contents = (topics[category] || topics["Crop Science"]).map((topic, i) => ({
    unit: i + 1,
    title: topic,
    content: `This unit covers ${topic.toLowerCase()} in detail. You will learn the fundamental concepts, practical techniques, and real-world applications relevant to ${category.toLowerCase()}. Study the material carefully to prepare for the end-of-unit assessment.

Key Learning Points:
• Understanding the core principles of ${topic.toLowerCase()}
• Practical applications for Rwandan farms
• Common challenges and how to overcome them
• Case studies and success stories

By the end of this unit, you should be able to apply these concepts in your farming practice and demonstrate your understanding through the assessment.`,
    assessment: generateUnitAssessment(topic, category, i),
  }));

  return contents;
};

const generateUnitAssessment = (topic: string, category: string, unitIndex: number) => {
  // Each unit gets 3 questions
  const allQuestions: Record<string, Array<Array<{ question: string; options: string[]; correct: number }>>> = {
    "Soil Science": [
      [{ question: "What are the three main soil types?", options: ["Sand, silt, clay", "Rock, mud, dust", "Gravel, peat, chalk", "Iron, calcium, zinc"], correct: 0 },
       { question: "Which soil type has the best drainage?", options: ["Clay", "Sandy", "Silt", "Peat"], correct: 1 },
       { question: "Why is soil classification important?", options: ["For decoration", "To determine suitable crops", "It's not important", "For building"], correct: 1 }],
      [{ question: "What is the optimal pH for most crops?", options: ["3.0-4.0", "5.5-7.0", "8.0-9.0", "10.0-12.0"], correct: 1 },
       { question: "How do you test soil pH?", options: ["By tasting", "Using pH meter or test kit", "By color", "By smell"], correct: 1 },
       { question: "What does acidic soil pH indicate?", options: ["pH above 7", "pH below 7", "pH of exactly 7", "No pH"], correct: 1 }],
      [{ question: "What does NPK stand for?", options: ["Natural Plant Keeping", "Nitrogen, Phosphorus, Potassium", "New Plant Knowledge", "None"], correct: 1 },
       { question: "Which nutrient promotes root growth?", options: ["Nitrogen", "Phosphorus", "Potassium", "Carbon"], correct: 1 },
       { question: "Which nutrient helps leaf growth?", options: ["Phosphorus", "Potassium", "Nitrogen", "Calcium"], correct: 2 }],
      [{ question: "What is composting?", options: ["Burning waste", "Decomposing organic matter", "Buying fertilizer", "Chemical mixing"], correct: 1 },
       { question: "How long does composting typically take?", options: ["1 day", "2-6 months", "5 years", "1 hour"], correct: 1 },
       { question: "What should NOT go in compost?", options: ["Vegetable scraps", "Meat products", "Leaves", "Grass"], correct: 1 }],
      [{ question: "What causes soil erosion?", options: ["Wind and water", "Darkness", "Cold", "Silence"], correct: 0 },
       { question: "Which technique prevents erosion?", options: ["Deforestation", "Terracing", "Over-grazing", "Burning"], correct: 1 },
       { question: "What is contour farming?", options: ["Farming in circles", "Plowing along contour lines", "Vertical farming", "Random planting"], correct: 1 }],
      [{ question: "Why is soil moisture important?", options: ["For mud", "For plant water uptake", "It's not important", "For decoration"], correct: 1 },
       { question: "How to measure soil moisture?", options: ["By weight", "Using tensiometer or sensor", "By color only", "By taste"], correct: 1 },
       { question: "What is field capacity?", options: ["Farm size", "Maximum water soil can hold after drainage", "Number of fields", "Fence capacity"], correct: 1 }],
      [{ question: "What are soil microorganisms?", options: ["Large animals", "Tiny living organisms in soil", "Minerals", "Rocks"], correct: 1 },
       { question: "How do bacteria help soil?", options: ["They don't", "Decompose organic matter & fix nitrogen", "Make soil toxic", "Create rocks"], correct: 1 },
       { question: "What is mycorrhiza?", options: ["A disease", "Fungal-root partnership", "A pesticide", "Soil type"], correct: 1 }],
      [{ question: "What is lime used for in soil?", options: ["Making cement", "Raising soil pH", "Lowering pH", "Decoration"], correct: 1 },
       { question: "What is green manure?", options: ["Green paint", "Cover crops plowed into soil", "Chemical fertilizer", "Grass"], correct: 1 },
       { question: "When should soil amendments be applied?", options: ["Never", "Before planting season", "After harvest only", "During rain"], correct: 1 }],
      [{ question: "How often should you test soil?", options: ["Never", "Every 1-3 years", "Every 50 years", "Daily"], correct: 1 },
       { question: "What indicates healthy soil?", options: ["Cracked and dry", "Rich earthworm population", "No plants growing", "Strong smell"], correct: 1 },
       { question: "What is a soil health card?", options: ["Credit card", "Document recording soil test results", "Greeting card", "ID card"], correct: 1 }],
    ],
  };

  const defaultQuestions = [
    { question: `What is the main focus of "${topic}"?`, options: ["Unrelated topic", `Understanding ${topic.toLowerCase()}`, "Random information", "Entertainment"], correct: 1 },
    { question: `Why is ${topic.toLowerCase()} important in farming?`, options: ["It's not important", "Improves productivity and sustainability", "For fun only", "Government requirement"], correct: 1 },
    { question: `Which best practice applies to ${topic.toLowerCase()}?`, options: ["Ignore all guidelines", "Follow research-based recommendations", "Use random methods", "Copy without understanding"], correct: 1 },
  ];

  const categoryQuestions = allQuestions[category];
  if (categoryQuestions && categoryQuestions[unitIndex]) {
    return categoryQuestions[unitIndex];
  }
  return defaultQuestions;
};

// Online reading materials with 9 content units each
const readingMaterials = [
  { id: "1", title: "Complete Guide to Soil Health", category: "Soil Science", pages: 45, description: "Learn about soil composition, testing, and improvement techniques for better crop yields." },
  { id: "2", title: "Organic Pest Management Handbook", category: "Pest Control", pages: 38, description: "Natural and organic methods to protect your crops from common pests without harmful chemicals." },
  { id: "3", title: "Water-Smart Farming Techniques", category: "Irrigation", pages: 32, description: "Efficient irrigation methods including drip systems, rainwater harvesting, and moisture management." },
  { id: "4", title: "Post-Harvest Storage Best Practices", category: "Post-Harvest", pages: 28, description: "Reduce crop losses with proper storage, drying, and preservation techniques." },
  { id: "5", title: "Climate-Resilient Crop Varieties", category: "Crop Science", pages: 52, description: "Guide to selecting and growing crop varieties that withstand extreme weather conditions." },
  { id: "6", title: "Farm Business Planning Manual", category: "Business", pages: 40, description: "Financial planning, record-keeping, and market analysis for profitable farming." },
];

const Training = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const certCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dialog states
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [readingListOpen, setReadingListOpen] = useState(false);
  const [readingOpen, setReadingOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<typeof readingMaterials[0] | null>(null);

  // Book content study states
  const [studyOpen, setStudyOpen] = useState(false);
  const [studyBook, setStudyBook] = useState<typeof readingMaterials[0] | null>(null);
  const [currentUnit, setCurrentUnit] = useState(0);
  const [unitAssessmentOpen, setUnitAssessmentOpen] = useState(false);
  const [unitQuestionIndex, setUnitQuestionIndex] = useState(0);
  const [unitSelectedAnswer, setUnitSelectedAnswer] = useState<number | null>(null);
  const [unitAnswers, setUnitAnswers] = useState<number[]>([]);
  const [unitAssessmentDone, setUnitAssessmentDone] = useState(false);
  const [unitScore, setUnitScore] = useState(0);
  const [completedUnits, setCompletedUnits] = useState<Record<string, number[]>>({});

  // Quiz states (for DB courses)
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizCourseId, setQuizCourseId] = useState<string | null>(null);
  const [quizCourseTitle, setQuizCourseTitle] = useState("");
  const [quizCategory, setQuizCategory] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Certificate states
  const [generateCertOpen, setGenerateCertOpen] = useState(false);
  const [certCourse, setCertCourse] = useState<string>("");
  const [shareOpen, setShareOpen] = useState(false);
  const [shareTitle, setShareTitle] = useState("");

  // Earned book certificates
  const [bookCertificates, setBookCertificates] = useState<Array<{ bookTitle: string; category: string; date: string; score: number }>>([]);

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
        user_id: user!.id, course_id: courseId, status: "In Progress", completed_lessons: 0,
      });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["course-progress"] }); toast({ title: "Course started!" }); },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const completeCourse = useMutation({
    mutationFn: async (courseId: string) => {
      const course = courses.find((c) => c.id === courseId);
      const { error } = await supabase.from("course_progress").update({
        status: "Completed", completed_lessons: course?.lessons || 0, completed_at: new Date().toISOString(),
      }).eq("user_id", user!.id).eq("course_id", courseId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["course-progress"] }); toast({ title: "🎓 Course Completed!", description: "You've earned a certificate!" }); },
  });

  const getProgress = (courseId: string) => progress.find((p) => p.course_id === courseId);
  const completedCourses = courses.filter((c) => getProgress(c.id)?.status === "Completed");
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

  // Quiz for DB courses
  const quizQuestions: Record<string, Array<{ question: string; options: string[]; correct: number }>> = {
    "Crop Management": [
      { question: "What is the optimal soil pH for most crops?", options: ["4.0 - 5.0", "5.5 - 7.0", "8.0 - 9.0", "3.0 - 4.0"], correct: 1 },
      { question: "Which nutrient is most important for leaf growth?", options: ["Phosphorus", "Potassium", "Nitrogen", "Calcium"], correct: 2 },
      { question: "What is crop rotation?", options: ["Rotating the field direction", "Growing different crops in sequence", "Rotating harvest times", "Moving crops between farms"], correct: 1 },
      { question: "When should you apply organic mulch?", options: ["Only in winter", "After soil is warm", "Before planting only", "Never"], correct: 1 },
      { question: "What is intercropping?", options: ["Growing crops indoors", "Growing two or more crops together", "Crop insurance", "Harvesting between seasons"], correct: 1 },
    ],
    "Pest Control": [
      { question: "What is IPM?", options: ["Using only chemicals", "Combining multiple pest control methods", "Ignoring pests", "Using only organic methods"], correct: 1 },
      { question: "Which insect is a natural pest predator?", options: ["Aphids", "Whiteflies", "Ladybugs", "Locusts"], correct: 2 },
      { question: "What is the best time to apply pesticides?", options: ["Midday", "Early morning or late evening", "During rain", "At night only"], correct: 1 },
      { question: "How can you prevent soil-borne diseases?", options: ["Overwatering", "Crop rotation and soil sterilization", "More fertilizer", "Planting closer"], correct: 1 },
      { question: "What attracts beneficial insects?", options: ["Pesticides", "Flowering plants and diversity", "Monoculture", "Artificial lights"], correct: 1 },
    ],
    default: [
      { question: "What is sustainable agriculture?", options: ["Using maximum chemicals", "Meeting needs without compromising future", "Only organic farming", "Industrial farming"], correct: 1 },
      { question: "Why is soil testing important?", options: ["It's not", "To know nutrient levels and pH", "To measure size", "Decoration"], correct: 1 },
      { question: "What is composting?", options: ["Burning waste", "Decomposing organic matter into fertilizer", "Buying fertilizer", "Mixing chemicals"], correct: 1 },
      { question: "How does mulching help?", options: ["It doesn't", "Retains moisture and suppresses weeds", "Increases pests", "Removes nutrients"], correct: 1 },
      { question: "Purpose of irrigation scheduling?", options: ["Waste water", "Apply water at optimal times", "Flood fields", "Avoid watering"], correct: 1 },
    ],
  };

  const getQuizQuestions = () => quizQuestions[quizCategory] || quizQuestions.default;

  const startQuiz = (courseId: string, courseTitle: string, category: string) => {
    setQuizCourseId(courseId); setQuizCourseTitle(courseTitle); setQuizCategory(category);
    setCurrentQuestion(0); setSelectedAnswer(null); setAnswers([]); setQuizCompleted(false); setScore(0); setQuizOpen(true);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    const questions = getQuizQuestions();
    if (currentQuestion + 1 >= questions.length) {
      const correct = newAnswers.reduce((count, ans, i) => count + (ans === questions[i].correct ? 1 : 0), 0);
      const pct = Math.round((correct / questions.length) * 100);
      setScore(pct); setQuizCompleted(true);
      if (pct >= 70 && quizCourseId) completeCourse.mutate(quizCourseId);
    } else { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(null); }
  };

  // Book study functions
  const openBookStudy = (book: typeof readingMaterials[0]) => {
    setStudyBook(book); setCurrentUnit(0); setReadingListOpen(false); setStudyOpen(true);
  };

  const getBookContents = () => {
    if (!studyBook) return [];
    return generateBookContents(studyBook.title, studyBook.category);
  };

  const getCompletedUnitsForBook = (bookId: string) => completedUnits[bookId] || [];

  const startUnitAssessment = () => {
    setUnitQuestionIndex(0); setUnitSelectedAnswer(null); setUnitAnswers([]); setUnitAssessmentDone(false); setUnitScore(0);
    setUnitAssessmentOpen(true);
  };

  const handleUnitAnswerNext = () => {
    if (unitSelectedAnswer === null) return;
    const contents = getBookContents();
    const questions = contents[currentUnit]?.assessment || [];
    const newAnswers = [...unitAnswers, unitSelectedAnswer];
    setUnitAnswers(newAnswers);
    if (unitQuestionIndex + 1 >= questions.length) {
      const correct = newAnswers.reduce((count, ans, i) => count + (ans === questions[i].correct ? 1 : 0), 0);
      const pct = Math.round((correct / questions.length) * 100);
      setUnitScore(pct); setUnitAssessmentDone(true);
      if (pct >= 70 && studyBook) {
        const bookId = studyBook.id;
        const prev = completedUnits[bookId] || [];
        if (!prev.includes(currentUnit)) {
          setCompletedUnits({ ...completedUnits, [bookId]: [...prev, currentUnit] });
        }
        // Check if all 9 units completed → award book certificate
        const updatedCompleted = [...prev, currentUnit];
        if (updatedCompleted.length >= 9) {
          const already = bookCertificates.find(bc => bc.bookTitle === studyBook.title);
          if (!already) {
            setBookCertificates([...bookCertificates, {
              bookTitle: studyBook.title, category: studyBook.category,
              date: new Date().toLocaleDateString(), score: pct,
            }]);
            toast({ title: "🎓 Book Certificate Earned!", description: `You completed all 9 units of "${studyBook.title}"!` });
          }
        }
      }
    } else { setUnitQuestionIndex(unitQuestionIndex + 1); setUnitSelectedAnswer(null); }
  };

  // Certificate generation
  const generateCertificateImage = (title: string): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 800; canvas.height = 560;
    const ctx = canvas.getContext("2d")!;

    // Background
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, 800, 560);
    // Border
    ctx.strokeStyle = "#1a7a4c"; ctx.lineWidth = 4; ctx.strokeRect(20, 20, 760, 520);
    ctx.strokeStyle = "#c9a84c"; ctx.lineWidth = 2; ctx.strokeRect(28, 28, 744, 504);

    // Header
    ctx.fillStyle = "#1a7a4c"; ctx.font = "bold 28px Georgia, serif"; ctx.textAlign = "center";
    ctx.fillText("CERTIFICATE OF COMPLETION", 400, 80);

    // Decorative line
    ctx.strokeStyle = "#c9a84c"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(200, 95); ctx.lineTo(600, 95); ctx.stroke();

    // Award icon text
    ctx.fillStyle = "#c9a84c"; ctx.font = "48px serif"; ctx.fillText("🏆", 400, 155);

    // "This certifies that"
    ctx.fillStyle = "#333"; ctx.font = "16px Georgia, serif";
    ctx.fillText("This is to certify that", 400, 195);

    // User name
    ctx.fillStyle = "#1a7a4c"; ctx.font = "bold 26px Georgia, serif";
    ctx.fillText(user?.user_metadata?.full_name || user?.email || "Student", 400, 235);

    // Line under name
    ctx.strokeStyle = "#ccc"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(200, 248); ctx.lineTo(600, 248); ctx.stroke();

    // Completion text
    ctx.fillStyle = "#333"; ctx.font = "16px Georgia, serif";
    ctx.fillText("has successfully completed the course", 400, 285);

    // Course title
    ctx.fillStyle = "#1a3c2a"; ctx.font = "bold 22px Georgia, serif";
    const lines = wrapText(ctx, title, 600);
    lines.forEach((line, i) => ctx.fillText(line, 400, 320 + i * 28));

    // Date & program
    const y = 320 + lines.length * 28 + 30;
    ctx.fillStyle = "#666"; ctx.font = "14px Georgia, serif";
    ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, y);
    ctx.fillText("Moses Farmer Training Program — 15 Day Course", 400, y + 22);

    // Footer
    ctx.fillStyle = "#1a7a4c"; ctx.font = "italic 12px Georgia, serif";
    ctx.fillText("Powered by Moses Farmer Agricultural Platform", 400, 520);

    return canvas.toDataURL("image/png");
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = []; let line = "";
    for (const word of words) {
      const test = line + word + " ";
      if (ctx.measureText(test).width > maxWidth && line) { lines.push(line.trim()); line = word + " "; }
      else line = test;
    }
    if (line) lines.push(line.trim());
    return lines;
  };

  const downloadCertificate = (title: string) => {
    const dataUrl = generateCertificateImage(title);
    const link = document.createElement("a");
    link.download = `Certificate-${title.replace(/\s+/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
    toast({ title: "📜 Certificate Downloaded", description: `${title} certificate saved.` });
  };

  const handleShare = (platform: string, title: string) => {
    const text = `🎓 I just earned a certificate in "${title}" from Moses Farmer Training Program!`;
    const url = window.location.origin;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    const links: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      instagram: `https://www.instagram.com/`,
      email: `mailto:?subject=${encodeURIComponent(`Certificate: ${title}`)}&body=${encodedText}%0A%0A${encodedUrl}`,
      github: `https://github.com/`,
    };

    if (platform === "instagram") {
      toast({ title: "📸 Instagram", description: "Download your certificate and share it on Instagram!" });
      downloadCertificate(title);
    } else {
      window.open(links[platform], "_blank");
      toast({ title: `Shared to ${platform.charAt(0).toUpperCase() + platform.slice(1)}!` });
    }
  };

  const openShare = (title: string) => { setShareTitle(title); setShareOpen(true); };

  // All certificates (DB courses + book certificates)
  const allCertificates = [
    ...completedCourses.map(c => ({ title: c.title, category: c.category, date: getProgress(c.id)?.completed_at ? new Date(getProgress(c.id)!.completed_at!).toLocaleDateString() : "N/A", type: "course" as const })),
    ...bookCertificates.map(bc => ({ title: bc.bookTitle, category: bc.category, date: bc.date, type: "book" as const })),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Training & Knowledge</h1>
            <p className="text-muted-foreground">15-day courses with 9 content units, assessments & certificates</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setReadingListOpen(true)}>
              <FileText className="mr-1.5 h-4 w-4" />Online Reading
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCertDialogOpen(true)}>
              <Award className="mr-1.5 h-4 w-4" />My Certificates
            </Button>
            <Button variant="outline" size="sm" onClick={() => setGenerateCertOpen(true)}>
              <Download className="mr-1.5 h-4 w-4" />Generate Certificate
            </Button>
            <Button size="sm" onClick={() => { setSearchQuery(""); setFilterCategory("all"); setFilterLevel("all"); }}>
              <BookOpen className="mr-1.5 h-4 w-4" />Browse All
            </Button>
          </div>
        </div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-gradient-to-r from-accent to-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-card-foreground">Your Learning Journey</p>
                <p className="text-sm text-muted-foreground">
                  {completedCount} completed · {inProgressCount} in progress · {allCertificates.length} certificates
                </p>
              </div>
            </div>
            <div className="w-full sm:w-48">
              <div className="flex justify-between text-xs text-muted-foreground"><span>Overall Progress</span><span>{overallPct}%</span></div>
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
          <Button variant="outline" size="sm" onClick={() => {
            if (!searchQuery.trim()) { toast({ title: "Enter a search term", variant: "destructive" }); return; }
            toast({ title: `🔍 Searching for "${searchQuery}"`, description: `Found ${filteredCourses.length} result(s)` });
          }}>
            <Search className="mr-1.5 h-4 w-4" />Search
          </Button>
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

        {/* Course Cards */}
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
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{completed}/{c.lessons}</span><span>{pct}%</span></div>
                    <Progress value={pct} className="mt-1 h-1.5" />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant={status === "Completed" ? "outline" : "default"} size="sm" className="flex-1"
                      onClick={() => { if (status === "Not Started") startCourse.mutate(c.id); }}
                      disabled={startCourse.isPending}>
                      {status === "Completed" ? "Review" : status === "In Progress" ? "Continue" : "Start"}
                    </Button>
                    {status === "In Progress" && (
                      <Button variant="secondary" size="sm" onClick={() => startQuiz(c.id, c.title, c.category)}>
                        <HelpCircle className="mr-1 h-3.5 w-3.5" />Quiz
                      </Button>
                    )}
                    {status === "Completed" && (
                      <Button variant="secondary" size="sm" onClick={() => openShare(c.title)}>
                        <Share2 className="mr-1 h-3.5 w-3.5" />Share
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== ONLINE READING LIBRARY ===== */}
      <Dialog open={readingListOpen} onOpenChange={setReadingListOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Online Reading Library</DialogTitle>
            <DialogDescription>Each book contains 9 content units with end-of-unit assessments</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {readingMaterials.map((book) => {
              const done = getCompletedUnitsForBook(book.id).length;
              const hasCert = bookCertificates.some(bc => bc.bookTitle === book.title);
              return (
                <div key={book.id} className="flex items-start gap-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground">{book.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{book.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">{book.category}</Badge>
                      <span className="text-xs text-muted-foreground">9 units · {book.pages} pages</span>
                      {done > 0 && <Badge variant="secondary" className="text-xs">{done}/9 done</Badge>}
                      {hasCert && <Badge className="text-xs bg-success/10 text-success border-success/30">Certified ✓</Badge>}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => openBookStudy(book)}>Study</Button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== BOOK STUDY - 9 UNITS ===== */}
      <Dialog open={studyOpen} onOpenChange={setStudyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" /> {studyBook?.title}
            </DialogTitle>
            <DialogDescription>
              Unit {currentUnit + 1} of 9 — {getBookContents()[currentUnit]?.title}
            </DialogDescription>
          </DialogHeader>

          {/* Unit Navigation */}
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 9 }).map((_, i) => {
              const done = studyBook ? getCompletedUnitsForBook(studyBook.id).includes(i) : false;
              return (
                <button key={i} onClick={() => setCurrentUnit(i)}
                  className={`h-8 w-8 rounded-md text-xs font-medium transition-colors ${
                    currentUnit === i ? "bg-primary text-primary-foreground" :
                    done ? "bg-success/20 text-success border border-success/30" :
                    "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {done ? "✓" : i + 1}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="prose prose-sm max-h-60 overflow-y-auto rounded-lg bg-muted/30 p-5 text-sm text-card-foreground leading-relaxed">
            <h3 className="text-base font-bold mt-0">Unit {currentUnit + 1}: {getBookContents()[currentUnit]?.title}</h3>
            {getBookContents()[currentUnit]?.content.split("\n").map((p, i) => (
              <p key={i} className={p.startsWith("•") ? "ml-4" : ""}>{p}</p>
            ))}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Button variant="outline" size="sm" disabled={currentUnit === 0} onClick={() => setCurrentUnit(currentUnit - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />Previous
              </Button>
              <Button variant="outline" size="sm" disabled={currentUnit === 8} onClick={() => setCurrentUnit(currentUnit + 1)}>
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button size="sm" onClick={startUnitAssessment}>
              <HelpCircle className="mr-1.5 h-4 w-4" />
              End Unit Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== UNIT ASSESSMENT ===== */}
      <Dialog open={unitAssessmentOpen} onOpenChange={setUnitAssessmentOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Unit {currentUnit + 1} Assessment
            </DialogTitle>
            <DialogDescription>
              {getBookContents()[currentUnit]?.title} — {unitAssessmentDone ? "Results" : `Question ${unitQuestionIndex + 1} of ${getBookContents()[currentUnit]?.assessment.length || 3}`}
            </DialogDescription>
          </DialogHeader>

          {unitAssessmentDone ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${unitScore >= 70 ? "bg-success/10" : "bg-destructive/10"}`}>
                {unitScore >= 70 ? <CheckCircle2 className="h-10 w-10 text-success" /> : <X className="h-10 w-10 text-destructive" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{unitScore}%</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {unitScore >= 70
                    ? `✅ Unit ${currentUnit + 1} completed! ${studyBook ? `${getCompletedUnitsForBook(studyBook.id).length}/9 units done.` : ""}`
                    : "You need 70% to pass. Study the material and try again."}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                {unitScore < 70 && (
                  <Button variant="outline" onClick={() => { setUnitQuestionIndex(0); setUnitAnswers([]); setUnitSelectedAnswer(null); setUnitAssessmentDone(false); }}>
                    Retry
                  </Button>
                )}
                <Button onClick={() => { setUnitAssessmentOpen(false); if (unitScore >= 70 && currentUnit < 8) setCurrentUnit(currentUnit + 1); }}>
                  {unitScore >= 70 && currentUnit < 8 ? "Next Unit →" : "Close"}
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Progress value={((unitQuestionIndex + 1) / (getBookContents()[currentUnit]?.assessment.length || 3)) * 100} className="h-2" />
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="font-medium text-sm text-card-foreground">{getBookContents()[currentUnit]?.assessment[unitQuestionIndex]?.question}</p>
              </div>
              <div className="space-y-2">
                {getBookContents()[currentUnit]?.assessment[unitQuestionIndex]?.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setUnitSelectedAnswer(idx)}
                    className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${
                      unitSelectedAnswer === idx ? "border-primary bg-primary/5 text-card-foreground" : "border-border hover:border-primary/50 text-muted-foreground"
                    }`}>
                    <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleUnitAnswerNext} disabled={unitSelectedAnswer === null}>
                  {unitQuestionIndex + 1 >= (getBookContents()[currentUnit]?.assessment.length || 3) ? "Finish" : "Next"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== COURSE QUIZ (DB courses) ===== */}
      <Dialog open={quizOpen} onOpenChange={setQuizOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-primary" /> Course Quiz</DialogTitle>
            <DialogDescription>{quizCourseTitle} — {quizCompleted ? "Results" : `Question ${currentQuestion + 1} of ${getQuizQuestions().length}`}</DialogDescription>
          </DialogHeader>
          {quizCompleted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${score >= 70 ? "bg-success/10" : "bg-destructive/10"}`}>
                {score >= 70 ? <Award className="h-10 w-10 text-success" /> : <X className="h-10 w-10 text-destructive" />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{score}%</h3>
                <p className="text-sm text-muted-foreground mt-1">{score >= 70 ? "🎉 You passed and earned a certificate!" : "You need 70% to pass."}</p>
              </div>
              {score >= 70 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  <Button size="sm" onClick={() => downloadCertificate(quizCourseTitle)}><Download className="mr-1 h-4 w-4" />Download</Button>
                  <Button size="sm" variant="outline" onClick={() => openShare(quizCourseTitle)}><Share2 className="mr-1 h-4 w-4" />Share</Button>
                </div>
              )}
              <div className="flex gap-2 justify-center">
                {score < 70 && <Button variant="outline" onClick={() => { setCurrentQuestion(0); setAnswers([]); setSelectedAnswer(null); setQuizCompleted(false); }}>Retry</Button>}
                <Button onClick={() => setQuizOpen(false)}>Close</Button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <Progress value={((currentQuestion + 1) / getQuizQuestions().length) * 100} className="h-2" />
              <div className="rounded-lg bg-muted/50 p-4"><p className="font-medium text-sm text-card-foreground">{getQuizQuestions()[currentQuestion]?.question}</p></div>
              <div className="space-y-2">
                {getQuizQuestions()[currentQuestion]?.options.map((opt, idx) => (
                  <button key={idx} onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left rounded-lg border-2 p-3 text-sm transition-all ${selectedAnswer === idx ? "border-primary bg-primary/5 text-card-foreground" : "border-border hover:border-primary/50 text-muted-foreground"}`}>
                    <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>{opt}
                  </button>
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleNextQuestion} disabled={selectedAnswer === null}>
                  {currentQuestion + 1 >= getQuizQuestions().length ? "Finish" : "Next"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== MY CERTIFICATES ===== */}
      <Dialog open={certDialogOpen} onOpenChange={setCertDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> My Certificates</DialogTitle>
            <DialogDescription>Certificates from completed courses and books</DialogDescription>
          </DialogHeader>
          {allCertificates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="mx-auto h-12 w-12 mb-3 opacity-30" />
              <p className="font-medium">No certificates yet</p>
              <p className="text-sm mt-1">Complete course quizzes or all 9 book units (70%+) to earn certificates!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {allCertificates.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">{cert.title}</p>
                    <p className="text-xs text-muted-foreground">{cert.category} · {cert.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => downloadCertificate(cert.title)}><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => openShare(cert.title)}><Share2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== GENERATE CERTIFICATE ===== */}
      <Dialog open={generateCertOpen} onOpenChange={setGenerateCertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" /> Generate Certificate</DialogTitle>
            <DialogDescription>Select a completed course or book to generate your certificate</DialogDescription>
          </DialogHeader>
          {allCertificates.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Complete a course quiz or all 9 units of a book to generate a certificate.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Select value={certCourse} onValueChange={setCertCourse}>
                <SelectTrigger><SelectValue placeholder="Select course/book" /></SelectTrigger>
                <SelectContent>
                  {allCertificates.map((cert, i) => (
                    <SelectItem key={i} value={cert.title}>{cert.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button disabled={!certCourse} onClick={() => { downloadCertificate(certCourse); setGenerateCertOpen(false); }}>
                  <Download className="mr-1.5 h-4 w-4" />Download Certificate
                </Button>
                <Button variant="outline" disabled={!certCourse} onClick={() => { openShare(certCourse); setGenerateCertOpen(false); }}>
                  <Share2 className="mr-1.5 h-4 w-4" />Share Certificate
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== SHARE DIALOG ===== */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Share2 className="h-5 w-5 text-primary" /> Share Certificate</DialogTitle>
            <DialogDescription>Share "{shareTitle}" certificate</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("whatsapp", shareTitle)}>
              <MessageCircle className="h-6 w-6 text-green-500" />
              <span className="text-xs">WhatsApp</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("facebook", shareTitle)}>
              <Facebook className="h-6 w-6 text-blue-600" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("instagram", shareTitle)}>
              <Instagram className="h-6 w-6 text-pink-500" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("email", shareTitle)}>
              <Mail className="h-6 w-6 text-orange-500" />
              <span className="text-xs">Email</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => handleShare("github", shareTitle)}>
              <Github className="h-6 w-6" />
              <span className="text-xs">GitHub</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => { downloadCertificate(shareTitle); setShareOpen(false); }}>
              <Download className="h-6 w-6 text-primary" />
              <span className="text-xs">Download</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Training;
