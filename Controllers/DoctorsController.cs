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
    public class DoctorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _context.Doctors.Include(d => d.Department)
                .Select(d => new DoctorDto
                {
                    Id = d.Id,
                    FullName = d.FullName,
                    Specialization = d.Specialization,
                    Phone = d.Phone,
                    Email = d.Email,
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.Department != null ? d.Department.Name : ""
                }).ToListAsync();

            return Ok(doctors);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Department)
                .Include(d => d.Appointments).ThenInclude(a => a.Patient)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null) return NotFound();

            return Ok(new DoctorDetailDto
            {
                Id = doctor.Id,
                FullName = doctor.FullName,
                Specialization = doctor.Specialization,
                Phone = doctor.Phone,
                Email = doctor.Email,
                DepartmentId = doctor.DepartmentId,
                DepartmentName = doctor.Department?.Name ?? "",
                Appointments = doctor.Appointments.Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = a.Patient?.FullName ?? "",
                    DoctorId = a.DoctorId,
                    DoctorName = doctor.FullName,
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status.ToString(),
                    Notes = a.Notes
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDoctorRequest request)
        {
            var doctor = new Doctor
            {
                FullName = request.FullName,
                Specialization = request.Specialization,
                Phone = request.Phone,
                Email = request.Email,
                DepartmentId = request.DepartmentId
            };

            _context.Add(doctor);
            await _context.SaveChangesAsync();

            var dept = await _context.Departments.FindAsync(doctor.DepartmentId);
            return CreatedAtAction(nameof(GetById), new { id = doctor.Id }, new DoctorDto
            {
                Id = doctor.Id,
                FullName = doctor.FullName,
                Specialization = doctor.Specialization,
                Phone = doctor.Phone,
                Email = doctor.Email,
                DepartmentId = doctor.DepartmentId,
                DepartmentName = dept?.Name ?? ""
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDoctorRequest request)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            doctor.FullName = request.FullName;
            doctor.Specialization = request.Specialization;
            doctor.Phone = request.Phone;
            doctor.Email = request.Email;
            doctor.DepartmentId = request.DepartmentId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DepartmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentDto { Id = d.Id, Name = d.Name })
                .ToListAsync();
            return Ok(departments);
        }
    }
}
