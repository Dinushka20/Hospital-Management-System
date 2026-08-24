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
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.FullName.Contains(search) || (p.Phone != null && p.Phone.Contains(search)));
            }

            var patients = await query.OrderByDescending(p => p.RegisteredOn)
                .Select(p => new PatientDto
                {
                    Id = p.Id,
                    FullName = p.FullName,
                    DateOfBirth = p.DateOfBirth,
                    Gender = p.Gender,
                    Phone = p.Phone,
                    Address = p.Address,
                    BloodGroup = p.BloodGroup,
                    RegisteredOn = p.RegisteredOn
                }).ToListAsync();

            return Ok(patients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.Appointments).ThenInclude(a => a.Doctor)
                .Include(p => p.MedicalRecords).ThenInclude(m => m.Doctor)
                .Include(p => p.Bills).ThenInclude(b => b.Items)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();

            return Ok(new PatientDetailDto
            {
                Id = patient.Id,
                FullName = patient.FullName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Phone = patient.Phone,
                Address = patient.Address,
                BloodGroup = patient.BloodGroup,
                RegisteredOn = patient.RegisteredOn,
                Appointments = patient.Appointments.Select(a => new AppointmentDto
                {
                    Id = a.Id,
                    PatientId = a.PatientId,
                    PatientName = patient.FullName,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor?.FullName ?? "",
                    AppointmentDate = a.AppointmentDate,
                    Reason = a.Reason,
                    Status = a.Status.ToString(),
                    Notes = a.Notes
                }).ToList(),
                MedicalRecords = patient.MedicalRecords.Select(m => new MedicalRecordDto
                {
                    Id = m.Id,
                    PatientId = m.PatientId,
                    PatientName = patient.FullName,
                    DoctorId = m.DoctorId,
                    DoctorName = m.Doctor?.FullName ?? "",
                    VisitDate = m.VisitDate,
                    Diagnosis = m.Diagnosis,
                    Prescription = m.Prescription,
                    Notes = m.Notes
                }).ToList(),
                Bills = patient.Bills.Select(b => new BillDto
                {
                    Id = b.Id,
                    PatientId = b.PatientId,
                    PatientName = patient.FullName,
                    BillDate = b.BillDate,
                    TotalAmount = b.TotalAmount,
                    AmountPaid = b.AmountPaid,
                    Balance = b.Balance,
                    Status = b.Status.ToString(),
                    Items = b.Items.Select(i => new BillItemDto
                    {
                        Id = i.Id,
                        Description = i.Description,
                        Amount = i.Amount
                    }).ToList()
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePatientRequest request)
        {
            var patient = new Patient
            {
                FullName = request.FullName,
                DateOfBirth = request.DateOfBirth,
                Gender = request.Gender,
                Phone = request.Phone,
                Address = request.Address,
                BloodGroup = request.BloodGroup,
                RegisteredOn = DateTime.Now
            };

            _context.Add(patient);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = patient.Id }, new PatientDto
            {
                Id = patient.Id,
                FullName = patient.FullName,
                DateOfBirth = patient.DateOfBirth,
                Gender = patient.Gender,
                Phone = patient.Phone,
                Address = patient.Address,
                BloodGroup = patient.BloodGroup,
                RegisteredOn = patient.RegisteredOn
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreatePatientRequest request)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            patient.FullName = request.FullName;
            patient.DateOfBirth = request.DateOfBirth;
            patient.Gender = request.Gender;
            patient.Phone = request.Phone;
            patient.Address = request.Address;
            patient.BloodGroup = request.BloodGroup;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
