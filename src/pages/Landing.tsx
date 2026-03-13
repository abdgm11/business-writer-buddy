import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, Globe, BookOpen, Zap, Shield, Mail, FileText, Fingerprint, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroDemoInput } from "@/components/HeroDemoInput";
import { LandingNavbar } from "@/components/LandingNavbar";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const }
  })
};

const Landing = () => {
  const [totalRewrites, setTotalRewrites] = useState<number>(0);
  const [isIndia, setIsIndia] = useState(false);
  const [yearly, setYearly] = useState(false);

  useEffect(() => {
    supabase.rpc("get_total_rewrites").then(({ data }) => {
      if (data) setTotalRewrites(Number(data));
    });

    // Geo-detect for pricing
    fetch("https://ipapi.co/json/").
    then((r) => r.json()).
    then((d) => {
      if (d?.country_code === "IN") setIsIndia(true);
    }).
    catch(() => {});
  }, []);

  const monthlyPrice = isIndia ? "₹299" : "$12";
  const yearlyPrice = isIndia ? "₹2,499" : "$99";
  const yearlyMonthly = isIndia ? "₹208" : "$8.25";
  const savings = "30%";

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-navy opacity-[0.03]" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-navy/10 blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-elegant">
              
              <Globe className="h-3.5 w-3.5 text-gold" />
              Trusted by professionals in 80+ countries
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl !leading-[1.1]">
              
              Sound Like a Native
              <br />
              <span className="text-gradient-gold">English Professional</span>
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
              
              Paste any email, report, or message — get it instantly rewritten in polished Business English
              with color-coded explanations of every improvement. <span className="font-medium text-foreground">Learn as you write.</span>
            </motion.p>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible">
              <HeroDemoInput />
            </motion.div>
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-10 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 rounded-full border bg-card px-6 py-3 text-sm text-muted-foreground shadow-elegant">
              
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold" />
                <span className="font-semibold text-foreground">{totalRewrites.toLocaleString()}</span> texts polished
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
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
            { icon: Sparkles, title: "AI-Powered Rewriting", desc: "Context-aware rewrites for emails, reports, presentations, LinkedIn posts, and Slack messages.", link: null },
            { icon: Mail, title: "Free Email Tone Checker", desc: "Instantly analyze your email's tone, professionalism, and clarity — no signup required.", link: "/email-tone-checker" },
            { icon: BookOpen, title: "Learn as You Write", desc: "Color-coded corrections with explanations of what changed and why — build your skills with every use.", link: null },
            { icon: Zap, title: "Daily Lessons", desc: "5-minute grammar and tone challenges tailored to your most common mistakes.", link: null },
            { icon: Globe, title: "Multiple Contexts", desc: "Switch between Email, Report, Presentation, LinkedIn, and Slack modes for context-perfect results.", link: null },
            { icon: Shield, title: "Privacy First", desc: "Your writing stays private. We never share or use your content for training.", link: null },
            { icon: Star, title: "Track Your Progress", desc: "See your improvement streak, words polished, and lessons completed over time.", link: null }].
            map((f, i) => {
              const content =
              <>
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                    <f.icon className="h-5 w-5 text-gold" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground font-sans">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  {f.link &&
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold">
                      Try it free <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                }
                </>;


              return (
                <motion.div
                  key={f.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`rounded-xl border bg-background p-6 shadow-elegant transition-all hover:shadow-lg ${f.link ? "ring-1 ring-gold/20 hover:ring-gold/40 cursor-pointer" : ""}`}>
                  
                  {f.link ? <Link to={f.link} className="block">{content}</Link> : content}
                </motion.div>);

            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
          </div>

          {/* Billing toggle */}
          <div className="mx-auto mb-12 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button
              onClick={() => setYearly(!yearly)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${yearly ? "bg-gold" : "bg-border"}`}>
              
              <span className={`inline-block h-5 w-5 transform rounded-full bg-card shadow transition-transform ${yearly ? "translate-x-6" : "translate-x-1"}`} />
            </button>
            <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
              Yearly <span className="text-xs text-gold font-semibold">Save {savings}</span>
            </span>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Free */}
            <div className="rounded-xl border bg-card p-8 shadow-elegant">
              <h3 className="text-lg font-semibold text-foreground font-sans mb-1">Free</h3>
              <p className="text-sm text-muted-foreground mb-6">Get started at no cost</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground font-display">{isIndia ? "₹0" : "$0"}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="mb-8 space-y-3">
                {["3 rewrites per day", "Basic corrections", "Email context only", "Limited history (7 days)"].map((f) =>
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-success" /> {f}
                  </li>
                )}
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
                {yearly ?
                <>
                    <span className="text-4xl font-bold text-foreground font-display">{yearlyPrice}</span>
                    <span className="text-muted-foreground">/year</span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      That's just <span className="font-semibold text-gold">{yearlyMonthly}/mo</span>
                    </p>
                  </> :

                <>
                    <span className="text-4xl font-bold text-foreground font-display">{monthlyPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </>
                }
              </div>
              <ul className="mb-8 space-y-3">
                {["Unlimited rewrites", "All 5 contexts", "Color-coded explanations", "Full writing history", "Daily lessons", "Priority processing"].map((f) =>
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-gold" /> {f}
                  </li>
                )}
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
            { name: "Olena Kovalenko", role: "Marketing Lead, Kyiv", quote: "ProseAI understands the difference between a Slack message and a board report. That context-awareness is game-changing." }].
            map((t) =>
            <div key={t.name} className="rounded-xl border bg-background p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) =>
                <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                )}
                </div>
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed italic">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Writing Tips */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8 md:mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Business Writing Tips
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-3 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Quick tips to level up your professional English — no fluff, just what works.
            </motion.p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {[
            { title: "How to Write a Professional Email", summary: "Start with a clear subject line, keep paragraphs short, and always end with a specific call to action. Avoid filler phrases like 'I hope this email finds you well.'", icon: Mail },
            { title: "Avoid These Common Grammar Mistakes", summary: "Confusing 'affect' vs 'effect,' misusing apostrophes, and dangling modifiers are the top errors non-native speakers make in business writing.", icon: BookOpen },
            { title: "How to Sound Confident in Writing", summary: "Replace hedging language ('I think maybe we could…') with direct statements ('I recommend…'). Use active voice and specific numbers to build authority.", icon: Zap },
            { title: "LinkedIn Post Writing Formula", summary: "Hook readers in the first line, tell a brief story or share a lesson, and end with a question. Keep sentences under 15 words for readability.", icon: Globe },
            { title: "Report Writing for Non-Native Speakers", summary: "Use an executive summary, bullet points for key findings, and plain English over jargon. Structure: Context → Findings → Recommendations.", icon: FileText },
            { title: "Tone Adjustment: Formal vs Friendly", summary: "Match your tone to your audience. Use 'Dear Mr. Smith' for formal contexts and 'Hi Sarah' for friendly ones. ProseAI can adjust this automatically.", icon: Sparkles }].
            map((tip, i) =>
            <motion.article
              key={tip.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="rounded-xl border bg-card p-5 sm:p-6 shadow-elegant hover:shadow-lg transition-shadow">
              
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted mb-4">
                  <tip.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.summary}</p>
              </motion.article>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-6 max-w-3xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8 md:mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
              Frequently Asked Questions
            </motion.h2>
          </motion.div>
          <div className="space-y-3">
            {[
            { q: "Is ProseAI free to use?", a: "Yes! You get 3 free rewrites per day. Upgrade to Pro for unlimited rewrites, all writing contexts, daily lessons, and full history." },
            { q: "What types of writing can ProseAI help with?", a: "ProseAI supports emails, reports, presentations, LinkedIn posts, and Slack messages. Choose your context and tone, and get tailored rewrites with grammar explanations." },
            { q: "How is ProseAI different from Grammarly?", a: "ProseAI is built specifically for non-native English speakers in business settings. It doesn't just fix grammar — it rewrites your text to sound like a native professional and explains every change so you learn." },
            { q: "Is my writing data secure?", a: "Absolutely. Your text is processed securely and never shared with third parties. Pro users get full history stored in their private account." },
            { q: "What languages does ProseAI support?", a: "ProseAI accepts input in English (including non-native English) and polishes it to native-level professional English. It's designed for speakers of any first language." },
            { q: "Can I use ProseAI on mobile?", a: "Yes! ProseAI works in any modern browser on desktop, tablet, and mobile devices. No app download required." }].
            map((faq, i) =>
            <motion.details
              key={faq.q}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
              className="group rounded-xl border bg-card shadow-elegant">
              
                <summary className="flex cursor-pointer items-center justify-between gap-3 p-4 sm:p-5 text-sm sm:text-base text-foreground font-medium hover:text-gold transition-colors [&::-webkit-details-marker]:hidden list-none">
                  <span>{faq.q}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                </summary>
                <p className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.details>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl rounded-2xl p-12 text-center shadow-lg bg-primary">
            <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl font-display">
              Ready to Write Like a Pro?
            </h2>
            <p className="mb-8 text-primary-foreground/90 text-lg leading-relaxed">
              Join thousands of non-native speakers who now write with confidence. Start polishing your emails, reports, and messages today.
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
              <FingerprintPattern className="h-3 w-3 text-gold" />
            </div>
            <span className="text-sm font-semibold text-foreground">ProseAI</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 ProseAI. All rights reserved.</p>
        </div>
      </footer>
    </div>);

};

export default Landing;