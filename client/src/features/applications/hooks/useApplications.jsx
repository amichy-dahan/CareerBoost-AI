import { useState, useMemo } from 'react';

// Mock data for demonstration
const mockApplications = [
  {
    id: '1',
    userId: 'user1',
    company: 'TechCorp',
    roleTitle: 'Junior Frontend Developer',
    location: 'San Francisco, CA',
    jobUrl: 'https://linkedin.com/jobs/123',
    status: 'Applied',
    appliedAt: '2025-09-15',
    technologies: ['React', 'TypeScript', 'Jest', 'CSS'],
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    company: 'StartupAI',
    roleTitle: 'Full Stack Developer',
    location: 'Remote',
    source: 'Company Site',
    jobUrl: 'https://startup.ai/careers/fullstack',
    resumeId: 'resume2',
    matchScore: 68,
    tailoringNotes: 'Highlighted Node.js projects and API development',
    status: 'Applied',
    nextAction: '',
    nextActionDate: '',
    appliedAt: '2025-09-12',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    createdAt: '2025-09-12T14:30:00Z',
    updatedAt: '2025-09-16T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    company: 'BigTech Inc',
    roleTitle: 'Software Engineer Intern',
    location: 'Seattle, WA',
    source: 'Referral',
    resumeId: 'resume1',
    matchScore: 92,
    status: 'Tech Interview 1',
    nextAction: 'System design prep',
    nextActionDate: '2025-09-17',
    appliedAt: '2025-09-10',
    technologies: ['Python', 'AWS', 'Microservices', 'Redis'],
    createdAt: '2025-09-10T16:45:00Z',
    updatedAt: '2025-09-16T11:20:00Z',
  },
    {
    id: '1',
    userId: 'user1',
    company: 'TechCorp',
    roleTitle: 'Junior Frontend Developer',
    location: 'San Francisco, CA',
    jobUrl: 'https://linkedin.com/jobs/123',
    status: 'Applied',
    appliedAt: '2025-09-15',
    technologies: ['React', 'TypeScript', 'Jest', 'CSS'],
    createdAt: '2025-09-15T10:00:00Z',
    updatedAt: '2025-09-15T10:00:00Z',
  },
  {
    id: '2',
    userId: 'user1',
    company: 'StartupAI',
    roleTitle: 'Full Stack Developer',
    location: 'Remote',
    source: 'Company Site',
    jobUrl: 'https://startup.ai/careers/fullstack',
    resumeId: 'resume2',
    matchScore: 68,
    tailoringNotes: 'Highlighted Node.js projects and API development',
    status: 'Applied',
    nextAction: '',
    nextActionDate: '',
    appliedAt: '2025-09-12',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
    createdAt: '2025-09-12T14:30:00Z',
    updatedAt: '2025-09-16T09:15:00Z',
  },
  {
    id: '3',
    userId: 'user1',
    company: 'BigTech Inc',
    roleTitle: 'Software Engineer Intern',
    location: 'Seattle, WA',
    source: 'Referral',
    resumeId: 'resume1',
    matchScore: 92,
    status: 'Tech Interview 1',
    nextAction: 'System design prep',
    nextActionDate: '2025-09-17',
    appliedAt: '2025-09-10',
    technologies: ['Python', 'AWS', 'Microservices', 'Redis'],
    createdAt: '2025-09-10T16:45:00Z',
    updatedAt: '2025-09-16T11:20:00Z',
  },
  
];

export const useApplications = (filters = {}, page = 1, pageSize = 20) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const data = useMemo(() => {
    try {
      // In a real app, this would be a React Query hook
      let filtered = [...mockApplications];
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          app => 
            app.company.toLowerCase().includes(searchLower) ||
            app.roleTitle.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters.status && filters.status.length > 0) {
        filtered = filtered.filter(app => filters.status.includes(app.status));
      }
      
      if (filters.technologies && filters.technologies.length > 0) {
        filtered = filtered.filter(app =>
          filters.technologies.some(tech => app.technologies.includes(tech))
        );
      }
      
      if (filters.source) {
        filtered = filtered.filter(app => app.source === filters.source);
      }
      
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedItems = filtered.slice(startIndex, endIndex);
      
      return {
        items: paginatedItems,
        total: filtered.length,
        page,
        pageSize,
      };
    } catch (error) {
      console.error('Error filtering applications:', error);
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize,
      };
    }
  }, [filters, page, pageSize]);

  return {
    data,
    isLoading,
    error: null,
  };
};

export const useApplication = (id) => {
  const data = useMemo(() => {
    try {
      return mockApplications.find(app => app.id === id);
    } catch (error) {
      console.error('Error finding application:', error);
      return null;
    }
  }, [id]);
  
  return {
    data,
    isLoading: false,
    error: null,
  };
};