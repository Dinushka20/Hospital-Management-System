using HMS.Models;
using Microsoft.AspNetCore.Identity;

namespace HMS.Data
{
    // Creates default roles, an admin user, and a couple of sample departments
    // so the app is usable immediately after first run.
    public static class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider services)
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            await context.Database.EnsureCreatedAsync();

            var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
            string[] roles = { "Administrator", "Doctor", "Nurse", "Receptionist", "LabStaff", "Pharmacist", "Accountant" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
            const string adminEmail = "admin@hms.local";
            if (await userManager.FindByEmailAsync(adminEmail) is null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FullName = "System Administrator",
                    EmailConfirmed = true
                };
                // CHANGE THIS PASSWORD after first login.
                var result = await userManager.CreateAsync(admin, "Admin@12345");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Administrator");
                }
            }

            if (!context.Departments.Any())
            {
                context.Departments.AddRange(
                    new Department { Name = "General Medicine" },
                    new Department { Name = "Cardiology" },
                    new Department { Name = "Pediatrics" },
                    new Department { Name = "Orthopedics" }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
