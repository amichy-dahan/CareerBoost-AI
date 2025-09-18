import { z } from "zod";

export const EducationItemSchema = z.object({
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().min(2, "Degree is required"),
  start: z.string().optional(),
  end: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const ExperienceItemSchema = z.object({
  company: z.string().min(2, "Company is required"),
  title: z.string().min(2, "Title is required"),
  location: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  bullets: z.array(z.string()).min(1, "Add at least one bullet point").max(8, "Maximum 8 bullet points"),
  tech: z.array(z.string()).optional(),
});

export const GenerateResumeSchema = z.object({
  targetRole: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  education: z.array(EducationItemSchema).min(1, "Add at least one education item"),
  experience: z.array(ExperienceItemSchema).min(1, "Add at least one experience item"),
  oldResumeText: z.string().optional(),
});