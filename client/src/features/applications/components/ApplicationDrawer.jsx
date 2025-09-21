import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { X, Plus } from "lucide-react";
import { APPLICATION_STATUSES, APPLICATION_SOURCES } from "../types";

const TECH_OPTIONS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Java', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Redux',
  'Next.js', 'Vue.js', 'Angular', 'Express.js', 'GraphQL',
  'Kubernetes', 'Jest', 'Cypress', 'Tailwind CSS'
];

const MOCK_RESUMES = [
  { id: 'resume1', fileName: 'Resume_Frontend_2025.pdf', atsScore: 87 },
  { id: 'resume2', fileName: 'Resume_Fullstack_Updated.pdf', atsScore: 82 },
  { id: 'resume3', fileName: 'Resume_General_v3.pdf', atsScore: 79 },
];

export const ApplicationDrawer = ({ application, open, onOpenChange, onSave }) => {
  const [formData, setFormData] = useState({
    company: application?.company || '',
    roleTitle: application?.roleTitle || '',
    location: application?.location || '',
    source: application?.source || 'LinkedIn',
    jobUrl: application?.jobUrl || '',
    resumeId: application?.resumeId || '',
    status: application?.status || 'Draft',
    appliedAt: application?.appliedAt || '',
    nextAction: application?.nextAction || '',
    nextActionDate: application?.nextActionDate || '',
    matchScore: application?.matchScore || undefined,
    tailoringNotes: application?.tailoringNotes || '',
    technologies: application?.technologies || [],
    offerComp: application?.offerComp || '',
    rejectionReason: application?.rejectionReason || '',
  });

  // Reset form when switching between add/edit or when a different application is selected
  useEffect(() => {
    setFormData({
      company: application?.company || '',
      roleTitle: application?.roleTitle || '',
      location: application?.location || '',
      source: application?.source || 'LinkedIn',
      jobUrl: application?.jobUrl || '',
      resumeId: application?.resumeId || '',
      status: application?.status || 'Draft',
      appliedAt: application?.appliedAt || '',
      nextAction: application?.nextAction || '',
      nextActionDate: application?.nextActionDate || '',
      matchScore: application?.matchScore || undefined,
      tailoringNotes: application?.tailoringNotes || '',
      technologies: application?.technologies || [],
      offerComp: application?.offerComp || '',
      rejectionReason: application?.rejectionReason || '',
    });
  }, [application, open]);

  const [newTech, setNewTech] = useState('');

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const addTechnology = (tech) => {
    if (tech && !formData.technologies?.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...(prev.technologies || []), tech]
      }));
    }
    setNewTech('');
  };

  const removeTechnology = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies?.filter(t => t !== tech) || []
    }));
  };

  const isEditMode = Boolean(application);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? 'Edit Application' : 'Add New Application'}
          </SheetTitle>
          <SheetDescription>
            {isEditMode 
              ? 'Update your application details and tracking information.'
              : 'Add a new job application to track your progress.'
            }
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  placeholder="e.g., TechCorp"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role Title *</Label>
                <Input
                  id="roleTitle"
                  placeholder="e.g., Frontend Developer"
                  value={formData.roleTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, roleTitle: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => setFormData(prev => ({ ...prev, source: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job URL</Label>
              <Input
                id="jobUrl"
                placeholder="https://company.com/jobs/123"
                value={formData.jobUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, jobUrl: e.target.value }))}
              />
            </div>
          </div>

          <Separator />

          {/* Resume & Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resume & Status</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume Version *</Label>
                <Select value={formData.resumeId} onValueChange={(value) => setFormData(prev => ({ ...prev, resumeId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_RESUMES.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{resume.fileName}</span>
                          <Badge variant="secondary" className="ml-2">
                            ATS: {resume.atsScore}%
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appliedAt">Applied Date</Label>
                <Input
                  id="appliedAt"
                  type="date"
                  value={formData.appliedAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, appliedAt: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="matchScore">Match Score</Label>
                <Input
                  id="matchScore"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0-100"
                  value={formData.matchScore || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, matchScore: e.target.value ? parseInt(e.target.value) : undefined }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Technologies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Technologies</h3>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={newTech} onValueChange={setNewTech}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add technology" />
                  </SelectTrigger>
                  <SelectContent>
                    {TECH_OPTIONS.filter(tech => !formData.technologies?.includes(tech)).map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => addTechnology(newTech)}
                  disabled={!newTech}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.technologies?.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeTechnology(tech)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Next Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Next Actions</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nextAction">Next Action</Label>
                <Input
                  id="nextAction"
                  placeholder="e.g., Follow up with recruiter"
                  value={formData.nextAction}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextAction: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nextActionDate">Next Action Date</Label>
                <Input
                  id="nextActionDate"
                  type="date"
                  value={formData.nextActionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, nextActionDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes & Additional Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Notes & Additional Info</h3>
            
            <div className="space-y-2">
              <Label htmlFor="tailoringNotes">Tailoring Notes</Label>
              <Textarea
                id="tailoringNotes"
                placeholder="What specific changes did you make to your resume for this role?"
                rows={3}
                value={formData.tailoringNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, tailoringNotes: e.target.value }))}
              />
            </div>
            
            {formData.status === 'Offer' && (
              <div className="space-y-2">
                <Label htmlFor="offerComp">Offer Compensation</Label>
                <Input
                  id="offerComp"
                  placeholder="e.g., $120k + equity"
                  value={formData.offerComp}
                  onChange={(e) => setFormData(prev => ({ ...prev, offerComp: e.target.value }))}
                />
              </div>
            )}
            
            {(formData.status === 'Rejected' || formData.status === 'Ghosted') && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Input
                  id="rejectionReason"
                  placeholder="e.g., Not enough experience with X"
                  value={formData.rejectionReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.company || !formData.roleTitle || !formData.resumeId}
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
            >
              {isEditMode ? 'Update Application' : 'Add Application'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};