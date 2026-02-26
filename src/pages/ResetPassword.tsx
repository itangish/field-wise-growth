import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setReady(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    toast({ title: "Password updated!" });
    navigate("/dashboard");
  };

  if (!ready) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <Logo />
        <p className="mt-4 text-muted-foreground">Invalid or expired reset link.</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center"><Logo /><h1 className="mt-4 font-display text-2xl font-bold">Set New Password</h1></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label htmlFor="password">New Password</Label><Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required /></div>
          <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground border-0" disabled={loading}>{loading ? "Updating..." : "Update Password"}</Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
