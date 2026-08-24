using Microsoft.AspNetCore.Identity;

namespace HMS.Models
{
    // Extends the built-in Identity user with hospital-specific info.
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
