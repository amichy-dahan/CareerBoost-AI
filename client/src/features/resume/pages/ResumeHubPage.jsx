import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Wand2, Sparkles, FileText } from "lucide-react";

export default function ResumeHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-semibold">Resume Assistant</h1>
          <p className="text-muted-foreground mt-2">Choose how you’d like to work on your résumé</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Option A */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Generate Resume from Scratch
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fill a short form and let AI draft an ATS-friendly résumé.
              </p>
              <Separator />
              <div className="flex justify-end">
                <Button asChild>
                  <Link to="/generate-resume">
                    <FileText className="h-4 w-4 mr-2" />
                    Start Builder
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Option B */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Improve Your Resume for a Specific Job
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Paste your existing resume text and the job description. Get a score, strengths, gaps, and missing keywords.
              </p>
              <Separator />
              <div className="flex justify-end">
                <Button asChild variant="secondary">
                  <Link to="/resume/improve">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Open Improver
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
