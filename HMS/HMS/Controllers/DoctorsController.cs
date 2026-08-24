using HMS.Data;
using HMS.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace HMS.Controllers
{
    [Authorize]
    public class DoctorsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            var doctors = await _context.Doctors.Include(d => d.Department).ToListAsync();
            return View(doctors);
        }

        public async Task<IActionResult> Details(int id)
        {
            var doctor = await _context.Doctors
                .Include(d => d.Department)
                .Include(d => d.Appointments).ThenInclude(a => a.Patient)
                .FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null) return NotFound();
            return View(doctor);
        }

        public async Task<IActionResult> Create()
        {
            await PopulateDepartments();
            return View(new Doctor());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("FullName,Specialization,Phone,Email,DepartmentId")] Doctor doctor)
        {
            if (!ModelState.IsValid)
            {
                await PopulateDepartments(doctor.DepartmentId);
                return View(doctor);
            }

            _context.Add(doctor);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Doctor added.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Edit(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return NotFound();
            await PopulateDepartments(doctor.DepartmentId);
            return View(doctor);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,FullName,Specialization,Phone,Email,DepartmentId")] Doctor doctor)
        {
            if (id != doctor.Id) return NotFound();
            if (!ModelState.IsValid)
            {
                await PopulateDepartments(doctor.DepartmentId);
                return View(doctor);
            }

            _context.Update(doctor);
            await _context.SaveChangesAsync();
            TempData["Success"] = "Doctor updated.";
            return RedirectToAction(nameof(Index));
        }

        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _context.Doctors.Include(d => d.Department).FirstOrDefaultAsync(d => d.Id == id);
            if (doctor == null) return NotFound();
            return View(doctor);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor != null)
            {
                _context.Doctors.Remove(doctor);
                await _context.SaveChangesAsync();
            }
            return RedirectToAction(nameof(Index));
        }

        private async Task PopulateDepartments(int? selected = null)
        {
            ViewBag.Departments = new SelectList(await _context.Departments.ToListAsync(), "Id", "Name", selected);
        }
    }
}
