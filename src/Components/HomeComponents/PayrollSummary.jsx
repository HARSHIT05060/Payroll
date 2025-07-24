import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDashboardData } from '../../context/DashboardContext';
import dayjs from 'dayjs';

const PayrollSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM')); 
  const { dashboardData, loading, setYearMonth } = useDashboardData();

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    const currentYearMonth = dayjs(date).format('YYYY-MM');
    setYearMonth(currentYearMonth);
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl border border-[var(--color-border-secondary)] p-6 mb-8 hover:shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-lg">
            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Payroll Overview</h2>
        </div>

        <div className="flex gap-2 bg-[var(--color-bg-hover)] p-1 rounded-lg border border-[var(--color-border-secondary)] items-center">
          <Calendar className="w-5 h-5 mx-2 text-[var(--color-text-white)]" />
          <DatePicker
            selected={selectedMonth}
            onChange={handleMonthChange}
            dateFormat="MM-yyyy"
            showMonthYearPicker
            placeholderText="MM-YYYY"
            className="w-full bg-[var(--color-bg-secondary-20)] border border-[var(--color-bg-secondary-30)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-white)] placeholder-[var(--color-text-white-90)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-secondary-30)]"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue-lightest)] p-6 rounded-xl border border-[var(--color-blue)] border-opacity-20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Total Payroll</p>
              <p className="text-2xl font-bold text-[var(--color-blue)]">₹{dashboardData?.totals?.total_salary || 0}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-blue)] rounded-full flex items-center justify-center shadow-lg">
              {/* ...icon... */}
              <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--color-success-light)] to-[var(--color-success-light)] p-6 rounded-xl border border-[var(--color-success)] border-opacity-20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Overtime</p>
              <p className="text-2xl font-bold text-[var(--color-success)]">₹{dashboardData?.totals?.overtime_salary || 0}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-success)] rounded-full flex items-center justify-center shadow-lg">
              {/* ...icon... */}
              <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[var(--color-warning-light)] to-[var(--color-warning-light)] p-6 rounded-xl border border-[var(--color-warning)] border-opacity-20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bonuses & Incentives</p>
              <p className="text-2xl font-bold text-[var(--color-warning)]">₹{dashboardData?.totals?.week_of_salary || 0}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-warning)] rounded-full flex items-center justify-center shadow-lg">
              {/* ...icon... */}
              <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Employee Payroll Table */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Employee Payroll Details</h3>
          </div>

          <div className="overflow-hidden border border-[var(--color-border-secondary)] rounded-xl shadow-sm">
            <table className="min-w-full">
              <thead className="bg-[var(--color-bg-hover)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                {dashboardData?.payroll_details?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-[var(--color-text-secondary)]">No payroll data available.</td>
                  </tr>
                )}
                {dashboardData?.payroll_details?.map((employee) => (
                  <tr key={employee.employee_salary_id} className="hover:bg-[var(--color-bg-hover)] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue)] flex items-center justify-center text-lg shadow-md">
                            {/* Show initials */}
                            {employee.full_name
                              ? employee.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                              : employee.employee_code}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {employee.full_name}
                          </div>
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            {employee.department_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                      ₹{employee.final_salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                      ₹{employee.overtime_salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                        employee.payment_status === "2"
                          ? "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)] border-opacity-20"
                          : "bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)] border-opacity-20"
                      }`}>
                        {employee.payment_status === "2" ? "paid" : "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart Section */}
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-6">Monthly Payroll Breakdown</h3>
          <div className="h-80 border border-[var(--color-border-secondary)] rounded-xl p-4 bg-[var(--color-bg-secondary)] shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dashboardData?.monthly_chart || []}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-divider)" opacity={0.3} />
                <XAxis
                  dataKey="month_name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    color: 'var(--color-text-primary)'
                  }}
                  formatter={(value, name) => [`₹${value}`, name]}
                />
                <Bar
                  dataKey="total_salary"
                  stackId="a"
                  fill="var(--color-blue)"
                  name="Monthly Payroll"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="overtime_salary"
                  stackId="a"
                  fill="var(--color-success)"
                  name="Overtime"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="week_of_salary"
                  stackId="a"
                  fill="var(--color-warning)"
                  name="Bonuses & Incentives"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;
