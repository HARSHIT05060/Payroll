# Attendance Management System - Frontend

## Project Summary

The Attendance Management System is a comprehensive web application designed to streamline employee attendance tracking, payroll management, leave applications, and reporting for organizations. This frontend application provides an intuitive user interface for managing all aspects of employee attendance and related administrative tasks. The system features role-based access control, real-time attendance tracking, automated payroll calculations, comprehensive reporting, and a modern responsive design.

## Tech Stack

### Frontend Technologies
- **React 19.0.0** - Modern JavaScript library for building user interfaces
- **Vite 6.3.1** - Fast build tool and development server
- **React Router DOM 7.6.0** - Client-side routing
- **Redux Toolkit 2.8.2** - State management
- **React Redux 9.2.0** - React bindings for Redux

### UI/UX Libraries
- **Material-UI (MUI) 7.1.0** - React component library
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React 0.508.0** - Beautiful icons
- **React Icons 5.5.0** - Icon library
- **React Hot Toast 2.5.2** - Toast notifications

### Data Visualization & Charts
- **Recharts 3.1.0** - Composable charting library
- **React Big Calendar 1.18.0** - Calendar component

### Date & Time Management
- **Day.js 1.11.13** - Modern date utility library
- **Moment.js 2.30.1** - Date manipulation library
- **Date-fns 4.1.0** - Date utility library
- **React Datepicker 8.4.0** - Date picker component
- **MUI X Date Pickers 8.2.0** - Advanced date pickers

### Export & File Handling
- **ExcelJS 4.4.0** - Excel file generation
- **XLSX 0.18.5** - Excel file manipulation
- **jsPDF 2.5.1** - PDF generation
- **jsPDF AutoTable 3.5.28** - PDF table generation
- **File Saver 2.0.5** - File download utility

### HTTP Client & Security
- **Axios 1.9.0** - HTTP client
- **Crypto-js 4.2.0** - Cryptographic library

### Development Tools
- **ESLint 9.22.0** - Code linting
- **PostCSS 8.5.3** - CSS processing
- **Autoprefixer 10.4.21** - CSS vendor prefixing

## Working Flow

### 1. Authentication Flow
```
User Login → Basic Auth Validation → JWT Token Generation → Role-based Access Control → Dashboard Access
```

### 2. Attendance Management Flow
```
Employee Check-in/Check-out → Real-time Data Capture → Attendance Validation → Database Storage → Report Generation
```

### 3. Payroll Processing Flow
```
Attendance Data Collection → Salary Calculation → Deductions/Allowances → Payroll Generation → Export Options
```

### 4. Leave Management Flow
```
Leave Application → Manager Approval → Status Update → Attendance Adjustment → Notification System
```

### 5. Reporting Flow
```
Data Aggregation → Filter Application → Report Generation → Export (PDF/Excel) → Distribution
```

## Installation Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd FRONTEND
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=Attendance Management System
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Step 5: Build for Production
```bash
npm run build
# or
yarn build
```

### Step 6: Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## API Documentation

### Authentication Endpoints

#### Login
- **Method:** POST
- **Path:** `/auth/login`
- **Parameters:** 
  - `username` (string): User credentials
  - `password` (string): User password
- **Response:** JWT token and user permissions
- **Purpose:** Authenticate user and establish session

### Employee Management Endpoints

#### Get Employees
- **Method:** GET
- **Path:** `/employees`
- **Parameters:** 
  - `page` (number): Page number
  - `limit` (number): Items per page
  - `search` (string): Search query
- **Response:** Employee list with pagination
- **Purpose:** Retrieve employee directory

#### Create Employee
- **Method:** POST
- **Path:** `/employees`
- **Parameters:** Employee data object
- **Response:** Created employee details
- **Purpose:** Add new employee to system

#### Update Employee
- **Method:** PUT
- **Path:** `/employees/:id`
- **Parameters:** Employee data object
- **Response:** Updated employee details
- **Purpose:** Modify existing employee information

