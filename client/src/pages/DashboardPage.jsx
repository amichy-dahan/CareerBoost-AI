import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-16"> {/* Account for fixed navigation */}
        <Dashboard />
      </div>
    </div>
  );
};

export default DashboardPage;