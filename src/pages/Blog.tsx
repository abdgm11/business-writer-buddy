import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LandingNavbar } from "@/components/LandingNavbar";
import { blogPosts } from "@/data/blogPosts";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.4 } };

const Blog = () => (
  <>
    <Helmet>
      <title>ProseAI Blog — Business Writing Tips for Non-Native Speakers</title>
      <meta name="description" content="Expert business writing tips, grammar guides, and career advice for non-native English speakers. Improve your professional communication." />
      <link rel="canonical" href="https://business-writer-buddy.lovable.app/blog" />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "ProseAI Blog",
        description: "Business writing tips for non-native English speakers",
        url: "https://business-writer-buddy.lovable.app/blog",
        publisher: { "@type": "Organization", name: "ProseAI" },
      })}</script>
    </Helmet>

    <LandingNavbar />

    <main className="min-h-screen bg-background">
      <section className="border-b bg-muted/30">
        <div className="container py-16 md:py-20 text-center">
          <motion.h1 {...fadeUp} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Writing Tips & Guides
          </motion.h1>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Practical advice to help you write better at work — from emails to LinkedIn profiles.
          </motion.p>
        </div>
      </section>

      <section className="container py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.div key={post.slug} {...fadeUp} transition={{ delay: i * 0.05, duration: 0.4 }}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30"
              >
                <span className="inline-block self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {post.category}
                </span>
                <h2 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">{post.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ProseAI. All rights reserved.
      </footer>
    </main>
  </>
);

export default Blog;
