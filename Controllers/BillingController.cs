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
    public class BillingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BillingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var bills = await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Items)
                .OrderByDescending(b => b.BillDate)
                .ToListAsync();

            return Ok(bills.Select(b => new BillDto
            {
                Id = b.Id,
                PatientId = b.PatientId,
                PatientName = b.Patient?.FullName ?? "",
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
            }));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null) return NotFound();

            return Ok(new BillDto
            {
                Id = bill.Id,
                PatientId = bill.PatientId,
                PatientName = bill.Patient?.FullName ?? "",
                BillDate = bill.BillDate,
                TotalAmount = bill.TotalAmount,
                AmountPaid = bill.AmountPaid,
                Balance = bill.Balance,
                Status = bill.Status.ToString(),
                Items = bill.Items.Select(i => new BillItemDto
                {
                    Id = i.Id,
                    Description = i.Description,
                    Amount = i.Amount
                }).ToList()
            });
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBillRequest request)
        {
            var patient = await _context.Patients.FindAsync(request.PatientId);
            if (patient == null)
                return BadRequest(new { message = "Please select a valid patient." });

            var bill = new Bill { PatientId = request.PatientId, BillDate = DateTime.UtcNow };

            void AddIfPositive(string description, decimal amount)
            {
                if (amount > 0) bill.Items.Add(new BillItem { Description = description, Amount = amount });
            }

            AddIfPositive("Consultation Charges", request.ConsultationCharge);
            AddIfPositive("Laboratory Charges", request.LaboratoryCharge);
            AddIfPositive("Pharmacy Charges", request.PharmacyCharge);
            AddIfPositive("Admission Charges", request.AdmissionCharge);

            if (!bill.Items.Any())
                return BadRequest(new { message = "Enter at least one charge greater than zero." });

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = bill.Id }, new BillDto
            {
                Id = bill.Id,
                PatientId = bill.PatientId,
                PatientName = patient.FullName,
                BillDate = bill.BillDate,
                TotalAmount = bill.TotalAmount,
                AmountPaid = bill.AmountPaid,
                Balance = bill.Balance,
                Status = bill.Status.ToString(),
                Items = bill.Items.Select(i => new BillItemDto
                {
                    Id = i.Id,
                    Description = i.Description,
                    Amount = i.Amount
                }).ToList()
            });
        }

        [HttpPost("{id}/pay")]
        public async Task<IActionResult> Pay(int id, [FromBody] PayBillRequest request)
        {
            var bill = await _context.Bills.Include(b => b.Items).FirstOrDefaultAsync(b => b.Id == id);
            if (bill == null) return NotFound();

            if (request.Amount > 0)
            {
                bill.AmountPaid += request.Amount;
                bill.Status = bill.AmountPaid >= bill.TotalAmount
                    ? BillStatus.Paid
                    : bill.AmountPaid > 0 ? BillStatus.PartiallyPaid : BillStatus.Unpaid;
                await _context.SaveChangesAsync();
            }

            return Ok(new { message = "Payment recorded.", status = bill.Status.ToString(), amountPaid = bill.AmountPaid, balance = bill.Balance });
        }
    }
}
