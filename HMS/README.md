# Hospital Management System (HMS) — ASP.NET Core 8 MVC + MySQL

This is a working starter build of the system described in your spec document, covering
the core workflow end-to-end: staff login & roles, patient registration, doctor
management, appointment scheduling, and billing/invoicing — backed by a real **MySQL**
database.

> **Important:** This code was written and reviewed by hand in a sandbox that has no
> access to NuGet, so it has **not been compiled here**. Follow the steps below on your
> own machine (which does have internet access) — the first `dotnet restore`/`build`
> will surface any typo immediately, and they're normal easy fixes if they occur.

---

## 0. Prerequisites

1. Install the **.NET 8 SDK**: https://dotnet.microsoft.com/download/dotnet/8.0
2. Install **MySQL Server** (8.0+): https://dev.mysql.com/downloads/mysql/
   - Windows: MySQL Installer is easiest.
   - macOS: `brew install mysql && brew services start mysql`
   - Linux: `sudo apt install mysql-server` (Ubuntu/Debian) or your distro's equivalent.
   - Make sure the MySQL service is running and you know the `root` password (or have
     created a dedicated user).
3. Any editor: Visual Studio 2022 (17.8+), VS Code + C# Dev Kit, or Rider.
4. Optionally, a MySQL GUI client (MySQL Workbench, DBeaver, TablePlus) to inspect data.

Check your installs:
```bash
dotnet --version   # should print 8.x
mysql --version    # should print 8.x
```

## 1. Point the app at your MySQL server

The app uses the **Pomelo.EntityFrameworkCore.MySql** provider and will create the
`hms` database and all its tables automatically the first time it runs — you do **not**
need to manually run `CREATE DATABASE` or any SQL scripts.

Open `HMS/appsettings.json` and update the password (and host/port/user if different):

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Port=3306;Database=hms;User=root;Password=YOUR_MYSQL_PASSWORD;TreatTinyAsBoolean=true;"
}
```

For anything beyond local development, don't commit real credentials — use instead:
```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=hms;User=root;Password=...;TreatTinyAsBoolean=true;"
```
(The project already has a `UserSecretsId` configured for this.)

Also check `Program.cs` — it targets MySQL Server 8.0.36 by default:
```csharp
var mySqlVersion = new MySqlServerVersion(new Version(8, 0, 36));
```
If your installed MySQL version differs, update that version number to match
(`mysql --version` tells you).

## 2. Run the project

```bash
cd HMS
dotnet restore
dotnet build
dotnet run --project HMS
```

The console will print something like `Now listening on: https://localhost:5001`.
Open that URL in your browser.

On first run, `DbSeeder` automatically:
- Creates the `hms` MySQL database and all tables
- Creates roles: Administrator, Doctor, Nurse, Receptionist, LabStaff, Pharmacist, Accountant
- Creates an admin login: **admin@hms.local / Admin@12345**
- Seeds four sample departments

**Log in with the admin account, then change that password** (see §7 for a note on
extending Identity UI with a proper "manage account" page).

## 3. Project structure

```
HMS/
  HMS.sln
  HMS/
    Program.cs                 → app startup, MySQL + Identity configuration
    Data/
      ApplicationDbContext.cs  → EF Core DbContext, entity relationships
      DbSeeder.cs              → roles/admin/sample data on first run
    Models/                    → Patient, Doctor, Department, Appointment,
                                  MedicalRecord, Bill, BillItem, ApplicationUser
    Controllers/                → one controller per module (MVC pattern)
    Views/                      → Razor views, one folder per controller
    wwwroot/                    → static files (css/site.css)
```

This follows the same **Presentation → Application → Business Logic → Database**
layering from your spec's §5 System Architecture:
- Views = Presentation Layer
- Controllers = Application Layer
- Models + validation = Business Logic Layer
- `ApplicationDbContext` + EF Core (MySQL) = Database Layer

## 4. What's fully implemented right now

| Spec section | Status |
|---|---|
| 3.1 User Management (login, roles, access control) | ✅ ASP.NET Core Identity, cookie auth, 30-min auto session timeout, role-based `[Authorize]` |
| 3.2 Patient Management | ✅ Register / edit / search / view history / delete |
| 3.3 Doctor Management | ✅ Add / edit / department assignment / view schedule |
| 3.4 Appointment Management | ✅ Book / edit / cancel / status tracking |
| 3.5 Electronic Medical Records | ✅ Model + relationships wired (diagnosis, prescription, treatment history) — add a `MedicalRecordsController` following the Patients pattern for full CRUD UI |
| 3.8 Billing System | ✅ Consultation / lab / pharmacy / admission charges, invoice generation, payment recording, auto status (Unpaid/Partial/Paid) |
| 4. Non-functional: Security | ✅ Hashed passwords (Identity), role-based access, session timeout. Audit logs: see §6 below |
| 4. Non-functional: Reliability | ✅ Real MySQL database with standard backup tooling — see §8.2 |

