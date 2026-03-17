import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  GraduationCap,
  PenLine,
  Target,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GrammarConcept {
  name: string;
  explanation: string;
  example_in_sentence: string;
  status: "correct" | "error" | "improvement";
}

interface GrammarError {
  original: string;
  correction: string;
  rule: string;
  explanation: string;
}

interface GrammarAnalysis {
  overall_assessment: string;
  grammar_score: number;
  corrected_sentence: string;
  concepts: GrammarConcept[];
  errors: GrammarError[];
  tips: string[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

const sampleSentence = "Me and him went to the store yesterday for buying some stuffs.";

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? "hsl(var(--success))" : score >= 5 ? "hsl(var(--gold))" : "hsl(var(--destructive))";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r="15.915" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.915" fill="none"
            stroke={color} strokeWidth="3"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-foreground">
          {score}
        </span>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "correct") return <CheckCircle2 className="h-4 w-4 text-success shrink-0" />;
  if (status === "error") return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
  return <AlertTriangle className="h-4 w-4 text-gold shrink-0" />;
};

export default function GrammarExplainer() {
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<GrammarAnalysis | null>(null);

  const handleAnalyze = async () => {
    const input = sentence.trim() || sampleSentence;
    setLoading(true);
    setAnalysis(null);

    try {
      const { data, error } = await supabase.functions.invoke("grammar-explainer", {
        body: { sentence: input },
      });

      if (error) {
        console.error("Grammar explainer error:", error);
        toast.error("Failed to analyze sentence. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.message || data.error);
        return;
      }

      setAnalysis(data.analysis);
      if (!sentence.trim()) setSentence(sampleSentence);
    } catch (e) {
      console.error("Grammar explainer error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setSentence("");
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 to-background px-4 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-dark">
              <GraduationCap className="h-3.5 w-3.5" /> Grammar Explainer
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            Understand <span className="text-gold">Every Grammar Rule</span> in Your Writing
          </motion.h1>

          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate="visible"
            className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg"
          >
            Paste any sentence and get a detailed breakdown of grammar concepts, errors, and rules — like having a grammar teacher on demand.
          </motion.p>
        </div>
      </section>

      {/* Input / Results */}
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          {!analysis ? (
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={3}
              className="rounded-xl border bg-card p-6 shadow-elegant space-y-4"
            >
              <textarea
                value={sentence}
                onChange={(e) => setSentence(e.target.value)}
                placeholder={`Paste a sentence to analyze... (or click below for a demo)\n\nExample: "${sampleSentence}"`}
                className="w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
                maxLength={1000}
                disabled={loading}
              />
              <div className="flex items-center justify-between">
                <Button size="lg" onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>
                  ) : (
                    <><BookOpen className="mr-2 h-4 w-4" /> Explain Grammar</>
                  )}
                </Button>
                <p className="hidden sm:block text-xs text-muted-foreground">Free — no signup required</p>
              </div>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="space-y-5">
              {/* Score + Assessment */}
              <div className="rounded-xl border bg-card p-6 flex flex-col sm:flex-row items-center gap-6">
                <ScoreRing score={analysis.grammar_score} label="Grammar Score" />
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-medium text-foreground">{analysis.overall_assessment}</p>
                  {analysis.corrected_sentence !== sentence && (
                    <div className="mt-3 rounded-lg border-2 border-success/30 bg-success/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-success mb-1">Corrected</p>
                      <p className="text-sm text-foreground">{analysis.corrected_sentence}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Errors */}
              {analysis.errors.length > 0 && (
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-destructive flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" /> Errors Found
                  </p>
                  <div className="space-y-3">
                    {analysis.errors.map((err, i) => (
                      <div key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-sm mb-1">
                              <span className="line-through text-destructive/70">{err.original}</span>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              <span className="font-semibold text-success">{err.correction}</span>
                            </div>
                            <p className="text-xs font-medium text-gold mb-1">{err.rule}</p>
                            <p className="text-xs text-muted-foreground">{err.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Concepts */}
              <div className="rounded-xl border bg-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> Grammar Concepts Identified
                </p>
                <div className="space-y-2">
                  {analysis.concepts.map((concept, i) => (
                    <div key={i} className="rounded-lg border p-3 transition-colors hover:bg-muted/50">
                      <div className="flex items-start gap-2">
                        <StatusIcon status={concept.status} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{concept.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{concept.explanation}</p>
                          <p className="mt-1 text-xs italic text-muted-foreground/80">
                            "{concept.example_in_sentence}"
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {analysis.tips.length > 0 && (
                <div className="rounded-xl border bg-card p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5" /> Writing Tips
                  </p>
                  <ul className="space-y-2">
                    {analysis.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 text-gold shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="gold" onClick={handleReset}>
                  <PenLine className="mr-2 h-4 w-4" /> Try Another Sentence
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/coach">
                    Full Writing Coach <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">How It Works</h2>
          <p className="mt-2 text-sm text-muted-foreground">Three steps to grammar mastery</p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { icon: PenLine, title: "Paste Your Sentence", desc: "Type or paste any sentence you want to understand better." },
              { icon: Target, title: "AI Analysis", desc: "Our AI identifies every grammar concept, error, and improvement opportunity." },
              { icon: GraduationCap, title: "Learn the Rules", desc: "Get clear explanations of each grammar rule with examples from your text." },
            ].map((step, i) => (
              <motion.div key={step.title} variants={fadeUp} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="rounded-xl border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                  <step.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground">Ready to Perfect Your Writing?</h2>
        <p className="mt-2 text-sm text-muted-foreground">Try the full ProseAI Writing Coach for AI-powered rewrites and corrections.</p>
        <Button size="lg" className="mt-6" asChild>
          <Link to="/coach">
            Try Writing Coach <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="mx-auto max-w-4xl flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-sm font-semibold text-foreground">ProseAI</span>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <Link to="/email-tone-checker" className="hover:text-foreground transition-colors">Tone Checker</Link>
            <Link to="/coach" className="hover:text-foreground transition-colors">Writing Coach</Link>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} ProseAI</p>
        </div>
      </footer>
    </div>
  );
}
