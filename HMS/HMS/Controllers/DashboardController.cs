using HMS.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            ViewBag.TotalPatients = await _context.Patients.CountAsync();
            ViewBag.TotalDoctors = await _context.Doctors.CountAsync();
            ViewBag.TodaysAppointments = await _context.Appointments
                .CountAsync(a => a.AppointmentDate >= today && a.AppointmentDate < tomorrow);
            ViewBag.RevenueThisMonth = await _context.Bills
                .Where(b => b.BillDate.Month == today.Month && b.BillDate.Year == today.Year)
                .SelectMany(b => b.Items)
                .SumAsync(i => (decimal?)i.Amount) ?? 0m;
            ViewBag.OutstandingBalance = await _context.Bills
                .Include(b => b.Items)
                .ToListAsync();

            return View();
        }
    }
}
