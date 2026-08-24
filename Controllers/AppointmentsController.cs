using HMS.Data;
using HMS.Models;
using HMS.Models.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .OrderBy(a => a.AppointmentDate)
                .Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = a.Patient != null ? a.Patient.FullName : "",
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor != null ? a.Doctor.FullName : "",
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status.ToString(),
                    Notes = a.Notes
                }).ToListAsync();

            return Ok(appointments);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAppointmentRequest request)
        {
            try
            {
                var appointment = new Appointment
                {
                    PatientId = request.PatientId,
                    DoctorId = request.DoctorId,
                    AppointmentDate = DateTime.SpecifyKind(request.AppointmentDate, DateTimeKind.Utc),
                    Reason = request.Reason,
                    Notes = request.Notes,
                    Status = AppointmentStatus.Scheduled
                };

                _context.Add(appointment);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAll), new { id = appointment.Id }, new AppointmentDto
                {
                    Id = appointment.Id,
                    PatientId = appointment.PatientId,
                    DoctorId = appointment.DoctorId,
                    AppointmentDate = appointment.AppointmentDate,
                    Reason = appointment.Reason,
                    Status = appointment.Status.ToString(),
                    Notes = appointment.Notes
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, inner = ex.InnerException?.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateAppointmentRequest request)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.PatientId = request.PatientId;
            appointment.DoctorId = request.DoctorId;
            appointment.AppointmentDate = request.AppointmentDate;
            appointment.Reason = request.Reason;
            appointment.Notes = request.Notes;

            if (Enum.TryParse<AppointmentStatus>(request.Status, true, out var status))
            {
                appointment.Status = status;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Appointment cancelled." });
        }
    }
}
