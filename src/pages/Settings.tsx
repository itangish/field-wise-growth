import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Bell, Shield, Globe, Palette, Database, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Settings = () => (
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
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue="Moses Uwimana" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="moses@ams.gov.rw" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input defaultValue="+250 788 123 456" />
              </div>
              <div className="space-y-2">
                <Label>District</Label>
                <Select defaultValue="kigali">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kigali">Kigali</SelectItem>
                    <SelectItem value="musanze">Musanze</SelectItem>
                    <SelectItem value="huye">Huye</SelectItem>
                    <SelectItem value="rubavu">Rubavu</SelectItem>
                    <SelectItem value="nyagatare">Nyagatare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">Notification Preferences</h3>
            <Separator className="my-4" />
            <div className="space-y-4">
              {[
                { label: "Weather Alerts", desc: "Receive severe weather warnings", default: true },
                { label: "AI Recommendations", desc: "Get smart advisory notifications", default: true },
                { label: "Market Updates", desc: "Price changes and new orders", default: true },
                { label: "Task Reminders", desc: "Upcoming and overdue tasks", default: false },
                { label: "Financial Reports", desc: "Weekly income & expense summaries", default: true },
                { label: "SMS Alerts", desc: "Receive critical alerts via SMS", default: false },
              ].map((n) => (
                <div key={n.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <Switch defaultChecked={n.default} />
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="security">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">Security Settings</h3>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-card-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="space-y-2">
                <Label>Current Password</Label>
                <Input type="password" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Update Password</Button>
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-border bg-card p-6 shadow-card">
            <h3 className="font-display text-base font-bold text-card-foreground">System Preferences</h3>
            <Separator className="my-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
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
                <Label>Units</Label>
                <Select defaultValue="metric">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (kg, ha, °C)</SelectItem>
                    <SelectItem value="imperial">Imperial (lb, acres, °F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select defaultValue="rwf">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rwf">RWF — Rwandan Franc</SelectItem>
                    <SelectItem value="usd">USD — US Dollar</SelectItem>
                    <SelectItem value="eur">EUR — Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select defaultValue="dmy">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save Preferences</Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  </DashboardLayout>
);

export default Settings;
