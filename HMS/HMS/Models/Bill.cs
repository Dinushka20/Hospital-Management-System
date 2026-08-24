using System.ComponentModel.DataAnnotations.Schema;

namespace HMS.Models
{
    public enum BillStatus
    {
        Unpaid,
        PartiallyPaid,
        Paid
    }

    public class Bill
    {
        public int Id { get; set; }

        public int PatientId { get; set; }
        public Patient? Patient { get; set; }

        public DateTime BillDate { get; set; } = DateTime.Now;

        public ICollection<BillItem> Items { get; set; } = new List<BillItem>();

        [Column(TypeName = "decimal(18,2)")]
        public decimal AmountPaid { get; set; } = 0m;

        public BillStatus Status { get; set; } = BillStatus.Unpaid;

        [NotMapped]
        public decimal TotalAmount => Items.Sum(i => i.Amount);

        [NotMapped]
        public decimal Balance => TotalAmount - AmountPaid;
    }
}
