import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Filter, Download } from "lucide-react";
import { APPLICATION_STATUSES, APPLICATION_SOURCES } from "../types";

const TECH_OPTIONS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'Java', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Redux',
  'Next.js', 'Vue.js', 'Angular', 'Express.js'
];

export const FiltersBar = ({ filters, onFiltersChange, onExport, totalResults }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTech, setSelectedTech] = useState('');

  const addStatusFilter = (status) => {
    const currentStatus = filters.status || [];
    if (!currentStatus.includes(status)) {
      onFiltersChange({
        ...filters,
        status: [...currentStatus, status]
      });
    }
    setSelectedStatus('');
  };

  const removeStatusFilter = (status) => {
    const currentStatus = filters.status || [];
    onFiltersChange({
      ...filters,
      status: currentStatus.filter(s => s !== status)
    });
  };

  const addTechFilter = (tech) => {
    const currentTech = filters.technologies || [];
    if (!currentTech.includes(tech)) {
      onFiltersChange({
        ...filters,
        technologies: [...currentTech, tech]
      });
    }
    setSelectedTech('');
  };

  const removeTechFilter = (tech) => {
    const currentTech = filters.technologies || [];
    onFiltersChange({
      ...filters,
      technologies: currentTech.filter(t => t !== tech)
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  return (
    <div className="bg-card border-b">
      {/* Search and Actions Row */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-nowrap">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search company or role..."
              value={filters.search || ''}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="w-full"
            />
          </div>

          <div className="flex gap-2 items-center">
            <Button variant="outline" onClick={onExport} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <div className="text-sm text-muted-foreground flex items-center whitespace-nowrap">
              {totalResults} applications
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="container mx-auto px-6 pb-4">
        <div className="flex items-center gap-4 flex-nowrap overflow-x-auto">
          <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={(value) => value && addStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Add status filter" />
            </SelectTrigger>
            <SelectContent>
              {APPLICATION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Source Filter */}
          <Select value={filters.source || 'all'} onValueChange={(value) => onFiltersChange({ ...filters, source: value === 'all' ? undefined : value })}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {APPLICATION_SOURCES.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Technology Filter */}
          <Select value={selectedTech} onValueChange={(value) => value && addTechFilter(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Add technology" />
            </SelectTrigger>
            <SelectContent>
              {TECH_OPTIONS.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearAllFilters} className="text-sm whitespace-nowrap">
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Row */}
      {hasActiveFilters && (
        <div className="container mx-auto px-6 pb-4">
          <div className="flex items-center gap-2 flex-nowrap overflow-x-auto">
            {/* Status Filters */}
            {filters.status?.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                Status: {status}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeStatusFilter(status)}
                />
              </Badge>
            ))}

            {/* Technology Filters */}
            {filters.technologies?.map((tech) => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                {tech}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeTechFilter(tech)}
                />
              </Badge>
            ))}

            {/* Source Filter */}
            {filters.source && (
              <Badge variant="secondary" className="flex items-center gap-1 whitespace-nowrap">
                Source: {filters.source}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => onFiltersChange({ ...filters, source: undefined })}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};W