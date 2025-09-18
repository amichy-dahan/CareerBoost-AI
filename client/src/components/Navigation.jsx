import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
const Navigation = () => {
  return <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border bg-background my-0">
      <div className="container mx-auto w-full h-16 flex items-center justify-between px-[26px] py-[10px]">
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
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <SheetHeader className="px-6 pt-6 pb-2 text-left">
                  
                </SheetHeader>
                <nav className="flex flex-col divide-y">
                  <Link to="/dashboard" className="px-6 py-4 hover:bg-accent hover:text-accent-foreground">Dashboard</Link>
                  <Link to="/applications" className="px-6 py-4 hover:bg-accent hover:text-accent-foreground">Applications</Link>
                  <Link to="/generate-resume" className="px-6 py-4 hover:bg-accent hover:text-accent-foreground">Generate Resume</Link>
                  <Link to="/login" className="px-6 py-4 hover:bg-accent hover:text-accent-foreground">Sign In</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;