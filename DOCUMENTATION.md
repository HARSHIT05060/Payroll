# Attendance Frontend Documentation

## 1. Project Overview
This is a React-based frontend for an Attendance Management System. It provides interfaces for employee management, attendance tracking, payroll, reporting, and more, with role-based access and subscription management.

## 2. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd FRONTEND
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as specified in the terminal).

## 3. Project Structure
```
FRONTEND/
├── public/                # Static assets
├── src/
│   ├── api/               # Axios instances and API calls
│   ├── Components/        # Reusable and feature components
│   ├── context/           # React Contexts (Auth, Theme)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page-level components (by feature)
│   ├── redux/             # Redux slices and store
│   ├── style/             # Custom styles
│   ├── utils/             # Utility functions (including export utilities)
│   └── assets/            # Images and other assets
├── package.json           # Project metadata and scripts
├── vite.config.js         # Vite configuration
└── ...
```

## 4. Scripts & Usage
- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint codebase

## 5. Key Features
- Employee, Department, Branch, and Designation management
- Attendance tracking and reporting
- Payroll management
- Leave and loan management
- Role-based access control
- Subscription management and warnings
- Export reports to Excel/PDF

## 6. Authentication & Authorization
- **AuthContext** (`src/context/AuthContext.jsx`): Manages user authentication state.
- **ProtectedRoute** (`src/Components/ProtectedRoute.jsx`): Restricts access to authenticated users.
- **permissionsSlice** (`src/redux/permissionsSlice.js`): Handles user permissions and roles.

## 7. State Management
- **Redux** is used for global state (see `src/redux/store.js`).
- **React Context** for auth and theme.

## 8. API Integration
- **Axios** instance in `src/api/axiosInstance.js`.
- API calls organized by feature (e.g., `src/api/user.js`).

## 9. Custom Hooks
- `useBranches.js`, `useDepartments.js`, `useDesignations.js`, `useUserId.js` in `src/hooks/` for data fetching and logic reuse.

## 10. Component Overview
- **Components/**: Shared UI and feature components (e.g., Navbar, Sidebar, Toast, ConfirmDialog).
- **Pages/**: Route-level components for each feature (e.g., Employee, Payroll, Report, ShiftManagement).
- **Subscription/**: Handles subscription status and warnings.

## 11. Styling
- **Tailwind CSS** (see `tailwind.config.js` and `postcss.config.js`).
- Custom styles in `src/style/` and `src/App.css`.

## 12. Export Utilities
- Located in `src/utils/exportUtils/`.
- Export reports (Daily, Date Range, Employee Directory, Monthly, Salary) to Excel and PDF.

## 13. Deployment
- Build the app: `npm run build`
- Deploy the `dist/` folder to your preferred static hosting (e.g., Vercel, Netlify).
- Vercel configuration in `vercel.json`.

## 14. Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and submit a pull request

## 15. License
Specify your license here (e.g., MIT, Apache 2.0, etc.)

## 16. Contact
For questions or support, contact the project maintainer or open an issue in the repository.
