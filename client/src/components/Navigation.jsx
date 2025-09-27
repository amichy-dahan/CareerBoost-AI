import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom"; // added useLocation, removed unused Link
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const Navigation = () => {
  const [isAuthed, setIsAuthed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";

  useEffect(() => {
    const readAuth = () => {
      const token = localStorage.getItem("auth_token") || localStorage.getItem("token");
      setIsAuthed(!!token);
    };
    readAuth();
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token");
    setIsAuthed(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border bg-background my-0">
      <div className="container mx-auto w-full h-16 flex items-center justify-between px-[26px] py-[10px]">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AI</span>
          </div>
          <span className="text-xl font-bold text-slate-950">CareerBoost</span>
        </div>
   
        {!isLanding && (
          <>
            <div className="hidden md:flex items-center">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `transition-colors px-4 py-2 mx-2 rounded-md border-b-2 ${
                    isActive
                      ? "font-bold text-foreground border-blue-500"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/applications"
                className={({ isActive }) =>
                  `transition-colors px-4 py-2 mx-2 rounded-md border-b-2 ${
                    isActive
                      ? "font-bold text-foreground border-blue-500"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`
                }
              >
                Applications
              </NavLink>
              <NavLink
                to="/resume"
                className={({ isActive }) =>
                  `transition-colors px-4 py-2 mx-2 rounded-md border-b-2 ${
                    isActive
                      ? "font-bold text-foreground border-blue-500"
                      : "text-muted-foreground hover:text-foreground border-transparent"
                  }`
                }
              >
                Resume Tools
              </NavLink>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={handleLogout}
              >
                Log Out
              </Button>

              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="p-0">
                    <SheetHeader className="px-6 pt-6 pb-2 text-left" />
                    <nav className="flex flex-col divide-y">
                      <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                          `px-6 py-4 hover:bg-accent hover:text-accent-foreground border-b-2 ${
                            isActive ? "font-bold border-blue-500" : "border-transparent"
                          }`
                        }
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                          `px-6 py-4 hover:bg-accent hover:text-accent-foreground border-b-2 ${
                            isActive ? "font-bold border-blue-500" : "border-transparent"
                          }`
                        }
                      >
                        Applications
                      </NavLink>
                      <NavLink
                        to="/resume"
                        className={({ isActive }) =>
                          `px-6 py-4 hover:bg-accent hover:text-accent-foreground border-b-2 ${
                            isActive ? "font-bold border-blue-500" : "border-transparent"
                          }`
                        }
                      >
                        Resume Tools
                      </NavLink>
                      <button
                        onClick={handleLogout}
                        className="text-left px-6 py-4 hover:bg-accent hover:text-accent-foreground"
                      >
                        Log Out
                      </button>
                    </nav>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;