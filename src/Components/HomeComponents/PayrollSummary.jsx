import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const PayrollSummary = () => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Payroll Overview</h2>
        </div>
        
        <div className="flex gap-2">
          {['Day', 'Week', 'Month'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Payroll</p>
              <p className="text-2xl font-bold text-blue-600">₹{(totalPayroll * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overtime</p>
              <p className="text-2xl font-bold text-green-600">₹{(totalOvertime * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Bonuses & Incentives</p>
              <p className="text-2xl font-bold text-purple-600">₹{(totalBonuses * 1000).toLocaleString('en-IN')}</p>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Table and Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Payroll Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-semibold text-gray-800">Employee Payroll Details</h3>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 border rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 border rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overtime
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employeePayrollData.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                            {employee.avatar}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {employee.position}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.salary}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {employee.overtime}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
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
          <h3 className="text-md font-semibold text-gray-800 mb-4">Monthly Payroll Breakdown</h3>
          <div className="h-80 border border-gray-200 rounded-lg p-4">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value}k`}
                />
                <Bar 
                  dataKey="monthlyPayroll" 
                  stackId="a" 
                  fill="#3B82F6" 
                  name="Monthly Payroll"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="overtime" 
                  stackId="a" 
                  fill="#93C5FD" 
                  name="Overtime"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="bonuses" 
                  stackId="a" 
                  fill="#DBEAFE" 
                  name="Bonuses & Incentives"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-gray-600">Monthly Payroll</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-300 rounded"></div>
              <span className="text-xs text-gray-600">Overtime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-100 rounded"></div>
              <span className="text-xs text-gray-600">Bonuses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;