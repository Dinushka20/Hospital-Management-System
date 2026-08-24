using HMS.Data;
using HMS.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var todayUtc = DateTime.UtcNow.Date;
                var tomorrowUtc = todayUtc.AddDays(1);

                var totalPatients = await _context.Patients.CountAsync();
                var totalDoctors = await _context.Doctors.CountAsync();
                var todaysAppointments = await _context.Appointments
                    .CountAsync(a => a.AppointmentDate >= todayUtc && a.AppointmentDate < tomorrowUtc);
                var revenueThisMonth = await _context.Bills
                    .Where(b => b.BillDate.Month == todayUtc.Month && b.BillDate.Year == todayUtc.Year)
                    .SelectMany(b => b.Items)
                    .SumAsync(i => (decimal?)i.Amount) ?? 0m;

                var allBills = await _context.Bills.Include(b => b.Items).ToListAsync();
                var outstanding = allBills.Sum(b => b.Balance);

                return Ok(new DashboardStats
                {
                    TotalPatients = totalPatients,
                    TotalDoctors = totalDoctors,
                    TodaysAppointments = todaysAppointments,
                    RevenueThisMonth = revenueThisMonth,
                    OutstandingBalance = outstanding
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }
    }
}
