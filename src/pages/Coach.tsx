import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/AppLayout";
import { CorrectionItem } from "@/components/CorrectionItem";
import { ArrowRight, Mail, FileText, Presentation, Linkedin, MessageSquare } from "lucide-react";

const contexts = [
  { id: "email", label: "Email", icon: Mail },
  { id: "report", label: "Report", icon: FileText },
  { id: "presentation", label: "Presentation", icon: Presentation },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "slack", label: "Slack", icon: MessageSquare },
] as const;

const mockResult = {
  original: "I want to inform you that the project is delayed because team members are not working properly. We need to fix this issue fast. Please let me know your thoughts on this matter.",
  polished: "I would like to bring to your attention that the project timeline has been impacted due to resource allocation challenges within the team. We are taking immediate steps to address this matter and restore progress. I welcome your feedback and any guidance you may wish to offer.",
  corrections: [
    { original: "project is delayed", improved: "project timeline has been impacted", reason: "Softer framing avoids blame and sounds more professional" },
    { original: "team members are not working properly", improved: "resource allocation challenges within the team", reason: "Diplomatic language — focuses on the systemic issue, not individuals" },
    { original: "fix this issue fast", improved: "taking immediate steps to address this matter", reason: "Action-oriented language that shows accountability" },
    { original: "let me know your thoughts", improved: "I welcome your feedback and any guidance you may wish to offer", reason: "More deferential tone appropriate for upward communication" },
  ],
};

const Coach = () => {
  const [text, setText] = useState("");
  const [context, setContext] = useState("email");
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    // Mock AI response for now
    await new Promise((r) => setTimeout(r, 1500));
    setResult(mockResult);
    setLoading(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Writing Coach</h1>
          <p className="text-muted-foreground mt-1">Paste your text, choose a context, and get professional rewrites with explanations.</p>
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

        {/* Input */}
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your email, report, message, or speech draft here..."
            className="mb-4 w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[150px]"
            rows={6}
          />
          <Button variant="hero" onClick={handleSubmit} disabled={!text.trim() || loading}>
            {loading ? "Polishing..." : "Polish My Writing"} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border bg-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-destructive">Original</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.original}</p>
              </div>
              <div className="rounded-xl border-2 border-success bg-card p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-success">Polished</p>
                <p className="text-sm text-foreground leading-relaxed">{result.polished}</p>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold">Corrections & Explanations</p>
              <div className="space-y-3">
                {result.corrections.map((c) => (
                  <div key={c.original} className="flex flex-col gap-1 rounded-lg bg-muted p-3">
                    <p className="text-sm">
                      <span className="line-through text-destructive/70">{c.original}</span>
                      {" → "}
                      <span className="font-medium text-success">{c.improved}</span>
                    </p>
                    <p className="text-xs text-muted-foreground italic">{c.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Coach;
