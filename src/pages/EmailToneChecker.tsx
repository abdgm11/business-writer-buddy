import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Star,
  Globe,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

interface ToneBreakdown {
  tone: string;
  percentage: number;
}

interface Suggestion {
  issue: string;
  example: string;
}

interface ToneAnalysis {
  dominant_tone: string;
  tone_breakdown: ToneBreakdown[];
  professionalism_score: number;
  clarity_score: number;
  confidence_level: string;
  impression: string;
  suggestions: Suggestion[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

const SAMPLE_EMAIL = `Hi team,

I want to ask about the project deadline. Can you give me update on where we are? I think we might be behind schedule and the client will not be happy if we miss the deadline. Please do the needful and let me know what is happening.

Thanks`;

const ScoreRing = ({ score, label, color }: { score: number; label: string; color: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
};

const ToneBar = ({ tone, percentage }: ToneBreakdown) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-sm">
      <span className="font-medium text-foreground">{tone}</span>
      <span className="text-muted-foreground">{percentage}%</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <motion.div
        className="h-full rounded-full gradient-gold"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      />
    </div>
  </div>
);

interface RewriteResult {
  polished_text: string;
  corrections: { original: string; improved: string; reason: string }[];
}

const EmailToneChecker = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<ToneAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rewriteResult, setRewriteResult] = useState<RewriteResult | null>(null);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [rewriteError, setRewriteError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRewrite = async () => {
    const input = text.trim() || SAMPLE_EMAIL;
    setRewriteLoading(true);
    setRewriteError("");
    setRewriteResult(null);

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rewrite`;
      const res = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ text: input, context: "email", tone: "formal" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRewriteError(data.message || data.error || "Rewrite failed. Please try again.");
        return;
      }

      if (data.polished_text) {
        setRewriteResult({
          polished_text: data.polished_text,
          corrections: data.corrections || [],
        });
      } else {
        setRewriteError("Unexpected response. Please try again.");
      }
    } catch {
      setRewriteError("Network error. Please check your connection.");
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleCopyRewrite = async () => {
    if (!rewriteResult) return;
    await navigator.clipboard.writeText(rewriteResult.polished_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAnalyze = async () => {
    const input = text.trim() || SAMPLE_EMAIL;
    if (!text.trim()) setText(SAMPLE_EMAIL);

    setLoading(true);
    setError("");
    setAnalysis(null);
    setRewriteResult(null);
    setRewriteError("");

    try {
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tone-checker`;
      const res = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ text: input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || data.error || "Analysis failed. Please try again.");
        return;
      }

      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0 gradient-navy opacity-[0.02]" />
        <div className="absolute -top-32 -right-32 h-[400px] w-[400px] rounded-full bg-gold/5 blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
              className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-elegant"
            >
              <Mail className="h-3.5 w-3.5 text-gold" />
              Free Email Tone Analyzer — No Signup Required
            </motion.div>

            <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="mb-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl !leading-[1.1]"
            >
              Check Your Email's{" "}
              <span className="text-gradient-gold">Tone Instantly</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="mx-auto mb-8 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed"
            >
              Paste your email and get instant AI-powered feedback on tone, professionalism, clarity, and confidence — with actionable suggestions to improve.
            </motion.p>
          </div>

