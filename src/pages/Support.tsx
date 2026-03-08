import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Search,
  Send,
  ChevronDown,
  CreditCard,
  PenTool,
  ShieldCheck,
  Settings,
  Zap,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const FAQ_CATEGORIES = [
  {
    label: "Getting Started",
    icon: Zap,
    faqs: [
      { q: "How do I rewrite my first text?", a: "Go to the Coach page, paste your text, choose a context (email, report, etc.) and tone, then click 'Polish My Writing'. ProseAI will rewrite it and explain every change." },
      { q: "What are contexts and tones?", a: "Context tells ProseAI what type of writing you're doing (email, report, LinkedIn post). Tone sets the style (formal, friendly, persuasive). This ensures your rewrite matches the situation." },
      { q: "How many free rewrites do I get?", a: "Free users get 3 rewrites per day. This resets at midnight UTC. Upgrade to Pro for unlimited rewrites." },
    ],
  },
  {
    label: "Billing & Plans",
    icon: CreditCard,
    faqs: [
      { q: "How do I upgrade to Pro?", a: "Go to Settings and click 'Upgrade to Pro'. You can pay monthly or yearly (30% off). We accept cards via Razorpay in multiple currencies." },
      { q: "Can I cancel my subscription?", a: "Yes, you can cancel anytime from Settings. You'll keep Pro access until the end of your billing period." },
      { q: "I was charged but don't have Pro access", a: "Payment verification can take a few seconds. Try refreshing the page. If the issue persists, submit a support ticket below and we'll resolve it within 24 hours." },
      { q: "Do you offer refunds?", a: "Yes, we offer a full refund within 7 days of purchase if you're not satisfied. Submit a support ticket with your payment details." },
    ],
  },
  {
    label: "Writing & Features",
    icon: PenTool,
    faqs: [
      { q: "Why does my score vary between rewrites?", a: "Scores reflect how much improvement was needed. A high score means your original was already strong. Scores help track your progress over time." },
      { q: "Can I edit the rewritten text?", a: "The rewritten text is a suggestion — copy it and modify it however you like. The goal is to help you learn and improve, not replace your voice." },
      { q: "What do the correction explanations mean?", a: "Each correction shows what was changed and why, helping you understand grammar rules, tone choices, and professional phrasing patterns." },
    ],
  },
  {
    label: "Account & Security",
    icon: ShieldCheck,
    faqs: [
      { q: "Is my writing data private?", a: "Yes. Your text is processed securely, stored only in your private account, and never shared with third parties or used to train models." },
      { q: "How do I change my password?", a: "Go to Settings and use the password reset option. You'll receive a reset link via email." },
      { q: "Can I delete my account and data?", a: "Yes. Contact us through the form below and we'll delete your account and all associated data within 48 hours." },
    ],
  },
];

const TICKET_CATEGORIES = [
  { value: "billing", label: "Billing & Payments" },
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "account", label: "Account Issue" },
  { value: "general", label: "General Question" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 },
  }),
};

const Support = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        !searchQuery ||
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const handleSubmitTicket = async () => {
    if (!user) {
      toast.error("Please sign in to submit a support ticket.");
      return;
    }
    if (!subject.trim() || !message.trim() || !category) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      category,
      subject: subject.trim(),
      message: message.trim(),
    });

    if (error) {
      setSubmitting(false);
      toast.error("Failed to submit ticket. Please try again.");
      return;
    }

    // Send email notifications via direct fetch
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token;
      const fnUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/notify-support`;

      console.log("[NOTIFY] Starting email notification...");
      console.log("[NOTIFY] Function URL:", fnUrl);
      console.log("[NOTIFY] Has access token:", !!accessToken);

      if (accessToken) {
        const res = await fetch(fnUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({ category, subject: subject.trim(), message: message.trim() }),
        });
        const resultText = await res.text();
        console.log("[NOTIFY] Response status:", res.status);
        console.log("[NOTIFY] Response body:", resultText);
        
        if (!res.ok) {
          toast.error(`Email notification failed (${res.status})`);
        }
      } else {
        console.log("[NOTIFY] No access token - skipping");
        toast.error("No active session for email notification");
      }
    } catch (err: any) {
      console.error("[NOTIFY] Error:", err?.message || err);
      toast.error(`Email notification error: ${err?.message}`);
    }

    setSubmitting(false);
    setSubmitted(true);
    setSubject("");
    setMessage("");
    setCategory("");
    toast.success("Support ticket submitted! We'll get back to you soon.");
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
          <p className="text-muted-foreground mt-1">
            Find answers or reach out — we're here to help.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help (e.g. 'cancel subscription', 'score', 'billing')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* FAQ sections */}
        <div className="space-y-6">
          {filteredFaqs.map((cat, ci) => (
            <motion.div
              key={cat.label}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={ci}
            >
              <div className="flex items-center gap-2 mb-3">
                <cat.icon className="h-5 w-5 text-gold" />
                <h2 className="text-lg font-semibold text-foreground">{cat.label}</h2>
              </div>
              <div className="space-y-2">
                {cat.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-xl border bg-card shadow-sm"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 text-sm text-foreground font-medium hover:text-gold transition-colors [&::-webkit-details-marker]:hidden list-none">
                      <span>{faq.q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </motion.div>
          ))}

          {filteredFaqs.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No results found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try different keywords or submit a ticket below.</p>
            </div>
          )}
        </div>

        {/* Contact / Ticket Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Still need help?</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Submit a ticket and we'll respond within 24 hours.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Ticket Submitted!</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                We've received your message and will get back to you within 24 hours via email.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setSubmitted(false)}
              >
                Submit another ticket
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                <Input
                  placeholder="Brief description of your issue"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail. Include any error messages or steps to reproduce..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>
              <Button
                onClick={handleSubmitTicket}
                disabled={submitting || !subject.trim() || !message.trim() || !category}
                className="gap-2"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
};

export default Support;