### Attendance Endpoints

#### Get Attendance
- **Method:** GET
- **Path:** `/attendance`
- **Parameters:** 
  - `date` (string): Date filter
  - `employee_id` (number): Employee filter
- **Response:** Attendance records
- **Purpose:** Retrieve attendance data

#### Mark Attendance
- **Method:** POST
- **Path:** `/attendance/check-in`
- **Parameters:** 
  - `employee_id` (number): Employee ID
  - `timestamp` (string): Check-in time
- **Response:** Attendance confirmation
- **Purpose:** Record employee check-in

### Payroll Endpoints

#### Generate Payroll
- **Method:** POST
- **Path:** `/payroll/generate`
- **Parameters:** 
  - `month` (number): Month
  - `year` (number): Year
- **Response:** Payroll data
- **Purpose:** Calculate monthly payroll

#### Get Payroll Report
- **Method:** GET
- **Path:** `/payroll/report`
- **Parameters:** 
  - `month` (number): Month
  - `year` (number): Year
- **Response:** Payroll report
- **Purpose:** Retrieve payroll information

### Leave Management Endpoints

#### Apply Leave
- **Method:** POST
- **Path:** `/leave/apply`
- **Parameters:** Leave application data
- **Response:** Application confirmation
- **Purpose:** Submit leave request

#### Get Leave Status
- **Method:** GET
- **Path:** `/leave/status`
- **Parameters:** 
  - `employee_id` (number): Employee ID
- **Response:** Leave status list
- **Purpose:** Check leave applications

## Folder Structure

