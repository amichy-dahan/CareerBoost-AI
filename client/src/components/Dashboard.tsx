import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Calendar, CheckCircle, AlertCircle, Clock, Star } from "lucide-react";
import UserProfileCard from "./UserProfileCard";
import { useApplications } from "@/features/applications/hooks/useApplications";
import { useAllApplications } from "@/features/applications/hooks/useAllApplications";
import { useState, useMemo, useEffect } from "react";

interface PriorityAction {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  impact: string; // e.g. "+15 pts"
  icon: any;
  color: string;
}
const Dashboard = () => {
  // Keep lightweight first page fetch for immediate UI (recent activity & actions use)
  const { data: applicationsData } = useApplications();
  const firstPageApplications = applicationsData?.items || [];
  // Load all applications for accurate aggregate metrics (frontend-only pagination crawl)
  const { applications: allApplications, isLoading: isLoadingAll } = useAllApplications();
  const applications = allApplications.length ? allApplications : firstPageApplications;

  // Generate ALL potential priority actions from applications data (unfiltered; we slice later)
  const allActionItems: PriorityAction[] = [];
  applications.forEach(app => {
    const appId = app.id || app._id || app.applicationId || app.company || Math.random().toString(36).slice(2);
    // High priority: Upcoming interviews
    if (app.status === 'Tech Interview 1' || app.status === 'Tech Interview 2' || app.status === 'Final/Onsite') {
      allActionItems.push({
        id: `${appId}-interview-${app.status}`,
        title: "Prepare for upcoming interview",
        description: `You have a technical interview at ${app.company} on ${new Date(app.nextActionDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })}. Review system design topics.`,
        priority: "High",
        impact: "+15 pts",
        icon: AlertCircle,
        color: "text-destructive"
      });
    }

    // Medium priority: Follow-ups needed
    if (app.status === 'Applied' && app.appliedAt) {
      const daysSinceApplied = Math.floor((Date.now() - new Date(app.appliedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceApplied >= 5 && daysSinceApplied <= 10) {
        allActionItems.push({
          id: `${appId}-followup-${daysSinceApplied}`,
          title: "Follow up on recent application",
          description: `Your application to ${app.company} was sent on ${new Date(app.appliedAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}. Follow up with recruiter by ${new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })}.`,
          priority: "Medium",
          impact: "+8 pts",
          icon: Clock,
          color: "text-primary"
        });
      }
    }

    // Medium priority: Low match scores
    if (app.matchScore && app.matchScore < 75) {
      const techsString = app.technologies?.slice(0, 2).join(' + ') || 'relevant skills';
      allActionItems.push({
        id: `${appId}-lowmatch-${app.matchScore}`,
        title: "Improve low match score",
        description: `Your application to ${app.company} scored ${app.matchScore}%. Update your résumé to highlight ${techsString}.`,
        priority: "Medium",
        impact: "+10 pts",
        icon: Clock,
        color: "text-primary"
      });
    }

    // Low priority: Missing next actions
    if (!app.nextAction || app.nextAction.trim() === '') {
      allActionItems.push({
        id: `${appId}-missing-next`,
        title: "Add next action",
        description: `${app.company} application has no next step defined. Add a follow-up or preparation task.`,
        priority: "Low",
        impact: "+3 pts",
        icon: CheckCircle,
        color: "text-success"
      });
    }
  });

  // Sort all actions (stable order) whenever applications change
  const sortedActions = useMemo(() => {
    return [...allActionItems].sort((a, b) => {
      const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [applications]);

  // Track completed actions so they do not reappear; derive visible actions from remaining
  const [completedActionIds, setCompletedActionIds] = useState<Set<string>>(new Set());
  const [userScore, setUserScore] = useState<number>(0);
  const [isLoadingProgress, setIsLoadingProgress] = useState<boolean>(true);
  const [progressError, setProgressError] = useState<string | null>(null);

  // Load persisted progress (score + completed actions)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/user/progress', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load progress');
        const data = await res.json();
        if (!cancelled) {
          setUserScore(data.careerScore || 0);
          if (Array.isArray(data.completedPriorityActions)) {
            setCompletedActionIds(new Set(data.completedPriorityActions));
          }
        }
      } catch (e: any) {
        if (!cancelled) setProgressError(e.message || 'Error loading progress');
      } finally {
        if (!cancelled) setIsLoadingProgress(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const visibleActions = useMemo(
    () => sortedActions.filter(a => !completedActionIds.has(a.id)).slice(0, 3),
    [sortedActions, completedActionIds]
  );

  const handleCompleteAction = async (index: number) => {
    const item = visibleActions[index];
    if (!item) return;
    const match = item.impact.match(/[-+]?\d+/);
    const points = match ? parseInt(match[0], 10) : 0;

    // Optimistic update
    setUserScore(s => s + points);
    setCompletedActionIds(prev => {
      const next = new Set(prev);
      next.add(item.id);
      return next;
    });

    try {
      await fetch('/api/user/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ actionId: item.id, points })
      });
    } catch (e) {
      // Rollback on failure
      setUserScore(s => s - points);
      setCompletedActionIds(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }
  };

  // Calculate career readiness metrics
  const averageMatchScore = applications.length > 0 ? Math.round(applications.reduce((sum, app) => sum + (app.matchScore || 0), 0) / applications.length) : 0;
  const activeApplications = applications.filter(app => !['Rejected', 'Ghosted', 'Withdrawn'].includes(app.status)).length;
  const pendingActions = applications.filter(app => app.nextAction && app.nextActionDate && new Date(app.nextActionDate) >= new Date()).length;
  const totalApplications = applications.length;

  // Generate recent activity
  const recentActivity = [];
  applications.forEach(app => {
    if (app.updatedAt) {
      const daysSinceUpdate = Math.floor((Date.now() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate <= 3) {
        const timeText = daysSinceUpdate === 0 ? 'today' : daysSinceUpdate === 1 ? 'yesterday' : `${daysSinceUpdate} days ago`;
        if (app.status === 'HR Screen' || app.status === 'Tech Interview 1') {
          recentActivity.push({
            title: `Status updated to '${app.status}'`,
            description: `${app.company} application moved to ${app.status.toLowerCase()} stage`,
            time: timeText,
            color: "bg-primary"
          });
        }
        if (app.nextAction) {
          recentActivity.push({
            title: "Next action added",
            description: `'${app.nextAction}' set for ${app.company} application`,
            time: timeText,
            color: "bg-success"
          });
        }
        if (app.matchScore && app.matchScore >= 85) {
          recentActivity.push({
            title: `Match score ${app.matchScore}% calculated`,
            description: `High compatibility found for ${app.company} application`,
            time: timeText,
            color: "bg-success"
          });
        }
      }
    }
  });
  const topRecentActivity = recentActivity.slice(0, 2);
  return <section id="dashboard" className="px-6 bg-muted/20 py-[55px]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 my-[15px]">
   
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Profile Card */}
            <UserProfileCard score={userScore} />
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Career Readiness Overview</CardTitle>
                  <Badge variant="secondary">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated today
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">{averageMatchScore}%</div>
                    <div className="text-sm text-muted-foreground">Avg Match Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">{activeApplications}</div>
                    <div className="text-sm text-muted-foreground">Active Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-warning mb-2">{pendingActions}</div>
                    <div className="text-sm text-muted-foreground">Pending Actions</div>
                  </div>
                  <div className="text-center col-span-3 text-xs text-muted-foreground">
                    {isLoadingAll ? 'Loading full portfolio...' : `${totalApplications} total applications aggregated`}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Resume Score</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-11/12 h-full bg-success rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium w-12">92%</span>
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topRecentActivity.length > 0 ? topRecentActivity.map((activity, index) => <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`}></div>
                      <div>
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>) : <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground mt-1">Start managing applications to see updates here</p>
                    </div>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-warning" />
                  Priority Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {visibleActions.length > 0 ? visibleActions.map((item, index) => <div key={item.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />
                        <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'} className="text-xs">
                          {item.priority}
                        </Badge>
                      </div>
                      <span className="text-xs font-medium text-success">{item.impact}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                    <Button size="sm" variant="outline" className="w-full text-xs" onClick={() => handleCompleteAction(index)}>
                      Done
                    </Button>
                  </div>) : <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">No priority actions</p>
                    <p className="text-xs text-muted-foreground mt-1">All applications are up to date</p>
                  </div>}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </section>;
};
export default Dashboard;