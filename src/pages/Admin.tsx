import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Shield, Users, UserCheck, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["admin", "manager", "farmer", "buyer"];

interface UserWithRoles {
  user_id: string;
  full_name: string | null;
  district: string | null;
  created_at: string;
  roles: AppRole[];
}

const roleBadgeVariant = (role: AppRole) => {
  switch (role) {
    case "admin": return "destructive";
    case "manager": return "default";
    case "farmer": return "secondary";
    case "buyer": return "outline";
  }
};

const Admin = () => {
  const { hasRole } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("user_id, full_name, district, created_at"),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const rolesMap = new Map<string, AppRole[]>();
      for (const r of rolesRes.data) {
        const existing = rolesMap.get(r.user_id) || [];
        existing.push(r.role);
        rolesMap.set(r.user_id, existing);
      }

      return profilesRes.data.map((p): UserWithRoles => ({
        user_id: p.user_id,
        full_name: p.full_name,
        district: p.district,
        created_at: p.created_at,
        roles: rolesMap.get(p.user_id) || [],
      }));
    },
    enabled: hasRole("admin"),
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Role assigned successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to assign role", description: err.message, variant: "destructive" });
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Role removed successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to remove role", description: err.message, variant: "destructive" });
    },
  });

  const filtered = users.filter(
    (u) =>
      !search ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.district?.toLowerCase().includes(search.toLowerCase()) ||
      u.roles.some((r) => r.includes(search.toLowerCase()))
  );

  if (!hasRole("admin")) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <Shield className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h2 className="font-display text-xl font-bold text-foreground">Access Denied</h2>
          <p className="mt-1 text-sm text-muted-foreground">You need admin privileges to view this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    { label: "Total Users", value: users.length, icon: Users },
    { label: "Admins", value: users.filter((u) => u.roles.includes("admin")).length, icon: Shield },
    { label: "Farmers", value: users.filter((u) => u.roles.includes("farmer")).length, icon: UserCheck },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and role assignments</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card shadow-card"
        >
          <div className="flex items-center gap-3 border-b border-border p-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, district, or role…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Current Roles</TableHead>
                  <TableHead>Assign Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((user) => (
                    <TableRow key={user.user_id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-card-foreground">{user.full_name || "Unnamed"}</p>
                          <p className="text-xs text-muted-foreground">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.district || "—"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={roleBadgeVariant(role)}
                              className="cursor-pointer"
                              onClick={() => {
                                if (user.roles.length <= 1) {
                                  toast({ title: "Cannot remove last role", variant: "destructive" });
                                  return;
                                }
                                removeRole.mutate({ userId: user.user_id, role });
                              }}
                              title="Click to remove"
                            >
                              {role} ×
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(role: AppRole) => {
                            if (user.roles.includes(role)) {
                              toast({ title: "User already has this role" });
                              return;
                            }
                            assignRole.mutate({ userId: user.user_id, role });
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Add role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_ROLES.filter((r) => !user.roles.includes(r)).map((role) => (
                              <SelectItem key={role} value={role}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
