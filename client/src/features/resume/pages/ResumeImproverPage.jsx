import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";

export default function ResumeImproverPage() {
  const { toast } = useToast();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const profileId = "demo"; // replace with real id if you have it

  const onAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast({ title: "Missing info", description: "Paste resume and job description.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setFeedback(null);
    try {
      const resp = await fetch(`/api/feedback/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription })
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to fetch feedback");
      }
      const data = await resp.json();
      setFeedback(data);
      toast({ title: "Analysis complete", description: "See results on the right." });
    } catch (e) {
      toast({ title: "Analysis failed", description: String(e.message), variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Improve Your Resume for a Job</h1>
          <p className="text-muted-foreground mt-2">
            Paste your resume + the target job description. We’ll score the match and suggest improvements.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left - inputs */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Paste Your Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resumeText">Resume Text</Label>
                <Textarea id="resumeText" value={resumeText} onChange={(e)=>setResumeText(e.target.value)}
                          placeholder="Paste your resume…" className="h-48 font-mono text-sm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDesc">Job Description</Label>
                <Textarea id="jobDesc" value={jobDescription} onChange={(e)=>setJobDescription(e.target.value)}
                          placeholder="Paste the job description…" className="h-48 font-mono text-sm" />
              </div>

              <Separator />
              <Button onClick={onAnalyze} size="lg" disabled={isAnalyzing}>
                {isAnalyzing ? (<><Sparkles className="h-4 w-4 mr-2 animate-spin" />Analyzing…</>)
                            : (<><Sparkles className="h-4 w-4 mr-2" />Analyze with AI</>)}
              </Button>
            </CardContent>
          </Card>

          {/* Right - results */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!feedback && <p className="text-sm text-muted-foreground">
                Results will appear here after you run the analysis.
              </p>}

              {feedback && (
                <>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="text-sm text-muted-foreground">Readiness Score</div>
                      <div className="text-3xl font-semibold">{feedback.readinessScore}/100</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Strengths</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {feedback.improvements?.map((it, i) => (
                        <li key={i} className="p-3 rounded-md border">
                          <div className="text-sm font-semibold">{it.area}</div>
                          <div className="text-sm text-muted-foreground">{it.suggestion}</div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Missing Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {feedback.missingKeywords?.map((k, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded border bg-muted">{k}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                    Suggestions are guidance—review and edit before applying.
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
