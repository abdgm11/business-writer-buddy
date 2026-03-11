import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, Mail, FileText, Presentation, Linkedin, MessageSquare, Volume2 } from "lucide-react";
import { CorrectionItem } from "@/components/CorrectionItem";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const sampleText =
  "I want to ask about the project status. Can you give me update? We need to finish this by next week otherwise client will be angry. Please do the needful.";

const tones = [
  { id: "formal", label: "Formal" },
  { id: "friendly", label: "Friendly" },
  { id: "assertive", label: "Assertive" },
  { id: "diplomatic", label: "Diplomatic" },
] as const;

const contexts = [
  { id: "email", label: "Email", icon: Mail },
  { id: "report", label: "Report", icon: FileText },
  { id: "presentation", label: "Presentation", icon: Presentation },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "slack", label: "Slack", icon: MessageSquare },
] as const;

interface Correction {
  original: string;
  improved: string;
  reason: string;
}

interface RewriteResult {
  polished: string;
  corrections: Correction[];
}

export const HeroDemoInput = () => {
  const [text, setText] = useState("");
  const [context, setContext] = useState("email");
  const [tone, setTone] = useState("formal");
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedText, setSubmittedText] = useState("");

  const handleDemo = async () => {
    const inputText = text.trim() || sampleText;
    setLoading(true);
    setResult(null);
    setSubmittedText(inputText);

    try {
      const { data, error } = await supabase.functions.invoke("rewrite", {
        body: { text: inputText, context, tone },
      });

      if (error) {
        console.error("Rewrite error:", error);
        toast.error("Failed to polish text. Please try again.");
        return;
      }

      if (data?.error) {
        toast.error(data.message || data.error);
        return;
      }

      setResult({ polished: data.polished, corrections: data.corrections });
    } catch (e) {
      console.error("Demo rewrite error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSubmittedText("");
  };

  return (
    <div className="mx-auto max-w-3xl">
      {!result ? (
        <div className="rounded-xl border bg-card p-6 shadow-elegant space-y-4">
          {/* Context selector */}
          <div className="flex flex-wrap gap-2">
            {contexts.map((c) => (
              <button
                key={c.id}
                onClick={() => setContext(c.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  context === c.id
                    ? "border-gold bg-gold/10 text-gold-dark"
                    : "border-border bg-background text-muted-foreground hover:border-gold/50"
                }`}
              >
                <c.icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            ))}
          </div>

          {/* Tone selector */}
          <div className="flex items-center gap-2 flex-wrap">
            <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  tone === t.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your email, message, or report here... (or click below for a demo)"
            className="w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
            disabled={loading}
          />
          <div className="flex items-center justify-between">
            <Button variant="default" size="lg" onClick={handleDemo} className="w-full sm:w-auto" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Polishing...
                </>
              ) : (
                <>
                  Polish My Writing <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <p className="hidden sm:block text-xs text-muted-foreground">Try it free — no signup required</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-destructive">Original</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{submittedText}</p>
            </div>
            <div className="rounded-xl border-2 border-success bg-card p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Polished</p>
              <p className="text-sm text-foreground leading-relaxed">{result.polished}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">What Changed & Why</p>
            <div className="space-y-2">
              {result.corrections.map((c) => (
                <CorrectionItem key={c.original} {...c} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click each correction to see the grammar rule</p>
          </div>
          <Button variant="gold" onClick={handleReset}>
            Try Another
          </Button>
        </div>
      )}
    </div>
  );
};
