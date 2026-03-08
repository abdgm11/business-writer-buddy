import { useRef } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, FileText, BookOpen, Flame, Share2, Download, Linkedin } from "lucide-react";

const reportData = {
  name: "Professional Writer",
  period: "Feb 6 – Mar 8, 2026",
  daysPracticed: 26,
  totalRewrites: 147,
  wordsPolished: 12_840,
  lessonsCompleted: 24,
  streak: 12,
  topImprovement: "Formal Register",
  skillBefore: "Intermediate",
  skillAfter: "Advanced",
  topMistakes: [
    { area: "Formal register", improved: 85 },
    { area: "Passive voice overuse", improved: 72 },
    { area: "Redundant phrases", improved: 68 },
    { area: "Regional idioms", improved: 91 },
  ],
};

const ReportCard = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(
      `🚀 My 30-Day Business English Report Card\n\n` +
      `📝 ${reportData.totalRewrites} texts polished\n` +
      `📚 ${reportData.wordsPolished.toLocaleString()} words improved\n` +
      `🔥 ${reportData.streak}-day streak\n` +
      `📈 Skill: ${reportData.skillBefore} → ${reportData.skillAfter}\n\n` +
      `Top improvement: ${reportData.topImprovement} (+${reportData.topMistakes[0].improved}%)\n\n` +
      `Leveling up my professional English with @ProseAI ✨\n\n#BusinessEnglish #ProfessionalDevelopment #ProseAI`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`, "_blank");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Card</h1>
            <p className="text-muted-foreground mt-1">Your 30-day writing improvement summary</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button variant="gold" size="sm" onClick={shareToLinkedIn}>
              <Linkedin className="h-4 w-4 mr-1" /> Share
            </Button>
          </div>
        </div>

        {/* Report Card */}
        <div ref={cardRef} className="rounded-2xl overflow-hidden shadow-elegant border">
          {/* Header */}
          <div className="gradient-navy p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <Sparkles key={i} className="absolute text-gold" style={{ top: `${15 + i * 15}%`, left: `${10 + i * 16}%`, width: 24, height: 24 }} />
              ))}
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-1 text-xs text-primary-foreground/70 mb-4">
                <Sparkles className="h-3 w-3 text-gold" /> ProseAI Report Card
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                30-Day Writing Progress
              </h2>
              <p className="text-primary-foreground/60 text-sm">{reportData.period}</p>
            </div>
          </div>

          {/* Skill Level Banner */}
          <div className="gradient-gold px-8 py-4 flex items-center justify-center gap-3">
            <TrendingUp className="h-5 w-5 text-accent-foreground" />
            <p className="font-semibold text-accent-foreground text-sm">
              Skill Level: {reportData.skillBefore} → <span className="text-base">{reportData.skillAfter}</span>
            </p>
          </div>

          {/* Stats */}
          <div className="bg-card p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: FileText, value: reportData.totalRewrites.toString(), label: "Texts Polished" },
                { icon: BookOpen, value: reportData.wordsPolished.toLocaleString(), label: "Words Improved" },
                { icon: Flame, value: `${reportData.streak} days`, label: "Best Streak" },
                { icon: BookOpen, value: reportData.lessonsCompleted.toString(), label: "Lessons Done" },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl bg-muted p-4">
                  <s.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground font-display">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Improvement Areas */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-foreground font-sans mb-4 uppercase tracking-wider">Areas of Improvement</h3>
              <div className="space-y-3">
                {reportData.topMistakes.map((m) => (
                  <div key={m.area}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-foreground">{m.area}</span>
                      <span className="text-sm font-semibold text-success">+{m.improved}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full gradient-gold transition-all duration-500"
                        style={{ width: `${m.improved}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded gradient-navy">
                  <Sparkles className="h-3 w-3 text-gold" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">ProseAI</span>
              </div>
              <p className="text-xs text-muted-foreground">proseai.com</p>
            </div>
          </div>
        </div>

        {/* Share CTA */}
        <div className="rounded-xl border bg-card p-6 text-center shadow-elegant">
          <Share2 className="h-6 w-6 text-gold mx-auto mb-3" />
          <h3 className="font-semibold text-foreground font-sans mb-1">Share Your Progress</h3>
          <p className="text-sm text-muted-foreground mb-4">Show your network how you're leveling up your Business English</p>
          <Button variant="gold" onClick={shareToLinkedIn}>
            <Linkedin className="h-4 w-4 mr-2" /> Post to LinkedIn
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportCard;
