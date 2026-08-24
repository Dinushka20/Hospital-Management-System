using HMS.Data;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    public class PatientsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Patients?search=
        public async Task<IActionResult> Index(string? search)
        {
            var query = _context.Patients.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.FullName.Contains(search) || (p.Phone != null && p.Phone.Contains(search)));
            }

            ViewData["Search"] = search;
            return View(await query.OrderByDescending(p => p.RegisteredOn).ToListAsync());
        }

        public async Task<IActionResult> Details(int id)
        {
            var patient = await _context.Patients
                .Include(p => p.Appointments).ThenInclude(a => a.Doctor)
                .Include(p => p.MedicalRecords).ThenInclude(m => m.Doctor)
                .Include(p => p.Bills).ThenInclude(b => b.Items)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();
            return View(patient);
        }

        public IActionResult Create() => View(new Patient());

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("FullName,DateOfBirth,Gender,Phone,Address,BloodGroup")] Patient patient)
        {
            if (!ModelState.IsValid) return View(patient);

            patient.RegisteredOn = DateTime.Now;
            _context.Add(patient);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Patient registered successfully.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return NotFound();
            return View(patient);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,FullName,DateOfBirth,Gender,Phone,Address,BloodGroup,RegisteredOn")] Patient patient)
        {
            if (id != patient.Id) return NotFound();
            if (!ModelState.IsValid) return View(patient);

            _context.Update(patient);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Patient updated.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null) return NotFound();
            return View(patient);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient != null)
            {
                _context.Patients.Remove(patient);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }
    }
}
