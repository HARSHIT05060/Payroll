import AttendanceReport from './HomeComponents/AttendanceReport';
import PayrollSummary from './HomeComponents/PayrollSummary';

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto py-2">
        <AttendanceReport />
      </div>
      <div className="max-w-7xl mx-auto">
        <PayrollSummary />
      </div>
    </div>
  );
};

export default Home;