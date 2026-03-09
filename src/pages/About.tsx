import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Users, Lightbulb, Globe } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const About = () => (
  <>
    <Helmet>
      <title>About ProseAI — Our Mission to Empower Non-Native Writers</title>
      <meta name="description" content="ProseAI helps non-native English speakers write with confidence at work. Learn about our mission, the problem we solve, and why we built this." />
      <link rel="canonical" href="https://business-writer-buddy.lovable.app/about" />
    </Helmet>

    <LandingNavbar />

    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-muted/30">
        <div className="container py-20 md:py-28 text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Writing shouldn't hold you back.
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.1, duration: 0.5 }} className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            ProseAI is on a mission to help non-native English speakers communicate with clarity, confidence, and professionalism — one email at a time.
          </motion.p>
        </div>
      </section>

      {/* Problem */}
      <section className="container py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 items-center">
          <motion.div {...fadeUp}>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">The Problem</span>
            <h2 className="mt-3 text-3xl font-bold text-foreground">Billions speak English as a second language. Most tools ignore them.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Over 1.5 billion people use English at work — but most writing tools are designed for native speakers. They fix grammar but don't explain <em>why</em>. They polish text but don't teach patterns. Non-native professionals are left guessing, second-guessing, and spending hours on emails that should take minutes.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-4">
            {[
              { icon: Globe, stat: "1.5B+", label: "Non-native English speakers worldwide" },
              { icon: Target, stat: "28%", label: "Of workday spent on email communication" },
              { icon: Users, stat: "67%", label: "Feel less confident writing in English" },
              { icon: Lightbulb, stat: "3x", label: "Faster improvement with explanations" },
            ].map(({ icon: Icon, stat, label }) => (
              <div key={label} className="rounded-xl border bg-card p-5 text-center">
                <Icon className="mx-auto h-6 w-6 text-primary" />
                <p className="mt-3 text-2xl font-bold text-foreground">{stat}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-y bg-muted/20">
        <div className="container py-16 md:py-24 text-center">
          <motion.div {...fadeUp}>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Solution</span>
            <h2 className="mt-3 text-3xl font-bold text-foreground">A writing coach, not just a checker</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              ProseAI doesn't just fix your writing — it helps you understand your mistakes and build lasting skills. Every correction comes with an explanation. Every session builds on the last. It's the difference between a spell-checker and a mentor.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-10 grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
            {[
              { title: "Rewrite & Learn", desc: "Get polished text plus clear explanations of every change." },
              { title: "Track Progress", desc: "See your writing score improve over days and weeks." },
              { title: "Build Confidence", desc: "Stop second-guessing. Write with authority." },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-xl border bg-card p-6 text-left">
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="container py-16 md:py-24">
        <motion.div {...fadeUp} className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Who It's For</span>
          <h2 className="mt-3 text-3xl font-bold text-foreground">Built for professionals who think in two languages</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Whether you're a developer writing docs, a marketer crafting campaigns, or a manager leading cross-cultural teams — ProseAI meets you where you are.
          </p>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground">Ready to write with confidence?</h2>
          <p className="mt-2 text-muted-foreground">Start free. No credit card required.</p>
          <Link to="/login" className="mt-6 inline-block">
            <Button variant="hero" size="lg">
              Get Started Free <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProseAI. All rights reserved.
      </footer>
    </main>
  </>
);

export default About;
