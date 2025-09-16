import { Badge } from "@/components/ui/badge";

const getStatusColor = (status) => {
  switch (status) {
    case 'Draft':
      return 'bg-muted text-muted-foreground';
    case 'Applied':
      return 'bg-primary text-primary-foreground';
    case 'HR Screen':
      return 'bg-accent text-accent-foreground';
    case 'OA/Take-Home':
      return 'bg-warning text-warning-foreground';
    case 'Tech Interview 1':
    case 'Tech Interview 2':
      return 'bg-warning text-warning-foreground';
    case 'Final/Onsite':
      return 'bg-warning text-warning-foreground';
    case 'Offer':
      return 'bg-success text-success-foreground';
    case 'Rejected':
    case 'Ghosted':
      return 'bg-destructive text-destructive-foreground';
    case 'Withdrawn':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

export const StatusBadge = ({ status, className }) => {
  return (
    <Badge className={`${getStatusColor(status)} ${className}`}>
      {status}
    </Badge>
  );
};