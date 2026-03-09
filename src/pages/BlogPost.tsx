import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { LandingNavbar } from "@/components/LandingNavbar";
import { blogPosts } from "@/data/blogPosts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock, Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";

function renderMarkdown(content: string) {
  return content
    .split("\n")
    .map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={i} />;
      if (trimmed.startsWith("### ")) return <h3 key={i} className="mt-8 mb-3 text-lg font-semibold text-foreground">{trimmed.slice(4)}</h3>;
      if (trimmed.startsWith("## ")) return <h2 key={i} className="mt-10 mb-4 text-xl font-bold text-foreground">{trimmed.slice(3)}</h2>;
      if (trimmed.startsWith("# ")) return null; // skip title, rendered separately
      if (trimmed.startsWith("- ")) return <li key={i} className="ml-6 list-disc text-muted-foreground">{renderInline(trimmed.slice(2))}</li>;
      return <p key={i} className="text-muted-foreground leading-relaxed">{renderInline(trimmed)}</p>;
    });
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return <Navigate to="/blog" replace />;

  const currentIndex = blogPosts.indexOf(post);
  const prev = blogPosts[currentIndex - 1];
  const next = blogPosts[currentIndex + 1];

  return (
    <>
      <Helmet>
        <title>{post.title} — ProseAI Blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://business-writer-buddy.lovable.app/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          author: { "@type": "Organization", name: "ProseAI" },
          publisher: { "@type": "Organization", name: "ProseAI" },
        })}</script>
      </Helmet>

      <LandingNavbar />

      <main className="min-h-screen bg-background">
        <article className="container max-w-3xl py-12 md:py-16">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
          </Link>

          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>

          <h1 className="mt-4 text-3xl md:text-4xl font-bold text-foreground leading-tight">{post.title}</h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {format(parseISO(post.date), "MMM d, yyyy")}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
          </div>

          <div className="mt-10 space-y-1">
            {renderMarkdown(post.content)}
          </div>

          {/* Nav between posts */}
          <div className="mt-16 flex items-center justify-between border-t pt-8">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" /> <span className="max-w-[200px] truncate">{prev.title}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/blog/${next.slug}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <span className="max-w-[200px] truncate">{next.title}</span> <ArrowRight className="h-4 w-4" />
              </Link>
            ) : <span />}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-xl border bg-muted/30 p-8 text-center">
            <h2 className="text-xl font-bold text-foreground">Want to write like this — automatically?</h2>
            <p className="mt-2 text-sm text-muted-foreground">ProseAI polishes your writing and teaches you as you go.</p>
            <Link to="/login" className="mt-4 inline-block">
              <Button variant="hero" size="lg">Try ProseAI Free <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </div>
        </article>

        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} ProseAI. All rights reserved.
        </footer>
      </main>
    </>
  );
};

export default BlogPost;
