import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const sampleTexts: Record<string, string> = {
  before: "I want to ask about the project status. Can you give me update? We need to finish this by next week otherwise client will be angry. Please do the needful.",
  after: "I would like to inquire about the current project status. Could you kindly provide an update at your earliest convenience? We have a firm deadline of next week, and it is critical that we meet the client's expectations. Please take the necessary action.",
};

const corrections = [
  { original: "I want to ask", improved: "I would like to inquire", reason: "More formal register appropriate for client communication" },
  { original: "Can you give me update?", improved: "Could you kindly provide an update at your earliest convenience?", reason: "Polite request form with professional courtesy phrase" },
  { original: "client will be angry", improved: "meet the client's expectations", reason: "Diplomatic language avoids negative framing in business context" },
  { original: "do the needful", improved: "take the necessary action", reason: "Replaced regional idiom with globally understood business phrase" },
];

export const HeroDemoInput = () => {
  const [text, setText] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleDemo = () => {
    if (!text.trim()) {
      setText(sampleTexts.before);
    }
    setShowResult(true);
  };

  return (
    <div className="mx-auto max-w-3xl">
      {!showResult ? (
        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your email, message, or report here... (or click below for a demo)"
            className="mb-4 w-full resize-none rounded-lg border bg-background p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            rows={4}
          />
          <Button variant="hero" onClick={handleDemo} className="w-full sm:w-auto">
            Polish My Writing <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">Try it free — no signup required</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-destructive">Original</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{text || sampleTexts.before}</p>
            </div>
            <div className="rounded-xl border-2 border-success bg-card p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-success">Polished</p>
              <p className="text-sm text-foreground leading-relaxed">{sampleTexts.after}</p>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">What Changed & Why</p>
            <div className="space-y-3">
              {corrections.map((c) => (
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
          <Button variant="gold" onClick={() => setShowResult(false)}>
            Try Another
          </Button>
        </div>
      )}
    </div>
  );
};
