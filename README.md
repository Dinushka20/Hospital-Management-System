# MediCore - Hospital Management System (HMS)

MediCore is a comprehensive, modern Hospital Management System built to streamline healthcare operations. It provides a unified platform to manage patients, doctors, appointments, and billing, all within a secure, role-based environment.

## 🌟 Features

*   **Role-Based Access Control (RBAC):** Secure access for different staff roles (Receptionist, Doctor, Admin, etc.) using JWT authentication.
*   **Patient Management:** Register new patients, view patient history, and manage medical records.
*   **Doctor Directory:** Maintain a list of active physicians and their specialties.
*   **Appointment Scheduling:** Book, manage, and track patient appointments seamlessly.
*   **Billing & Invoicing:** Generate comprehensive invoices (consultation, laboratory, pharmacy, admission) with LKR currency support and track outstanding balances.
*   **Dashboard Analytics:** Real-time overview of hospital metrics, including patient counts, appointment schedules, and revenue tracking.
*   **Modern UI/UX:** A clean, responsive light theme with a teal/emerald color palette, designed for usability and accessibility.

## 🛠️ Tech Stack

### Frontend
*   **React (Vite):** Fast, modern frontend framework.
*   **React Router:** For seamless client-side navigation.
*   **React Icons:** High-quality SVG icons for a polished look.
*   **Vanilla CSS:** Custom design system featuring a premium light theme with deep teal accents.

### Backend
*   **ASP.NET Core 8 Web API:** Robust and high-performance backend.
*   **Entity Framework Core:** ORM for database operations.
*   **PostgreSQL (Supabase):** Reliable relational database.
*   **ASP.NET Core Identity:** For secure user management and authentication.

### Infrastructure & Deployment
*   **Vercel:** Frontend hosting.
*   **Azure App Service:** Backend API hosting.
*   **GitHub Actions:** Automated CI/CD pipeline for backend deployment.

## 🚀 Getting Started (Local Development)

### Prerequisites
*   Node.js (v18 or higher)
*   .NET 8 SDK
*   PostgreSQL database (or a Supabase project)

### 1. Clone the Repository
```bash
git clone https://github.com/Dinushka20/Hospital-Management-System.git
cd Hospital-Management-System
```

### 2. Backend Setup
1.  Navigate to the project root (where `HMS.csproj` is located).
2.  Update the `DefaultConnection` string in `appsettings.json` (or `appsettings.Development.json`) with your PostgreSQL connection details.
3.  Apply database migrations:
    ```bash
    dotnet ef database update
    ```
4.  Run the API:
    ```bash
    dotnet run
    ```
    The API will typically run on `http://localhost:5000` or `https://localhost:5001`.

### 3. Frontend Setup
1.  Navigate to the `client` directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure the API endpoint:
    *   Ensure that the base URL in `client/src/api/client.js` points to your local backend (e.g., `http://localhost:5000/api`) during local development.
4.  Start the development server:
    ```bash
    npm run dev
    ```

## 🌐 Deployment

*   **Frontend (Vercel):** The React frontend is configured for deployment on Vercel. Ensure the build command is set to `npm run build` and the output directory is `dist`.
*   **Backend (Azure):** The ASP.NET Core backend uses GitHub Actions (`.github/workflows/azure-webapps-dotnet-core.yml`) for automated deployment to Azure App Service upon pushing to the `main` branch.

## 🔒 Security Notes
*   Ensure that your Supabase connection strings use the **IPv4 Connection Pooler** if deploying to Azure App Service Free Tier, as it does not support outbound IPv6.
*   Keep your JWT secret keys and database passwords secure using environment variables or Azure Key Vault in production.
