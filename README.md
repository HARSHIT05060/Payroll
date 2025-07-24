# Pharma 24/7
 
Pharma 24/7 is a comprehensive pharmacy management platform designed for seamless inventory, sales, purchase, and reporting operations. Built with modern web technologies, it supports multi-user roles, real-time stock management, and regulatory compliance, making it ideal for pharmacies of all sizes.
 
---
 
## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Main Modules](#main-modules)
- [Technology Stack](#technology-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Environment & Configuration](#environment--configuration)
- [Key Features](#key-features)
- [Contributing](#contributing)
- [Contact](#contact)
 
---
 
## Project Overview
Pharma 24/7 streamlines pharmacy operations by integrating inventory, sales, purchase, and reporting into a single, user-friendly platform. It supports role-based access, e-prescriptions, real-time analytics, and is optimized for both single and chain pharmacies.
 
---
 
## Architecture
- **Frontend:** React.js (with Tailwind CSS & MUI for UI)
- **Backend:** Laravel (PHP) [external, not in this repo]
- **Database:** MySQL / PostgreSQL
- **Authentication:** JWT-based
- **Hosting:** Vercel, AWS, or DigitalOcean
 
The frontend communicates with the backend via RESTful APIs. Authentication tokens are stored in localStorage and attached to all API requests.
 
---
 
## Main Modules
- **Authentication:** Signup, login, OTP, password reset, and role-based access (Owner/Admin, Staff)
- **Dashboard:** Real-time overview of sales, purchases, inventory, and key metrics
- **Inventory Management:** Add/edit/delete items, stock tracking, reorder alerts, barcode support
- **Purchase Management:** Supplier management, purchase bills, returns, and payment tracking
- **Sales Management:** Customer management, sales bills, returns, and prescription handling
- **Order Processing:** Online/offline order management, status tracking, notifications
- **Reports & Analytics:** GST, margin, stock, accounting, and intelligent sales reports (PDF/Excel/CSV export)
- **Profile & Settings:** User profile, password, pharmacy settings, notification preferences
- **Role & Permission Management:** Staff roles, permissions, and activity logs
 
---
 
## Technology Stack
| Layer         | Technology                |
|--------------|---------------------------|
| Frontend     | React.js, Tailwind CSS, MUI|
| Backend      | Laravel (PHP)             |
| Database     | MySQL / PostgreSQL        |
| Auth         | JWT                       |
| Hosting      | Vercel, AWS, DigitalOcean |
 
---
 
## Folder Structure
```
Pharma247/
├── public/                # Static assets (images, icons, sample data)
├── src/
│   ├── App.js             # Main app entry, routing
│   ├── componets/         # Reusable UI components (buttons, loaders, popups, auth, permissions)
│   ├── dashboard/         # Main business modules (Inventory, Sales, Purchase, Reports, etc.)
│   ├── OnlineOrders/      # Online order management
│   ├── protected/         # Route protection (Admin, Auth)
│   ├── assets/            # App-specific images
│   ├── theme.js           # MUI/Tailwind theme customization
│   └── index.js           # React entry point
├── package.json           # Project dependencies & scripts
├── tailwind.config.js     # Tailwind CSS config
└── README.md              # Project documentation
```
 
---
 
## Installation & Setup
 
### Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Code editor (e.g., VSCode)
 
### Steps
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yogeshShopno/Pharma24-7.git
   cd Pharma24-7
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000) by default.
 
> **Note:** The frontend expects the backend API to be available at `https://testadmin.pharma247.in/api` (see `src/index.js`).
 
---
 
## Environment & Configuration
- **API Endpoint:** Set in `src/index.js` via `axios.defaults.baseURL`.
- **Authentication:** JWT token is stored in `localStorage` and attached to all requests.
- **Environment Variables:** (If needed, create a `.env` file for custom configs.)
 
---
 
## Key Features
- **User Authentication & Role-Based Access**
- **Inventory & Stock Management**
- **Sales & Billing System**
- **Purchase & Supplier Management**
- **Order & Prescription Handling**
- **Reports & Analytics Dashboard**
- **Customer & Vendor Management**
- **Barcode Scanning for Quick Billing**
- **Multi-User & Multi-Store Support**
- **Real-Time Stock Alerts**
- **Accounting Integration**
- **E-Prescription Support**
- **Automatic Tax Calculation (GST, VAT, etc.)**
- **Dark Mode UI**
 
---
 
## Contributing
1. **Fork the repository** and create your feature branch:
   ```sh
   git checkout -b feature/YourFeature
   ```
2. **Commit your changes** with clear messages.
3. **Push to your fork** and submit a pull request.
4. For major changes, open an issue first to discuss your proposal.
 
---
 
## Contact
- **Email:** inquiry@pharma247.in
- **Website:** [Pharma247.in](https://pharma247.in)
- **Twitter:** [@Pharma247](https://twitter.com/Pharma247)
- **Production:** [https://medical.pharma247.in/](https://medical.pharma247.in/)
- **Beta:** [https://pharma24-7.vercel.app/](https://pharma24-7.vercel.app/)
 
---
 
*For any queries, suggestions, or support, feel free to reach out!*
 
 
 
# Pharma 24/7
 
Pharma 24/7 is a robust, full-featured pharmacy management platform designed to streamline every aspect of pharmacy operations—from inventory and sales to purchase, reporting, and compliance. Built with modern web technologies, it supports multi-user roles, real-time stock management, granular permissions, and regulatory compliance, making it ideal for both independent and chain pharmacies.
 
---
 
## Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Folder Structure & Key Files](#folder-structure--key-files)
- [Main Modules & Features](#main-modules--features)
- [Authentication, Roles & Permissions](#authentication-roles--permissions)
- [API Communication & Error Handling](#api-communication--error-handling)
- [Environment & Configuration](#environment--configuration)
- [Installation & Setup](#installation--setup)
- [Contributing](#contributing)
- [FAQ & Troubleshooting](#faq--troubleshooting)
- [Contact & Support](#contact--support)
 
---
 
## Project Overview
Pharma 24/7 integrates all core pharmacy operations into a single, user-friendly platform. It provides:
- Real-time inventory and stock management
- Sales and purchase billing
- Customer, distributor, and doctor management
- Online/offline order processing
- Comprehensive reporting (GST, margin, stock, accounting, analytics)
- Role-based access and granular permissions
- Regulatory compliance (GST, e-prescriptions, etc.)
- Multi-store and multi-user support
 
---
 
## Architecture
- **Frontend:** React.js (with Tailwind CSS, Material UI, and Flowbite for UI)
- **Backend:** Laravel (PHP) [external, not in this repo]
- **Database:** MySQL / PostgreSQL
- **Authentication:** JWT-based (token stored in localStorage)
- **API:** RESTful, with axios for HTTP requests
- **Hosting:** Vercel, AWS, or DigitalOcean
 
**Frontend-Backend Communication:**
- All data operations are performed via REST APIs.
- JWT tokens are attached to every request for authentication.
- Permissions are fetched and encrypted in localStorage.
 
---
 
## Technology Stack
| Layer         | Technology(s)                                 |
|--------------|-----------------------------------------------|
| Frontend     | React.js, Tailwind CSS, Material UI, Flowbite |
| State/UI     | React Hooks, Context, MUI, Flowbite           |
| Backend      | Laravel (PHP)                                 |
| Database     | MySQL / PostgreSQL                            |
| Auth         | JWT                                           |
| Charts       | Recharts, D3, CanvasJS                        |
| File Ops     | xlsx, file-saver, pdf-lib                     |
| Date Utils   | date-fns, dayjs                               |
| Testing      | Jest, React Testing Library                   |
| Build Tools  | react-scripts, cross-env, tailwindcss         |
| Hosting      | Vercel, AWS, DigitalOcean                     |
 
---
 
## Folder Structure & Key Files
```
Pharma247/
├── public/                # Static assets (images, icons, sample data, favicon, manifest)
├── src/
│   ├── App.js             # Main app entry, routing, theme provider
│   ├── assets/            # App-specific images (e.g., login logo)
│   ├── componets/         # Reusable UI components & utilities
│   │   ├── buttons/           # Button, Delete, LoginBtn
│   │   ├── deletePopup/       # Delete confirmation modal
│   │   ├── ErrorPage/         # Error page component
│   │   ├── Images/            # UI images
│   │   ├── loader/            # Loader spinner
│   │   ├── Login/             # Login/Signup UI
│   │   ├── popupBox/          # Popup/alert components
│   │   ├── pre-login/         # Login, Signup, Forgot password
│   │   ├── cryptoUtils.js     # Data encryption/decryption helpers
│   │   ├── emitters.js        # Event emitter utility
│   │   ├── permission.js      # Permission hooks/utilities
│   │   ├── permissionStorage.js # Permission storage helpers
│   ├── dashboard/         # Main business modules
│   │   ├── Chart/             # Charts (Donut, Staff Overview)
│   │   ├── Header.js          # App header, user menu, notifications
│   │   ├── Inventory/         # Inventory list/view
│   │   ├── ItemMaster/        # Item master (add/edit items)
│   │   ├── model/             # Purchase/sale models
│   │   ├── More/              # Submodules: AdjustStock, BankAccounts, CashManagement, Catagory, Company, Customer, Distributor, Doctor, DrugGroup, LoyaltyPoint, ManageExpense, Package, Reconciliation, Reports
│   │   ├── OrderList/         # Order list
│   │   ├── profile/           # Profile, About, Settings, Staff-Sessions
│   │   ├── Purchase/          # Purchase bills, payments, returns
│   │   ├── Sale/              # Sale bills, returns
│   │   ├── Search.js          # Unified search (medicine, drug group, distributor, customer)
│   ├── Image/             # UI images (stock, sales, purchase, etc.)
│   ├── OnlineOrders/      # Online order management (Accepted, Assigned, Delivered, etc.)
│   ├── protected/         # Route protection (Admin, Auth)
│   ├── theme.js           # MUI/Tailwind theme customization
│   ├── index.js           # React entry point, axios config
│   ├── reportWebVitals.js # Web vitals reporting
│   ├── setupTests.js      # Test setup
├── package.json           # Project dependencies & scripts
├── tailwind.config.js     # Tailwind CSS config
├── README.md              # Project documentation
```
 
**Key Configuration Files:**
- `package.json`: All dependencies, scripts, and project metadata
- `tailwind.config.js`: Tailwind CSS setup
- `public/manifest.json`: PWA manifest
- `public/index.html`: HTML template
 
---
 
## Main Modules & Features
 
### 1. **Authentication & User Management**
- **Signup/Login/OTP:** Multi-step registration, OTP verification, password reset
- **Role-based Routing:** Owner/Admin, Staff, with protected routes
- **Session Management:** JWT token in localStorage, auto-redirect on expiry
- **Profile Management:** User info, password, pharmacy settings, documents
 
### 2. **Dashboard**
- **Real-time Metrics:** Sales, purchases, inventory, returns, loyalty points
- **Charts:** Bar, donut, staff overview, expiry tracking
- **Quick Links:** Top customers, distributors, expiring items
 
### 3. **Inventory Management**
- **Item Master:** Add/edit/delete items, barcode generation, batch/expiry, GST/HSN, company/category/supplier linkage
- **Stock Tracking:** Real-time stock, reorder alerts, batch-wise stock, non-moving items
- **Stock Adjustment:** Manual adjustments, audit logs
- **Inventory Reconciliation:** Stock audit, item count, audit status
 
### 4. **Purchase Management**
- **Purchase Bills:** Add/edit, CSV import, barcode support
- **Returns:** Purchase return bills, expiry management
- **Payments:** Payment tracking, bill-wise payment, payment modes
- **Supplier Management:** Add/edit suppliers, GST, contact info
 
### 5. **Sales Management**
- **Sales Bills:** Add/edit, barcode billing, e-prescription support
- **Returns:** Sales return bills, expiry, batch management
- **Customer Management:** Add/edit customers, loyalty points, order history
- **Doctor Management:** Add/edit doctors, prescription linkage
 
### 6. **Order Processing**
- **Online/Offline Orders:** Status tracking (Accepted, Processing, Delivered, etc.)
- **Notifications:** Real-time status updates
- **Pickup/Delivery:** Pickup, delivery, counter sales
 
### 7. **Reports & Analytics**
- **GST Reports:** Purchase, sales, HSN-wise, GSTR-1/2/3B, day-wise summary
- **Margin Reports:** Item-wise, bill-item-wise
- **Stock Reports:** Inventory reconciliation, batch-wise, non-moving, stock adjustment, purchase return
- **Accounting Reports:** Purchase payment summary
- **Intelligent Reports:** Monthly sales overview, top selling items, top customers/distributors
- **Other Reports:** Doctor-wise, company-wise, staff activity, sales summary
- **Export:** PDF, Excel, CSV
 
### 8. **Role & Permission Management**
- **Staff Roles:** Create/edit roles, assign permissions
- **Permission Storage:** Encrypted in localStorage
- **Activity Logs:** Staff activity, reconciliation logs
 
### 9. **Utilities & UI Components**
- **Reusable Buttons, Loaders, Popups**
- **Event Emitters**
- **Crypto Utilities:** AES encryption for sensitive data
- **Unified Search:** Medicine, drug group, distributor, customer
- **Error Handling:** Toast notifications, error pages
 
---
 
## Authentication, Roles & Permissions
 
### **Authentication Flow**
- **Login/Signup:**
  - User submits credentials (mobile, password, OTP)
  - On success, receives JWT token and user info
  - Token and user info are stored in localStorage
- **Session:**
  - Token is attached to all axios requests
  - On token expiry/invalid, user is redirected to login
 
### **Role-Based Access**
- **Roles:** Owner/Admin, Staff (customizable)
- **Permissions:**
  - Fetched from backend (`user-permission` API)
  - Encrypted and stored in localStorage
  - Used by `usePermissions` hook and `ProtectedRoute` component
- **Protected Routes:**
  - `Protected` and `AdminProtected` components check for valid token
  - `ProtectedRoute` checks for required permission before rendering
- **Permission Storage:**
  - Utilities in `componets/permission.js` and `componets/permissionStorage.js`
  - Permissions are encrypted using AES (see `cryptoUtils.js`)
 
---
 
## API Communication & Error Handling
 
### **API Communication**
- **HTTP Client:** axios (configured in `src/index.js`)
- **Base URL:** Set to backend API (`https://testadmin.pharma247.in/api` by default)
- **Token Handling:** JWT token is attached to all requests via axios default headers
- **Endpoints:** All business logic (inventory, sales, purchase, etc.) is handled via RESTful endpoints
- **File Uploads:** Handled via FormData (CSV, Excel, images)
 
### **Error Handling**
- **API Errors:**
  - Caught in each async function
  - User feedback via `react-toastify` toasts
  - 401 errors trigger logout and redirect
- **Validation:**
  - Client-side validation for all forms (required fields, format checks)
  - Server-side validation errors are displayed to the user
- **Global Error Pages:**
  - ErrorPage component for unauthorized/forbidden access
 
---
 
## Environment & Configuration
 
### **Environment Variables**
- **API Endpoint:** Set in `src/index.js` via `axios.defaults.baseURL`
- **JWT Token:** Stored in localStorage as `token`
- **Permissions:** Encrypted and stored in localStorage as `Permission`
- **Custom Configs:** Use a `.env` file for custom environment variables if needed
 
### **Config Files**
- `package.json`: All dependencies and scripts
- `tailwind.config.js`: Tailwind CSS setup
- `public/manifest.json`: PWA manifest
- `public/index.html`: HTML template
 
---
 
## Installation & Setup
 
### **Prerequisites**
- Node.js (LTS recommended)
- npm (comes with Node.js)
- Code editor (e.g., VSCode)
 
### **Steps**
1. **Clone the repository:**
   ```sh
   git clone https://github.com/yogeshShopno/Pharma24-7.git
   cd Pharma24-7
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000) by default.
 
> **Note:** The frontend expects the backend API to be available at `https://testadmin.pharma247.in/api` (see `src/index.js`).
 
---
 
## Contributing
 
### **How to Contribute**
1. **Fork the repository** and create your feature branch:
   ```sh
   git checkout -b feature/YourFeature
   ```
2. **Commit your changes** with clear, conventional commit messages.
3. **Push to your fork** and submit a pull request.
4. For major changes, open an issue first to discuss your proposal.
 
### **Code Style**
- Use consistent formatting (Prettier, ESLint recommended)
- Use descriptive variable and function names
- Write modular, reusable components
- Add comments for complex logic
- Write tests for new features (where possible)
 
---
 
## FAQ & Troubleshooting
 
### **Q: The app can't connect to the backend API.**
- Check that the backend is running and accessible at the URL set in `src/index.js`.
- Ensure CORS is enabled on the backend.
 
### **Q: I get a 401 Unauthorized error.**
- Your session may have expired. Log in again.
- Check that the JWT token is present in localStorage.
 
### **Q: Styles are not loading or look broken.**
- Ensure Tailwind CSS and MUI dependencies are installed.
- Check `tailwind.config.js` and `src/index.css` for correct setup.
 
### **Q: File uploads (CSV/Excel) fail.**
- Ensure the file type is supported (CSV/Excel).
- Check for API errors in the browser console.
 
### **Q: How do I add a new report or module?**
- Create a new component in the relevant `src/dashboard/More/Reports/` or module directory.
- Register the route in `App.js`.
- Ensure permissions are set if needed.
 
---
 
## Contact & Support
- **Email:** inquiry@pharma247.in
- **Website:** [Pharma247.in](https://pharma247.in)
- **Twitter:** [@Pharma247](https://twitter.com/Pharma247)
- **Production:** [https://medical.pharma247.in/](https://medical.pharma247.in/)
- **Beta:** [https://pharma24-7.vercel.app/](https://pharma24-7.vercel.app/)
 
---
 
*For any queries, suggestions, or support, feel free to reach out!*
 
 
