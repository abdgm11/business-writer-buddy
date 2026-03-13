import { useRef, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useReportCardData } from "@/hooks/useReportCardData";
import { useBadges } from "@/hooks/useBadges";
import { BadgesSection } from "@/components/BadgesSection";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Sparkles,
  TrendingUp,
  FileText,
  BookOpen,
  Flame,
  Share2,
  Download,
  Linkedin,
  Twitter,
  Copy,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Calendar, FingerprintPattern } from
"lucide-react";
import { Link } from "react-router-dom";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ReportCard = () => {
  const { user } = useAuth();
  const { loading, stats } = useReportCardData();
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const badges = useBadges({
    totalRewrites: stats?.totalRewrites ?? 0,
    totalWords: stats?.wordsPolished ?? 0,
    streak: stats?.streak ?? 0,
    bestScore: stats?.bestScore ?? null,
    avgScore: stats?.avgScore ?? null,
    uniqueContexts: stats?.contextBreakdown.length ?? 0,
    daysPracticed: stats?.daysPracticed ?? 0
  });

  const period = stats ?
  `${formatDate(stats.firstDate)} – ${formatDate(stats.lastDate)}` :
  "";

  const shareText =
  stats ?
  `🚀 My ProseAI Writing Report Card\n\n` +
  `📝 ${stats.totalRewrites} texts polished\n` +
  `📚 ${stats.wordsPolished.toLocaleString()} words improved\n` + (
  stats.streak > 0 ? `🔥 ${stats.streak}-day streak\n` : "") + (
  stats.avgScore ? `📊 Avg score: ${stats.avgScore}/100\n` : "") + (
  stats.scoreImprovement && stats.scoreImprovement > 0 ? `📈 Score improvement: +${stats.scoreImprovement} pts\n` : "") + (
  stats.topContext ? `✉️ Top context: ${capitalize(stats.topContext)}\n` : "") +
  `\nLeveling up my professional English with ProseAI ✨\n\n#BusinessEnglish #ProfessionalDevelopment #ProseAI` :
  "";

  const shareUrl = window.location.origin;

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=600,height=500");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText + `\n${shareUrl}`).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 max-w-2xl mx-auto">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
      </AppLayout>);

  }

  if (!stats || stats.totalRewrites === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">No Data Yet</h2>
          <p className="text-muted-foreground max-w-sm">
            Complete a few rewrites to generate your shareable report card. Your stats will appear here automatically.
          </p>
          <Link to="/coach">
            <Button variant="gold" className="gap-2">
              Start Writing <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </AppLayout>);

  }

  return (
    <AppLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report Card</h1>
            <p className="text-muted-foreground mt-1">Your writing improvement summary — share it with the world!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>

        {/* Report Card Visual */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl overflow-hidden shadow-elegant border print:shadow-none">
          
          {/* Header */}
          <div className="gradient-navy p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 6 }).map((_, i) =>
              <Sparkles
                key={i}
                className="absolute text-gold"
                style={{ top: `${15 + i * 15}%`, left: `${10 + i * 16}%`, width: 24, height: 24 }} />

              )}
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-1 text-xs text-primary-foreground/70 mb-4">
                <FingerprintPattern className="h-3 w-3 text-gold" /> ProseAI Report Card
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-1">
                Writing Progress Report
              </h2>
              <p className="text-primary-foreground/60 text-sm">{period}</p>
              {user?.email &&
              <p className="text-primary-foreground/40 text-xs mt-1">{user.email}</p>
              }
            </div>
          </div>

          {/* Score Improvement Banner */}
          {stats.scoreImprovement !== null && stats.scoreImprovement > 0 &&
          <div className="gradient-gold px-8 py-4 flex items-center justify-center gap-3">
              <TrendingUp className="h-5 w-5 text-accent-foreground" />
              <p className="font-semibold text-accent-foreground text-sm">
                Score improved by <span className="text-base">+{stats.scoreImprovement} points</span> since you started!
              </p>
            </div>
          }

          {/* Stats Grid */}
          <div className="bg-card p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
              { icon: FileText, value: stats.totalRewrites.toString(), label: "Texts Polished" },
              { icon: BookOpen, value: stats.wordsPolished.toLocaleString(), label: "Words Improved" },
              { icon: Flame, value: stats.streak > 0 ? `${stats.streak} days` : "—", label: "Current Streak" },
              { icon: Calendar, value: stats.daysPracticed.toString(), label: "Days Practiced" }].
              map((s) =>
              <div key={s.label} className="text-center rounded-xl bg-muted p-4">
                  <s.icon className="h-5 w-5 text-gold mx-auto mb-2" />
                  <p className="text-xl font-bold text-foreground font-display">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              )}
            </div>

            {/* Scores Row */}
            {(stats.avgScore || stats.bestScore) &&
            <div className="grid grid-cols-2 gap-4 mb-8">
                {stats.avgScore &&
              <div className="rounded-xl border p-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-2">Average Score</p>
                    <p className="text-4xl font-bold text-foreground font-display">{stats.avgScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                  </div>
              }
                {stats.bestScore &&
              <div className="rounded-xl border p-5 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-2">Best Score</p>
                    <p className="text-4xl font-bold text-foreground font-display">{stats.bestScore}</p>
                    <p className="text-xs text-muted-foreground mt-1">personal best</p>
                  </div>
              }
              </div>
            }

            {/* Context Breakdown */}
            {stats.contextBreakdown.length > 0 &&
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground font-sans mb-4 uppercase tracking-wider">
                  Writing Contexts Used
                </h3>
                <div className="space-y-3">
                  {stats.contextBreakdown.map((c) => {
                  const pct = Math.round(c.count / stats.totalRewrites * 100);
                  return (
                    <div key={c.name}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-foreground capitalize">{c.name}</span>
                          <span className="text-sm font-semibold text-gold">{pct}%</span>
                        </div>
                        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                          className="h-full rounded-full gradient-gold"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }} />
                        
                        </div>
                      </div>);

                })}
                </div>
              </div>
            }


            {/* Badges */}
            <BadgesSection badges={badges} variant="report" />

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded gradient-navy">
                  <Sparkles className="h-3 w-3 text-gold" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">ProseAI</span>
              </div>
              <p className="text-xs text-muted-foreground">business-writer-buddy.lovable.app</p>
            </div>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border bg-card p-6 shadow-elegant">
          
          <div className="text-center mb-5">
            <Share2 className="h-6 w-6 text-gold mx-auto mb-3" />
            <h3 className="font-semibold text-foreground font-sans mb-1">Share Your Progress</h3>
            <p className="text-sm text-muted-foreground">
              Show your network how you're leveling up your Business English
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="gold" onClick={shareToLinkedIn} className="gap-2 w-full sm:w-auto">
              <Linkedin className="h-4 w-4" /> Post to LinkedIn
            </Button>
            <Button variant="outline" onClick={shareToTwitter} className="gap-2 w-full sm:w-auto">
              <Twitter className="h-4 w-4" /> Share on X
            </Button>
            <Button variant="outline" onClick={copyToClipboard} className="gap-2 w-full sm:w-auto">
              {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Text"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Tip: Take a screenshot of your report card above for a visual post!
          </p>
        </motion.div>
      </div>
    </AppLayout>);

};

export default ReportCard;