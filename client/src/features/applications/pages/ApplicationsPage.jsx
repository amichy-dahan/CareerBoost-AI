import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useApplications } from "../hooks/useApplications.jsx";
import { FiltersBar } from "../components/FiltersBar";
import { ApplicationsTable } from "../components/ApplicationsTable";
import { ApplicationDrawer } from "../components/ApplicationDrawer";
const ApplicationsPage = () => {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(undefined);
  const {
    toast
  } = useToast();
  const {
    data,
    isLoading
  } = useApplications(filters, page, 20);
  const handleExport = () => {
    // Mock CSV export
    const csvContent = ['Company,Role,Status,Applied Date,Match Score,Technologies', ...data.items.map(app => `"${app.company}","${app.roleTitle}","${app.status}","${app.appliedAt || ''}","${app.matchScore || ''}","${app.technologies.join('; ')}"`)].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'applications.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export completed",
      description: `${data.items.length} applications exported to CSV`
    });
  };
  const handleAddApplication = () => {
    setEditingApplication(undefined);
    setDrawerOpen(true);
  };
  const handleEditApplication = application => {
    setEditingApplication(application);
    setDrawerOpen(true);
  };
  const handleDeleteApplication = applicationId => {
    // Mock delete
    toast({
      title: "Application deleted",
      description: "The application has been removed from your list"
    });
  };
  const handleDuplicateApplication = application => {
    setEditingApplication({
      ...application,
      id: '',
      // Clear ID to create new
      company: application.company + ' (Copy)',
      status: 'Draft',
      appliedAt: ''
    });
    setDrawerOpen(true);
  };
  const handleSaveApplication = applicationData => {
    // Mock save
    const isEditing = Boolean(editingApplication?.id);
    toast({
      title: isEditing ? "Application updated" : "Application added",
      description: `${applicationData.company} - ${applicationData.roleTitle} has been ${isEditing ? 'updated' : 'added'}`
    });
    setEditingApplication(undefined);
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <br />
              <br />
              <br />
              <h1 className="text-3xl font-bold text-foreground my-[15px]">Manage Applications</h1>
              <p className="text-muted-foreground mt-2">
                Track your job applications and stay organized throughout your job search
              </p>
            </div>
            <Button onClick={handleAddApplication} className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 flex items-center gap-2 mx-[15px] my-[21px]">
              <Plus className="h-5 w-5" />
              Add Application
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <FiltersBar filters={filters} onFiltersChange={setFilters} onExport={handleExport} totalResults={data.total} />

      {/* Table */}
      <div className="container py-6 mx-0 px-[24px] my-0">
        {isLoading ? <div className="text-center py-12">
            <div className="text-lg">Loading applications...</div>
          </div> : <ApplicationsTable applications={data.items} onEdit={handleEditApplication} onDelete={handleDeleteApplication} onDuplicate={handleDuplicateApplication} />}

        {/* Pagination */}
        {data.total > 20 && <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {Math.ceil(data.total / 20)}
            </span>
            <Button variant="outline" disabled={page >= Math.ceil(data.total / 20)} onClick={() => setPage(page + 1)}>
              Next
            </Button>
          </div>}
      </div>

      {/* Add/Edit Drawer */}
      <ApplicationDrawer application={editingApplication} open={drawerOpen} onOpenChange={setDrawerOpen} onSave={handleSaveApplication} />
    </div>;
};
export default ApplicationsPage;