import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GenerateResumeSchema } from "../schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { FileText, Wand2, Copy, Save, Download, Upload, Sparkles, Plus, X, GraduationCap, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
export default function GenerateResumePage() {
  const [output, setOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [skillCount, setSkillCount] = useState(1);
  const [eduCount, setEduCount] = useState(1);
  const [expCount, setExpCount] = useState(1);
  const {
    toast
  } = useToast();
  const form = useForm({
    resolver: zodResolver(GenerateResumeSchema),
    defaultValues: {
      targetRole: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      jobTitle: "",
      skills: [""],
      education: [{
        institution: "",
        degree: "",
        start: "",
        end: ""
      }],
      experience: [{
        company: "",
        title: "",
        location: "",
        start: "",
        end: "",
        bullets: [""],
        tech: []
      }],
      oldResumeText: ""
    }
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: {
      errors
    },
    watch
  } = form;
  async function onParseOldResume(file) {
    if (!file) return;
    setIsParsing(true);
    try {
      const text = `Mock parsed text from ${file.name}. This would contain the extracted resume content.`;
      setValue("oldResumeText", text);
      toast({
        title: "Resume parsed successfully",
        description: "Extracted text has been added to the form."
      });
    } catch (error) {
      toast({
        title: "Parsing failed",
        description: "Could not extract text from the uploaded file.",
        variant: "destructive"
      });
    } finally {
      setIsParsing(false);
    }
  }
  async function onGenerate(values) {
    setIsGenerating(true);
    try {
      const mockResume = `JOHN DOE
Email: john.doe@email.com | LinkedIn: linkedin.com/in/johndoe | GitHub: github.com/johndoe
San Francisco, CA

PROFESSIONAL SUMMARY
${values.targetRole ? `Motivated ${values.targetRole.toLowerCase()} ` : ""}Software developer with strong foundation in modern web technologies. Passionate about creating efficient, user-friendly applications and continuous learning. Experienced in ${values.skills.slice(0, 3).join(", ")} and collaborative development practices.

TECHNICAL SKILLS
Programming Languages: ${values.skills.filter(s => s.includes("Script") || s.includes("Python") || s.includes("Java")).join(", ") || "JavaScript, TypeScript"}
Frameworks & Libraries: ${values.skills.filter(s => s.includes("React") || s.includes("Vue") || s.includes("Angular") || s.includes("Node")).join(", ") || "React, Node.js"}
Tools & Technologies: ${values.skills.filter(s => !s.includes("Script") && !s.includes("React")).join(", ") || "Git, Docker, AWS"}

EXPERIENCE
${values.experience.map(exp => `
${exp.title?.toUpperCase()} | ${exp.company?.toUpperCase()}${exp.location ? ` | ${exp.location}` : ""}
${exp.start} - ${exp.end}
${exp.bullets?.[0]?.split('\n').map(bullet => bullet.trim()).filter(bullet => bullet.startsWith('•')).join('\n') || "• Key achievement placeholder"}
${exp.tech?.length ? `Technologies: ${exp.tech.join(", ")}` : ""}
`).join("")}

EDUCATION
${values.education.map(edu => `
${edu.degree?.toUpperCase()}${edu.institution ? ` | ${edu.institution?.toUpperCase()}` : ""}${edu.start && edu.end ? ` | ${edu.start} - ${edu.end}` : ""}
`).join("")}

PROJECTS
Personal Portfolio Website
• Built responsive portfolio showcasing projects using React and modern CSS
• Implemented contact form with email integration and form validation
• Deployed using Vercel with custom domain and SSL certificate
Technologies: React, TypeScript, Tailwind CSS, Vercel`;
      setOutput(mockResume);
      toast({
        title: "Resume generated successfully!",
        description: "Your ATS-optimized resume is ready for review."
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard",
      description: "Resume text has been copied to your clipboard."
    });
  };
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 my-0 py-[71px]">
        <div className="mb-8 text-center my-[29px]">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent mb-4">
        </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto"> Fill out your information and let AI craft the perfect resume.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 my-0 py-0">
          {/* Left Panel - Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resume Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Target Role */}
              <div className="space-y-2">
                <Label htmlFor="targetRole" className="text-sm font-medium">Target Job (Optional)</Label>
                <Input id="targetRole" {...register("targetRole")} placeholder="e.g., Junior Frontend Developer" className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Helps tailor keywords and focus for your resume
                </p>
              </div>

              <Separator />

              {/* Personal Info */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">1. Personal Info</Label>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="mb-4">
                    <Label htmlFor="firstName" className="text-xs text-muted-foreground">First Name *</Label>
                    <Input id="firstName" {...register("firstName")} placeholder="John" className="mt-2" />
                    {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="lastName" className="text-xs text-muted-foreground">Last Name *</Label>
                    <Input id="lastName" {...register("lastName")} placeholder="Doe" className="mt-2" />
                    {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="email" className="text-xs text-muted-foreground">Email *</Label>
                    <Input id="email" {...register("email")} placeholder="john.doe@email.com" type="email" className="mt-2" />
                    {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="phone" className="text-xs text-muted-foreground">Phone *</Label>
                    <Input id="phone" {...register("phone")} placeholder="(555) 123-4567" className="mt-2" />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="address" className="text-xs text-muted-foreground">Address *</Label>
                    <Input id="address" {...register("address")} placeholder="San Francisco, CA" className="mt-2" />
                    {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="jobTitle" className="text-xs text-muted-foreground">Job Title *</Label>
                    <Input id="jobTitle" {...register("jobTitle")} placeholder="Software Developer" className="mt-2" />
                    {errors.jobTitle && <p className="text-xs text-destructive mt-1">{errors.jobTitle.message}</p>}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Skills - Simplified */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Skills</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setSkillCount(prev => prev + 1)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
                <div className="space-y-3">
                  {Array.from({
                  length: skillCount
                }, (_, index) => <div key={index} className="flex items-center gap-2">
                      <Input {...register(`skills.${index}`)} placeholder="e.g., React, TypeScript, Node.js" className="flex-1" />
                      {index > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => setSkillCount(prev => Math.max(1, prev - 1))} className="text-destructive hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>}
                    </div>)}
                </div>
                <Separator />
              </div>

              {/* Education - Simplified */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setEduCount(prev => prev + 1)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {Array.from({
                  length: eduCount
                }, (_, index) => <Card key={index} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Education #{index + 1}</CardTitle>
                          {index > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => setEduCount(prev => Math.max(1, prev - 1))} className="text-destructive hover:text-destructive">
                              <X className="h-4 w-4" />
                            </Button>}
                        </div>
                      </CardHeader>
                       <CardContent className="space-y-3">
                         <div className="grid gap-6 md:grid-cols-2">
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Institution *</Label>
                             <Input {...register(`education.${index}.institution`)} placeholder="University of Example" className="mt-2" />
                           </div>
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Degree *</Label>
                             <Input {...register(`education.${index}.degree`)} placeholder="Bachelor of Computer Science" className="mt-2" />
                           </div>
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Start Date</Label>
                             <Input {...register(`education.${index}.start`)} placeholder="Sep 2020" className="mt-2" />
                           </div>
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">End Date</Label>
                             <Input {...register(`education.${index}.end`)} placeholder="Present or Jun 2024" className="mt-2" />
                           </div>
                         </div>
                       </CardContent>
                    </Card>)}
                </div>
                <Separator />
              </div>

              {/* Experience - Simplified */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => setExpCount(prev => prev + 1)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
                <div className="space-y-4">
                  {Array.from({
                  length: expCount
                }, (_, index) => <Card key={index} className="relative">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Experience #{index + 1}</CardTitle>
                          {index > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => setExpCount(prev => Math.max(1, prev - 1))} className="text-destructive hover:text-destructive">
                              <X className="h-4 w-4" />
                            </Button>}
                        </div>
                      </CardHeader>
                       <CardContent className="space-y-4">
                         <div className="grid gap-6 md:grid-cols-2">
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Company *</Label>
                             <Input {...register(`experience.${index}.company`)} placeholder="Tech Company Inc." className="mt-2" />
                           </div>
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Job Title *</Label>
                             <Input {...register(`experience.${index}.title`)} placeholder="Software Developer Intern" className="mt-2" />
                           </div>
                           <div className="mb-4">
                             <Label className="text-xs text-muted-foreground">Location</Label>
                             <Input {...register(`experience.${index}.location`)} placeholder="San Francisco, CA" className="mt-2" />
                           </div>
                           <div className="grid grid-cols-2 gap-4 mb-4">
                             <div>
                               <Label className="text-xs text-muted-foreground">Start</Label>
                               <Input {...register(`experience.${index}.start`)} placeholder="Jun 2023" className="mt-2" />
                             </div>
                             <div>
                               <Label className="text-xs text-muted-foreground">End</Label>
                               <Input {...register(`experience.${index}.end`)} placeholder="Present" className="mt-2" />
                             </div>
                           </div>
                         </div>
                         
                         <div className="space-y-3">
                           <Label className="text-xs text-muted-foreground">Key Achievements *</Label>
                           <Textarea {...register(`experience.${index}.bullets.0`)} placeholder="• Developed responsive web applications using React and TypeScript, improving user engagement by 25%&#10;• Collaborated with cross-functional teams to implement new features, reducing development time by 30%&#10;• Optimized database queries and API endpoints, improving application performance by 40%" className="min-h-[100px] mt-2" />
                           <p className="text-xs text-muted-foreground my-[20px]">
                             Tip: Use action verbs + quantified results (numbers, percentages, metrics)
                           </p>
                         </div>
                       </CardContent>
                    </Card>)}
                </div>
                <Separator />
              </div>

              {/* Old Resume Upload */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Existing Resume (Optional)
                </Label>
                <Input type="file" accept=".pdf,.doc,.docx" onChange={e => e.target.files?.[0] && onParseOldResume(e.target.files[0])} disabled={isParsing} className="my-[20px]" />
                <Textarea {...register("oldResumeText")} placeholder="Extracted text will appear here (for AI context)" className="h-24 font-mono text-sm" />
              </div>

              <Separator />

              {/* Generate Button */}
              <Button onClick={handleSubmit(onGenerate)} className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90" size="lg" disabled={isGenerating}>
                {isGenerating ? <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    Generating Resume...
                  </> : <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate AI Resume
                  </>}
              </Button>
            </CardContent>
          </Card>

          {/* Right Panel - Output */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Generated Resume
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea readOnly value={output} placeholder="Your generated resume will appear here..." className="h-[600px] font-mono text-sm resize-none" />
              
              {output && <div className="flex gap-2 pt-4 border-t">
                  <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    Copy Text
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" disabled>
                    <Save className="h-4 w-4" />
                    Save Version
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" disabled>
                    <Download className="h-4 w-4" />
                    Export DOCX
                  </Button>
                </div>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
}