import React, { useState, useMemo, useCallback, useRef, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Edit, Trash2, FileText } from "lucide-react"; // Removed Copy
import { StatusBadge } from "./StatusBadge";
import { TechChips } from "./TechChips";
import { format } from "date-fns";

// ---- Next Action helpers ----
function formatNextActionDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return format(d, 'MMM d');
}

function getNextActionUrgency(date) {
  if (!date) return 'none';
  const target = new Date(date);
  if (isNaN(target.getTime())) return 'none';
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((startTarget - startToday) / 86400000);
  if (diffDays < 0) return 'overdue';
  if (diffDays <= 2) return 'urgent';
  if (diffDays <= 7) return 'upcoming';
  return 'future';
}

function getNextActionStyle(urgency) {
  switch (urgency) {
    case 'overdue':
      return 'text-destructive';
    case 'urgent':
      return 'text-warning';
    case 'upcoming':
      return 'text-primary';
    case 'future':
      return 'text-muted-foreground';
    default:
      return 'text-muted-foreground';
  }
}

// Memoized row component (duplicate action removed)
const ApplicationRow = memo(function ApplicationRow({
  app,
  isSelected,
  onToggle,
  onEdit,
  onDelete
}) {
  const nextActionUrgency = getNextActionUrgency(app.nextActionDate);
  return (
    <TableRow className={`hover:bg-muted/50 ${isSelected ? 'bg-accent/30' : ''}`}>
      <TableCell>
        <input
          type="checkbox"
          checked={isSelected}
            onChange={() => onToggle(app.id)}
        />
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          {app.company}
          {app.jobUrl && (
            <a
              href={app.jobUrl}
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
          <div className="font-medium">{app.roleTitle}</div>
          {app.location && (
            <div className="text-sm text-muted-foreground">{app.location}</div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm">{app._formattedAppliedAt}</TableCell>
      <TableCell>
        <StatusBadge status={app.status} />
      </TableCell>
      <TableCell>
        <TechChips technologies={app.technologies} maxVisible={2} />
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
        {app.nextAction ? (
          <div className="space-y-1">
            <div className="text-sm">{app.nextAction}</div>
            {app.nextActionDate && (
              <div className={`text-xs ${getNextActionStyle(nextActionUrgency)}`}>
                {formatNextActionDate(app.nextActionDate)}
                {nextActionUrgency === 'overdue' && ' (Overdue)'}
                {nextActionUrgency === 'urgent' && ' (Due Soon)'}
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs italic text-muted-foreground">None</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(app)}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(app.id)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

export const ApplicationsTable = ({ applications, onEdit, onDelete }) => {
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const headerCheckboxRef = useRef(null);

  const preparedApps = useMemo(() => {
    return applications.map(a => ({
      ...a,
      _formattedAppliedAt: a.appliedAt ? format(new Date(a.appliedAt), 'MMM d, yyyy') : '-'
    }));
  }, [applications]);

  const allSelected = selectedRows.size > 0 && selectedRows.size === preparedApps.length && preparedApps.length > 0;
  const isIndeterminate = selectedRows.size > 0 && !allSelected;

  React.useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleRowSelection = useCallback((id) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((checked) => {
    setSelectedRows(() => {
      if (!checked) return new Set();
      return new Set(preparedApps.map(a => a.id));
    });
  }, [preparedApps]);

  const clearSelection = useCallback(() => setSelectedRows(new Set()), []);

  // Edit the single selected application (must be exactly one)
  const handleEditSelected = useCallback(() => {
    if (selectedRows.size !== 1) {
      alert('Select exactly one application to edit.');
      return;
    }
    const onlyId = [...selectedRows][0];
    const app = preparedApps.find(a => a.id === onlyId);
    if (app) onEdit(app);
  }, [selectedRows, preparedApps, onEdit]);

  // Erase all selected applications after confirmation
  const handleEraseSelected = useCallback(() => {
    if (selectedRows.size === 0) return;
    if (!window.confirm(`Erase ${selectedRows.size} selected application(s)? This cannot be undone.`)) return;
    selectedRows.forEach(id => onDelete(id));
    clearSelection();
  }, [selectedRows, onDelete, clearSelection]);

  return (
    <div className="space-y-4">
      {selectedRows.size > 0 && (
        <div className="flex items-center gap-4 p-4 bg-accent rounded-lg">
          <span className="text-sm font-medium">
            {selectedRows.size} applications selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleEditSelected}>
              Edit Selected
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/40 hover:bg-destructive/10"
              onClick={handleEraseSelected}
            >
              Erase Selected
            </Button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={clearSelection}
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
                  ref={headerCheckboxRef}
                  type="checkbox"
                  onChange={(e) => toggleAll(e.target.checked)}
                  checked={allSelected}
                />
              </TableHead>
              <TableHead className="font-semibold">Company</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Applied</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Technologies</TableHead>
              <TableHead className="font-semibold">Resume</TableHead>
              <TableHead className="font-semibold">Next Action</TableHead>
              <TableHead className="font-semibold w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preparedApps.map(app => (
              <ApplicationRow
                key={app.id}
                app={app}
                isSelected={selectedRows.has(app.id)}
                onToggle={toggleRowSelection}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>

        {preparedApps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-lg font-medium mb-2">No applications found</div>
            <div className="text-sm">Try adjusting your filters or add your first application</div>
          </div>
        )}
      </div>
    </div>
  );
};