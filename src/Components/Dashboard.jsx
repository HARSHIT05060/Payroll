import React from 'react';
import dayjs from 'dayjs'; // import dayjs for date formatting
import { DashboardProvider } from '../context/DashboardContext';
import AttendanceReport from './HomeComponents/AttendanceReport';
import PayrollSummary from './HomeComponents/PayrollSummary';
import SalaryTrend from './HomeComponents/SalaryTrend';
import PendingTasks from './HomeComponents/PendingTasks';

const MainDashboard = () => (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
        <AttendanceReport />
        <PayrollSummary/>
        <SalaryTrend />
    </div>
);

const Dashboard = () => {
    const user = { user_id: 2 };

    // Get today date and year-month dynamically
    const today = dayjs().format('YYYY-MM-DD');
    const currentYearMonth = dayjs().format('YYYY-MM');

    return (
        <DashboardProvider
            user={user}
            initialDate={today}
            initialYearMonth={currentYearMonth}
        >
            <MainDashboard />
        </DashboardProvider>
    );
};

export default Dashboard;
