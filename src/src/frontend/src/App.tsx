import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  useSubmitReview,
  useGetFreeNotes,
  useAddFreeNote,
  useDeleteFreeNote,
  useGetYouTubeLectures,
  useAddYouTubeLecture,
  useDeleteYouTubeLecture,
} from "@/hooks/useQueries";
import { 
  AtomIcon, 
  BookOpenIcon, 
  GraduationCapIcon, 
  LightbulbIcon,
  MailIcon,
  PhoneIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
  UserIcon,
  ZapIcon,
  StarIcon,
  ClockIcon,
  UsersIcon,
  AwardIcon,
  FileTextIcon,
  VideoIcon,
  DownloadIcon,
  TrashIcon,
  PlusIcon,
  ExternalLinkIcon,
  PlayCircleIcon,
  CalendarIcon,
} from "lucide-react";
import { SiYoutube } from "react-icons/si";

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    name: "",
    course: "",
    rating: 0,
    review: "",
  });

  // Free Notes state
  const [noteFormData, setNoteFormData] = useState({
    title: "",
    description: "",
    fileUrl: "",
    category: "",
  });

  // YouTube Lecture state
  const [lectureFormData, setLectureFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    category: "",
  });

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "note" | "lecture" | null;
    id: bigint | null;
  }>({
    isOpen: false,
    type: null,
    id: null,
  });

  const submitReviewMutation = useSubmitReview();
  const { data: freeNotes = [], isLoading: isLoadingNotes } = useGetFreeNotes();
  const addFreeNoteMutation = useAddFreeNote();
  const deleteFreeNoteMutation = useDeleteFreeNote();
  const { data: youtubeLectures = [], isLoading: isLoadingLectures } = useGetYouTubeLectures();
  const addYouTubeLectureMutation = useAddYouTubeLecture();
  const deleteYouTubeLectureMutation = useDeleteYouTubeLecture();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (name && email && message) {
      toast.success("Thank you! We'll get back to you soon.", {
        description: "Your inquiry has been received.",
      });
      e.currentTarget.reset();
    } else {
      toast.error("Please fill in all fields");
    }
  };

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!reviewFormData.name || !reviewFormData.course || !reviewFormData.review) {
      toast.error("Please fill in all fields");
      return;
    }

    if (reviewFormData.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    submitReviewMutation.mutate(
      {
        studentName: reviewFormData.name,
        course: reviewFormData.course,
        rating: BigInt(reviewFormData.rating),
        reviewText: reviewFormData.review,
      },
      {
        onSuccess: () => {
          toast.success("Thank you for your feedback!", {
            description: "Your review has been submitted successfully.",
          });
          // Clear the form
          setReviewFormData({
            name: "",
            course: "",
            rating: 0,
            review: "",
          });
        },
        onError: (error) => {
          toast.error("Failed to submit review", {
            description: error instanceof Error ? error.message : "Please try again later",
          });
        },
      }
    );
  };

  const handleNoteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!noteFormData.title || !noteFormData.description || !noteFormData.fileUrl || !noteFormData.category) {
      toast.error("Please fill in all fields");
      return;
    }

    addFreeNoteMutation.mutate(noteFormData, {
      onSuccess: () => {
        toast.success("Note added successfully!");
        setNoteFormData({ title: "", description: "", fileUrl: "", category: "" });
      },
      onError: (error) => {
        toast.error("Failed to add note", {
          description: error instanceof Error ? error.message : "Please try again later",
        });
      },
    });
  };

  const handleLectureSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!lectureFormData.title || !lectureFormData.description || !lectureFormData.videoUrl || !lectureFormData.category) {
      toast.error("Please fill in all fields");
      return;
    }

    addYouTubeLectureMutation.mutate(lectureFormData, {
      onSuccess: () => {
        toast.success("Lecture added successfully!");
        setLectureFormData({ title: "", description: "", videoUrl: "", category: "" });
      },
      onError: (error) => {
        toast.error("Failed to add lecture", {
          description: error instanceof Error ? error.message : "Please try again later",
        });
      },
    });
  };

  const handleDelete = () => {
    if (!deleteDialog.id || !deleteDialog.type) return;

    if (deleteDialog.type === "note") {
      deleteFreeNoteMutation.mutate(deleteDialog.id, {
        onSuccess: () => {
          toast.success("Note deleted successfully");
          setDeleteDialog({ isOpen: false, type: null, id: null });
        },
        onError: (error) => {
          toast.error("Failed to delete note", {
            description: error instanceof Error ? error.message : "Please try again later",
          });
        },
      });
    } else {
      deleteYouTubeLectureMutation.mutate(deleteDialog.id, {
        onSuccess: () => {
          toast.success("Lecture deleted successfully");
          setDeleteDialog({ isOpen: false, type: null, id: null });
        },
        onError: (error) => {
          toast.error("Failed to delete lecture", {
            description: error instanceof Error ? error.message : "Please try again later",
          });
        },
      });
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categories = [
    "Mechanics",
    "Electromagnetism",
    "Thermodynamics",
    "Optics",
    "Modern Physics",
    "Waves & Sound",
    "Class 11",
    "Class 12",
  ];

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <AtomIcon className="h-6 w-6 text-accent" />
            <span className="font-display text-xl font-bold">
              <span className="font-light">Dada's</span>{" "}
              <span className="text-primary">Physics</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">
              About
            </a>
            <a href="#why-us" className="text-sm font-medium hover:text-accent transition-colors">
              Why Us
            </a>
            <a href="#reviews" className="text-sm font-medium hover:text-accent transition-colors">
              Reviews
            </a>
            <a href="#courses" className="text-sm font-medium hover:text-accent transition-colors">
              Courses
            </a>
            <a href="#free-resources" className="text-sm font-medium hover:text-accent transition-colors">
              Free Resources
            </a>
            <a href="#topics" className="text-sm font-medium hover:text-accent transition-colors">
              Topics
            </a>
            <Button onClick={scrollToContact} size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Get in Touch
            </Button>
          </nav>
          <Button onClick={scrollToContact} size="sm" className="md:hidden bg-accent hover:bg-accent/90 text-accent-foreground">
            Contact
          </Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div 
            className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none select-none physics-equation text-[120px] md:text-[180px] leading-none flex items-center justify-center"
            style={{
              transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
              opacity: isVisible ? 1 : 0,
              transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            E = mc²
          </div>
          
          <div className="container relative z-10">
            <div className="mx-auto max-w-4xl text-center space-y-8">
              <div 
                className="space-y-4"
                style={{
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
                }}
              >
                <Badge variant="outline" className="border-accent text-accent px-4 py-1">
                  Specialized Physics Coaching
                </Badge>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight">
                  <span className="font-light">Dada's</span>{" "}
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Physics
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                  Master the universe's fundamental laws with expert guidance from an educator dedicated solely to physics excellence
                </p>
              </div>
              
              <div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                style={{
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s",
                }}
              >
                <Button 
                  onClick={scrollToContact}
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8"
                >
                  <LightbulbIcon className="mr-2 h-5 w-5" />
                  Start Your Journey
                </Button>
                <Button 
                  onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8"
                >
                  Learn More
                </Button>
              </div>

              <div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8"
                style={{
                  transform: isVisible ? "translateY(0)" : "translateY(30px)",
                  opacity: isVisible ? 1 : 0,
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
                }}
              >
                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50">
                  <GraduationCapIcon className="h-6 w-6 text-accent" />
                  <div className="text-left">
                    <div className="font-display text-2xl font-bold text-primary">8</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50">
                  <AtomIcon className="h-6 w-6 text-accent" />
                  <div className="text-left">
                    <div className="font-display text-2xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Physics Focus</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50">
                  <TrendingUpIcon className="h-6 w-6 text-accent" />
                  <div className="text-left">
                    <div className="font-display text-2xl font-bold text-primary">Top</div>
                    <div className="text-sm text-muted-foreground">Results Driven</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* About Section */}
        <section id="about" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-primary text-primary">
                  Meet Your Educator
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Devjyoti Chatterjee
                </h2>
                <p className="text-xl text-muted-foreground">
                  Expert Physics Educator with 8 Years of Teaching Excellence
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-accent" />
                      </div>
                      <CardTitle className="text-2xl">Teaching Philosophy</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Physics is not just formulas and numbers—it's understanding the fundamental principles that govern our universe. My approach focuses on building deep conceptual clarity before diving into problem-solving.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Every student has a unique learning style, and I tailor my teaching methods to help each individual grasp complex concepts with confidence and curiosity.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <GraduationCapIcon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">Experience & Expertise</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2Icon className="h-5 w-5 text-success mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">8 years of dedicated physics teaching experience</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2Icon className="h-5 w-5 text-success mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">Specialized curriculum for board exams and competitive tests</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2Icon className="h-5 w-5 text-success mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">Proven track record of student success and conceptual mastery</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2Icon className="h-5 w-5 text-success mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">Patient, encouraging approach that builds student confidence</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-accent text-accent">
                  Our Approach
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Why Choose Dada's Physics?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Pure physics expertise, personalized attention, and a passion for teaching
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center border-2 hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <AtomIcon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle>100% Physics Focused</CardTitle>
                    <CardDescription className="text-base">
                      Unlike general coaching centres, we specialize exclusively in physics, ensuring unmatched depth and expertise
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="text-center border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <ZapIcon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle>Conceptual Clarity First</CardTitle>
                    <CardDescription className="text-base">
                      We prioritize deep understanding over rote memorization, building strong foundations for lasting success
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="text-center border-2 hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <BookOpenIcon className="h-8 w-8 text-accent" />
                    </div>
                    <CardTitle>Personalized Learning</CardTitle>
                    <CardDescription className="text-base">
                      Small batch sizes and individual attention ensure every student's unique needs are addressed
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="mt-8 border-2 border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Our Teaching Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6 text-center">
                    <div className="space-y-2">
                      <div className="font-display text-4xl font-bold text-primary">01</div>
                      <h4 className="font-semibold">Concept Building</h4>
                      <p className="text-sm text-muted-foreground">Strong theoretical foundation</p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-display text-4xl font-bold text-primary">02</div>
                      <h4 className="font-semibold">Visual Learning</h4>
                      <p className="text-sm text-muted-foreground">Diagrams and real-world examples</p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-display text-4xl font-bold text-primary">03</div>
                      <h4 className="font-semibold">Problem Practice</h4>
                      <p className="text-sm text-muted-foreground">Progressive difficulty levels</p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-display text-4xl font-bold text-primary">04</div>
                      <h4 className="font-semibold">Exam Mastery</h4>
                      <p className="text-sm text-muted-foreground">Strategies and confidence building</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Student Reviews Section */}
        <section id="reviews" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-primary text-primary">
                  Student Testimonials
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Share Your Feedback
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Help us improve! Share your experience and feedback about our physics coaching
                </p>
              </div>

              {/* Review Submission Form */}
              <div className="mx-auto max-w-2xl mb-12">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Submit Your Review</CardTitle>
                    <CardDescription>
                      Share your learning experience with Dada's Physics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="review-name">Your Name</Label>
                        <Input
                          id="review-name"
                          placeholder="Enter your name"
                          value={reviewFormData.name}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, name: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="review-course">Course / Batch</Label>
                        <Input
                          id="review-course"
                          placeholder="e.g., Class 11 WBCHSE, JEE 2025"
                          value={reviewFormData.course}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, course: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewFormData({ ...reviewFormData, rating: star })}
                              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 rounded"
                            >
                              <StarIcon
                                className={`h-8 w-8 ${
                                  star <= reviewFormData.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </button>
                          ))}
                          {reviewFormData.rating > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground self-center">
                              {reviewFormData.rating} / 5
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="review-text">Your Review</Label>
                        <Textarea
                          id="review-text"
                          placeholder="Share your experience with the coaching, teaching style, and learning outcomes..."
                          rows={6}
                          value={reviewFormData.review}
                          onChange={(e) => setReviewFormData({ ...reviewFormData, review: e.target.value })}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                        disabled={submitReviewMutation.isPending}
                      >
                        {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics Card */}
              <div className="mt-12 text-center">
                <Card className="border-2 border-accent/30 bg-accent/5 inline-block">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-8 flex-wrap">
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold text-primary mb-1">100+</div>
                        <div className="text-sm text-muted-foreground">Happy Students</div>
                      </div>
                      <Separator orientation="vertical" className="h-12 hidden sm:block" />
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold text-primary mb-1">95%</div>
                        <div className="text-sm text-muted-foreground">Success Rate</div>
                      </div>
                      <Separator orientation="vertical" className="h-12 hidden sm:block" />
                      <div className="text-center">
                        <div className="font-display text-3xl font-bold text-primary mb-1">4.9/5</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Topics Covered Section */}
        <section id="topics" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-primary text-primary">
                  Curriculum
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Physics Topics Covered
                </h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive coverage across all major physics domains
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Mechanics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Kinematics and Motion</li>
                      <li>• Newton's Laws</li>
                      <li>• Work, Energy & Power</li>
                      <li>• Circular Motion</li>
                      <li>• Gravitation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Electromagnetism
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Electrostatics</li>
                      <li>• Current Electricity</li>
                      <li>• Magnetic Effects</li>
                      <li>• Electromagnetic Induction</li>
                      <li>• AC Circuits</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Optics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Ray Optics</li>
                      <li>• Wave Optics</li>
                      <li>• Reflection & Refraction</li>
                      <li>• Interference & Diffraction</li>
                      <li>• Optical Instruments</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Thermodynamics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Heat and Temperature</li>
                      <li>• Laws of Thermodynamics</li>
                      <li>• Kinetic Theory of Gases</li>
                      <li>• Heat Transfer</li>
                      <li>• Thermodynamic Processes</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Modern Physics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Atomic Structure</li>
                      <li>• Nuclear Physics</li>
                      <li>• Quantum Mechanics Basics</li>
                      <li>• Photoelectric Effect</li>
                      <li>• Semiconductors</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-accent" />
                      Waves & Sound
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Wave Motion</li>
                      <li>• Sound Waves</li>
                      <li>• Superposition</li>
                      <li>• Doppler Effect</li>
                      <li>• Resonance</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <Card className="border-2 border-accent/30 bg-accent/5 inline-block">
                  <CardContent className="pt-6">
                    <p className="text-lg mb-4">
                      <span className="font-semibold">Suitable for:</span> High School, Board Exams (CBSE/ICSE/State), JEE, NEET, and other competitive examinations
                    </p>
                    <Button onClick={scrollToContact} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                      Discuss Your Curriculum Needs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* New Courses Section */}
        <section id="courses" className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-accent text-accent">
                  Course Offerings
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Choose Your Learning Path
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Specialized courses designed for different goals and academic levels
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <AwardIcon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Class 11 WBCHSE</CardTitle>
                    <CardDescription className="text-base mt-3">
                      1st semester + JEE / NEET preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-4 w-4 text-accent" />
                        <span>Starts: March 1st week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpenIcon className="h-4 w-4 text-accent" />
                        <span>WBCHSE Board</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4 text-accent" />
                        <span>Online / Offline batch</span>
                      </div>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>1st semester syllabus coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>JEE / NEET preparation included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>Flexible online or offline mode</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={scrollToContact}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Contact for Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-lg relative">
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Starting Soon
                  </Badge>
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <TrendingUpIcon className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">Class 12 WBCHSE</CardTitle>
                    <CardDescription className="text-base mt-3">
                      3rd semester + JEE / NEET preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-4 w-4 text-accent" />
                        <span>Starts: March 1st week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpenIcon className="h-4 w-4 text-accent" />
                        <span>WBCHSE Board</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4 text-accent" />
                        <span>Offline batch only</span>
                      </div>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>3rd semester syllabus coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>JEE / NEET preparation included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>In-person classes for focused learning</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={scrollToContact}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Contact for Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      <LightbulbIcon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Class 11 CBSE</CardTitle>
                    <CardDescription className="text-base mt-3">
                      Class 11 CBSE + NEET / JEE preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-4 w-4 text-accent" />
                        <span>Starts soon</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpenIcon className="h-4 w-4 text-accent" />
                        <span>CBSE Board</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4 text-accent" />
                        <span>Contact for batch details</span>
                      </div>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>Complete CBSE syllabus coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>NEET / JEE preparation included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>Strong foundation building</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={scrollToContact}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Contact for Admission
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                      <TrendingUpIcon className="h-7 w-7 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">Class 12 CBSE</CardTitle>
                    <CardDescription className="text-base mt-3">
                      Class 12 CBSE + NEET / JEE preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon className="h-4 w-4 text-accent" />
                        <span>Starts: March 1st week</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <BookOpenIcon className="h-4 w-4 text-accent" />
                        <span>CBSE Board</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UsersIcon className="h-4 w-4 text-accent" />
                        <span>Contact for batch details</span>
                      </div>
                    </div>
                    <Separator />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>Complete CBSE syllabus coverage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>NEET / JEE preparation included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2Icon className="h-4 w-4 text-success mt-0.5 shrink-0" />
                        <span>Advanced problem solving</span>
                      </li>
                    </ul>
                    <Button 
                      onClick={scrollToContact}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      Contact for Details
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 text-center">
                <Card className="border-2 border-primary/30 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-lg flex items-center justify-center gap-2">
                        <GraduationCapIcon className="h-5 w-5 text-accent" />
                        All Courses Include
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle2Icon className="h-4 w-4 text-success" />
                          <span>Personalized attention</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle2Icon className="h-4 w-4 text-success" />
                          <span>Study materials provided</span>
                        </div>
                        <div className="flex items-center gap-2 justify-center">
                          <CheckCircle2Icon className="h-4 w-4 text-success" />
                          <span>Doubt clearing sessions</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Free Resources Section */}
        <section id="free-resources" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="mx-auto max-w-6xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-accent text-accent">
                  Learn For Free
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Free Learning Resources
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Access free study materials, notes, and video lectures to enhance your physics learning
                </p>
              </div>

              {/* YouTube Channel Highlight */}
              <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/5 to-primary/5 mb-12">
                <CardContent className="pt-8">
                  <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                    <div className="h-20 w-20 rounded-full bg-[#FF0000] flex items-center justify-center shrink-0">
                      <SiYoutube className="h-12 w-12 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-2xl font-bold mb-2">
                        Watch Free Physics Lectures on YouTube
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Subscribe to Dada's Physics YouTube channel for comprehensive physics lessons, problem-solving techniques, and exam preparation tips — completely free!
                      </p>
                      <Button 
                        asChild
                        size="lg"
                        className="bg-[#FF0000] hover:bg-[#CC0000] text-white"
                      >
                        <a 
                          href="https://youtube.com/@dadasphysics5474?si=3oMHVfVSkGwgouAf" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          <PlayCircleIcon className="h-5 w-5" />
                          Visit YouTube Channel
                          <ExternalLinkIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Free Notes Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                      <FileTextIcon className="h-6 w-6 text-primary" />
                      Free Study Notes
                    </h3>
                  </div>

                  {/* Add Note Form */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" />
                        Upload New Note
                      </CardTitle>
                      <CardDescription>Add study materials for students</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleNoteSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="note-title">Title</Label>
                          <Input
                            id="note-title"
                            placeholder="e.g., Newton's Laws Summary"
                            value={noteFormData.title}
                            onChange={(e) => setNoteFormData({ ...noteFormData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note-description">Description</Label>
                          <Textarea
                            id="note-description"
                            placeholder="Brief description of the content"
                            rows={3}
                            value={noteFormData.description}
                            onChange={(e) => setNoteFormData({ ...noteFormData, description: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note-url">File URL</Label>
                          <Input
                            id="note-url"
                            type="url"
                            placeholder="https://example.com/notes.pdf"
                            value={noteFormData.fileUrl}
                            onChange={(e) => setNoteFormData({ ...noteFormData, fileUrl: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note-category">Category</Label>
                          <Select 
                            value={noteFormData.category} 
                            onValueChange={(value) => setNoteFormData({ ...noteFormData, category: value })}
                            required
                          >
                            <SelectTrigger id="note-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={addFreeNoteMutation.isPending}
                        >
                          {addFreeNoteMutation.isPending ? "Adding..." : "Add Note"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Notes List */}
                  <div className="space-y-4">
                    {isLoadingNotes ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          Loading notes...
                        </CardContent>
                      </Card>
                    ) : freeNotes.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          No notes available yet. Be the first to add one!
                        </CardContent>
                      </Card>
                    ) : (
                      freeNotes.map((note) => (
                        <Card key={note.id.toString()} className="border-2 hover:border-primary/50 transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{note.title}</CardTitle>
                                <CardDescription className="mt-2">{note.description}</CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteDialog({ isOpen: true, type: "note", id: note.id })}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                              <Badge variant="secondary">{note.category}</Badge>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {formatDate(note.uploadTimestamp)}
                              </div>
                            </div>
                            <Button asChild className="w-full" variant="outline">
                              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">
                                <DownloadIcon className="mr-2 h-4 w-4" />
                                Download / View
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>

                {/* YouTube Lectures Section */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-2xl font-bold flex items-center gap-2">
                      <VideoIcon className="h-6 w-6 text-[#FF0000]" />
                      Video Lectures
                    </h3>
                  </div>

                  {/* Add Lecture Form */}
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PlusIcon className="h-5 w-5" />
                        Add New Lecture
                      </CardTitle>
                      <CardDescription>Share a YouTube lecture link</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLectureSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="lecture-title">Title</Label>
                          <Input
                            id="lecture-title"
                            placeholder="e.g., Kinematics Complete Chapter"
                            value={lectureFormData.title}
                            onChange={(e) => setLectureFormData({ ...lectureFormData, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lecture-description">Description</Label>
                          <Textarea
                            id="lecture-description"
                            placeholder="Brief description of the lecture"
                            rows={3}
                            value={lectureFormData.description}
                            onChange={(e) => setLectureFormData({ ...lectureFormData, description: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lecture-url">YouTube URL</Label>
                          <Input
                            id="lecture-url"
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={lectureFormData.videoUrl}
                            onChange={(e) => setLectureFormData({ ...lectureFormData, videoUrl: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lecture-category">Category</Label>
                          <Select 
                            value={lectureFormData.category} 
                            onValueChange={(value) => setLectureFormData({ ...lectureFormData, category: value })}
                            required
                          >
                            <SelectTrigger id="lecture-category">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-[#FF0000] hover:bg-[#CC0000]"
                          disabled={addYouTubeLectureMutation.isPending}
                        >
                          {addYouTubeLectureMutation.isPending ? "Adding..." : "Add Lecture"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Lectures List */}
                  <div className="space-y-4">
                    {isLoadingLectures ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          Loading lectures...
                        </CardContent>
                      </Card>
                    ) : youtubeLectures.length === 0 ? (
                      <Card>
                        <CardContent className="pt-6 text-center text-muted-foreground">
                          No lectures available yet. Be the first to add one!
                        </CardContent>
                      </Card>
                    ) : (
                      youtubeLectures.map((lecture) => (
                        <Card key={lecture.id.toString()} className="border-2 hover:border-[#FF0000]/50 transition-colors">
                          <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{lecture.title}</CardTitle>
                                <CardDescription className="mt-2">{lecture.description}</CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteDialog({ isOpen: true, type: "lecture", id: lecture.id })}
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                              <Badge variant="secondary">{lecture.category}</Badge>
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {formatDate(lecture.uploadTimestamp)}
                              </div>
                            </div>
                            <Button asChild className="w-full bg-[#FF0000] hover:bg-[#CC0000]">
                              <a href={lecture.videoUrl} target="_blank" rel="noopener noreferrer">
                                <PlayCircleIcon className="mr-2 h-4 w-4" />
                                Watch on YouTube
                                <ExternalLinkIcon className="ml-2 h-4 w-4" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-4xl">
              <div className="text-center space-y-4 mb-16">
                <Badge variant="outline" className="border-accent text-accent">
                  Get in Touch
                </Badge>
                <h2 className="font-display text-4xl md:text-5xl font-bold">
                  Start Your Physics Journey
                </h2>
                <p className="text-xl text-muted-foreground">
                  Have questions? Want to enroll? We'd love to hear from you
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form and we'll get back to you within 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your physics learning goals..."
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        Reach out to us through any of these channels
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <MailIcon className="h-5 w-5 text-accent shrink-0" />
                        <div>
                          <div className="font-medium">Email</div>
                          <a href="mailto:devjyotichatterjee5@gmail.com" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                            devjyotichatterjee5@gmail.com
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <PhoneIcon className="h-5 w-5 text-accent shrink-0" />
                        <div>
                          <div className="font-medium">Phone</div>
                          <a href="tel:+918906772968" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                            +91 89067 72968
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          <LightbulbIcon className="h-5 w-5 text-accent" />
                          Quick Response Guarantee
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          We understand that finding the right physics tutor is important. We respond to all inquiries within 24 hours and offer a free consultation to discuss your specific needs and goals.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <AtomIcon className="h-6 w-6 text-accent" />
                <span className="font-display text-xl font-bold">
                  <span className="font-light">Dada's</span>{" "}
                  <span className="text-primary">Physics</span>
                </span>
              </div>
              <div className="text-sm text-muted-foreground text-center md:text-left">
                <p>Expert Physics Coaching by Devjyoti Chatterjee</p>
                <p className="mt-1">8 Years of Teaching Excellence</p>
              </div>
              <div className="text-sm text-muted-foreground">
                © 2026. Built with love using{" "}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  caffeine.ai
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, isOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this {deleteDialog.type === "note" ? "note" : "lecture"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialog({ isOpen: false, type: null, id: null })}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteFreeNoteMutation.isPending || deleteYouTubeLectureMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
