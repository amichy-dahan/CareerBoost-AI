import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
const Navigation = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border bg-slate-100 my-0">
      <div className="container h-16 flex items-center justify-between px-[26px] mx-px py-[10px] my-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CBA</span>
          </div>
          <span className="text-xl font-bold text-slate-950">CareerBoost AI </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mx-[9px]">
            Dashboard
          </Link>
          <Link to="/applications" className="text-muted-foreground hover:text-foreground transition-colors mx-[20px]">
            Applications
<<<<<<< HEAD
          </Link>
          <Link to="/generate-resume" className="text-muted-foreground hover:text-foreground transition-colors">
=======

          </NavLink>
          <NavLink
            to="/resume"
            className={({ isActive }) =>
              `transition-colors border-b-2 ${
                isActive
                  ? "font-bold text-foreground border-blue-500"
                  : "text-muted-foreground hover:text-foreground border-transparent"
              }`
            }
          >
>>>>>>> 1b32d940e3e51586f5e349ecf1f95a40850e1774
            Generate Resume
          </Link>
          
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="hidden md:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/login">
            <Button className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
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