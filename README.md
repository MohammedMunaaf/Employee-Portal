# Custom Employee Portal with Zoho One Integration & RBAC

A web-based **Custom Employee Portal** featuring built-in authentication, Role-Based Access Control (RBAC), security audit logging, and backend integration with Zoho One APIs using a single service account OAuth mechanism.

Employees log into the custom portal using role-based credentials. They never need individual Zoho usernames or passwords.

---

## 🌟 Key Features

- **Custom Authentication**: Signed JSON Web Tokens (JWT) with bcrypt password hashing and session management.
- **Backend-Enforced RBAC**: Express authorization middleware validating permissions on every API request.
- **Role-Based Dashboard**: Dynamically renders authorized Zoho applications based on the logged-in user's role.
- **Single Service Account OAuth**: Backend service manages Zoho OAuth 2.0 token refreshing (`POST https://accounts.zoho.com/oauth/v2/token`) without exposing client secrets to the frontend.
- **Admin Control Panel**: Enables administrators to manage portal users, view role-permission mappings, and inspect system audit logs.
- **Security Audit Logging**: Captures real-time logs for successful/failed logins, logout events, application access, and unauthorized access attempts.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, React Router v6, Axios, Lucide Icons, Vanilla CSS.
- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv.
- **Database**: MySQL (`mysql2`).
- **Integration**: Zoho OAuth 2.0 API Integration.

---

## 🔑 Demo Credentials

Password for all seeded demo accounts: **`Password123!`**

| Role | Email Address | Permitted Zoho Application | Access Scope |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@example.com` | **All Applications** | Full Portal Access + Admin Panel |
| **HR** | `hr@example.com` | **Zoho People** | HR & Employee Directory |
| **Sales** | `sales@example.com` | **Zoho CRM** | Sales Pipelines & Deals |
| **Support** | `support@example.com` | **Zoho Desk** | Support Tickets & SLAs |
| **Finance** | `finance@example.com` | **Zoho Books** | Invoicing & Accounting |

---

## 📌 Role-to-Application Mapping

| User Role | Zoho Application | Purpose | Required Permission |
| :--- | :--- | :--- | :--- |
| **Admin** | All Services | Complete portal & security management | `*` (All permissions) |
| **HR** | Zoho People | HR management, onboarding & leaves | `zoho.people` |
| **Sales** | Zoho CRM | Sales pipelines, leads & deals | `zoho.crm` |
| **Support** | Zoho Desk | Customer support & SLA tracking | `zoho.desk` |
| **Finance** | Zoho Books | Financial invoicing & accounting | `zoho.books` |

---

## 📁 Project Directory Structure

```plaintext
custom-employee-portal/
├── backend/
│   ├── src/
│   │   ├── config/          # MySQL connection pool setup (db.js)
│   │   ├── controllers/     # Route handlers (auth, dashboard, zoho, admin)
│   │   ├── middleware/      # JWT verification & RBAC authorization middleware
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # Zoho OAuth client & Audit logging services
│   │   └── server.js        # Main Express server entry point
│   ├── .env                 # Environment variables
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProtectedRoute, ZohoCard
│   │   ├── pages/           # Login, Dashboard, AdminPanel
│   │   ├── services/        # Axios API client
│   │   ├── App.jsx          # Client router
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── index.html           # Main HTML with SVG favicon
│   └── package.json
├── database/
│   ├── schema.sql           # MySQL DDL for Users, Roles, Permissions, Logs
│   ├── seed.sql             # Demo users & role-permission mappings
│   └── init_db.js           # Database initialization script
├── .gitignore
└── README.md
```

---

## 🗄️ Database Setup & Schema

The relational database uses 6 core tables:
1. `Users`: Employee profiles (`id`, `name`, `email`, `password_hash`, `is_active`, `created_at`).
2. `Roles`: System roles (`id`, `name`, `description`, `created_at`).
3. `Permissions`: Granular permission keys (`id`, `name`, `description`).
4. `UserRoles`: Junction table mapping users to roles.
5. `RolePermissions`: Junction table mapping permissions to roles.
6. `AuditLogs`: Security event tracking (`id`, `user_id`, `action`, `details`, `ip_address`, `created_at`).

### Initializing Database (MySQL)

Ensure MySQL is running on your machine, then run:

```bash
node database/init_db.js
```

---

## ⚙️ Environment Variables Configuration

Create `backend/.env` based on `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=employee_portal

# Security
JWT_SECRET=super_secret_employee_portal_jwt_key_2026

# Zoho OAuth Credentials
ZOHO_CLIENT_ID=1000.EXAMPLECLIENTID
ZOHO_CLIENT_SECRET=exampleclientsecret12345
ZOHO_REFRESH_TOKEN=1000.examplerefreshtoken12345
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
```

---

## 🚀 Setup & Execution Instructions

### Step 1: Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Step 2: Initialize Database

```bash
node database/init_db.js
```

### Step 3: Run Servers

- **Backend Server** (Port 5000):
  ```bash
  cd backend
  npm run dev
  ```

- **Frontend Application** (Port 3000):
  ```bash
  cd frontend
  npm run dev
  ```

---

## 📡 API Reference Overview

- `POST /api/auth/login`: User login returning signed JWT.
- `GET /api/dashboard`: User profile & authorized Zoho applications.
- `GET /api/zoho/people`: Zoho People data (Requires `zoho.people`).
- `GET /api/zoho/crm`: Zoho CRM data (Requires `zoho.crm`).
- `GET /api/zoho/desk`: Zoho Desk data (Requires `zoho.desk`).
- `GET /api/zoho/books`: Zoho Books data (Requires `zoho.books`).
- `GET /api/admin/users`: User management list (Admin only).
- `GET /api/admin/audit-logs`: System audit logs (Admin only).
