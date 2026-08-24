using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public class MedicalRecord
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        [DataType(DataType.Date)]
        public DateTime VisitDate { get; set; } = DateTime.Now;

        [Required]
        public string Diagnosis { get; set; } = string.Empty;

        public string? Prescription { get; set; }

        public string? Notes { get; set; }
    }
}
