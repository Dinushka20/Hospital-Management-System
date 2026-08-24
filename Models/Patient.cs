using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class Patient
    {
        public int Id { get; set; }

        [Required, StringLength(150)]
        public string FullName { get; set; } = string.Empty;

        [DataType(DataType.Date)]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string Gender { get; set; } = "Other";

        [Phone]
        public string? Phone { get; set; }

        public string? Address { get; set; }

        public string? BloodGroup { get; set; }

        public DateTime RegisteredOn { get; set; } = DateTime.Now;

        public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
        public ICollection<MedicalRecord> MedicalRecords { get; set; } = new List<MedicalRecord>();
        public ICollection<Bill> Bills { get; set; } = new List<Bill>();
    }
}
