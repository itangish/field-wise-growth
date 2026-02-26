import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { Sprout, ArrowRight } from "lucide-react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isForgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
      toast({ title: "Check your email", description: "Password reset link sent." });
      setIsForgot(false);
      return;
    }

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast({ title: "Login failed", description: error.message, variant: "destructive" });
      navigate("/dashboard");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: window.location.origin,
        },
      });
      setLoading(false);
      if (error) return toast({ title: "Signup failed", description: error.message, variant: "destructive" });
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      setIsLogin(true);
    }
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo />
            <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
              {isForgot ? "Reset Password" : isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isForgot ? "Enter your email to receive a reset link" : isLogin ? "Sign in to your AMS account" : "Join the smart agriculture platform"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgot && (
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Moses K." required />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            {!isForgot && (
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </div>
            )}

            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground border-0 gap-2" disabled={loading}>
              {loading ? "Please wait..." : isForgot ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="text-center text-sm">
            {isForgot ? (
              <button onClick={() => setIsForgot(false)} className="text-primary hover:underline">Back to login</button>
            ) : (
              <>
                {isLogin && (
                  <button onClick={() => setIsForgot(true)} className="text-muted-foreground hover:text-primary block mx-auto mb-2">Forgot password?</button>
                )}
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