          {/* Input + Results */}
          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="mx-auto max-w-3xl"
          >
            <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-elegant">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your email here... (or click 'Analyze' for a demo)"
                className="mb-4 w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={5}
                maxLength={2000}
              />
              <div className="flex items-center justify-between flex-wrap gap-3">
                <Button variant="hero" onClick={handleAnalyze} disabled={loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BarChart3 className="h-4 w-4" />}
                  {loading ? "Analyzing..." : "Analyze Tone"}
                </Button>
                <span className="text-xs text-muted-foreground">{text.length}/2000 characters</span>
              </div>
              {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>
          </motion.div>

          {/* Results */}
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto mt-6 max-w-3xl space-y-4"
            >
              {/* Scores Row */}
              <div className="rounded-xl border bg-card p-6 shadow-elegant">
                <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
                  <ScoreRing score={analysis.professionalism_score} label="Professionalism" color="hsl(var(--gold))" />
                  <ScoreRing score={analysis.clarity_score} label="Clarity" color="hsl(var(--success))" />
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-border">
                      <span className="text-lg font-bold text-foreground">{analysis.confidence_level}</span>
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">Confidence</span>
                  </div>
                </div>
              </div>

              {/* Dominant Tone + Impression */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border bg-card p-5 shadow-elegant">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">Dominant Tone</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{analysis.dominant_tone}</p>
                </div>
                <div className="rounded-xl border bg-card p-5 shadow-elegant">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">Recipient Impression</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{analysis.impression}</p>
                </div>
              </div>

              {/* Tone Breakdown */}
              <div className="rounded-xl border bg-card p-5 shadow-elegant">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-4 w-4 text-gold" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold">Tone Breakdown</span>
                </div>
                <div className="space-y-3">
                  {analysis.tone_breakdown.map((t) => (
                    <ToneBar key={t.tone} {...t} />
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              {analysis.suggestions.length > 0 && (
                <div className="rounded-xl border bg-card p-5 shadow-elegant">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-4 w-4 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold">Suggestions</span>
                  </div>
                  <div className="space-y-3">
                    {analysis.suggestions.map((s, i) => (
                      <div key={i} className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm font-medium text-foreground mb-1">{s.issue}</p>
                        <p className="text-sm text-muted-foreground italic">"{s.example}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inline Rewrite */}
              <div className="rounded-xl border-2 border-gold bg-card p-6 shadow-gold">
                {!rewriteResult ? (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Want this email <span className="text-gradient-gold">rewritten instantly?</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get a polished, professional version of your email right here — powered by ProseAI.
                    </p>
                    <Button variant="gold" className="gap-2" onClick={handleRewrite} disabled={rewriteLoading}>
                      {rewriteLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                      {rewriteLoading ? "Rewriting..." : "Rewrite This Email"}
                    </Button>
                    {rewriteError && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        {rewriteError}
                      </div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-gold" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-gold">Polished Version</span>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={handleCopyRewrite}>
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <div className="rounded-lg border-2 border-gold/30 bg-background p-4">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {rewriteResult.polished_text}
                      </p>
                    </div>
                    {rewriteResult.corrections.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What Changed</span>
                        {rewriteResult.corrections.map((c, i) => (
                          <div key={i} className="rounded-lg bg-muted/50 p-3 text-sm">
                            <span className="text-destructive line-through">{c.original}</span>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="text-green-500 font-medium">{c.improved}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-3 pt-2">
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRewrite} disabled={rewriteLoading}>
                        {rewriteLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                        Rewrite Again
                      </Button>
                      <Link to="/coach">
                        <Button variant="gold" size="sm" className="gap-1.5">
                          Full Writing Coach <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* SEO content: How It Works */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
              How the Email Tone Checker Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three steps to a better email — takes less than 10 seconds.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { step: "1", icon: Mail, title: "Paste Your Email", desc: "Copy-paste your draft email into the analyzer. Works with any length up to 2,000 characters." },
              { step: "2", icon: Zap, title: "Get AI Analysis", desc: "Our AI analyzes tone, professionalism, clarity, and confidence in seconds — completely free." },
              { step: "3", icon: CheckCircle2, title: "Improve & Send", desc: "Apply the actionable suggestions to sound more professional, confident, and clear." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative rounded-xl border bg-background p-6 shadow-elegant text-center"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full gradient-gold text-lg font-bold text-accent-foreground">
                  {s.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO content: Why Tone Matters */}
      <section className="py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-6 text-center">
              Why Email Tone Matters
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Studies show that <strong className="text-foreground">64% of workplace misunderstandings</strong> stem from email tone issues. A message you intend as friendly can come across as passive-aggressive. A straightforward request might seem demanding.
              </p>
              <p>
                For non-native English speakers, tone is even trickier. Direct translations from your native language can sound too blunt, too formal, or unintentionally rude in English business contexts.
              </p>
              <p>
                The ProseAI Email Tone Checker uses advanced AI to detect the emotional undertones of your writing and provides specific, actionable suggestions to align your intended message with how it will actually be received.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Shield, title: "100% Private", desc: "Your email text is never stored or shared. Analysis happens in real-time and is immediately discarded." },
                { icon: Globe, title: "Works for Any English Level", desc: "Whether you're a native speaker or learning, get nuanced feedback that goes beyond basic grammar." },
                { icon: Star, title: "No Signup Required", desc: "Use the tone checker instantly — no account, no payment, no friction." },
                { icon: Sparkles, title: "Powered by ProseAI", desc: "The same AI that powers ProseAI's professional writing coach, used by professionals in 80+ countries." },
              ].map((f) => (
                <div key={f.title} className="rounded-xl border bg-card p-5 shadow-elegant">
                  <div className="flex items-center gap-3 mb-2">
                    <f.icon className="h-5 w-5 text-gold" />
                    <h3 className="font-semibold text-foreground">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-card">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            Ready to Write Better Emails?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Go beyond tone checking — get your emails fully rewritten in polished Business English with color-coded explanations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/coach">
              <Button variant="gold" size="lg" className="gap-2">
                Try ProseAI Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ProseAI — AI-powered Business English writing coach</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/coach" className="hover:text-foreground transition-colors">Writing Coach</Link>
            <Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EmailToneChecker;
