import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, Sparkles } from "lucide-react";
const Features = () => {
  const features = [{
    icon: Target,
    title: "Application Tracking & Insights",
    description: "Organize all your job applications in one place and never miss a step.",
    benefits: ["Track statuses and deadlines", "Monitor match scores", "Stay ready for upcoming interviews"],
    color: "text-green-600"
  }, {
    icon: TrendingUp,
    title: "Progress Tracking ",
    description: "See how your job search improves over time with clear analytics and reminders.",
    benefits: ["Weekly goals vs. actuals", "Stage conversion (Applied → Interview)", "Overdue or missing actions"],
    color: "text-purple-600"
  }, {
    icon: Sparkles,
    title: "AI-Powered Résumé Builder",
    description: "Generate tailored, ATS-friendly résumés designed to match specific roles.",
    benefits: ["Role-specific customization", "Quantified bullet suggestions", "Multiple versions for different jobs"],
    color: "text-orange-600"
  }];
  return <section id="features" className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Features</Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Stand Out
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Maximize your job landing potential.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-primary-glow/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, idx) => <div key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {benefit}
                    </div>)}
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default Features;