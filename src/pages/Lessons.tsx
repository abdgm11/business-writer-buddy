import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, Clock, ArrowRight } from "lucide-react";

const dailyLessons = [
  {
    id: 1,
    title: "Formal vs. Informal Register",
    description: "Learn when to use 'would like to' vs 'want to' in business emails.",
    duration: "5 min",
    completed: true,
    category: "Tone",
  },
  {
    id: 2,
    title: "Avoiding Redundancy",
    description: "Eliminate phrases like 'please be informed that' and 'I am writing to let you know'.",
    duration: "4 min",
    completed: true,
    category: "Clarity",
  },
  {
    id: 3,
    title: "Active vs. Passive Voice",
    description: "When to use each in reports and presentations for maximum impact.",
    duration: "5 min",
    completed: false,
    category: "Grammar",
  },
  {
    id: 4,
    title: "Email Sign-offs",
    description: "Beyond 'Best Regards' — professional closings for different contexts.",
    duration: "3 min",
    completed: false,
    category: "Etiquette",
  },
  {
    id: 5,
    title: "Hedging Language",
    description: "Use 'it appears that' and 'we might consider' to soften recommendations.",
    duration: "5 min",
    completed: false,
    category: "Diplomacy",
  },
];

const Lessons = () => {
  const [lessons] = useState(dailyLessons);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Lessons</h1>
          <p className="text-muted-foreground mt-1">5-minute challenges based on your most common mistakes.</p>
        </div>

        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`rounded-xl border bg-card p-5 shadow-elegant transition-all hover:shadow-lg ${
                lesson.completed ? "opacity-70" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${lesson.completed ? "bg-success/10" : "gradient-navy"}`}>
                    {lesson.completed ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <BookOpen className="h-5 w-5 text-gold" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground font-sans">{lesson.title}</h3>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {lesson.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{lesson.description}</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> {lesson.duration}
                    </div>
                  </div>
                </div>
                <Button
                  variant={lesson.completed ? "outline" : "hero"}
                  size="sm"
                  disabled={lesson.completed}
                >
                  {lesson.completed ? "Done" : "Start"} {!lesson.completed && <ArrowRight className="ml-1 h-3 w-3" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Lessons;
