import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  UserCheck,ArrowLeft ,
  Calendar
} from 'lucide-react';


// Import the separate components
import StatCard from './HomeComponents/StatCard';
import AttendanceReport from './HomeComponents/AttendanceReport';
import { useNavigate } from 'react-router-dom';

// Main Home Component
const Home = () => {
  const [statsLoading, setStatsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    onVacation: 0
  });
  const navigate = useNavigate();
  // Simulate fetching dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setDashboardStats({
        totalEmployees: 1234,
        presentToday: 945,
        absentToday: 67,
        onVacation: 45
      });
      setStatsLoading(false);
    };

    fetchStats();
  }, []);

  const handleStatCardClick = (type) => {
    console.log(`Clicked ${type} stat card`);
    // Navigate to respective detailed view
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        '--color-bg-primary': '#f8fafc',
        '--color-bg-secondary': '#ffffff',
        '--color-border-primary': '#e2e8f0',
        '--color-text-primary': '#1e293b',
        '--color-text-secondary': '#64748b',
        '--color-text-muted': '#94a3b8',
        '--color-blue-dark': '#1e40af',
        '--color-blue-lighter': '#dbeafe',
        '--color-blue-lightest': '#f0f9ff'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                  <ArrowLeft size={18} />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      Dashboard
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={dashboardStats.totalEmployees.toLocaleString()}
            color="var(--color-blue-lighter)"
            icon={Users}
            trend={5}
            loading={statsLoading}
            onClick={() => handleStatCardClick('employees')}
            expandable
          />
          <StatCard
            title="Present Today"
            value={dashboardStats.presentToday.toLocaleString()}
            icon={UserCheck}
            color="#dcfce7"
            trend={2}
            loading={statsLoading}
            onClick={() => handleStatCardClick('present')}
            expandable
          />
          <StatCard
            title="Absent Today"
            value={dashboardStats.absentToday.toLocaleString()}
            icon={Clock}
            color="#fee2e2"
            trend={-1}
            loading={statsLoading}
            onClick={() => handleStatCardClick('absent')}
            expandable
          />
          <StatCard
            title="On Vacation"
            value={dashboardStats.onVacation.toLocaleString()}
            icon={Calendar}
            color="#fef3c7"
            trend={0}
            loading={statsLoading}
            onClick={() => handleStatCardClick('vacation')}
            expandable
          />
        </div>

        {/* Attendance Report */}
        <div className="mt-8">
          <AttendanceReport />
        </div>
      </div>
    </div>
  );
};

export default Home;