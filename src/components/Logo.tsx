import { Sprout } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <Link to="/" className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero">
      <Sprout className="h-5 w-5 text-primary-foreground" />
    </div>
    {!collapsed && (
      <span className="font-display text-lg font-bold text-foreground">
        AMS
      </span>
    )}
  </Link>
);

export default Logo;