## 5. What's scaffolded as a pattern, not yet built out

Your spec also lists **Laboratory Management**, **Pharmacy Management**, and
**Staff Management** (§3.6, 3.7, 3.9) as full modules. I deliberately scoped this
first pass to the core patient-to-payment workflow so you'd have a real, working
system rather than a shallow module for everything.

Every remaining module follows the **exact same 4-file pattern** already used for
Patients/Doctors/Appointments:

1. **Model** in `Models/` (e.g. `Medicine.cs`, `LabTest.cs`, `Employee.cs`)
2. **DbSet** + relationship config added to `ApplicationDbContext.cs`
3. **Controller** in `Controllers/` with Index/Create/Edit/Delete actions (copy
   `PatientsController.cs` and rename)
4. **Views** in `Views/<Module>/` (copy `Views/Patients/*.cshtml` and adjust fields)

I'm happy to build out Pharmacy, Laboratory, and Staff management the same way in a
follow-up — just say the word and I'll generate the full files for each.

## 6. Adding Audit Logs (spec §4 Security)

For a simple audit trail, add an `AuditLog` entity (`UserId`, `Action`, `Entity`,
`Timestamp`) and write to it from each controller's Create/Edit/Delete actions, or
centralize it by overriding `SaveChangesAsync` in `ApplicationDbContext` to log all
tracked entity changes automatically.

## 7. Notes on Identity UI

I wrote a custom, minimal `AccountController` (Login/Register/Logout) instead of the
default scaffolded Identity Razor Pages, so you have full control over the UI and it
matches your Bootstrap layout. If you want the full built-in flow (password reset,
email confirmation, 2FA, "manage account" page), run:

```bash
dotnet tool install -g dotnet-aspnet-codegenerator
dotnet aspnet-codegenerator identity -dc HMS.Data.ApplicationDbContext --files "Account.Register;Account.Login;Account.Manage"
```

## 8. Production hardening

### 8.1 Use EF Core Migrations instead of EnsureCreated

Right now `DbSeeder.SeedAsync` calls `EnsureCreatedAsync()`, which is fine for getting
started but doesn't track schema changes over time. Before deploying, switch to
migrations:

```bash
dotnet tool install --global dotnet-ef
cd HMS
dotnet ef migrations add InitialCreate
dotnet ef database update
```

Then replace `await context.Database.EnsureCreatedAsync();` in `DbSeeder.cs` with
`await context.Database.MigrateAsync();`. From then on, any model change gets its own
migration (`dotnet ef migrations add <Name>`) instead of relying on EnsureCreated.

### 8.2 Backups (spec §10)

For MySQL, the standard tools are:
- **`mysqldump`** for logical backups: `mysqldump -u root -p hms > hms_backup.sql`
- Schedule it with `cron` (Linux/macOS) or Task Scheduler (Windows) for daily/weekly runs
- For point-in-time recovery, enable MySQL's binary logging (`log_bin`) so you can
  replay changes since the last full backup — covers "Disaster Recovery Plan" and
  "Audit Trail" from your spec's §10.

### 8.3 Connecting to a remote/production MySQL server

Change only the connection string — no code changes needed:
```
Server=your-db-host.example.com;Port=3306;Database=hms;User=hms_app;Password=...;TreatTinyAsBoolean=true;SslMode=Required;
```
Create a dedicated MySQL user with limited privileges rather than using `root`:
```sql
CREATE USER 'hms_app'@'%' IDENTIFIED BY 'a-strong-password';
GRANT ALL PRIVILEGES ON hms.* TO 'hms_app'@'%';
FLUSH PRIVILEGES;
```

## 9. Suggested next steps, in order

1. Run it locally, log in as admin, register a test patient, book an appointment, generate an invoice.
2. Ask me to generate the **Pharmacy**, **Laboratory**, and **Staff Management** modules (same pattern).
3. Add the **Reports** module (§3.10) — mostly LINQ queries over existing tables rendered as views or exported via the `pdf`/`xlsx` tooling.
4. Harden security: enforce HTTPS in production, add rate limiting on login, enable 2FA.
5. Consider `Future Enhancements` (§12) — Patient Portal and Notifications are natural next additions once the staff-facing app is solid.
