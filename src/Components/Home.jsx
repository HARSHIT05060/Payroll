import React, { useState } from 'react';
import AttendanceReport from './HomeComponents/AttendanceReport';
import PayrollSummary from './HomeComponents/PayrollSummary';
import PendingTasks from './HomeComponents/PendingTasks';
import SalaryTrend from './HomeComponents/SalaryTrend';
import { DashboardProvider } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';

const HomeContent = () => {
  // Static sample data (keep/remove as needed)
  const pendingTasksData = [
    { id: 1, title: "Employee Onboarding", count: 5, priority: "high", dueDate: "Tomorrow" },
    { id: 2, title: "Performance Reviews", count: 12, priority: "medium", dueDate: "This Week" },
    { id: 3, title: "Leave Approvals", count: 3, priority: "critical", dueDate: "Today" },
    { id: 4, title: "Document Verification", count: 8, priority: "low", dueDate: "Next Week" },
  ];



  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* First Row */}
        <div className="py-2">
          <AttendanceReport />
        </div>
        <div>
          <PayrollSummary />
        </div>

        {/* Second Row */}
        <div >
          <SalaryTrend  />
          {/* <PendingTasks data={pendingTasksData} /> */}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user } = useAuth();

  const [selectedDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  return (
    <DashboardProvider user={user} date={selectedDate}>
      <HomeContent />
    </DashboardProvider>
  );
};

export default Home;
