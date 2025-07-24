import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const   PayrollSummary = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  // Sample payroll data with Indian rupee values
  const payrollData = [
    {
      month: 'Jan',
      monthlyPayroll: 1250,
      overtime: 420,
      bonuses: 210
    },
    {
      month: 'Feb',
      monthlyPayroll: 1170,
      overtime: 330,
      bonuses: 170
    },
    {
      month: 'Mar',
      monthlyPayroll: 1840,
      overtime: 670,
      bonuses: 290
    },
    {
      month: 'Apr',
      monthlyPayroll: 1500,
      overtime: 500,
      bonuses: 250
    },
    {
      month: 'May',
      monthlyPayroll: 1340,
      overtime: 460,
      bonuses: 230
    },
    {
      month: 'Jun',
      monthlyPayroll: 2000,
      overtime: 750,
      bonuses: 330
    },
    {
      month: 'Jul',
      monthlyPayroll: 2090,
      overtime: 790,
      bonuses: 350
    },
    {
      month: 'Aug',
      monthlyPayroll: 1590,
      overtime: 540,
      bonuses: 270
    },
    {
      month: 'Sep',
      monthlyPayroll: 1500,
      overtime: 500,
      bonuses: 250
    }
  ];

  // Sample employee payroll data with rupee values
  const employeePayrollData = [
    {
      id: 1,
      name: 'Rhaenyra Targaryen',
      email: 'rhaenyra@stella.com',
      position: 'Product Designer',
      salary: '₹1,04,500',
      overtime: '12hrs',
      bonus: '₹16,700',
      total: '₹1,21,200',
      status: 'Paid',
      avatar: '👩🏼‍💼'
    },
    {
      id: 2,
      name: 'Daemon Targaryen',
      email: 'daemon@stella.com',
      position: 'Finance Manager',
      salary: '₹96,200',
      overtime: '2hrs',
      bonus: '₹12,500',
      total: '₹1,08,700',
      status: 'Pending',
      avatar: '👨🏼‍💼'
    },
    {
      id: 3,
      name: 'Jon Snow',
      email: 'jon@stella.com',
      position: 'Graphic Designer',
      salary: '₹83,600',
      overtime: '-',
      bonus: '₹8,350',
      total: '₹91,950',
      status: 'Paid',
      avatar: '👨🏻‍💼'
    },
    {
      id: 4,
      name: 'Aegon Targaryen',
      email: 'aegon@stella.com',
      position: 'Lead Product Designer',
      salary: '₹1,25,500',
      overtime: '10hrs',
      bonus: '₹20,900',
      total: '₹1,46,400',
      status: 'Paid',
      avatar: '👨🏼‍💼'
    },
    {
      id: 5,
      name: 'Alicent Hightower',
      email: 'alicent@stella.com',
      position: 'Project Manager',
      salary: '₹1,10,800',
      overtime: '8hrs',
      bonus: '₹14,650',
      total: '₹1,25,450',
      status: 'Paid',
      avatar: '👩🏼‍💼'
    }
  ];

  // Calculate totals
  const totalPayroll = payrollData.reduce((sum, item) => sum + item.monthlyPayroll, 0);
  const totalOvertime = payrollData.reduce((sum, item) => sum + item.overtime, 0);
  const totalBonuses = payrollData.reduce((sum, item) => sum + item.bonuses, 0);

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

        <div className="flex gap-2 bg-[var(--color-bg-hover)] p-1 rounded-lg border border-[var(--color-border-secondary)]">
          {['Day', 'Week', 'Month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 text-sm rounded-md font-medium transition-all duration-200 ${selectedPeriod === period
                  ? 'bg-[var(--color-blue)] text-[var(--color-text-white)] shadow-md'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue-lightest)] p-6 rounded-xl border border-[var(--color-blue)] border-opacity-20 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Total Payroll</p>
              <p className="text-2xl font-bold text-[var(--color-blue)]">₹{(totalPayroll * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-blue)] rounded-full flex items-center justify-center shadow-lg">
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
              <p className="text-2xl font-bold text-[var(--color-success)]">₹{(totalOvertime * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-success)] rounded-full flex items-center justify-center shadow-lg">
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
              <p className="text-2xl font-bold text-[var(--color-warning)]">₹{(totalBonuses * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-12 h-12 bg-[var(--color-warning)] rounded-full flex items-center justify-center shadow-lg">
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
            <div className="flex gap-2">
              <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-secondary)] rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-secondary)] rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
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
                {employeePayrollData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-[var(--color-bg-hover)] transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue)] flex items-center justify-center text-lg shadow-md">
                            {employee.avatar}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {employee.name}
                          </div>
                          <div className="text-sm text-[var(--color-text-secondary)]">
                            {employee.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                      {employee.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                      {employee.overtime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${employee.status === 'Paid'
                          ? 'bg-[var(--color-success-light)] text-[var(--color-success)] border border-[var(--color-success)] border-opacity-20'
                          : 'bg-[var(--color-warning-light)] text-[var(--color-warning)] border border-[var(--color-warning)] border-opacity-20'
                        }`}>
                        {employee.status}
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
                data={payrollData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-divider)" opacity={0.3} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    color: 'var(--color-text-primary)'
                  }}
                  formatter={(value, name) => [`₹${value}k`, name]}
                />
                <Bar
                  dataKey="monthlyPayroll"
                  stackId="a"
                  fill="var(--color-blue)"
                  name="Monthly Payroll"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="overtime"
                  stackId="a"
                  fill="var(--color-success)"
                  name="Overtime"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="bonuses"
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
