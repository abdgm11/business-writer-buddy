import { useState } from "react";
import { gtagEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { CorrectionItem } from "@/components/CorrectionItem";
import { ArrowRight, Mail, FileText, Presentation, Linkedin, MessageSquare, Volume2, Sparkles, Zap, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useRemainingRewrites } from "@/hooks/useRemainingRewrites";

const tones = [
  { id: "formal", label: "Formal", desc: "Board-level language" },
  { id: "friendly", label: "Friendly-Professional", desc: "Warm but polished" },
  { id: "assertive", label: "Assertive", desc: "Direct and confident" },
  { id: "diplomatic", label: "Diplomatic", desc: "Tactful and careful" },
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

const Coach = () => {
  const { user } = useAuth();
  const { remaining, used, limit, isPro, loading: quotaLoading, refetch: refetchQuota } = useRemainingRewrites();
  const [text, setText] = useState("");
  const [context, setContext] = useState("email");
  const [tone, setTone] = useState("formal");
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.polished);
    setCopied(true);
    gtagEvent("copy_rewrite", { context, tone, word_count: wordCount });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = result ? `${result.polished}\n\n✨ Polished with ProseAI — https://business-writer-buddy.lovable.app` : "";

  const handleShareLinkedIn = () => {
    gtagEvent("share_rewrite", { platform: "linkedin" });
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://business-writer-buddy.lovable.app")}`, "_blank");
  };

  const handleShareTwitter = () => {
    gtagEvent("share_rewrite", { platform: "twitter" });
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const MAX_WORDS = 500;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isNearLimit = wordCount >= MAX_WORDS * 0.8;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleSubmit = async () => {
    if (!text.trim() || isOverLimit) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("rewrite", {
        body: { text: text.trim(), context, tone },
      });

      if (error) {
        console.error("Edge function error:", error);
        toast.error("Failed to rewrite text. Please try again.");
        return;
      }

      if (data.error) {
        if (data.limit_reached) {
          toast.error(data.message || "Daily limit reached. Upgrade to Pro for unlimited rewrites.");
        } else {
          toast.error(data.error);
        }
        return;
      }

      const rewriteResult: RewriteResult = { polished: data.polished, corrections: data.corrections };
      setResult(rewriteResult);
      gtagEvent("rewrite_submit", { context, tone, word_count: wordCount });

      // History is now saved server-side in the edge function
      if (user) {
        // Update streak client-side (non-security-sensitive)
        await supabase.from("profiles").update({
          last_practice_at: new Date().toISOString(),
        }).eq("user_id", user.id);

        refetchQuota();
      }
    } catch (e) {
      console.error("Rewrite error:", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Writing Coach</h1>
          <p className="text-muted-foreground mt-1">Paste your text, choose a context, and get professional rewrites with explanations.</p>

          {user && !quotaLoading && !isPro && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2.5 text-sm">
              <Zap className="h-4 w-4 shrink-0 text-gold" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{remaining}/{limit}</span> free rewrites remaining today.
                {remaining === 0 && (
                  <> <Link to="/settings" className="font-medium text-gold hover:underline">Upgrade to Pro</Link> for unlimited.</>
                )}
              </span>
            </div>
          )}

          {user && !quotaLoading && isPro && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm">
              <Sparkles className="h-4 w-4 shrink-0 text-gold" />
              <span className="text-muted-foreground">
                <span className="font-semibold text-gold">Pro</span> — Unlimited rewrites
              </span>
            </div>
          )}

          {!user && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm">
              <Sparkles className="h-4 w-4 shrink-0 text-gold" />
              <span className="text-muted-foreground">
                <Link to="/login" className="font-medium text-gold hover:underline">Sign up free</Link> to save your writing history and track your progress.
              </span>
            </div>
          )}
        </div>

        {/* Context Selector */}
        <div className="flex flex-wrap gap-2">
          {contexts.map((c) => (
            <button
              key={c.id}
              onClick={() => setContext(c.id)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                context === c.id
                  ? "border-gold bg-gold/10 text-gold-dark"
                  : "border-border bg-card text-muted-foreground hover:border-gold/50"
              }`}
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Tone Selector */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">Tone</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  tone === t.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
                title={t.desc}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
           <textarea
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Paste your email, report, message, or speech draft here..."
             className={`mb-2 w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[150px] ${isOverLimit ? "border-destructive focus:ring-destructive" : ""}`}
             rows={6}
           />
           {isOverLimit && (
             <p className="text-xs text-destructive mb-2">Text exceeds the {MAX_WORDS}-word limit. Please shorten it before submitting.</p>
           )}
           {isNearLimit && !isOverLimit && (
             <p className="text-xs text-gold mb-2">Approaching the {MAX_WORDS}-word limit ({MAX_WORDS - wordCount} words remaining).</p>
           )}
           <div className="flex items-center justify-between">
             <Button variant="hero" onClick={handleSubmit} disabled={!text.trim() || loading || isOverLimit}>
               {loading ? "Polishing..." : "Polish My Writing"} <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
             <p className={`text-xs ${isOverLimit ? "text-destructive font-medium" : isNearLimit ? "text-gold" : "text-muted-foreground"}`}>
               {wordCount}/{MAX_WORDS} words · {text.length} characters
             </p>
           </div>
         </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-destructive">Original</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
              <div className="rounded-xl border-2 border-success bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-success">Polished</p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs gap-1.5">
                      {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShareTwitter} className="h-7 px-2 text-xs gap-1.5">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      Share
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShareLinkedIn} className="h-7 px-2 text-xs gap-1.5">
                      <Linkedin className="h-3.5 w-3.5" />
                      Share
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{result.polished}</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">Corrections & Explanations</p>
              <div className="space-y-2">
                {result.corrections.map((c) => (
                  <CorrectionItem key={c.original} {...c} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Click each correction to see the grammar rule</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Coach;
