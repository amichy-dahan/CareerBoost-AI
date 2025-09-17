import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Upload, Github, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();

  function handleNav(){
    navigate("/login");
  }
  return <section className="pt-24 pb-16 px-6 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                AI-Powered Career Optimization
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Land Your Dream{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Developer Job
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">Get personalized, AI-driven insights to optimize your résumé. Stand out from the crowd with friendly improvements tailored for developers.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleNav} size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 transition-opacity">
                Start Free Analysis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Upload Resume</span>
              </div>
              <div className="flex items-center space-x-2">
                <Linkedin className="w-4 h-4" />
                <span>Sync LinkedIn</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-card border border-border rounded-2xl p-8 shadow-elegant">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mx-[20px]">Career Readiness Overview</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success mb-1">84%</div>
                    <div className="text-xs text-muted-foreground">Avg Match Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">7</div>
                    <div className="text-xs text-muted-foreground">Active Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning mb-1">3</div>
                    <div className="text-xs text-muted-foreground">Pending Actions</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm mx-[26px]">Resume Score</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-11/12 h-full bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium w-10">92%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mx-[24px]">
                    <strong className="text-foreground">Next Action:</strong> Prepare for BigTech Inc technical interview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;