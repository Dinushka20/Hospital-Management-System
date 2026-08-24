using HMS.Data;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    public class BillingController : Controller
    {
        private readonly ApplicationDbContext _context;

        public BillingController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var bills = await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Items)
                .OrderByDescending(b => b.BillDate)
                .ToListAsync();
            return View(bills);
        }

        public async Task<IActionResult> Create()
        {
            await PopulatePatients();
            return View();
        }

        // Simple fixed-category billing form: Consultation, Laboratory, Pharmacy, Admission.
        // Leave any field blank/zero to skip that charge.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(int patientId, decimal consultationCharge,
            decimal laboratoryCharge, decimal pharmacyCharge, decimal admissionCharge)
        {
            var patient = await _context.Patients.FindAsync(patientId);
            if (patient == null)
            {
                ModelState.AddModelError(string.Empty, "Please select a valid patient.");
                await PopulatePatients(patientId);
                return View();
            }

            var bill = new Bill { PatientId = patientId, BillDate = DateTime.Now };

            void AddIfPositive(string description, decimal amount)
            {
                if (amount > 0) bill.Items.Add(new BillItem { Description = description, Amount = amount });
            }

            AddIfPositive("Consultation Charges", consultationCharge);
            AddIfPositive("Laboratory Charges", laboratoryCharge);
            AddIfPositive("Pharmacy Charges", pharmacyCharge);
            AddIfPositive("Admission Charges", admissionCharge);

            if (!bill.Items.Any())
            {
                ModelState.AddModelError(string.Empty, "Enter at least one charge greater than zero.");
                await PopulatePatients(patientId);
                return View();
            }

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Invoice generated.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Details(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Items)
                .FirstOrDefaultAsync(b => b.Id == id);
            if (bill == null) return NotFound();
            return View(bill);
        }

        // Record a payment against a bill and update its status automatically.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Pay(int id, decimal amount)
        {
            var bill = await _context.Bills.Include(b => b.Items).FirstOrDefaultAsync(b => b.Id == id);
            if (bill == null) return NotFound();

            if (amount > 0)
            {
                bill.AmountPaid += amount;
                bill.Status = bill.AmountPaid >= bill.TotalAmount
                    ? BillStatus.Paid
                    : bill.AmountPaid > 0 ? BillStatus.PartiallyPaid : BillStatus.Unpaid;
                await _context.SaveChangesAsync();
                TempData["Success"] = "Payment recorded.";
            }

            return RedirectToAction(nameof(Details), new { id });
        }

        private async Task PopulatePatients(int? selected = null)
        {
            ViewBag.Patients = new SelectList(await _context.Patients.OrderBy(p => p.FullName).ToListAsync(), "Id", "FullName", selected);
        }
    }
}
