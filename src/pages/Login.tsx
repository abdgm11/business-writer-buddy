import { useState, useEffect } from "react";
import { gtagEvent } from "@/lib/gtag";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Mail, Lock, ArrowRight, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get("ref");

  // Auto-switch to signup mode if coming via referral link
  useEffect(() => {
    if (refCode) setIsSignup(true);
  }, [refCode]);

  // Process referral after successful signup + email confirmation
  useEffect(() => {
    if (user && refCode) {
      const processReferral = async () => {
        try {
          const { data: sess } = await supabase.auth.getSession();
          const { data, error } = await supabase.functions.invoke("process-referral", {
            headers: { Authorization: `Bearer ${sess?.session?.access_token}` },
            body: { referral_code: refCode },
          });
          if (!error && data?.success) {
            toast.success(`🎉 ${data.message}`);
            gtagEvent("referral_redeemed", { code: refCode });
          }
        } catch {
          // silently fail — don't block login
        }
      };
      processReferral();
    }
  }, [user, refCode]);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login${refCode ? `?ref=${refCode}` : ""}` },
        });
        if (error) throw error;
        gtagEvent("sign_up", { method: "email" });
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        gtagEvent("login", { method: "email" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${refCode ? `/login?ref=${refCode}` : ""}`,
    });
    if (error) {
      toast.error("Google sign-in failed. Please try again.");
    } else {
      gtagEvent("login", { method: "google" });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
              <Sparkles className="h-5 w-5 text-gold" />
            </div>
            <span className="text-2xl font-bold text-foreground">
              Prose<span className="text-gold">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignup ? "Start writing like a professional today" : "Continue improving your writing"}
          </p>
        </div>

        {/* Referral badge */}
        {refCode && isSignup && (
          <div className="mb-4 rounded-lg border border-gold/30 bg-gold/5 p-3 flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-gold shrink-0" />
            <span className="text-foreground">
              You've been referred! Sign up to earn <span className="font-semibold text-gold">3 bonus rewrites</span>.
            </span>
          </div>
        )}

        <div className="rounded-xl border bg-card p-6 shadow-elegant">
          <Button variant="outline" className="w-full mb-4" onClick={handleGoogleAuth}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button variant="hero" className="w-full" type="submit" disabled={loading}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button onClick={() => setIsSignup(!isSignup)} className="font-medium text-gold hover:underline">
            {isSignup ? "Sign in" : "Sign up free"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
