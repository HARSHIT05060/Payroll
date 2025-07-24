// SalaryTrend.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useDashboardData } from '../../context/DashboardContext';

const SalaryTrend = () => {
  const { dashboardData, loading } = useDashboardData();
  // API: dashboardData.monthly_chart, keys: month_name, total_salary (string)

  // Prepare chart data: convert salary to number
  const data = (dashboardData?.monthly_chart || []).map((d) => ({
    ...d,
    total_salary: Number(d.total_salary || 0),
  }));

  // Calculate stats
  const getStats = () => {
    if (!data || data.length === 0) {
      return { highest: 0, average: 0, growth: 0 };
    }
    const salaries = data.map(d => d.total_salary);
    const highest = Math.max(...salaries);
    const average = salaries.length > 0 ? Math.round(salaries.reduce((acc, s) => acc + s, 0) / salaries.length) : 0;
    const first = salaries.find(s => s > 0) || 0;
    const last = salaries.slice().reverse().find(s => s > 0) || 0;
    const growth = first > 0
      ? (((last - first) / first) * 100)
      : 0;
    return { highest, average, growth };
  };

  const { highest, average, growth } = getStats();

  return (
    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl border border-[var(--color-border-secondary)] p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-lg">
            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
            Monthly Salary Trend
          </h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-hover)] px-3 py-2 rounded-full border border-[var(--color-border-secondary)]">
          <div className="w-3 h-3 bg-[var(--color-blue)] rounded-full shadow-sm"></div>
          <span className="font-medium">Average Salary</span>
        </div>
      </div>

      {data && data.length > 0 && data.some(d => d.total_salary > 0) ? (
        <>
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-divider)" opacity={0.3} />
                <XAxis
                  dataKey="month_name"
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--color-text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={value => `₹${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={value => [`₹${(value / 1000).toFixed(1)}K`, 'Total Salary']}
                  labelFormatter={label => label}
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border-secondary)',
                    borderRadius: '12px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    color: 'var(--color-text-primary)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="total_salary"
                  stroke="var(--color-blue)"
                  strokeWidth={4}
                  dot={{ r: 6, fill: 'var(--color-blue)', strokeWidth: 3, stroke: 'var(--color-bg-secondary)' }}
                  activeDot={{
                    r: 8,
                    fill: 'var(--color-blue-dark)',
                    strokeWidth: 4,
                    stroke: 'var(--color-bg-secondary)',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--color-border-divider)]">
            <div className="text-center p-4 bg-gradient-to-br from-[var(--color-success-light)] to-[var(--color-success-light)] rounded-xl border border-[var(--color-success)] border-opacity-20 hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Highest</p>
              <p className="text-xl font-bold text-[var(--color-success)]">
                ₹{highest.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-blue-lightest)] rounded-xl border border-[var(--color-blue)] border-opacity-20 hover:shadow-lg transition-all duration-200">
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Average</p>
              <p className="text-xl font-bold text-[var(--color-blue)]">
                ₹{average.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-[var(--color-warning-light)] to-[var(--color-warning-light)] rounded-xl border border-opacity-20 hover:shadow-lg transition-all duration-200"
              style={{
                borderColor: growth >= 0 ? 'var(--color-success)' : 'var(--color-error)',
                backgroundColor: growth >= 0 ? 'var(--color-success-light)' : 'var(--color-error-light)'
              }}>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">Growth</p>
              <p className="text-xl font-bold"
                style={{ color: growth >= 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
              </p>
            </div>
          </div>
        </>
      ) : (
        // Empty state
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-bg-gray-light)] to-[var(--color-bg-hover)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-[var(--color-text-secondary)] font-semibold text-lg mb-2">No salary data available</p>
          <p className="text-sm text-[var(--color-text-muted)]">Data will appear here once salary trends are recorded</p>
        </div>
      )}
    </div>
  );
};

export default SalaryTrend;
