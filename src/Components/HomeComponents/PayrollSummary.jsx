import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Users, TrendingUp, DollarSign, Clock, Award, Eye } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDashboardData } from '../../context/DashboardContext';
import dayjs from 'dayjs';

const PayrollSummary = () => {
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [viewType, setViewType] = useState('both'); // 'both', 'chart', 'table'
  const { dashboardData, setYearMonth } = useDashboardData();

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
    const currentYearMonth = dayjs(date).format('YYYY-MM');
    setYearMonth(currentYearMonth);
  };

  return (
    <>
      <div className="max-w-8xl mx-auto">
        {/* Main Container */}
        <div className="bg-[var(--color-bg-secondary)] rounded-3xl shadow-xl border border-[var(--color-border-secondary)] p-8 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-blue)]/5 to-[var(--color-blue-dark)]/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[var(--color-blue)]/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-2xl shadow-lg">
                <TrendingUp className="w-8 h-8 text-[var(--color-text-white)]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">Payroll Overview</h1>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Month Selector */}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[var(--color-text-primary)]" />
                <DatePicker
                  selected={selectedMonth}
                  onChange={handleMonthChange}
                  dateFormat="MM-yyyy"
                  showMonthYearPicker
                  className="month-picker-input"
                  placeholderText="MM-YYYY"
                  maxDate={new Date()}
                />
              </div>

              {/* View Toggle */}
              <div className="flex bg-[var(--color-bg-surface)] border border-[var(--color-border-secondary)] rounded-xl p-1">
                <button
                  onClick={() => setViewType('both')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewType === 'both'
                    ? 'bg-[var(--color-blue)] text-[var(--color-text-white)] shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                    }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setViewType('chart')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewType === 'chart'
                    ? 'bg-[var(--color-blue)] text-[var(--color-text-white)] shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                    }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setViewType('table')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewType === 'table'
                    ? 'bg-[var(--color-blue)] text-[var(--color-text-white)] shadow-md'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]'
                    }`}
                >
                  Table
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative">
            <div className="bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue-lightest)] p-6 rounded-2xl border border-[var(--color-blue)] border-opacity-20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="flex items-center justify-between relative ">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Total Payroll</p>
                  <p className="text-3xl font-bold text-[var(--color-blue)] mb-1">₹{dashboardData?.totals?.total_salary || 0}</p>
                </div>
                <div className="w-14 h-14 bg-[var(--color-blue)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-[var(--color-text-white)]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-success)] border-opacity-20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="flex items-center justify-between relative ">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Overtime</p>
                  <p className="text-3xl font-bold text-[var(--color-success)] mb-1">₹{dashboardData?.totals?.overtime_salary || 0}</p>
                </div>
                <div className="w-14 h-14 bg-[var(--color-success)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-[var(--color-text-white)]" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-warning)] border-opacity-20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full -translate-y-12 translate-x-12"></div>
              <div className="flex items-center justify-between relative ">
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bonuses & Incentives</p>
                  <p className="text-3xl font-bold text-[var(--color-warning)] mb-1">₹{dashboardData?.totals?.week_of_salary || 0}</p>
                </div>
                <div className="w-14 h-14 bg-[var(--color-warning)] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-[var(--color-text-white)]" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className={`relative z-10 ${viewType === 'both' ? 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-stretch' : ''}`}>
            {/* Employee Payroll Table */}
            {(viewType === 'table' || viewType === 'both') && (
              <div className={viewType === 'table' ? 'w-full' : ''}>
                <div className="bg-[var(--color-bg-surface)] rounded-2xl shadow-lg border border-[var(--color-border-secondary)] overflow-hidden h-full flex flex-col">
                  <div className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] p-6 border-b border-[var(--color-border-secondary)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-6 h-6 text-[var(--color-text-white)]" />
                        <h3 className="text-xl font-bold text-[var(--color-text-white)]">Employee Payroll Details</h3>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto flex-1 flex flex-col">
                    <table className="min-w-full flex-1">
                      <thead className="bg-[var(--color-bg-hover)]">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            Employee
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            Base Salary
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            Overtime
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)] align-top">
                        {dashboardData?.payroll_details?.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="text-center py-12 text-[var(--color-text-secondary)]">
                              <div className="flex flex-col items-center gap-3">
                                <Users className="w-12 h-12 text-[var(--color-text-muted)]" />
                                <p>No payroll data available</p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          dashboardData?.payroll_details?.map((employee) => (
                            <tr key={employee.employee_salary_id} className="hover:bg-[var(--color-bg-hover)] transition-colors duration-200">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex  items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue)] flex items-center justify-center text-white font-semibold shadow-md">
                                    {employee.full_name
                                      ? employee.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
                                      : employee.employee_code}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-[var(--color-text-primary)]">{employee.full_name}</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">{employee.department_name}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-[var(--color-text-primary)]">₹{employee.final_salary}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-[var(--color-success)]">₹{employee.overtime_salary}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${employee.payment_status === "2"
                                  ? "bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)] border-opacity-20"
                                  : "bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)] border-opacity-20"
                                  }`}>
                                  {employee.payment_status === "2" ? "Paid" : "Pending"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Section */}
            {(viewType === 'chart' || viewType === 'both') && (
              <div className={viewType === 'chart' ? 'w-full' : ''}>
                <div className="bg-[var(--color-bg-surface)] rounded-2xl shadow-lg border border-[var(--color-border-secondary)] overflow-hidden h-full flex flex-col">
                  <div className="bg-gradient-to-r from-[var(--color-bg-hover)] to-[var(--color-bg-hover)] p-6 border-b border-[var(--color-border-secondary)]">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] flex items-center gap-3">
                      <BarChart className="w-6 h-6 text-[var(--color-text-secondary)]" />
                      Monthly Payroll Breakdown
                    </h3>
                  </div>

                  <div className="p-6 flex-1">
                    {dashboardData?.monthly_chart?.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-[var(--color-text-secondary)]">
                        <BarChart className="w-16 h-16 text-[var(--color-text-muted)] mb-4" />
                        <p className="text-lg font-medium">No chart data available</p>
                        <p className="text-sm">Data will appear here when payroll information is loaded</p>
                      </div>
                    ) : (
                      <div className="h-80">
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
                              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
                              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border-secondary)',
                                borderRadius: '12px',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                                color: 'var(--color-text-primary)'
                              }}
                              formatter={(value, name) => [`₹${value}`, name]}
                            />
                            <Bar
                              dataKey="total_salary"
                              stackId="a"
                              fill="var(--color-blue)"
                              name="Base Salary"
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
                              name="Bonuses"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default PayrollSummary;