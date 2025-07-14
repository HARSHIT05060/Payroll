import AttendanceReport from './HomeComponents/AttendanceReport';

// Main Home Component
const Home = () => {
  return (
    <div className="min-h-screen p-6 bg-[var(--color-bg-primary)]">
      <div className="max-w-7xl mx-auto">
        {/* Attendance Report */}
        <div className="">
          <AttendanceReport />
        </div>
      </div>
    </div>
  );
};

export default Home;