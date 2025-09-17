import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
const Navigation = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border bg-background my-0">
      <div className="container h-16 flex items-center justify-between px-[26px] mx-px py-[10px] my-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">In.d</span>
          </div>
          <span className="text-xl font-bold text-slate-950">BreakIn.dev</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mx-[9px]">
            Dashboard
          </Link>
          <Link to="/applications" className="text-muted-foreground hover:text-foreground transition-colors mx-[20px]">
            Applications
          </Link>
          <Link to="/generate-resume" className="text-muted-foreground hover:text-foreground transition-colors">
            Generate Resume
          </Link>
          
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>;
};
export default Navigation;