```
FRONTEND/
├── public/                     # Static assets
│   ├── login.png              # Login page image
│   └── vite.svg               # Vite logo
├── src/                       # Source code
│   ├── api/                   # API configuration and services
│   │   ├── axiosInstance.js   # Axios configuration with auth
│   │   └── user.js            # User-related API calls
│   ├── Components/            # Reusable UI components
│   │   ├── Branches/          # Branch management components
│   │   ├── Department/        # Department management components
│   │   ├── Designation/       # Designation management components
│   │   ├── HomeComponents/    # Dashboard components
│   │   ├── Subscription/      # Subscription management
│   │   └── ui/                # Common UI components
│   ├── context/               # React context providers
│   │   ├── AuthContext.jsx    # Authentication context
│   │   ├── DashboardContext.jsx # Dashboard data context
│   │   └── Themecontext.jsx   # Theme management
│   ├── hooks/                 # Custom React hooks
│   │   ├── useBranches.js     # Branch data hook
│   │   ├── useDepartments.js  # Department data hook
│   │   └── useDesignations.js # Designation data hook
│   ├── pages/                 # Page components
│   │   ├── Configuration/     # System configuration
│   │   ├── Employee/          # Employee management
│   │   ├── Leave/             # Leave management
│   │   ├── Loan/              # Loan management
│   │   ├── Payroll/           # Payroll processing
│   │   ├── Report/            # Reporting system
│   │   ├── ShiftManagement/   # Shift management
│   │   └── Users/             # User management
│   ├── redux/                 # Redux store configuration
│   │   ├── permissionsSlice.js # Permissions state management
│   │   ├── sessionStorageUtils.js # Session storage utilities
│   │   └── store.js           # Redux store setup
│   ├── utils/                 # Utility functions
│   │   └── exportUtils/       # Export functionality
│   │       ├── DailyReport/   # Daily report exports
│   │       ├── DateRangeReport/ # Date range report exports
│   │       ├── EmployeeReport/ # Employee report exports
│   │       ├── MonthlyReport/ # Monthly report exports
│   │       └── salary/        # Salary report exports
│   ├── App.jsx                # Main application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── package.json               # Project dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## Features

### 🔐 Authentication & Authorization
- **Secure Login System** - Basic authentication with role-based access control
- **Permission Management** - Granular permissions for different user roles
- **Session Management** - Secure session handling with JWT tokens
- **Unauthorized Access Protection** - Route protection based on user permissions

### 👥 Employee Management
- **Employee Directory** - Complete employee information management
- **Department Management** - Organize employees by departments
- **Branch Management** - Multi-branch organization support
- **Designation Management** - Job title and role management
- **Employee Profiles** - Detailed employee information and history

### ⏰ Attendance Tracking
- **Real-time Check-in/Check-out** - Live attendance recording
- **Attendance Reports** - Daily, weekly, and monthly attendance summaries
- **Attendance Validation** - Automated attendance verification
- **Shift Management** - Flexible shift scheduling and assignment

### 📊 Payroll Management
- **Automated Payroll Calculation** - Automatic salary computation
- **Deductions & Allowances** - Flexible deduction and allowance system
- **Payroll Reports** - Comprehensive payroll documentation
- **Export Functionality** - PDF and Excel export options

### 🏖️ Leave Management
- **Leave Applications** - Digital leave request system
- **Approval Workflow** - Manager approval process
- **Leave Status Tracking** - Real-time leave application status
- **Leave Balance Management** - Automatic leave balance calculation

### 💰 Loan & Advance Management
- **Loan Applications** - Employee loan request system
- **Advance Payment** - Salary advance management
- **Repayment Tracking** - Loan repayment monitoring
- **Loan History** - Complete loan transaction history

### 📈 Reporting & Analytics
- **Daily Reports** - Daily attendance and activity reports
- **Monthly Reports** - Monthly summary reports
- **Date Range Reports** - Custom date range reporting
- **Employee Directory Reports** - Employee information exports
- **Salary Reports** - Comprehensive salary analysis
- **Export Options** - PDF and Excel export capabilities

### ⚙️ System Configuration
- **Time Configuration** - System time and schedule settings
- **User Management** - Admin user creation and management
- **Role Management** - Custom role creation and assignment
- **Subscription Management** - Subscription status and warnings

### 🎨 User Interface
- **Responsive Design** - Mobile-friendly interface
- **Dark/Light Theme** - Theme switching capability
- **Modern UI/UX** - Material-UI and Tailwind CSS integration
- **Interactive Dashboard** - Real-time data visualization
- **Toast Notifications** - User feedback and alerts

### 📱 Additional Features
- **Data Export** - Multiple format export options
- **Search & Filter** - Advanced search and filtering capabilities
- **Pagination** - Efficient data pagination
- **Real-time Updates** - Live data synchronization
- **Error Handling** - Comprehensive error management

## Screenshots

*[Screenshots will be added here to showcase the application interface]*

### Dashboard Overview
- Main dashboard with attendance summary
- Payroll overview and trends
- Pending tasks and notifications

### Employee Management
- Employee directory with search and filter
- Employee detail pages
- Department and branch management

### Attendance Tracking
- Daily attendance view
- Check-in/check-out interface
- Attendance reports and analytics

### Payroll Processing
- Monthly payroll generation
- Salary calculation interface
- Payroll reports and exports

## Contributors

### Development Team
- **Frontend Developer** - React.js, Material-UI, Redux
- **UI/UX Designer** - User interface design and experience
- **Backend Integration** - API integration and data management
- **Testing & Quality Assurance** - Application testing and bug fixes

### Responsibilities
- **Frontend Development** - React components and state management
- **API Integration** - Backend service integration
- **UI/UX Design** - User interface and experience design
- **Testing** - Unit testing and integration testing
- **Documentation** - Code documentation and user guides

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Contact Information

### Development Team
- **Email:** [team-email@company.com]
- **Project Repository:** [GitHub Repository URL]
- **Issue Tracker:** [GitHub Issues URL]

### Support
For technical support or feature requests, please contact:
- **Technical Support:** [support@company.com]
- **Feature Requests:** [features@company.com]

---

**Note:** This is the frontend application for the Attendance Management System. For backend API documentation and setup instructions, please refer to the backend repository documentation.

 
