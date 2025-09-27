import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Upload, Linkedin, Calendar } from "lucide-react";
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
            <div className="absolute inset-0 bg-gradient-to-r from-primary/25 to-primary-glow/25 rounded-3xl blur-3xl"></div>
            <Card className="relative border border-border/70 shadow-elegant rounded-2xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base lg:text-lg font-semibold">Career Readiness Overview</CardTitle>
                  <Badge variant="secondary" className="flex items-center gap-1 text-[11px] font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Updated today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-success mb-1">62%</div>
                    <div className="text-xs text-muted-foreground">Interview Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">7</div>
                    <div className="text-xs text-muted-foreground">Active Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-warning mb-1">3</div>
                    <div className="text-xs text-muted-foreground">Pending Actions</div>
                  </div>
                  <div className="col-span-3 text-center text-[11px] tracking-wide text-muted-foreground">
                    Example portfolio view • 18 total applications
                  </div>
                </div>
                <div className="mt-2 pt-4 border-t border-border/60">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Next Action:</span> Prepare for BigTech Inc technical interview.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>;
};
export default Hero;