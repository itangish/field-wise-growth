import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  delay?: number;
}

const StatCard = ({ icon, label, value, change, changePositive, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="rounded-xl border border-border bg-card p-5 shadow-card"
  >
    <div className="flex items-center justify-between">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        {icon}
      </div>
      {change && (
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold",
            changePositive
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive"
          )}
        >
          {change}
        </span>
      )}
    </div>
    <p className="mt-4 text-2xl font-bold font-display text-card-foreground">{value}</p>
    <p className="mt-1 text-sm text-muted-foreground">{label}</p>
  </motion.div>
);

export default StatCard;
