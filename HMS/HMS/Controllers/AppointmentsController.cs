using HMS.Data;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    public class AppointmentsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
            return View(appointments);
        }

        public async Task<IActionResult> Create()
        {
            await PopulateDropdowns();
            return View(new Appointment());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PatientId,DoctorId,AppointmentDate,Reason,Notes")] Appointment appointment)
        {
            if (!ModelState.IsValid)
            {
                await PopulateDropdowns(appointment.PatientId, appointment.DoctorId);
                return View(appointment);
            }

            _context.Add(appointment);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Appointment booked.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();
            await PopulateDropdowns(appointment.PatientId, appointment.DoctorId);
            return View(appointment);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,PatientId,DoctorId,AppointmentDate,Reason,Status,Notes")] Appointment appointment)
        {
            if (id != appointment.Id) return NotFound();
            if (!ModelState.IsValid)
            {
                await PopulateDropdowns(appointment.PatientId, appointment.DoctorId);
                return View(appointment);
            }

            _context.Update(appointment);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Appointment updated.";
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Cancel(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private async Task PopulateDropdowns(int? patientId = null, int? doctorId = null)
        {
            ViewBag.Patients = new SelectList(await _context.Patients.OrderBy(p => p.FullName).ToListAsync(), "Id", "FullName", patientId);
            ViewBag.Doctors = new SelectList(await _context.Doctors.OrderBy(d => d.FullName).ToListAsync(), "Id", "FullName", doctorId);
        }
    }
}
