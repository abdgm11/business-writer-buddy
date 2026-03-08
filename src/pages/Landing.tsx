import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check, Star, Globe, BookOpen, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroDemoInput } from "@/components/HeroDemoInput";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Landing = () => {
  const [totalRewrites, setTotalRewrites] = useState<number>(0);

  useEffect(() => {
    supabase.rpc("get_total_rewrites").then(({ data }) => {
      if (data) setTotalRewrites(Number(data));
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-navy">
              <Sparkles className="h-4 w-4 text-gold" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Prose<span className="text-gold">AI</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/login">
              <Button variant="hero" size="sm">
                Get Started Free <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-navy opacity-[0.03]" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground"
            >
              <Globe className="h-3.5 w-3.5 text-gold" />
              Trusted by professionals in 80+ countries
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
            >
              Sound Like a Native
              <br />
              <span className="text-gradient-gold">English Professional</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Paste any email, report, or message — get it instantly rewritten in polished Business English
              with color-coded explanations of every improvement. Learn as you write.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <HeroDemoInput />
            </motion.div>
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 inline-flex items-center gap-6 rounded-full border bg-card px-6 py-3 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold" />
                <span className="font-semibold text-foreground">{totalRewrites.toLocaleString()}</span> texts polished
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gold" />
                80+ countries
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-card">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
              More Than a Grammar Checker
            </h2>
            <p className="text-muted-foreground text-lg">
              ProseAI understands business context and teaches you the nuances of professional communication.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Sparkles, title: "AI-Powered Rewriting", desc: "Context-aware rewrites for emails, reports, presentations, LinkedIn posts, and Slack messages." },
              { icon: BookOpen, title: "Learn as You Write", desc: "Color-coded corrections with explanations of what changed and why — build your skills with every use." },
              { icon: Zap, title: "Daily Lessons", desc: "5-minute grammar and tone challenges tailored to your most common mistakes." },
              { icon: Globe, title: "Multiple Contexts", desc: "Switch between Email, Report, Presentation, LinkedIn, and Slack modes for context-perfect results." },
              { icon: Shield, title: "Privacy First", desc: "Your writing stays private. We never share or use your content for training." },
              { icon: Star, title: "Track Your Progress", desc: "See your improvement streak, words polished, and lessons completed over time." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl border bg-background p-6 shadow-elegant transition-all hover:shadow-lg"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <f.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground font-sans">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-xl border bg-card p-8 shadow-elegant">
              <h3 className="text-lg font-semibold text-foreground font-sans mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-6">Get started at no cost</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground font-display">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                {["3 rewrites per day", "Basic corrections", "Email context only", "Limited history (7 days)"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>
            {/* Pro */}
            <div className="relative rounded-xl border-2 border-gold bg-card p-8 shadow-gold">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full gradient-gold px-4 py-1 text-xs font-semibold text-accent-foreground">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-foreground font-sans mb-1">Pro</h3>
              <p className="text-sm text-muted-foreground mb-6">For serious professionals</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground font-display">$12</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                {["Unlimited rewrites", "All 5 contexts", "Color-coded explanations", "Full writing history", "Daily lessons", "Priority processing"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-gold" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <Button variant="gold" className="w-full">Start Pro Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-card">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
              Loved by Professionals Worldwide
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {[
              { name: "Priya Sharma", role: "Product Manager, Bangalore", quote: "My emails to US clients used to take 30 minutes to write. Now I draft in 5 minutes and ProseAI polishes them perfectly." },
              { name: "Lucas Ferreira", role: "Software Engineer, São Paulo", quote: "The explanations help me understand why certain phrases sound more professional. I've improved so much in 3 months." },
              { name: "Olena Kovalenko", role: "Marketing Lead, Kyiv", quote: "ProseAI understands the difference between a Slack message and a board report. That context-awareness is game-changing." },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border bg-background p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl gradient-navy p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to Write Like a Pro?
            </h2>
            <p className="mb-8 text-primary-foreground/70 text-lg">
              Join thousands of non-native speakers who now write with confidence.
            </p>
            <Link to="/login">
              <Button variant="gold" size="lg">
                Start Free Today <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded gradient-navy">
              <Sparkles className="h-3 w-3 text-gold" />
            </div>
            <span className="text-sm font-semibold text-foreground">ProseAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ProseAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
