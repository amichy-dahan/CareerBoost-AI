import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, Edit, Copy, Trash2, FileText } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { TechChips } from "./TechChips";
import { format } from "date-fns";

export const ApplicationsTable = ({ applications, onEdit, onDelete, onDuplicate }) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getNextActionUrgency = (nextActionDate) => {
    if (!nextActionDate) return 'normal';
    
    const actionDate = new Date(nextActionDate);
    const today = new Date();
    const diffDays = Math.ceil((actionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'urgent';
    return 'normal';
  };

  const getNextActionStyle = (urgency) => {
    switch (urgency) {
      case 'overdue':
        return 'text-destructive font-medium';
      case 'urgent':
        return 'text-warning font-medium';
      default:
        return 'text-muted-foreground';
    }
  };

  const toggleRowSelection = (applicationId) => {
    setSelectedRows(prev => 
      prev.includes(applicationId)
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  return (
    <div className="space-y-4">
      {selectedRows.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.length} applications selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Bulk Status Update
            </Button>
            <Button size="sm" variant="outline">
              Export Selected
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setSelectedRows([])}
          >
            Clear Selection
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRows(applications.map(app => app.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                  checked={selectedRows.length === applications.length && applications.length > 0}
                />
              </TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Applied</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Technologies</TableHead>
              <TableHead className="font-semibold">Match Score</TableHead>
              <TableHead className="font-semibold">Resume</TableHead>
              <TableHead className="font-semibold">Next Action</TableHead>
              <TableHead className="font-semibold w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => {
              const nextActionUrgency = getNextActionUrgency(application.nextActionDate);
              
              return (
                <TableRow 
                  key={application.id}
                  className={`hover:bg-muted/50 ${selectedRows.includes(application.id) ? 'bg-accent/30' : ''}`}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(application.id)}
                      onChange={() => toggleRowSelection(application.id)}
                    />
                  </TableCell>
                  
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {application.company}
                      {application.jobUrl && (
                        <a
                          href={application.jobUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{application.roleTitle}</div>
                      {application.location && (
                        <div className="text-sm text-muted-foreground">{application.location}</div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-sm">
                    {formatDate(application.appliedAt)}
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={application.status} />
                  </TableCell>
                  
                  <TableCell>
                    <TechChips technologies={application.technologies} maxVisible={2} />
                  </TableCell>
                  
                  <TableCell className="text-center">
                    {application.matchScore ? (
                      <Badge variant={application.matchScore >= 80 ? 'default' : application.matchScore >= 60 ? 'secondary' : 'outline'}>
                        {application.matchScore}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="View Resume"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  
                  <TableCell>
                    {application.nextAction ? (
                      <div className="space-y-1">
                        <div className="text-sm">{application.nextAction}</div>
                        <div className={`text-xs ${getNextActionStyle(nextActionUrgency)}`}>
                          {formatDate(application.nextActionDate)}
                          {nextActionUrgency === 'overdue' && ' (Overdue)'}
                          {nextActionUrgency === 'urgent' && ' (Due Soon)'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No action set</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(application)}
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        onClick={() => onDuplicate(application)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => onDelete(application.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {applications.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg font-medium mb-2">No applications found</div>
            <div className="text-sm">Try adjusting your filters or add your first application</div>
          </div>
        )}
      </div>
    </div>
  );
};