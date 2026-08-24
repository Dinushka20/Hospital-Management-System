using System.ComponentModel.DataAnnotations;

namespace HMS.Models
{
    public enum AppointmentStatus
    {
        Scheduled,
        Completed,
        Cancelled
    }

    public class Appointment
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        public int DoctorId { get; set; }
        public Doctor? Doctor { get; set; }

        [DataType(DataType.DateTime)]
        public DateTime AppointmentDate { get; set; } = DateTime.Now.AddDays(1);

        [Required, StringLength(250)]
        public string Reason { get; set; } = string.Empty;

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;

        public string? Notes { get; set; }
    }
}
