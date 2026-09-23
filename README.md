# Donor Management System

A production-ready Donor Management System built for Coordinators and Administrators to securely collect, manage, and track donation records. 

Built with a scalable architecture ensuring data privacy, role-based access control, and strict duplicate prevention measures.

## 🚀 Features

### 🛡️ Role-Based Access Control (RBAC)
- **Coordinators:** Have isolated access. They can only view and manage the donor records they personally created.
- **Administrators:** Have global access. They can view all donor records across the organization, manage coordinator accounts, and view system-wide analytics.

### 🔒 Security & Data Integrity
- **Database Duplicate Prevention:** Enforces uniqueness on normalized emails and WhatsApp numbers directly via MongoDB indexes. This guarantees data integrity and prevents race conditions if multiple coordinators attempt to enter the same donor simultaneously.
- **Secure Authentication:** Managed via Auth.js (NextAuth), utilizing hashed passwords (`bcryptjs`) and secure session cookies. Route protection is enforced at the Next.js Middleware level.

### 📊 Dashboards & Analytics
- **Coordinator Dashboard:** Provides quick access to personal statistics (Total Donors Added, Today's Donations) and an optimized fast-entry form for rapid data collection.
- **Admin Dashboard:** Features global analytics, including an interactive 7-day revenue chart built with Recharts, along with comprehensive data tables for managing all donors and coordinators.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Database:** MongoDB & Mongoose
- **Authentication:** Auth.js (NextAuth)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) & Tailwind CSS
- **Validation:** React Hook Form & Zod
- **Analytics:** Recharts

## 💻 Getting Started

### Prerequisites
- Node.js 18+
- A running MongoDB instance (local or MongoDB Atlas)

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and update your MongoDB URI and Auth Secret.
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   AUTH_SECRET=a_secure_random_string
   NEXT_PUBLIC_APP_NAME="Donor Management System"
   ```

3. **Seed the Database:**
   To populate your database with initial Coordinator and Admin test accounts, run the seed script:
   ```bash
   npx tsx scripts/seed.ts
   ```
   *(Note: This creates default users `admin@example.com` and `rahul@example.com`)*

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser to log in.

## 📁 Project Architecture
- **`/src/models`**: Contains the Mongoose schemas defining the data layer constraints and unique indexes.
- **`/src/lib/validation`**: Contains Zod schemas shared across the frontend forms and backend server actions.
- **`/src/auth.ts` & `/src/middleware.ts`**: Contains the core NextAuth configuration and role-based route protection logic.
- **`/src/components/ui`**: Highly reusable and accessible UI components built with Tailwind CSS.
