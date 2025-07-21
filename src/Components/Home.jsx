import AttendanceReport from './HomeComponents/AttendanceReport';
import PayrollSummary from './HomeComponents/PayrollSummary';
import PendingTasks from './HomeComponents/PendingTasks';
import SalaryTrend from './HomeComponents/SalaryTrend';

// Main Home Component
const Home = () => {
  // Sample data for PendingTasks
  const pendingTasksData = [
    {
      id: 1,
      title: "Employee Onboarding",
      count: 5,
      priority: "high",
      dueDate: "Tomorrow"
    },
    {
      id: 2,
      title: "Performance Reviews",
      count: 12,
      priority: "medium",
      dueDate: "This Week"
    },
    {
      id: 3,
      title: "Leave Approvals",
      count: 3,
      priority: "critical",
      dueDate: "Today"
    },
    {
      id: 4,
      title: "Document Verification",
      count: 8,
      priority: "low",
      dueDate: "Next Week"
    }
  ];

  // Sample data for SalaryTrend
  const salaryTrendData = [
    { month: 'Jan', salary: 850000, events: 'New Year Bonus' },
    { month: 'Feb', salary: 820000, events: 'Regular Month' },
    { month: 'Mar', salary: 890000, events: 'Annual Increments' },
    { month: 'Apr', salary: 910000, events: 'Q1 Performance Bonus' },
    { month: 'May', salary: 930000, events: 'Regular Month' },
    { month: 'Jun', salary: 950000, events: 'Mid-Year Adjustments' },
  ];

  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* First Row - Existing Components */}
        <div className="py-2">
          <AttendanceReport />
        </div>
        <div>
          <PayrollSummary />
        </div>
        
        {/* Second Row - New Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalaryTrend data={salaryTrendData} />
          <PendingTasks data={pendingTasksData} />
        </div>
      </div>
    </div>
  );
};

export default Home;