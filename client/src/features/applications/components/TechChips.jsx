import { Badge } from "@/components/ui/badge";

export const TechChips = ({ technologies, maxVisible = 3, className }) => {
  const visible = technologies.slice(0, maxVisible);
  const remaining = technologies.length - maxVisible;

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {visible.map((tech) => (
        <Badge key={tech} variant="secondary" className="text-xs">
          {tech}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  );
};