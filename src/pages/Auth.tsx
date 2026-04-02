import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout, ArrowRight, LogIn, UserPlus, Mail } from "lucide-react";

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
      toast({ title: "Check your email", description: "Password reset link sent." });
      setMode("login");
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast({ title: "Login failed", description: error.message, variant: "destructive" });
      navigate("/dashboard");
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      setLoading(false);
      if (error) return toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      
      // Auto-confirmed: navigate directly
      if (data.session) {
        toast({ title: "Welcome!", description: "Your account has been created." });
        navigate("/dashboard");
      } else {
        toast({ title: "Account created!", description: "You can now sign in." });
        setMode("login");
      }
    }
  };

  const titles: Record<AuthMode, { heading: string; sub: string }> = {
    login: { heading: "Sign In", sub: "Enter your credentials to access your account" },
    signup: { heading: "Create Account", sub: "Fill in the details below to get started" },
    forgot: { heading: "Reset Password", sub: "We'll send a reset link to your email" },
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <Sprout key={i} className="absolute text-primary-foreground" style={{
              top: `${15 + i * 15}%`, left: `${10 + (i % 3) * 30}%`,
              width: `${40 + i * 8}px`, height: `${40 + i * 8}px`, transform: `rotate(${i * 30}deg)`,
            }} />
          ))}
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 text-center px-12">
          <h2 className="font-display text-4xl font-extrabold text-primary-foreground">Agriculture Management System</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">AI-powered tools from seed to market</p>
        </motion.div>
      </div>

      {/* Auth form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
          <div className="text-center">
            <Logo />
          </div>

          {/* Tab switcher */}
          {mode !== "forgot" && (
            <div className="flex rounded-lg bg-muted p-1 gap-1">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  mode === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}

          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-foreground">{titles[mode].heading}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{titles[mode].sub}</p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Moses K." required />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </div>
              {mode !== "forgot" && (
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                </div>
              )}

              {mode === "login" && (
                <div className="text-right">
                  <button type="button" onClick={() => setMode("forgot")} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground border-0 gap-2 h-11 text-sm font-semibold" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Please wait...
                  </span>
                ) : mode === "forgot" ? (
                  <>
                    <Mail className="h-4 w-4" />
                    Send Reset Link
                  </>
                ) : mode === "login" ? (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.form>
          </AnimatePresence>

          {mode === "forgot" && (
            <div className="text-center">
              <button type="button" onClick={() => setMode("login")} className="text-sm text-primary font-medium hover:underline">
                ← Back to Sign In
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
