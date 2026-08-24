namespace HMS.Models.DTOs
{
    // ---- Auth DTOs ----
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; }
    }

    public class RegisterRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Receptionist";
    }

    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public IList<string> Roles { get; set; } = new List<string>();
    }

    // ---- Dashboard DTOs ----
    public class DashboardStats
    {
        public int TotalPatients { get; set; }
        public int TotalDoctors { get; set; }
        public int TodaysAppointments { get; set; }
        public decimal RevenueThisMonth { get; set; }
        public decimal OutstandingBalance { get; set; }
    }

    // ---- Patient DTOs ----
    public class PatientDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = "Other";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? BloodGroup { get; set; }
        public DateTime RegisteredOn { get; set; }
    }

    public class PatientDetailDto : PatientDto
    {
        public List<AppointmentDto> Appointments { get; set; } = new();
        public List<MedicalRecordDto> MedicalRecords { get; set; } = new();
        public List<BillDto> Bills { get; set; } = new();
    }

    public class CreatePatientRequest
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Gender { get; set; } = "Other";
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? BloodGroup { get; set; }
    }

    // ---- Doctor DTOs ----
    public class DoctorDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
    }

    public class DoctorDetailDto : DoctorDto
    {
        public List<AppointmentDto> Appointments { get; set; } = new();
    }

    public class CreateDoctorRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public int DepartmentId { get; set; }
    }

    // ---- Appointment DTOs ----
    public class AppointmentDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class CreateAppointmentRequest
    {
        public int PatientId { get; set; }
        public int DoctorId { get; set; }
        public DateTime AppointmentDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string? Notes { get; set; }
    }

    public class UpdateAppointmentRequest : CreateAppointmentRequest
    {
        public string Status { get; set; } = "Scheduled";
    }

    // ---- Medical Record DTOs ----
    public class MedicalRecordDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public int DoctorId { get; set; }
        public string DoctorName { get; set; } = string.Empty;
        public DateTime VisitDate { get; set; }
        public string Diagnosis { get; set; } = string.Empty;
        public string? Prescription { get; set; }
        public string? Notes { get; set; }
    }

    // ---- Billing DTOs ----
    public class BillDto
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public string PatientName { get; set; } = string.Empty;
        public DateTime BillDate { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal AmountPaid { get; set; }
        public decimal Balance { get; set; }
        public string Status { get; set; } = string.Empty;
        public List<BillItemDto> Items { get; set; } = new();
    }

    public class BillItemDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }

    public class CreateBillRequest
    {
        public int PatientId { get; set; }
        public decimal ConsultationCharge { get; set; }
        public decimal LaboratoryCharge { get; set; }
        public decimal PharmacyCharge { get; set; }
        public decimal AdmissionCharge { get; set; }
    }

    public class PayBillRequest
    {
        public decimal Amount { get; set; }
    }

    // ---- Department DTOs ----
    public class DepartmentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
