import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const themeColors = [
  { name: "Default Green", value: "green", hsl: "142 64% 38%" },
  { name: "Ocean Blue", value: "blue", hsl: "210 80% 45%" },
  { name: "Sunset Orange", value: "orange", hsl: "25 90% 50%" },
  { name: "Royal Purple", value: "purple", hsl: "270 60% 50%" },
  { name: "Rose Pink", value: "pink", hsl: "340 70% 55%" },
  { name: "Earth Brown", value: "brown", hsl: "30 50% 40%" },
];

const Settings = () => {
  const { user, profile } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState(() => localStorage.getItem("app_language") || "en");
  const [currency, setCurrency] = useState(() => localStorage.getItem("app_currency") || "rwf");
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem("app_theme_color") || "green");

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("app_notifications");
    return saved ? JSON.parse(saved) : {
      weather: true, ai: true, market: true, tasks: false, finance: true, sms: false,
    };
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setDistrict(profile.district || "");
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("phone").eq("user_id", user.id).single().then(({ data }) => {
        if (data?.phone) setPhone(data.phone);
      });
    }
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update({
        full_name: fullName,
        phone,
        district,
      }).eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => toast({ title: "✅ Profile updated", description: "Your personal information has been saved." }),
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const updatePassword = useMutation({
    mutationFn: async () => {
      if (newPassword !== confirmPassword) throw new Error("Passwords don't match");
      if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "✅ Password updated", description: "Your password has been changed successfully." });
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleLanguageChange = (val: string) => {
    setLanguage(val);
    localStorage.setItem("app_language", val);
    const names: Record<string, string> = { en: "English", rw: "Kinyarwanda", fr: "French", sw: "Kiswahili" };
    toast({ title: "🌍 Language updated", description: `Language changed to ${names[val]}.` });
  };

  const handleCurrencyChange = (val: string) => {
    setCurrency(val);
    localStorage.setItem("app_currency", val);
    toast({ title: "💰 Currency updated", description: `Currency set to ${val.toUpperCase()}.` });
  };

  const handleThemeChange = (color: typeof themeColors[0]) => {
    setActiveTheme(color.value);
    localStorage.setItem("app_theme_color", color.value);
    document.documentElement.style.setProperty("--primary", color.hsl);
    toast({ title: "🎨 Theme updated", description: `Color theme changed to ${color.name}.` });
  };

  const handleNotificationToggle = (key: string, checked: boolean) => {
    const updated = { ...notifications, [key]: checked };
    setNotifications(updated);
    localStorage.setItem("app_notifications", JSON.stringify(updated));
    const labels: Record<string, string> = { weather: "Weather Alerts", ai: "AI Recommendations", market: "Market Updates", tasks: "Task Reminders", finance: "Financial Reports", sms: "SMS Alerts" };
    toast({
      title: checked ? "🔔 Notification enabled" : "🔕 Notification disabled",
      description: `${labels[key]} ${checked ? "turned on" : "turned off"}.`,
    });
  };

  const notifItems = [
    { key: "weather", label: "Weather Alerts", desc: "Receive severe weather warnings" },
    { key: "ai", label: "AI Recommendations", desc: "Get smart advisory notifications" },
    { key: "market", label: "Market Updates", desc: "Price changes and new orders" },
    { key: "tasks", label: "Task Reminders", desc: "Upcoming and overdue tasks" },
    { key: "finance", label: "Financial Reports", desc: "Weekly income & expense summaries" },
    { key: "sms", label: "SMS Alerts", desc: "Receive critical alerts via SMS" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and system preferences</p>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile"><User className="mr-1.5 h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="mr-1.5 h-4 w-4" />Notifications</TabsTrigger>
            <TabsTrigger value="security"><Shield className="mr-1.5 h-4 w-4" />Security</TabsTrigger>
            <TabsTrigger value="preferences"><Palette className="mr-1.5 h-4 w-4" />Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold text-card-foreground">Personal Information</h3>
              <Separator className="my-4" />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={user?.email || ""} disabled /></div>
                <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Kigali", "Musanze", "Huye", "Rubavu", "Nyagatare", "Karongi", "Rwamagana", "Muhanga"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold text-card-foreground">Notification Preferences</h3>
              <Separator className="my-4" />
              <div className="space-y-4">
                {notifItems.map((n) => (
                  <div key={n.key} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[n.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => handleNotificationToggle(n.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-display text-base font-bold text-card-foreground">Change Password</h3>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} /></div>
                  <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => updatePassword.mutate()} disabled={updatePassword.isPending || !newPassword}>
                    {updatePassword.isPending ? "Updating…" : "Update Password"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="preferences">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Language & Currency */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-base font-bold text-card-foreground">Language & Currency</h3>
                <Separator className="my-4" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="rw">Kinyarwanda</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={currency} onValueChange={handleCurrencyChange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rwf">RWF — Rwandan Franc</SelectItem>
                        <SelectItem value="usd">USD — US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Theme Colors */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-display text-base font-bold text-card-foreground">Theme Color</h3>
                <p className="text-xs text-muted-foreground mt-1">Choose a color theme for your dashboard</p>
                <Separator className="my-4" />
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {themeColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleThemeChange(color)}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${
                        activeTheme === color.value ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div
                        className="h-8 w-8 rounded-full relative"
                        style={{ backgroundColor: `hsl(${color.hsl})` }}
                      >
                        {activeTheme === color.value && (
                          <Check className="absolute inset-0 m-auto h-4 w-4 text-white" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
